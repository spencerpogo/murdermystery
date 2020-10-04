// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package net

import "log"

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	Clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Handler for messages from clients
	handleMsg func(client *Client, data []byte)

	// Handler for joins
	handleJoin func(client *Client)

	// Handler for leaves
	handleLeave func(client *Client)

	// Handler for when the game starts
	HandleStart func(hub *Hub)

	// Whether the game has started and can no longer accept players
	Started bool

	// The host of the game
	Host *Client
}

// NewHub creates a new *Hub object
func NewHub(handleMsg func(client *Client, data []byte),
	handleJoin func(client *Client),
	handleLeave func(client *Client),
	handleStart func(hub *Hub)) *Hub {
	return &Hub{
		broadcast:   make(chan []byte),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		Clients:     make(map[*Client]bool),
		Started:     false,
		handleMsg:   handleMsg,
		handleJoin:  handleJoin,
		handleLeave: handleLeave,
		HandleStart: handleStart,
	}
}

// Broadcast broadcasts a mess to all clients
func (h *Hub) Broadcast(msg []byte) {
	h.broadcast <- msg
}

// Run is a goroutine that starts the Hub's event loop
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.Clients[client] = true
			go h.handleJoin(client)
		case client := <-h.unregister:
			if _, ok := h.Clients[client]; ok {
				client.conn.Close()
				close(client.send)
				go h.handleLeave(client)
				delete(h.Clients, client)
			}
		case message := <-h.broadcast:
			log.Println("[BROADCAST]", string(message), "[/BROADCAST]")
			for client := range h.Clients {
				client.Send(message)
			}
		}
	}
}
