package protocol

import (
	"encoding/json"

	"github.com/Scoder12/murdermystery/backend/net"
)

// HandleJoin handles when a client joins a game
func HandleJoin(client *net.Client) {
	h := client.Hub

	if h.Started {
		data, _ := json.Marshal(map[string]string{"error": "Game already started"})
		client.Send(data)
		client.Close()
		return
	}

	isHost := false
	// Is there no host set yet?
	_, hostExists := h.Clients[h.Host]
	if h.Host == nil || !hostExists {
		// This player is now the host
		h.Host = client
		isHost = true
	}

	d, _ := json.Marshal(map[string]bool{"isHost": isHost})
	client.Send(d)
}
