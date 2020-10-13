package protocol

import (
	"encoding/json"
	"fmt"

	"github.com/Scoder12/murdermystery/backend/net"
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

// SendRPC works the same way as SerializeRPC but also send the serialized data
func SendRPC(client *net.Client, name string, data map[string]interface{}) {
	client.Send(SerializeRPC(name, data))
}

// BroadcastRPC works the same way as SerializeRPC but also broadcasts the RPC
func BroadcastRPC(hub *net.Hub, name string, data map[string]interface{}) {
	hub.Broadcast(SerializeRPC(name, data))
}

// SyncPlayers syncs the server's playerset with the clients
func SyncPlayers(hub *net.Hub) {
	players := map[int]string{}
	hostID := -2
	i := 0

	var p *net.Client
	for pid := range hub.Clients {
		p = hub.Clients[pid]
		if p.IsOpen {
			players[pid] = p.Name
			if hub.Host == p {
				hostID = pid
			}
			i++
		}
	}
	BroadcastRPC(hub, "players", map[string]interface{}{"names": players, "hostID": hostID})
}
