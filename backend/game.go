package main

import (
	"encoding/json"
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
	// Unmarshal as JSON
	var data map[string]interface{} // TODO: maybe other types?
	if err := json.Unmarshal(msg, &data); err != nil {
		log.Println(err)
		client.Close()
		return
	}
	// TODO: do something with the JSON

	okJSON, _ := json.Marshal(map[string]bool{"ok": true})
	client.send <- okJSON
}

func (game *Game) start() {
	log.Println("New game starting")
}
