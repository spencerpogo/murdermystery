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
	log.Printf("Got message: %s\n", string(msg))
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
	if !hub.Started {
		return
	}
	hub.Started = false

	protocol.BroadcastRPC(hub, "error", map[string]interface{}{"reason": reason})
	time.Sleep(200 * time.Millisecond)

	var p *net.Client
	for pid := range hub.Clients {
		p = hub.Clients[pid]
		if p.IsOpen {
			p.Close()
		}
	}
}

// HandleLeave handles when a client connection is closed
func HandleLeave(client *net.Client) {
	// TODO: check for game over here
	log.Println("Close received")
	h := client.Hub

	if h.Started {
		EndGame(h, "disconnect")
	}

	if h.Host == client && len(h.Clients) > 0 {
		// Player IDs are assigned in order, so the lower the id, the earlier they joined
		// So sort clients by PID and give host to the first one that is online
		pids := make([]int, 0)
		for pid := range h.Clients {
			pids = append(pids, pid)
		}
		sort.Ints(pids)
		for pid := range pids {
			c, ok := h.Clients[pid]
			if !ok || !c.IsOpen {
				continue
			}
			h.Host = h.Clients[pid]
			protocol.SendRPC(h.Host, "host", map[string]interface{}{"isHost": true})
			break
		}
	}
	if !h.Started {
		protocol.SyncPlayers(client.Hub)
	}
}
