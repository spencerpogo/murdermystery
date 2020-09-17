package main

import (
	"log"
)

// Game is a game that is in progress
type Game struct {
	id string
	// TODO
}

func createGame(games map[string]Game, id string) Game {
	log.Printf("Creating new game with id %s\n", id)
	g := Game{id}
	games[id] = g
	return g
}
