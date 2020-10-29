package game

import (
	"github.com/Scoder12/murdermystery/backend/protocol"
	"github.com/Scoder12/murdermystery/backend/protocol/pb"
	"gopkg.in/olahol/melody.v1"
)

// Vote represents a vote taking place in the game
type Vote struct {
	// The clients who are allowed to vote
	voters []*melody.Session
	// The candidates who they can choose from
	candidates []*melody.Session
	// The votes received from voters. map[voter]candidate
	votes map[*melody.Session]*melody.Session
}

// End ends the vote. Assumed game mutex is locked.
func (v *Vote) End() {
	msg, err := protocol.Marshal(&pb.VoteOver{})
	if err != nil {
		return
	}

	for _, s := range v.voters {
		if s != nil && !s.IsClosed() {
			s.WriteBinary(msg)
		}
	}
}

// HasConcensus return whether all votes are the same
func (v *Vote) HasConcensus() bool {
	var choice *melody.Session = nil

	for _, s := range v.votes {
		if choice == nil {
			choice = s
			continue
		}
		if s != choice {
			return false
		}
	}
	return true
}

// IsVoter checks whether a session is in v.voters
func (v *Vote) IsVoter(s *melody.Session) bool {
	for _, i := range v.voters {
		if i == s {
			return true
		}
	}
	return false
}

func (g *Game) callVote(voters, candidates []*melody.Session) {
	g.lock.Lock()
	defer g.lock.Unlock()

	if g.vote != nil {
		g.vote.End()
	}

	g.vote = &Vote{
		voters:     voters,
		candidates: candidates,
		votes:      make(map[*melody.Session]*melody.Session),
	}

	// Get IDS
	ids := []int32{}
	for _, s := range candidates {
		c := g.clients[s]
		if c != nil {
			ids = append(ids, c.ID)
		}
	}

	msg, err := protocol.Marshal(&pb.VoteRequest{Choice_IDs: ids})
	if err != nil {
		return
	}

	for _, s := range voters {
		if !s.IsClosed() {
			s.WriteBinary(msg)
		}
	}
}
