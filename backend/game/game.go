package game

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"gopkg.in/olahol/melody.v1"
)

// printerr handles an error
func printerr(e error) {
	if e != nil {
		log.Printf("printerr: %s", e)
	}
}

// Client represents a client in the game
type Client struct {
	// Identifier of the client. Should be treated as constant!
	ID int32

	// A timer used for waiting on the client
	// This timer should be cleared if the client discconects
	closeTimer *time.Timer

	// name of the client
	name string

	// role of the client
	role pb.Character
}

// Game represents a running game
type Game struct {
	// The melody server for this game
	m *melody.Melody

	// The function that will de-allocate the game when it finishes
	destroyFn func()

	// Next id
	nextID int32

	// A lock to prevent data races, must be used when reading/writing game attributes
	lock sync.Mutex

	// All alive players
	clients map[*melody.Session]*Client

	// The spectators in this server
	spectators map[*melody.Session]bool

	// Whether the game has been started
	started bool

	// The host of the game
	host *melody.Session

	// The current vote taking place, nil if there is none
	vote *Vote

	// The players that were killed during the night
	killed map[*melody.Session]pb.KillReason

	// Healer capabilities
	hasHeal   bool
	hasPoison bool

	// Spectator events
	spectatorMsgs []*pb.SpectatorUpdate
}

// New constructs a new game
func New(destroyFn func()) *Game {
	g := &Game{
		m:             melody.New(),
		nextID:        1,
		destroyFn:     destroyFn,
		clients:       make(map[*melody.Session]*Client),
		spectators:    make(map[*melody.Session]bool),
		killed:        make(map[*melody.Session]pb.KillReason),
		hasHeal:       true,
		hasPoison:     true,
		spectatorMsgs: make([]*pb.SpectatorUpdate, 0),
	}
	// For debug
	g.m.Upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	g.m.HandleConnect(g.handleJoin)
	g.m.HandleDisconnect(g.handleDisconnect)
	g.m.HandleMessageBinary(g.handleMsg)
	g.m.HandleSentMessageBinary(func(s *melody.Session, msg []byte) {
		g.lock.Lock()
		defer g.lock.Unlock()
		var b strings.Builder
		fmt.Fprintf(&b, "[%v] ↓ [", g.getID(s))
		for i, c := range msg {
			if i != 0 {
				fmt.Fprint(&b, ",")
			}
			fmt.Fprintf(&b, "%v", int(c))
		}
		fmt.Fprintf(&b, "]\n")
		log.Print(b.String())
	})

	return g
}

// HandleRequest wraps the internal melody session's HandleRequest method
func (g *Game) HandleRequest(w http.ResponseWriter, r *http.Request) error {
	return g.m.HandleRequest(w, r)
}

// End ends the game
func (g *Game) End() {
	g.lock.Lock()
	defer g.lock.Unlock()

	if !g.started {
		return
	}
	g.started = false

	log.Println("Game ending")
	err := g.m.Close()
	printerr(err)
	g.destroyFn()
}

// EndWithError sends a pb.Error message then ends the game
func (g *Game) EndWithError(reason pb.Error_EType) {
	g.lock.Lock()
	defer g.lock.Unlock()

	if !g.started {
		return
	}
	g.started = false

	msg, err := protocol.Marshal(&pb.Error{Msg: reason})
	if err != nil {
		return
	}
	err = g.m.BroadcastBinary(msg)
	printerr(err)
	time.Sleep(200 * time.Millisecond)

	go g.End()
}

// Returns whether the host is valid. Assumes game is locked!
func (g *Game) hostValid() bool {
	if g.host == nil || g.host.IsClosed() {
		return false
	}
	c := g.clients[g.host]
	return c != nil
}

// UpdateHost ensures the host of the game is valid. Assumes game is locked!
func (g *Game) updateHost() {
	if g.hostValid() {
		return
	}
	// Find the earliest person to join (lowest PID) that is still online
	var bestM *melody.Session = nil
	var bestID int32 = -1
	for m, c := range g.clients {
		if bestID == -1 || c.ID < bestID {
			bestM = m
		}
	}
	if bestM != nil {
		msg, err := protocol.Marshal(&pb.Host{IsHost: true})
		if err != nil {
			return
		}
		err = bestM.WriteBinary(msg)
		if err == nil {
			log.Println(err)
		}
		g.host = bestM
	}
}

// syncPlayers syncs player names between the server and all clients
func (g *Game) syncPlayers() {
	players := []*pb.Players_Player{}
	// Save hostID
	var hostID int32 = -1
	h, ok := g.clients[g.host]
	if ok {
		hostID = h.ID
	}

	for _, c := range g.clients {
		if c == nil || len(c.name) == 0 {
			return
		}
		players = append(players, &pb.Players_Player{Name: c.name, Id: c.ID})
	}

	msg, err := protocol.Marshal(&pb.Players{Players: players, HostId: hostID})
	if err != nil {
		return
	}
	err = g.m.BroadcastBinary(msg)
	printerr(err)
}

