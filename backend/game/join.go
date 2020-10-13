package game

import (
	"log"
	"time"

	"github.com/Scoder12/murdermystery/backend/net"
	"github.com/Scoder12/murdermystery/backend/protocol"
)

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
	_, hostExists := h.Clients[h.Host]
	hostExists = hostExists && h.Clients[h.Host]
	if h.Host == nil || !hostExists {
		// This player is now the host
		h.Host = client
		isHost = true
	}

	protocol.SendRPC(client, "host", map[string]interface{}{"isHost": isHost})

	select {
	case <-time.After(2 * time.Second):
		log.Println("Client did not name themself, closing")
		client.Close()
	case <-client.Evt.Once("named"):
		break
	}
}
