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

func genCharacterArray(numPlayers int) []pb.Character {
	// There is one healer and one prophet always
	res := []pb.Character{pb.Character_HEALER, pb.Character_PROPHET}
	var numCits int = int(math.Floor(float64(numPlayers-2) / 2.0))
	var numWolves int = (numPlayers - 2) - numCits

	log.Println("2 special", numCits, "citizen", numWolves, "wolves")

	for i := 0; i < numCits; i++ {
		res = append(res, pb.Character_CITIZEN)
	}
	for i := 0; i < numWolves; i++ {
		res = append(res, pb.Character_WEREWOLF)
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
		// No one is allowed to join/leave so the role array method works fine

		if m.IsClosed() || len(c.name) == 0 {
			continue
		}

		role := roles[i]
		c.role = role
		msg, err := protocol.Marshal(&pb.SetCharacter{Character: role})
		if err != nil {
			return
		}
		err = m.WriteBinary(msg)
		if err != nil {
			log.Println(err)
		}
		i++
	}
}

func (g *Game) revealWolves() {
	g.lock.Lock()
	defer g.lock.Unlock()

	wolfSessions := []*melody.Session{}
	wolfIDs := []int32{}
	nonWolfSessions := []*melody.Session{}

	for m, c := range g.clients {
		if c.role == pb.Character_WEREWOLF {
			wolfSessions = append(wolfSessions, m)
			wolfIDs = append(wolfIDs, c.ID)
		} else {
			nonWolfSessions = append(nonWolfSessions, m)
		}
	}

	msg, err := protocol.Marshal(&pb.FellowWolves{Ids: wolfIDs})
	if err != nil {
		return
	}

	for _, s := range wolfSessions {
		err = s.WriteBinary(msg)
		if err != nil {
			log.Println(err)
		}
	}

	// Allow game to be unlocked before calling
	go g.callVote(wolfSessions, nonWolfSessions, pb.VoteRequest_KILL, g.wolfVoteHandler())
}