// updateSpectators updates the connected spectators to the current game state
func (g *Game) updateSpectators() {
	/*players := []*pb.SpectatorStatus_Player{}
	for _, c := range g.clients {
		if c != nil {
			players = append(players, &pb.SpectatorStatus_Player{Character: c.role, Name: c.name})
		}
	}

	msg, err := protocol.Marshal(&pb.SpectatorStatus{Players: players})
	if err != nil {
		return
	}

	for s := range g.spectators {
		err = s.WriteBinary(msg)
		printerr(err)
	}*/
}

// A helper function to get the ID of a client
// lock hub before calling!
func (g *Game) getID(s *melody.Session) int32 {
	c, ok := g.clients[s]
	if !ok {
		return -1
	}
	return c.ID
}

// FindByID finds a session and client from an ID. Both will be nil if invalid.
// Assumes game is locked!
func (g *Game) FindByID(id int32) (*melody.Session, *Client) {
	for s, c := range g.clients {
		if c != nil && c.ID == id {
			return s, c
		}
	}
	return nil, nil
}

// SessionsByRole returns all sessions that have and do not have a given role
// Assumes game is locked!
func (g *Game) SessionsByRole(role pb.Character) ([]*melody.Session, []*melody.Session) {
	hasRole := []*melody.Session{}
	doesntHaveRole := []*melody.Session{}

	for s, c := range g.clients {
		if c != nil {
			if c.role == role {
				hasRole = append(hasRole, s)
			} else {
				doesntHaveRole = append(doesntHaveRole, s)
			}
		}
	}
	return hasRole, doesntHaveRole
}

func (g *Game) getKilled() *melody.Session {
	log.Println("killed:", g.killed)
	var r *melody.Session
	for s := range g.killed {
		r = s
		break
	}
	if r == nil {
		log.Panicln("[PANIC] Try to getKilled() when g.killed is empty!")
	}
	return r
}

// stageKill sets a value in g.killed.
func (g *Game) stageKill(s *melody.Session, reason pb.KillReason) {
	log.Println("Killed", s, "Reason:", reason)
	g.killed[s] = reason
}

func (g *Game) kill(s *melody.Session) {
	c, ok := g.clients[s]
	if !ok {
		log.Println("Tried to kill invalid client")
		return
	}
	log.Printf("Killing [%v] %s\n", c.ID, c.name)
	reason, ok := g.killed[s]
	if !ok {
		reason = pb.KillReason_UNKNOWN
	}
	msg, err := protocol.Marshal(&pb.Killed{Reason: reason})
	if err != nil {
		return
	}
	err = s.WriteBinary(msg)
	printerr(err)

	g.spectators[s] = true
	delete(g.clients, s)
}

func (g *Game) commitKills() {
	log.Println("Commiting kills")
	for s := range g.killed {
		g.kill(s)
	}
	g.resetKills()
}

func (g *Game) resetKills() {
	g.killed = make(map[*melody.Session]pb.KillReason)
}

// checkForGameOver checks whether the game is over. Assumes game is locked.
func (g *Game) checkForGameOver() pb.GameOver_Reason {
	// There are two ways in which the werewolves can win. If they kill all special roles
	//  or if they kill all citizens.
	// If all wolves die, then the wolves lose.

	// Check if any wolves are alive.
	wolves, _ := g.SessionsByRole(pb.Character_WEREWOLF)
	if len(wolves) == 0 {
		log.Println("No wolves, citizens win")
		return pb.GameOver_CITIZEN_WIN
	}
	// Check if any citizens are alive
	citizens, specialAndWolves := g.SessionsByRole(pb.Character_CITIZEN)
	if len(citizens) == 0 {
		log.Println("No citizens, werewolves win")
		return pb.GameOver_WEREWOLF_WIN
	}
	// Check if any special roles are alive
	for _, s := range specialAndWolves {
		c := g.clients[s]
		if c != nil {
			// If they are not a citizen and not a werewolf, they are special
			if c.role != pb.Character_WEREWOLF {
				// and they are alive so the game is still going
				log.Println("Found special, game still going")
				return pb.GameOver_NONE
			}
		}
	}
	// If we got here, there were no special people in the non-citizen list, so the
	//  werewolves won.
	log.Println("No specials, werewolves win")
	return pb.GameOver_WEREWOLF_WIN
}

func (g *Game) handleGameOver(reason pb.GameOver_Reason) {
	// Reveal all player characters
	players := make([]*pb.GameOver_Player, len(g.clients))
	i := 0
	for _, c := range g.clients {
		players[i] = &pb.GameOver_Player{Id: c.ID, Character: c.role}
		i++
	}
	// Marshal gameover msg
	msg, err := protocol.Marshal(&pb.GameOver{Reason: reason, Players: players})
	if err != nil {
		return
	}

	err = g.m.BroadcastBinary(msg)
	printerr(err)
	time.Sleep(2000 * time.Millisecond)

	// End the game
	g.End()
}

func (g *Game) sendPlayerStatus() {
	alive := make([]int32, len(g.clients))
	i := 0
	for _, c := range g.clients {
		alive[i] = c.ID
		i++
	}
	msg, err := protocol.Marshal(&pb.PlayerStatus{Alive: alive})
	if err != nil {
		return
	}
	for s := range g.clients {
		err = s.WriteBinary(msg)
		printerr(err)
	}
}
