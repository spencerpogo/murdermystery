package protocol

import (
	"encoding/json"
	"fmt"
	"log"
)

// Hub represents net.Hub without triggering and import cycle
type Hub interface {
	Started() bool
}

// Client represents net.Client without triggering an import cycle
type Client interface {
	Send(msg []byte)
	Close()
	Hub() Hub
}

const (
	// Hello is a hello
	hello = 0
)

// HelloMsg is a hello message
type HelloMsg struct {
	Name string `json:"name"`
}

func helloHandler(client Client, data []byte) error {
	var msg HelloMsg
	if err := json.Unmarshal(data, &msg); err != nil {
		return err
	}

	resp, _ := json.Marshal(map[string]string{"msg": fmt.Sprintf("Hello, %s!", msg.Name)})
	client.Send(resp)
	return nil
}

func callHandler(client Client, op int, data []byte) error {
	switch op {
	case hello:
		return helloHandler(client, data)
	default:
		return fmt.Errorf("Unrecognized op")
	}
}

// HandleMsg handles a message from a client
func HandleMsg(client Client, msg []byte) error {
	log.Printf("Got message: %s\n", string(msg))
	if len(msg) < 2 {
		return fmt.Errorf("Message too short")
	}

	// First byte is opcode
	opcode := int(msg[0]) - 65
	err := callHandler(client, opcode, msg[1:])
	// TODO: check error
	if err != nil {
		log.Printf("%s\n", err)
		client.Close()
		return nil
	}

	return nil
}

// HandleClose handles when a client connection is closed
func HandleClose(client Client) {
	// TODO: check for game over here
	log.Println("Close received")
}
