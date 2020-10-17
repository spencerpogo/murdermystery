package game

import (
	"encoding/json"
	"log"
	"strings"
	"time"

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

func (g *Game) setNameHandler(s *melody.Session, c *Client, data []byte) {
	if c == nil {
		return
	}

	g.lock.Lock()
	defer g.lock.Unlock()

	if len(c.name) > 0 {
		// No renames
		return
	}

	var name string
	if err := json.Unmarshal(data, &name); err != nil {
		log.Printf("[%v] Sent invalid JSON: %s", c.ID, err)
		s.Close()
		return
	}

	for _, bad := range badStrings {
		name = strings.ReplaceAll(name, bad, "")
	}
	name = strings.TrimSpace(name)

	if len(name) == 0 || len(name) > 50 {
		s.Write(protocol.SerializeRPC("error", map[string]interface{}{"error": "name"}))
		time.Sleep(200 * time.Millisecond)
		s.Close()
	}
	c.name = name

	log.Printf("[%v] Set name to %s", c.ID, name)
	g.syncPlayers()
	return
}
