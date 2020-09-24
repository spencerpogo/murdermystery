package main

import (
	"log"
	//"github.com/olebedev/emitter"
)

// Game is a game that is running
type Game struct {
	hub *Hub
}

func newGame() *Game {
	game := &Game{
		hub: newHub(),
	}
	go game.hub.run()
	go game.start()
	return game
}

func handleClose(client *Client) {
	// TODO: check for game over here
	log.Println("Close received")
}

func handleMsg(client *Client, msg []byte) {
	log.Printf("Got message: %s\n", string(msg))
	err := decodeMsg(client, msg)
	if err != nil {
		log.Println(err)
		client.Close()
		return
	}
}

func (game *Game) start() {
	log.Println("New game starting")
}
