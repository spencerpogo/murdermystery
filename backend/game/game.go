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
		for _, c := range msg {
			fmt.Fprintf(&b, "%v, ", int(c))
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
		if c == nil {
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
