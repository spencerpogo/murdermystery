package game

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol"
	"github.com/Scoder12/murdermystery/backend/protocol/pb"
	"gopkg.in/olahol/melody.v1"
)

// Vote represents a vote taking place in the game
type Vote struct {
	// The type of vote
	vType pb.VoteRequest_Type
	// The clients who are allowed to vote
	voters map[*melody.Session]bool
	// The candidates who they can choose from
	candidates map[*melody.Session]bool
	// The votes received from voters. map[voter]candidate
	votes map[*melody.Session]*melody.Session
	// The function to call whenever a vote is cast
	onChange func(*Vote, *melody.Session, *melody.Session)
	// Whether to disclose the results once the vote is over
	showResults bool
}

// _encodeResults encodes the vote into a VoteResult message.
// Assumes game mutex is locked and is intended to be called by Vote.End()
func (v *Vote) _encodeResults(g *Game) *pb.VoteResult {
	candidates := make(map[int32][]int32)
	for voter, cand := range v.votes {
		// Need clients for IDs
		voterClient, voterExists := g.clients[voter]
		candClient, candExists := g.clients[cand]
		// If both are valid
		if voterExists && candExists {
			// Add voter's ID to candiate's votes
			votes, ok := candidates[candClient.ID]
			if !ok {
				votes = []int32{}
			}
			votes = append(votes, voterClient.ID)
			candidates[candClient.ID] = votes
		}
	}

	voteResult := []*pb.VoteResult_CandidateResult{}
	for candID, voteIDs := range candidates {
		voteResult = append(voteResult, &pb.VoteResult_CandidateResult{Id: candID, Voters: voteIDs})
	}
	return &pb.VoteResult{Candidates: voteResult}
}

// End ends the vote. Assumed game mutex is locked.
func (v *Vote) End(g *Game) {
	g.vote = nil

	var result *pb.VoteResult
	if v.showResults {
		result = v._encodeResults(g)
	} else {
		result = nil
	}

	msg, err := protocol.Marshal(&pb.VoteOver{Result: result})
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

func (g *Game) callVote(
	voters, candidates []*melody.Session,
	vType pb.VoteRequest_Type,
	onChange func(*Vote, *melody.Session, *melody.Session),
	showResults bool) {
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
		vType:       vType,
		voters:      votersMap,
		candidates:  candidatesMap,
		votes:       make(map[*melody.Session]*melody.Session),
		onChange:    onChange,
		showResults: showResults,
	}

	// Get IDS
	ids := []int32{}
	for _, s := range candidates {
		c := g.clients[s]
		if c != nil {
			ids = append(ids, c.ID)
		}
	}

	msg, err := protocol.Marshal(&pb.VoteRequest{Choice_IDs: ids, Type: vType})
	if err != nil {
		return
	}

	for _, s := range voters {
		err = s.WriteBinary(msg)
		printerr(err)
	}
}

func (g *Game) handleVoteMessage(s *melody.Session, c *Client, msg *pb.ClientVote) {
	g.lock.Lock()
	defer g.lock.Unlock()

	if msg.Choice == 0 || g.vote == nil || !g.vote.IsVoter(s) {
		return
	}

	v := g.vote
	log.Println(msg.Choice, v.vType, pb.VoteRequest_HEALERHEAL, v.vType == pb.VoteRequest_HEALERHEAL)
	if v.vType == pb.VoteRequest_HEALERHEAL {
		g.healerHealHandler(msg.Choice == 2)
	} else {
		// Find corresponding session by ID
		choiceSession, _ := g.FindByID(msg.Choice)
		if choiceSession == nil {
			return
		}
		if v.votes[s] == choiceSession {
			// The vote hasn't changed
			return
		}
		// Store vote
		v.votes[s] = choiceSession
		log.Println(v.votes, g.vote.HasConcensus())

		v.onChange(v, s, choiceSession)
	}
}
