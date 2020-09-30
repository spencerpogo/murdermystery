package protocol

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/Scoder12/murdermystery/backend/net"
)

const (
	// Hello is a hello
	hello = 0
)

// HelloMsg is a hello message
type HelloMsg struct {
	Name string `json:"name"`
}

func helloHandler(client *net.Client, data []byte) error {
	var msg HelloMsg
	if err := json.Unmarshal(data, &msg); err != nil {
		return err
	}

	resp, _ := json.Marshal(map[string]string{"msg": fmt.Sprintf("Hello, %s!", msg.Name)})
	client.Send(resp)
	return nil
}

func callHandler(client *net.Client, op int, data []byte) error {
	switch op {
	case hello:
		return helloHandler(client, data)
	default:
		return fmt.Errorf("Unrecognized op")
	}
}

// HandleMsg handles a message from a client
func HandleMsg(client *net.Client, msg []byte) {
	log.Printf("Got message: %s\n", string(msg))
	if len(msg) < 2 {
		log.Println("Message too short")
		client.Close()
		return
	}

	// First byte is opcode
	opcode := int(msg[0]) - 65
	err := callHandler(client, opcode, msg[1:])
	// TODO: check error
	if err != nil {
		log.Printf("%s\n", err)
		client.Close()
	}
}

// HandleLeave handles when a client connection is closed
func HandleLeave(client *net.Client) {
	// TODO: check for game over here
	log.Println("Close received")
}
