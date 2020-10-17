package game

import (
	"fmt"
	"log"
	"time"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"gopkg.in/olahol/melody.v1"
)

func (g *Game) handleJoin(s *melody.Session) {
	g.lock.Lock()
	defer g.lock.Unlock()

	if g.started {
		s.Write(protocol.SerializeRPC("handshake", map[string]interface{}{"error": "started"}))
		time.Sleep(200 * time.Millisecond) // Allow plenty of time for the message to send
		s.Close()
		return
	}

	c := &Client{ID: g.nextID}
	g.nextID++
	g.clients[s] = c

	s.Write(protocol.SerializeRPC("handshake", map[string]interface{}{}))

	// For efficiency, the timer will be stopped if the client discconects fast enough
	c.closeTimer = time.AfterFunc(2*time.Second, func() {
		g.lock.Lock()
		defer g.lock.Unlock()

		if len(c.name) == 0 {
			log.Printf("[%v] Did not name, closing\n", c.ID)
			s.Close()
		}
	})

	g.updateHost()
}

func (g *Game) handleDisconnect(s *melody.Session) {
	g.lock.Lock()
	defer g.lock.Unlock()

	c, ok := g.clients[s]
	if ok {
		log.Printf("[%v] Disconnected\n", c.ID)
	}

	if g.started {
		log.Println("Stopping game")
		g.End("disconnect")
	}

	if c != nil && c.closeTimer != nil {
		log.Println("Stopping timer")
		c.closeTimer.Stop()
	}
}

func (g *Game) callHandler(s *melody.Session, c *Client, op int, d []byte) error {
	switch op {
	case 0:
		g.setNameHandler(s, c, d)
		return nil
	case 1:
		g.startGameHandler(s, c, d)
		return nil
	default:
		return fmt.Errorf("Unrecognized op")
	}
}

// HandleMsg handles a message from a client
func (g *Game) handleMsg(s *melody.Session, msg []byte) {
	g.lock.Lock()
	c, ok := g.clients[s]
	g.lock.Unlock()

	if ok {
		log.Printf("[%v] ↑ %s\n", c.ID, string(msg))
		opcode, msgRest, err := protocol.DecodeMsg(msg)
		if err != nil {
			return
		}
		err = g.callHandler(s, c, opcode, msgRest)
		if err != nil {
			log.Println(err)
			s.Close()
		}
	}
}
