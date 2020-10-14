package game

import (
	"log"
	"time"

	"github.com/Scoder12/murdermystery/backend/net"
	"github.com/Scoder12/murdermystery/backend/protocol"
)

func hostExists(h *net.Hub) bool {
	if h.Host == nil {
		return false
	}
	_, hostExists := h.Clients[h.Host.ID]
	return hostExists && h.Host.IsOpen()
}

// HandleJoin handles when a client joins a game
func HandleJoin(client *net.Client) {
	h := client.Hub

	if h.Started {
		protocol.SendRPC(client, "handshake", map[string]interface{}{"error": "started"})
		// If we close too early, the message won't get sent
		time.Sleep(300 * time.Millisecond)
		client.Close()
		return
	}

	protocol.SendRPC(client, "handshake", map[string]interface{}{})

	isHost := false
	// Is there no host set yet?
	if !hostExists(h) {
		// This player is now the host
		h.Host = client
		isHost = true
	}

	protocol.SendRPC(client, "host", map[string]interface{}{"isHost": isHost})

	time.AfterFunc(2*time.Second, func() {
		if !client.IsOpen() {
			log.Println("Client did not name themself, closing")
			client.Close()
		}
	})
}
