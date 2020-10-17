package game

import (
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/Scoder12/murdermystery/backend/protocol"

	"gopkg.in/olahol/melody.v1"
)

// Client represents a client in the game
type Client struct {
	// Identifier of the client. Should be treated as constant!
	ID int

	// A timer used for waiting on the client
	// This timer should be cleared if the client discconects
	closeTimer *time.Timer

	// name of the client
	name string
}

// Game represents a running game
type Game struct {
	// The melody server for this game
	m *melody.Melody

	// Next id
	nextID int

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
func New() *Game {
	g := &Game{
		m:       melody.New(),
		clients: make(map[*melody.Session]*Client),
	}
	// For debug
	g.m.Upgrader.CheckOrigin = func(r *http.Request) bool { return true }

	g.m.HandleConnect(g.handleJoin)
	g.m.HandleDisconnect(g.handleDisconnect)
	g.m.HandleMessage(g.handleMsg)
	g.m.HandleSentMessage(func(s *melody.Session, msg []byte) {
		g.lock.Lock()
		defer g.lock.Unlock()
		log.Printf("[%v] ↓ %s", g.getID(s), string(msg))
	})

	return g
}

// HandleRequest wraps the internal melody session's HandleRequest method
func (g *Game) HandleRequest(w http.ResponseWriter, r *http.Request) error {
	return g.m.HandleRequest(w, r)
}

// End ends the game
func (g *Game) End(reason string) {
	g.lock.Lock()
	defer g.lock.Unlock()

	if !g.started {
		return
	}
	g.started = false

	g.m.Broadcast(protocol.SerializeRPC("error", map[string]interface{}{"reason": reason}))
	time.Sleep(200 * time.Millisecond)

	g.m.Close()
}

// UpdateHost ensures the host of the game is valid
func (g *Game) updateHost() {
	// TODO
}

// syncPlayers syncs player names between the server and all clients
func (g *Game) syncPlayers() {
	// TODO
}

// A helper function to get the ID of a client
// lock hub before calling!
func (g *Game) getID(s *melody.Session) int {
	c, ok := g.clients[s]
	if !ok {
		return -1
	}
	return c.ID
}
