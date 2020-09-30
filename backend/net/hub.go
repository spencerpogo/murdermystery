// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package net

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	// Whether the game has started and can no longer accept players
	started bool

	// Handler for messages from clients
	handleMsg func(client *Client, data []byte)

	// Handler for joins
	handleJoin func(client *Client)

	// Handler for leaves
	handleLeave func(client *Client)
}

// NewHub creates a new *Hub object
func NewHub(handleMsg func(client *Client, data []byte), handleJoin func(client *Client), handleLeave func(client *Client)) *Hub {
	return &Hub{
		broadcast:   make(chan []byte),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
		clients:     make(map[*Client]bool),
		started:     false,
		handleMsg:   handleMsg,
		handleJoin:  handleJoin,
		handleLeave: handleLeave,
	}
}

// Run is a goroutine that starts the Hub's event loop
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			h.handleJoin(client)
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				close(client.send)
				h.handleLeave(client)
				delete(h.clients, client)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					h.unregister <- client
				}
			}
		}
	}
}
