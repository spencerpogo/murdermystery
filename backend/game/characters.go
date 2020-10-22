package game

import (
	"log"
	"math"
	"math/rand"
	"time"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"gopkg.in/olahol/melody.v1"
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

func genCharacterArray(numPlayers int) []pb.SetCharacter_Character {
	// There is one healer and one prophet always
	res := []pb.SetCharacter_Character{pb.SetCharacter_HEALER, pb.SetCharacter_PROPHET}
	var numCits int = int(math.Floor(float64(numPlayers-2) / 2.0))
	var numWolves int = (numPlayers - 2) - numCits

	log.Println("2 special", numCits, "citizen", numWolves, "wolves")

	for i := 0; i < numCits; i++ {
		res = append(res, pb.SetCharacter_CITIZEN)
	}
	for i := 0; i < numWolves; i++ {
		res = append(res, pb.SetCharacter_WEREWOLF)
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

		role := roles[i]
		c.role = int32(role)
		msg, err := protocol.Marshal(&pb.SetCharacter{Character: role})
		if err != nil {
			return
		}
		m.WriteBinary(msg)
		i++
	}

	g.revealWolves()
}

// Assumes game is locked
func (g *Game) revealWolves() {
	wolfSessions := []*melody.Session{}
	wolfIDs := []int32{}
	nonWolfIDs := []int32{}

	for m, c := range g.clients {
		if c.role == int32(pb.SetCharacter_WEREWOLF) {
			wolfSessions = append(wolfSessions, m)
			wolfIDs = append(wolfIDs, c.ID)
		} else {
			nonWolfIDs = append(nonWolfIDs, c.ID)
		}
	}

	msg, err := protocol.Marshal(&pb.FellowWolves{Ids: wolfIDs})
	if err != nil {
		return
	}
	msg2, err := protocol.Marshal(&pb.VoteRequest{Choice_IDs: nonWolfIDs})
	if err != nil {
		return
	}

	for i := range wolfSessions {
		m := wolfSessions[i]
		if !m.IsClosed() {
			m.WriteBinary(msg)
			m.WriteBinary(msg2)
		}
	}
}
