package game

import (
	"log"
	"sort"

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
func (v *Vote) _encodeResults(g *Game, jury *pb.JuryVoteResult) *pb.VoteResult {
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
	return &pb.VoteResult{Candidates: voteResult, Jury: jury}
}

// End ends the vote. Assumed game mutex is locked.
func (v *Vote) End(g *Game, jury *pb.JuryVoteResult) {
	g.vote = nil

	var result *pb.VoteResult
	if v.showResults {
		result = v._encodeResults(g, jury)
	} else {
		result = nil
	}

	// Send VoteOver to the voters
	voteOver := &pb.VoteOver{Result: result}
	msg, err := protocol.Marshal(voteOver)
	if err != nil {
		return
	}

	for s := range v.voters {
		if s != nil {
			err = s.WriteBinary(msg)
			printerr(err)
		}
	}

	// Dispatch it to spectators
	g.dispatchSpectatorUpdate(protocol.ToSpectatorUpdate(&pb.SpectatorVoteOver{
		VoteOver: voteOver,
	}))
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

// AllVotesIn returns whether all voters have voted
func (v *Vote) AllVotesIn() bool {
	for voter := range v.voters {
		_, hasVoted := v.votes[voter]
		if !hasVoted {
			return false
		}
	}
	return true
}

// Tally returns a map of candidates to the number of votes they got
func (v *Vote) Tally() map[*melody.Session]int {
	scores := make(map[*melody.Session]int)

	for _, choice := range v.votes {
		s, ok := scores[choice]
		if !ok {
			s = 0
		}
		s++
		scores[choice] = s
	}
	return scores
}

// GetResult gets the result of the vote and the winner if any
func (v *Vote) GetResult() (pb.VoteResultType, *melody.Session) {
	// Setup data
	tally := v.Tally()
	scores := make([]int, len(tally))
	i := 0
	for _, s := range tally {
		scores[i] = s
		i++
	}
	sort.Ints(scores)
	scoreLen := len(scores)

	winningScore := scores[scoreLen-1]
	if scoreLen >= 2 {
		if winningScore == scores[scoreLen-2] {
			// Tie
			return pb.VoteResultType_TIE, nil
		}
	}

	// Find winner
	var winner *melody.Session
	for choice, score := range tally {
		if score == winningScore {
			winner = choice
			break
		}
	}

	return pb.VoteResultType_WIN, winner
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
		g.vote.End(g, nil)
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
	voterIDs := make([]int32, len(voters))
	i := 0
	for _, s := range candidates {
		c := g.clients[s]
		if c != nil {
			voterIDs[i] = c.ID
			i++
		}
	}

	candidateIDs := make([]int32, len(candidates))
	i = 0
	for _, s := range candidates {
		c := g.clients[s]
		if c != nil {
			candidateIDs[i] = c.ID
			i++
		}
	}

	// Send the vote request to the voters
	req := &pb.VoteRequest{Choice_IDs: candidateIDs, Type: vType}
	msg, err := protocol.Marshal(req)
	if err != nil {
		return
	}

	for _, s := range voters {
		err = s.WriteBinary(msg)
		printerr(err)
	}

	// Dispatch this as a spectator event
	g.dispatchSpectatorUpdate(protocol.ToSpectatorUpdate(&pb.SpectatorVoteRequest{
		Voters:      voterIDs,
		VoteRequest: req,
	}))
}

func (g *Game) handleVoteMessage(s *melody.Session, c *Client, msg *pb.ClientVote) {
	g.lock.Lock()
	defer g.lock.Unlock()

	if msg.Choice == 0 || g.vote == nil || !g.vote.IsVoter(s) {
		return
	}

	v := g.vote
	// Healer Heal is a special case: they are picking yes/no, not a specific person, so
	//  change their choice into a yes/no bool instead of a session and use a different
	//  handler (because the normal handler's signature wouldn't work)
	if v.vType == pb.VoteRequest_HEALERHEAL {
		g.healerHealHandler(c, msg.Choice == 2)
	} else {
		var choiceSession *melody.Session
		if v.vType == pb.VoteRequest_HEALERPOISON && msg.Choice == -1 {
			// Special case: This vote can be "skipped" by using -1 as the choice.
			// Set choiceSession to nil and onChange will handle it
			log.Println("healerpoison: settings choiceSession to nil")
			choiceSession = nil
		} else {
			// Find corresponding session by ID
			choiceSession, _ = g.FindByID(msg.Choice)
			if choiceSession == nil {
				return
			}
			_, hasVoted := v.votes[s]
			if hasVoted {
				// You cannot change your vote after voting
				return
			}

			// Store vote
			v.votes[s] = choiceSession
			log.Println("votes:", v.votes, "hasConcensus:", g.vote.HasConcensus())
		}

		v.onChange(v, s, choiceSession)
	}
}
