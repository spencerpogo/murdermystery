package game

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"github.com/Scoder12/murdermystery/backend/protocol/pb"
	"gopkg.in/olahol/melody.v1"
)

func (g *Game) callJuryVote() {
	g.lock.Lock()
	defer g.lock.Unlock()

	// Make list of all killed IDs
	killedIDs := make([]int32, len(g.killed))
	i := 0
	log.Println("Prejury killed:", g.killed)
	for s := range g.killed {
		c := g.clients[s]
		if c != nil {
			killedIDs[i] = c.ID
			i++
		}
	}
	// Marshal killReveal
	killReveal, err := protocol.Marshal(&pb.KillReveal{Killed_IDs: killedIDs})
	if err != nil {
		return
	}
	// Now that the kills are revealed, commit them so that dead people can't be voted for
	g.commitKills()

	// Make a list of all client sessions, sending killreveal message to each
	clients := make([]*melody.Session, len(g.clients))
	i = 0
	for c := range g.clients {
		if c != nil {
			clients[i] = c
			i++
			// Send KillReveal
			err = c.WriteBinary(killReveal)
			printerr(err)
		}
	}
	log.Println("Calling jury vote", clients, clients)
	go g.callVote(clients, clients, pb.VoteRequest_JURY, g.juryVoteHandler(), true)
}

func (g *Game) juryVoteHandler() func(*Vote, *melody.Session, *melody.Session) {
	return func(v *Vote, voter, candidate *melody.Session) {
		if !v.AllVotesIn() {
			return
		}

		status, winner := v.GetResult()
		if status != pb.VoteResultType_TIE && winner == nil {
			// something went wrong
			log.Println("No vote winner! Tally:", v.Tally())
			status = pb.VoteResultType_NOWINNER
		}
		var winnerID int32
		if winner != nil {
			client := g.clients[winner]
			if client != nil {
				winnerID = client.ID
				g.stageKill(winner, pb.KillReason_VOTED)
			}
		}

		// Send VoteOver
		v.End(g, &pb.JuryVoteResult{Status: status, Winner: winnerID})
		g.commitKills()
		// Show players who is alive and dead
		g.sendPlayerStatus()

		gameOverReason := g.checkForGameOver()
		if gameOverReason != pb.GameOver_NONE {
			// The game is over. Send game over message and end it.
			g.handleGameOver(gameOverReason)
		} else {
			// The game is not over. Start a new night with the first vote!
			go g.callWolfVote()
		}
	}
}
