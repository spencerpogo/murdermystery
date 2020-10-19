package game

import (
	"log"
	"strings"
	"time"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"github.com/Scoder12/murdermystery/backend/protocol"

	"gopkg.in/olahol/melody.v1"
)

// Treat like const!
var badStrings = []string{
	"\u200B", // zero width space
	"\n",
	"\r",
	"\t",
}

func (g *Game) setNameHandler(s *melody.Session, c *Client, msg *pb.SetName) {
	if c == nil {
		return
	}

	g.lock.Lock()
	defer g.lock.Unlock()

	if len(c.name) > 0 {
		// No renames
		return
	}

	name := msg.GetName()

	for _, bad := range badStrings {
		name = strings.ReplaceAll(name, bad, "")
	}
	name = strings.TrimSpace(name)

	if len(name) == 0 || len(name) > 50 {
		msg, err := protocol.Marshal(&pb.Error{Msg: pb.Error_BADNAME})
		if err != nil {
			return
		}
		s.WriteBinary(msg)
		time.Sleep(200 * time.Millisecond)
		s.Close()
	}
	c.name = name

	log.Printf("[%v] Set name to %s", c.ID, name)
	g.syncPlayers()
	return
}
