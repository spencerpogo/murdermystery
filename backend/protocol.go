package main

import (
	"encoding/json"
	"fmt"
)

const (
	// Hello is a hello
	hello = 0
)

// HelloMsg is a hello message
type HelloMsg struct {
	name string
}

func helloHandler(client *Client, data []byte) error {
	var msg HelloMsg
	if err := json.Unmarshal(data, &msg); err != nil {
		return err
	}

	resp, _ := json.Marshal(map[string]string{"msg": fmt.Sprintf("Hello, %s!", msg.name)})
	client.send <- resp
	return nil
}

func callHandler(client *Client, op int, data []byte) error {
	switch op {
	case hello:
		return helloHandler(client, data)
	default:
		return fmt.Errorf("Unrecognized op")
	}
}

func decodeMsg(client *Client, msg []byte) error {
	if len(msg) < 2 {
		return fmt.Errorf("Message too short")
	}

	// First byte is opcode
	opcode := int(msg[0]) - 65
	err := callHandler(client, opcode, msg[1:])
	// TODO: check error
	if err != nil {
		client.Close()
		return nil
	}

	okJSON, _ := json.Marshal(map[string]bool{"ok": true})
	client.send <- okJSON
	return nil
}
