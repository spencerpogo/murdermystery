package game

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"github.com/Scoder12/murdermystery/backend/protocol"

	"gopkg.in/olahol/melody.v1"
)

func (g *Game) startGameHandler(s *melody.Session, c *Client, msg *pb.StartGame) {
	g.lock.Lock()
	defer g.lock.Unlock()

	if g.host == nil || g.host != s {
		// They are unauthorized, ignore
		return
	}
	if g.started {
		// already started, ignore
		return
	}
	online := 0
	for s := range g.clients {
		if s != nil && !s.IsClosed() {
			online++
		}
	}
	if online < 6 {
		msg, err := protocol.Marshal(&pb.Alert{Msg: pb.Alert_NEEDMOREPLAYERS})
		if err != nil {
			return
		}
		s.WriteBinary(msg)
		return
	}

	// This locks out new players from joining
	g.started = true

	var id int32 = 0
	if c != nil {
		id = c.ID
	}

	log.Printf("[%v] Starting %v player game", id, online)
	// Run in goroutine so defer fires and unlocks
	go g.handleStart()
}
