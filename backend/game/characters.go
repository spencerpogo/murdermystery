package game

import (
	"log"
	"math"
	"math/rand"
	"time"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"gopkg.in/olahol/melody.v1"
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
func (g *Game) AssignCharacters() {
	g.lock.Lock()
	defer g.lock.Unlock()

	if !g.started {
		log.Println("Call Game.AssignCharacters() with started=false, returning")
		return
	}
	log.Println("Assigning characters")

	numPlayers := 0
	for m, c := range g.clients {
		if !m.IsClosed() && len(c.name) > 0 {
			numPlayers++
		}
	}
	roles := genCharacterArray(numPlayers)
	// shuffle
	rand.Seed(time.Now().UnixNano())
	rand.Shuffle(len(roles), func(i, j int) { roles[i], roles[j] = roles[j], roles[i] })

	var i int = 0
	for m, c := range g.clients {
		// Would like to generate roles lazily in this loop,
		//  but would be hard to make it both random and assign the correct amount.
		// No one is allows to join/leave so the role array method works fine

		if m.IsClosed() || len(c.name) == 0 {
			continue
		}

		role := int(roles[i])
		c.role = role
		m.Write(protocol.SerializeRPC("setCharacter", map[string]interface{}{
			"value": CharacterMap[role],
		}))
		i++
	}

	g.revealWolves()
}

// Assumes game is locked
func (g *Game) revealWolves() {
	wolfSessions := []*melody.Session{}
	wolfIDs := []int{}

	for m, c := range g.clients {
		if c.role == int(Werewolf) {
			wolfSessions = append(wolfSessions, m)
			wolfIDs = append(wolfIDs, c.ID)
		}
	}

	for i := range wolfSessions {
		m := wolfSessions[i]
		if !m.IsClosed() {
			m.Write(protocol.SerializeRPC("wolves", map[string]interface{}{
				"ids": wolfIDs,
			}))
		}
	}
}
