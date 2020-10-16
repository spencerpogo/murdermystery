package game

import (
	"fmt"
	"log"
	"sort"
	"time"

	"github.com/Scoder12/murdermystery/backend/net"
	"github.com/Scoder12/murdermystery/backend/protocol"
)

const (
	setName   = 0
	startGame = 1
)

func callHandler(c *net.Client, op int, d []byte) error {
	switch op {
	case setName:
		return setNameHandler(c, d)
	case startGame:
		return startGameHandler(c, d)
	default:
		return fmt.Errorf("Unrecognized op")
	}
}

// HandleMsg handles a message from a client
func HandleMsg(client *net.Client, msg []byte) {
	log.Printf("%s > %s\n", client.Name(), string(msg))
	opcode, msgRest, err := protocol.DecodeMsg(msg)
	if err != nil {
		return
	}
	err = callHandler(client, opcode, msgRest)
	if err != nil {
		log.Println(err)
		client.Close()
	}
}

// EndGame ends the game
func EndGame(hub *net.Hub, reason string) {
	if !hub.Started() {
		return
	}
	hub.SetStarted(false)

	protocol.BroadcastRPC(hub, "error", map[string]interface{}{"reason": reason})
	time.Sleep(200 * time.Millisecond)

	hub.EachOnline(func(c *net.Client) {
		c.Close()
	})
}

// HandleLeave handles when a client connection is closed
func HandleLeave(h *net.Hub, wasHost bool) {
	// TODO: check for game over here
	log.Println("Close received")

	if h.Started() {
		EndGame(h, "disconnect")
	}

	if wasHost {
		// Player IDs are assigned in order, so the lower the id, the earlier they joined
		// So sort clients by PID and give host to the first one that is online
		pids := make([]int, 0)
		h.EachOnline(func(c *net.Client) {
			pids = append(pids, c.ID)
		})
		sort.Ints(pids)
		for pid := range pids {
			c, err := h.GetClient(pid)
			if err != nil {
				continue
			}
			h.SetHost(c)
			protocol.SendRPC(c, "host", map[string]interface{}{"isHost": true})
			break
		}
	}
	protocol.SyncPlayers(h)
}
