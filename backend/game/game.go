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

	// The clients in this server and their associated info
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
	killed map[*melody.Session]bool

	// Healer capabilities
	hasHeal   bool
	hasPoison bool
}

// New constructs a new game
func New(destroyFn func()) *Game {
	g := &Game{
		m:          melody.New(),
		nextID:     1,
		destroyFn:  destroyFn,
		clients:    make(map[*melody.Session]*Client),
		spectators: make(map[*melody.Session]bool),
		killed:     make(map[*melody.Session]bool),
		hasHeal:    true,
		hasPoison:  true,
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
	players := []*pb.SpectatorStatus_Player{}
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
	}
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

func (g *Game) kill(s *melody.Session) {
	c, ok := g.clients[s]
	if !ok {
		log.Println("Tried to kill invalid client")
		return
	}
	log.Printf("Killing [%v] %s\n", c.ID, c.name)
	msg, err := protocol.Marshal(&pb.Killed{})
	if err != nil {
		return
	}
	err = s.WriteBinary(msg)
	printerr(err)

	delete(g.clients, s)
	g.spectators[s] = true
}

func (g *Game) commitKills() {
	log.Println("Commiting kills")
	for s := range g.killed {
		g.kill(s)
	}
	g.resetKills()
}

func (g *Game) resetKills() {
	g.killed = make(map[*melody.Session]bool)
}

func (g *Game) callWolfVote() {
	g.lock.Lock()
	defer g.lock.Unlock()

	wolfSessions, nonWolfSessions := g.SessionsByRole(pb.Character_WEREWOLF)

	go g.callVote(wolfSessions, nonWolfSessions, pb.VoteRequest_KILL, g.wolfVoteHandler(), true)
}

// Handler assumes game is locked
func (g *Game) wolfVoteHandler() func(*Vote, *melody.Session, *melody.Session) {
	return func(v *Vote, voter, killed *melody.Session) {
		log.Println("Wolf vote over")
		g.killed[killed] = true
		g.vote.End(g, nil)

		// The kill will actually happen after the healer vote
		prophet, notProphet := g.SessionsByRole(pb.Character_PROPHET)
		go g.callVote(prophet, notProphet, pb.VoteRequest_PROPHET, g.prophetVoteHandler(killed), false)
	}
}

// prohetReveal reveals whether choice is good or bad to prophet. Returns true on
//  sucess, false otherwise. Assumes game is locked.
func (g *Game) prophetReveal(prophet, choice *melody.Session) bool {
	// Fetch client for choice
	choiceClient := g.clients[choice]
	if choiceClient == nil {
		return false
	}
	// They are good if they are anything but werewolf
	good := choiceClient.role != pb.Character_WEREWOLF
	// Send voter the result
	msg, err := protocol.Marshal(&pb.ProphetReveal{Id: choiceClient.ID, Good: good})
	if err != nil {
		return false
	}
	err = prophet.WriteBinary(msg)
	printerr(err)
	return true
}

// Handler assumes game is locked
func (g *Game) prophetVoteHandler(killed *melody.Session) func(*Vote, *melody.Session, *melody.Session) {
	return func(v *Vote, voter, candidate *melody.Session) {
		if g.vote != v {
			return
		}
		log.Println("Prophet vote over")

		g.prophetReveal(voter, candidate)

		// Doesn't really matter if this is at top or bottom, put at bottom just to be safe
		g.vote.End(g, nil)

		go g.callHealerHealVote()
	}
}

func (g *Game) callHealerHealVote() {
	g.lock.Lock()
	defer g.lock.Unlock()

	if g.hasHeal {
		log.Println("Starting healer vote")
		healer, _ := g.SessionsByRole(pb.Character_HEALER)
		if len(healer) != 1 {
			log.Printf("Error: Healer length not 1: %v", healer)
			return
		}

		// Find ID of killed client and send it to healer
		killedSession := g.getKilled()
		killedClient := g.clients[killedSession]
		if killedClient != nil {
			killedIDs := make([]int32, 1)
			killedIDs[0] = killedClient.ID
			msg, err := protocol.Marshal(&pb.KillReveal{Killed_IDs: killedIDs})
			if err != nil {
				return
			}
			err = healer[0].WriteBinary(msg)
			printerr(err)
		}

		log.Println("Calling healer vote, g.killed:", g.killed)
		go g.callVote(healer, []*melody.Session{}, pb.VoteRequest_HEALERHEAL, func(v *Vote, t, c *melody.Session) {}, false)
	} else {
		go g.callHealerPoisonVote()
	}
}

func (g *Game) healerHealHandler(confirmed bool) {
	if confirmed && g.hasHeal {
		// They are using their heal
		log.Println("Heal used")
		g.hasHeal = false
		// Empty g.killed
		g.resetKills()
	}
	log.Println("Heal response received, ending vote")
	g.vote.End(g, nil)
	go g.callHealerPoisonVote()
}

func (g *Game) callHealerPoisonVote() {
	g.lock.Lock()
	defer g.lock.Unlock()

	if g.hasPoison {
		healer, notHealer := g.SessionsByRole(pb.Character_HEALER)
		go g.callVote(healer, notHealer, pb.VoteRequest_HEALERPOISON, g.healerPoisonHandler(), false)
	} else {
		go g.callJuryVote()
	}
}

func (g *Game) healerPoisonHandler() func(*Vote, *melody.Session, *melody.Session) {
	return func(v *Vote, voter, candidate *melody.Session) {
		log.Println("Healer Poison vote over")
		if g.hasPoison && candidate != nil {
			log.Println("Poison used")
			g.hasPoison = false
			g.killed[candidate] = true
		}
		g.vote.End(g, nil)
		log.Println("After poison g.killed:", g.killed)
		go g.callJuryVote()
	}
}

func (g *Game) callJuryVote() {
	g.lock.Lock()
	defer g.lock.Unlock()

	// Make list of all killed IDs
	killedIDs := make([]int32, len(g.killed))
	i := 0
	log.Println("Prejury killed:", g.killed)
	for s := range g.killed {
		c := g.clients[s]
		if c != nil {
			killedIDs[i] = c.ID
			i++
		}
	}
	// Marshal killReveal
	killReveal, err := protocol.Marshal(&pb.KillReveal{Killed_IDs: killedIDs})
	if err != nil {
		return
	}
	// Make a list of all client sessions, sending killreveal message to each
	clients := make([]*melody.Session, len(g.clients))
	i = 0
	for c := range g.clients {
		if c != nil {
			clients[i] = c
			i++
			// Send KillReveal
			err = c.WriteBinary(killReveal)
			printerr(err)
		}
	}
	go g.callVote(clients, clients, pb.VoteRequest_JURY, g.juryVoteHandler(), true)
}

func (g *Game) juryVoteHandler() func(*Vote, *melody.Session, *melody.Session) {
	return func(v *Vote, voter, candidate *melody.Session) {
		if !v.AllVotesIn() {
			return
		}

		status, winner := v.GetResult()
		if status != pb.VoteResultType_TIE && winner == nil {
			// something went wrong
			log.Println("No vote winner! Tally:", v.Tally())
			status = pb.VoteResultType_NOWINNER
		}
		var winnerID int32
		if winner != nil {
			client := g.clients[winner]
			if client != nil {
				winnerID = client.ID
				g.killed[winner] = true
			}
		}

		// Send VoteOver
		v.End(g, &pb.JuryVoteResult{Status: status, Winner: winnerID})
		g.commitKills()

		gameOverReason := g.checkForGameOver()
		if gameOverReason != pb.GameOver_NONE {
			// The game is over. Send game over message and end it.
			g.handleGameOver(gameOverReason)
		}
	}
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
	time.Sleep(200 * time.Millisecond)

	// End the game
	g.End()
}
