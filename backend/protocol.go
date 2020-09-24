package main

import (
	"encoding/json"
	"fmt"
)

func decodeMsg(client *Client, msg []byte) error {
	if len(msg) < 2 {
		return fmt.Errorf("Message too short")
	}

	// First byte is opcode
	//opcode := int(msg[0]) - 65
	// TODO: validate opcode and don't parse it as JSON

	// Unmarshal as JSON
	var data map[string]interface{} // TODO: maybe other types?
	if err := json.Unmarshal(msg, &data); err != nil {
		return fmt.Errorf("Message Decode Error: %s", err)
	}

	// TODO: do something with the JSON

	okJSON, _ := json.Marshal(map[string]bool{"ok": true})
	client.send <- okJSON
	return nil
}
