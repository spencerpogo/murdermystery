package game

import (
	"fmt"
	"log"
	"time"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"gopkg.in/olahol/melody.v1"
)

func (g *Game) handleJoin(s *melody.Session) {
	log.Println("Handling join")
	g.lock.Lock()
	defer g.lock.Unlock()
	log.Println("Lock aquired")

	if g.started {
		// Make them a spectator. TODO: call g.addSpectator when it is implmented
		g.spectators[s] = true
		msg, err := protocol.Marshal(&pb.Handshake{Status: pb.Handshake_SPECTATOR, Id: -1})
		if err != nil {
			return
		}
		err = s.WriteBinary(msg)
		printerr(err)
		return
	}

	c := &Client{ID: g.nextID}
	g.nextID++
	g.clients[s] = c

	msg, err := protocol.Marshal(&pb.Handshake{Status: pb.Handshake_OK, Id: c.ID})
	if err != nil {
		return
	}
	err = s.WriteBinary(msg)
	printerr(err)

	// For efficiency, the timer will be stopped if the client discconects fast enough
	c.closeTimer = time.AfterFunc(2*time.Second, func() {
		g.lock.Lock()
		defer g.lock.Unlock()

		if len(c.name) == 0 {
			log.Printf("[%v] Did not name, closing\n", c.ID)
			err = s.Close()
			printerr(err)
		}
	})

	g.updateHost()
}

func (g *Game) handleDisconnect(s *melody.Session) {
	g.lock.Lock()
	defer g.lock.Unlock()

	c := g.clients[s]
	// They are probably a spectator, ignore the disconnect
	if c == nil {
		return
	}

	log.Printf("[%v] Disconnected\n", c.ID)
	delete(g.clients, s)

	if g.started {
		log.Println("Stopping game")
		// Call in a goroutine so deferred game unlock can run
		go g.EndWithError(pb.Error_DISCONNECT)
		return
	}

	if c != nil && c.closeTimer != nil {
		log.Println("Stopping timer")
		c.closeTimer.Stop()
	}

	g.syncPlayers()
}

func (g *Game) callHandler(s *melody.Session, c *Client, data *pb.ClientMessage) error {
	switch msg := data.Data.(type) {
	case *pb.ClientMessage_SetName:
		g.setNameHandler(s, c, msg.SetName)
		return nil
	case *pb.ClientMessage_StartGame:
		g.startGameHandler(s, c, msg.StartGame)
		return nil
	case *pb.ClientMessage_Vote:
		g.handleVoteMessage(s, c, msg.Vote)
		return nil
	default:
		return fmt.Errorf("unrecognized op")
	}
}

// HandleMsg handles a message from a client
func (g *Game) handleMsg(s *melody.Session, data []byte) {
	// https://developers.google.com/protocol-buffers/docs/reference/go-generated#oneof
	g.lock.Lock()
	c, ok := g.clients[s]
	g.lock.Unlock()

	// They are a spectator or some sort of race condition, ignore silently
	if !ok {
		return
	}
	//log.Printf("[%v] ↑ %s\n", c.ID, string(msg))
	var msg *pb.ClientMessage = protocol.Unmarshal(data)
	if msg == nil {
		log.Printf("[%v] Invalid data", c.ID)
		err := s.Close()
		printerr(err)
		return
	}

	err := g.callHandler(s, c, msg)
	if err != nil {
		log.Println(err)
		err = s.Close()
		printerr(err)
	}
}

func (g *Game) handleStart() {
	g.AssignCharacters()

	g.lock.Lock()
	// Populate g.players
	for s, c := range g.clients {
		g.players[s] = c
	}
	g.lock.Unlock()

	g.revealWolves()
}
