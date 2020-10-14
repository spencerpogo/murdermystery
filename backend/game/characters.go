package game

import (
	"log"
	"math"
	"math/rand"
	"time"

	"github.com/Scoder12/murdermystery/backend/net"
	"github.com/Scoder12/murdermystery/backend/protocol"
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

func genCharacterArray(numPlayers int) []Role {
	// There is one healer and one prophet always
	res := []Role{Healer, Prophet}
	var numCits int = int(math.Floor(float64(numPlayers-2) / 2.0))
	var numWolves int = (numPlayers - 2) - numCits

	log.Println("2 special", numCits, "citizen", numWolves, "wolves")

	for i := 0; i < numCits; i++ {
		res = append(res, Citizen)
	}
	for i := 0; i < numWolves; i++ {
		res = append(res, Werewolf)
	}
	return res
}

// AssignCharacters assigns a character to each player
func AssignCharacters(h *net.Hub) {
	// TODO: Figure out real rules for this instead of assigning randomly
	log.Println("Assigning characters")

	numPlayers := 0
	for pid := range h.Clients {
		c, ok := h.Clients[pid]
		if ok && c.IsOpen && len(c.Name) > 0 {
			numPlayers++
		}
	}
	roles := genCharacterArray(numPlayers)
	// shuffle
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(roles), func(i, j int) { roles[i], roles[j] = roles[j], roles[i] })

	var i int = 0
	var c *net.Client
	for pid := range h.Clients {
		c = h.Clients[pid]
		c.Role = int(roles[i])
		i++
		protocol.SendRPC(c, "setCharacter", map[string]interface{}{"value": CharacterMap[c.Role]})
	}
}

// HandleStart is called when a game is starting
func HandleStart(h *net.Hub) {
	AssignCharacters(h)
}
