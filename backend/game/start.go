package game

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/net"
	"github.com/Scoder12/murdermystery/backend/protocol"
)

func startGameHandler(client *net.Client, d []byte) error {
	// d is ignored.
	if client.Hub.Host != client {
		// They are unauthorized, ignore
		return nil
	}
	if client.Hub.Started {
		// already started, ignore
		return nil
	}
	online := 0
	for pid := range client.Hub.Clients {
		c, ok := client.Hub.Clients[pid]
		if ok && c.IsOpen() {
			online++
		}
	}
	if online < 6 {
		protocol.SendRPC(client, "alert", map[string]interface{}{"msg": "notEnoughPlayers"})
		return nil
	}

	// Lock out new players from joining
	client.Hub.Started = true
	log.Println("Game starting with", len(client.Hub.Clients), "players")
	client.Hub.HandleStart(client.Hub)

	return nil
}
