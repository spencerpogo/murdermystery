package game

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"github.com/Scoder12/murdermystery/backend/protocol/pb"
	"gopkg.in/olahol/melody.v1"
)

// prohetReveal reveals whether choice is good or bad to prophet. Returns true on
//  sucess, false otherwise. Assumes game is locked.
func (g *Game) prophetReveal(prophet, choice *melody.Session) bool {
	// Fetch client for choice
	choiceClient := g.clients[choice]
	if choiceClient == nil {
		return false
	}
	// They are good if they are anything but werewolf
	good := choiceClient.role != pb.Character_WEREWOLF
	// Send voter the result
	msg, err := protocol.Marshal(&pb.ProphetReveal{Id: choiceClient.ID, Good: good})
	if err != nil {
		return false
	}
	err = prophet.WriteBinary(msg)
	printerr(err)
	return true
}

// Handler assumes game is locked
func (g *Game) prophetVoteHandler(killed *melody.Session) func(*Vote, *melody.Session, *melody.Session) {
	return func(v *Vote, voter, candidate *melody.Session) {
		if g.vote != v {
			return
		}
		log.Println("Prophet vote over")

		g.prophetReveal(voter, candidate)

		// Doesn't really matter if this is at top or bottom, put at bottom just to be safe
		g.vote.End(g, nil)

		go g.callHealerHealVote()
	}
}
