package protocol

import (
	"encoding/json"

	"github.com/Scoder12/murdermystery/backend/net"
)

// HandleJoin handles when a client joins a game
func HandleJoin(client net.Client) {
	if client.Hub.Started {
		data, _ := json.Marshal(map[string]string{"error": "Game already started"})
		client.Send(data)
	}

}
