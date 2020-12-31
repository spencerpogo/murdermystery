package game

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"
	"gopkg.in/olahol/melody.v1"
)

func (g *Game) callWolfVote() {
	g.lock.Lock()
	defer g.lock.Unlock()

	wolfSessions, nonWolfSessions := g.SessionsByRole(pb.Character_WEREWOLF)

	go g.callVote(wolfSessions, nonWolfSessions, pb.VoteRequest_KILL, g.wolfVoteHandler(), true)
}

// Handler assumes game is locked
func (g *Game) wolfVoteHandler() func(*Vote, *melody.Session, *melody.Session) {
	return func(v *Vote, voter, killed *melody.Session) {
		log.Println("Wolf vote over")
		log.Println(killed, "killed by wolves")
		g.stageKill(killed, pb.KillReason_WOLVES)
		g.vote.End(g, nil)

		// The kill will actually happen after the healer vote
		go g.callProphetVote()
	}
}
