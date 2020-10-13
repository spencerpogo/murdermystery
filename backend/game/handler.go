package game

import (
	"fmt"
	"log"
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
	protocol.BroadcastRPC(hub, "error", map[string]interface{}{"reason": reason})
	time.Sleep(200 * time.Millisecond)
	for p := range hub.Clients {
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
		// client picked is not guaranteed to be random, but is not predictable either
		for newHost := range h.Clients {
			h.Host = newHost
			protocol.SendRPC(newHost, "host", map[string]interface{}{"isHost": true})
			break
		}
	}
	if !h.Started {
		protocol.SyncPlayers(client.Hub)
	}
}
