package protocol

import (
	"encoding/json"
	"fmt"
)

// DecodeMsg decodes a message
func DecodeMsg(msg []byte) (int, []byte, error) {
	if len(msg) < 1 {
		return 0, []byte{}, fmt.Errorf("Message too short")
	}
	// First byte is opcode
	opcode := int(msg[0]) - 65
	return opcode, msg[1:], nil
}

// SerializeRPC serializes an RPC given the type of the message and any arguments to send.
func SerializeRPC(name string, data map[string]interface{}) []byte {
	data["type"] = name
	out, _ := json.Marshal(data)
	return out
}
