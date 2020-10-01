package protocol

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/Scoder12/murdermystery/backend/net"
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
	if len(msg) < 1 {
		log.Println("Message too short")
		client.Close()
		return
	}

	// First byte is opcode
	opcode := int(msg[0]) - 65
	err := callHandler(client, opcode, msg[1:])
	if err != nil {
		log.Println(err)
		client.Close()
	}
}

// HandleLeave handles when a client connection is closed
func HandleLeave(client *net.Client) {
	// TODO: check for game over here
	log.Println("Close received")
	h := client.Hub
	if h.Host == client && len(h.Clients) > 0 {
		// client picked is not guaranteed to be random, but is not predictable either
		for newHost := range h.Clients {
			h.Host = newHost
			msg, _ := json.Marshal(map[string]bool{"isHost": true})
			newHost.Send(msg)
			break
		}
	}
}
