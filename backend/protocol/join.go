package protocol

import (
	"encoding/json"
	"log"
	"time"

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

	// Sleep for 2 seconds, if the name has not been set then terminate
	time.Sleep(2 * time.Second)
	if client.Name == "" {
		log.Println("Client did not name themself")
		client.Close()
		return
	}
}
