package game

import (
	"github.com/Scoder12/murdermystery/backend/net"
	//"github.com/olebedev/emitter"
)

// Game is a game that is running
type Game struct {
	Hub *net.Hub
}

// NewGame creates a new Game objects and runs the proper goroutines
func NewGame() *Game {
	game := &Game{
		Hub: net.NewHub(),
	}
	go game.Hub.Run()
	return game
}
