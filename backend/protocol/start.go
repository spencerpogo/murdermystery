package protocol

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/net"
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
	for p := range client.Hub.Clients {
		if p.IsOpen {
			online++
		}
	}
	if online < 6 {
		SendRPC(client, "alert", map[string]interface{}{"msg": "notEnoughPlayers"})
	}

	// Lock out new players from joining
	client.Hub.Started = true
	log.Println("Game starting with", len(client.Hub.Clients), "players")
	client.Hub.HandleStart(client.Hub)

	return nil
}
