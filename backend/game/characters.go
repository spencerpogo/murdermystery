package game

import (
	"encoding/json"
	"log"
	"math/rand"

	"github.com/Scoder12/murdermystery/backend/net"
)

// Role represents a role in the game
type Role int

const (
	// NoCharacter represents no character
	NoCharacter Role = 0
	// Citizen represents a Citizen
	Citizen Role = 1
	// Werewolf represents a Werewolf
	Werewolf Role = 2
	// Healer represents a Healer
	Healer Role = 3
	// Prophet represents a Prophet
	Prophet Role = 4
	// Hunter represents a Hunter
	Hunter Role = 5
)

// CharacterMap is a map of character IDs to their string attribute name
var CharacterMap = map[int]string{
	0: "NoCharacter",
	1: "Citizen",
	2: "Werewolf",
	3: "Healer",
	4: "Prophet",
	5: "Hunter",
}

// AssignCharacters assigns a character to each player
func AssignCharacters(h *net.Hub) {
	// TODO: Figure out real rules for this instead of assigning randomly
	log.Println("Assigning characters")
	for c := range h.Clients {
		c.Role = rand.Intn(5) + 1 // A random character number, [1,5]
		msg, _ := json.Marshal(map[string]string{"type": "setCharacter", "value": CharacterMap[c.Role]})
		c.Send(msg)
	}
}
