package main

import (
	"encoding/json"
	"log"

	"github.com/olebedev/emitter"
)

// Game is a game that is running
type Game struct {
	hub *Hub
	evt *emitter.Emitter
}

func newGame() *Game {
	evt := &emitter.Emitter{}
	// skip sending of event
	evt.Use("*", emitter.Void)
	game := &Game{
		hub: newHub(evt),
		evt: evt,
	}
	go game.hub.run()
	go game.start()
	return game
}

func (game *Game) start() {
	log.Println("New game starting")
	game.evt.On("close", func(event *emitter.Event) {
		log.Println("Client closed")
	})
	game.evt.On("msg", func(e *emitter.Event) {
		// Decode the event
		arg := e.Args[0]
		client, ok := arg.(*Client)
		msg, mok := e.Args[1].([]byte)
		if !ok || !mok {
			log.Println("Message event type assertion failed")
			return
		}
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
	})
}
