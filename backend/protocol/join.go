package protocol

import (
	"encoding/json"
)

// HandleJoin handles when a client joins a game
func HandleJoin(client Client) {
	if client.Hub().Started() {
		data, _ := json.Marshal(map[string]string{"error": "Game already started"})
		client.Send(data)
	}

	
}
