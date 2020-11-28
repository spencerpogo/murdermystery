package game

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"github.com/Scoder12/murdermystery/backend/protocol/pb"
	"gopkg.in/olahol/melody.v1"
)

// Vote represents a vote taking place in the game
type Vote struct {
	// The clients who are allowed to vote
	voters map[*melody.Session]bool
	// The candidates who they can choose from
	candidates map[*melody.Session]bool
	// The votes received from voters. map[voter]candidate
	votes map[*melody.Session]*melody.Session
	// The function to call whenever a vote is cast
	onChange func(*Vote)
}

// End ends the vote. Assumed game mutex is locked.
func (v *Vote) End(g *Game) {
	g.vote = nil

	msg, err := protocol.Marshal(&pb.VoteOver{})
	if err != nil {
		return
	}

	for s := range v.voters {
		if s != nil {
			err = s.WriteBinary(msg)
			printerr(err)
		}
	}
}

// HasConcensus return whether all votes are the same
func (v *Vote) HasConcensus() bool {
	var choice *melody.Session = nil
	var choiceSet bool = false

	for voter := range v.voters {
		s := v.votes[voter]

		if !choiceSet {
			choice = s
			choiceSet = true
			continue
		}

		if s != choice {
			return false
		}
	}

	// Don't return true if nobody has chosen
	return choice != nil
}

// IsVoter checks whether a session is in v.voters
func (v *Vote) IsVoter(s *melody.Session) bool {
	for i := range v.voters {
		if i == s {
			return true
		}
	}
	return false
}

// Assumes game is locked
func (v *Vote) toPB(g *Game) *pb.VoteSync {
	pbVotes := []*pb.VoteSync_Vote{}

	for voter := range v.voters {
		var voterID int32 = -1
		c := g.clients[voter]
		if c != nil {
			voterID = c.ID
		}

		voteSess, ok := v.votes[voter]
		var choiceID int32 = -1
		if ok {
			c := g.clients[voteSess]
			if c != nil {
				choiceID = c.ID
			}
		}
		pbVotes = append(pbVotes, &pb.VoteSync_Vote{Id: voterID, Choice: choiceID})
	}

	return &pb.VoteSync{Votes: pbVotes}
}

func (g *Game) callVote(
	voters, candidates []*melody.Session,
	vtype pb.VoteRequest_Type,
	onChange func(*Vote)) {
	g.lock.Lock()
	defer g.lock.Unlock()

	if g.vote != nil {
		g.vote.End(g)
	}

	votersMap := make(map[*melody.Session]bool)
	for _, s := range voters {
		votersMap[s] = true
	}
	candidatesMap := make(map[*melody.Session]bool)
	for _, c := range candidates {
		candidatesMap[c] = true
	}

	// We don't need to reference the vote type anywhere so not storing it, but can later
	//  if needed
	g.vote = &Vote{
		voters:     votersMap,
		candidates: candidatesMap,
		votes:      make(map[*melody.Session]*melody.Session),
		onChange:   onChange,
	}

	// Get IDS
	ids := []int32{}
	for _, s := range candidates {
		c := g.clients[s]
		if c != nil {
			ids = append(ids, c.ID)
		}
	}

	msg, err := protocol.Marshal(&pb.VoteRequest{Choice_IDs: ids, Type: vtype})
	if err != nil {
		return
	}

	for _, s := range voters {
		err = s.WriteBinary(msg)
		printerr(err)
	}

	g.syncVote()
}

func (g *Game) handleVoteMessage(s *melody.Session, c *Client, msg *pb.ClientVote) error {
	g.lock.Lock()
	defer g.lock.Unlock()

	if msg.Choice == 0 || g.vote == nil || !g.vote.IsVoter(s) {
		return nil
	}
	// Find corresponding session by ID
	choiceSession, _ := g.FindByID(msg.Choice)
	if choiceSession == nil {
		return nil
	}
	if g.vote.votes[s] == choiceSession {
		// The vote hasn't changed
		return nil
	}
	// Store vote
	g.vote.votes[s] = choiceSession
	log.Println(g.vote.votes, g.vote.HasConcensus())

	v := g.vote
	v.onChange(v)
	if g.vote != v {
		// It was ended by the handler
		return nil
	}
	g.syncVote()

	return nil
}

// SyncVote syncs the vote choices with all clients. Assumes game is locked!
func (g *Game) syncVote() {
	if g.vote == nil {
		return
	}

	pb := g.vote.toPB(g)
	msg, err := protocol.Marshal(pb)
	if err != nil {
		return
	}

	for voter := range g.vote.voters {
		if !voter.IsClosed() {
			err = voter.WriteBinary(msg)
			printerr(err)
		}
	}
}
