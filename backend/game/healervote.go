package game

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"github.com/Scoder12/murdermystery/backend/protocol/pb"
	"gopkg.in/olahol/melody.v1"
)

func (g *Game) callHealerHealVote() {
	g.lock.Lock()
	defer g.lock.Unlock()

	if g.hasHeal {
		log.Println("Starting healer vote")
		healers, _ := g.SessionsByRole(pb.Character_HEALER)
		if len(healers) < 1 {
			// Healer is dead, skip this vote.
			go g.callJuryVote()
		}
		if len(healers) > 1 {
			log.Printf("Error: Healers length >1: %v", healers)
			return
		}

		// Find ID of killed client and send it to healer
		killedSession := g.getKilled()
		killedClient := g.clients[killedSession]
		if killedClient != nil {
			killedIDs := make([]int32, 1)
			killedIDs[0] = killedClient.ID
			msg, err := protocol.Marshal(&pb.KillReveal{Killed_IDs: killedIDs})
			if err != nil {
				return
			}
			err = healers[0].WriteBinary(msg)
			printerr(err)
		}

		log.Println("Calling healer vote, g.killed:", g.killed)
		go g.callVote(healers, []*melody.Session{}, pb.VoteRequest_HEALERHEAL, func(v *Vote, t, c *melody.Session) {}, false)
	} else {
		go g.callHealerPoisonVote()
	}
}

func (g *Game) healerHealHandler(confirmed bool) {
	if confirmed && g.hasHeal {
		// They are using their heal
		log.Println("Heal used")
		g.hasHeal = false
		// Empty g.killed
		g.resetKills()
	}
	log.Println("Heal response received, ending vote")
	g.vote.End(g, nil)
	go g.callHealerPoisonVote()
}

func (g *Game) callHealerPoisonVote() {
	g.lock.Lock()
	defer g.lock.Unlock()

	if g.hasPoison {
		healer, notHealer := g.SessionsByRole(pb.Character_HEALER)
		go g.callVote(healer, notHealer, pb.VoteRequest_HEALERPOISON, g.healerPoisonHandler(), false)
	} else {
		go g.callJuryVote()
	}
}

func (g *Game) healerPoisonHandler() func(*Vote, *melody.Session, *melody.Session) {
	return func(v *Vote, voter, candidate *melody.Session) {
		log.Println("Healer Poison vote over")
		if g.hasPoison && candidate != nil {
			log.Println("Poison used on", candidate)
			g.hasPoison = false
			g.stageKill(candidate, pb.KillReason_HEALERPOISON)
		}
		g.vote.End(g, nil)
		log.Println("After poison g.killed:", g.killed)
		go g.callJuryVote()
	}
}
