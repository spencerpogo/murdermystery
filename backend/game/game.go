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
	role int32
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

	// Whether the game has been started
	started bool

	// The host of the game
	host *melody.Session

	// The current vote taking place, nil if there is none
	vote *Vote
}

// New constructs a new game
func New(destroyFn func()) *Game {
	g := &Game{
		m:         melody.New(),
		nextID:    1,
		destroyFn: destroyFn,
		clients:   make(map[*melody.Session]*Client),
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
		log.Printf(b.String())
	})

	return g
}

// HandleRequest wraps the internal melody session's HandleRequest method
func (g *Game) HandleRequest(w http.ResponseWriter, r *http.Request) error {
	return g.m.HandleRequest(w, r)
}

// End ends the game
func (g *Game) End(reason pb.Error_EType) {
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
	g.m.BroadcastBinary(msg)
	time.Sleep(200 * time.Millisecond)

	g.m.Close()
	g.destroyFn()
}

// Returns whether the host is valid. Assumes game is locked!
func (g *Game) hostValid() bool {
	if g.host == nil || g.host.IsClosed() {
		return false
	}
	_, ok := g.clients[g.host]
	return ok
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
		bestM.WriteBinary(msg)
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
	g.m.BroadcastBinary(msg)
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
func (g *Game) SessionsByRole(role int32) ([]*melody.Session, []*melody.Session) {
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

// Handler assumes game is locked
func (g *Game) wolfVoteHandler() func(v *Vote) {
	return func(v *Vote) {
		if g.vote != v || !v.HasConcensus() {
			return
		}
		log.Println("Wolf vote over")
		g.vote.End()

		prophet, notProphet := g.SessionsByRole(int32(pb.SetCharacter_PROPHET))
		go g.callVote(prophet, notProphet, pb.VoteRequest_PROPHET, g.prophetVoteHandler())
	}
}

// Handler assumes game is locked
func (g *Game) prophetVoteHandler() func(v *Vote) {
	return func(v *Vote) {
		if g.vote != v {
			return
		}
		log.Println("Prophet vote over")
		g.vote.End()
		// TODO: Show requested person's status, call next vote
	}
}
