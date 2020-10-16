// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package net

import (
	"fmt"
	"sync"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Next player ID to assign so that it is unique
	nextPlayerID int

	mu sync.Mutex

	// Registered clients.
	clients map[int]*Client

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients, using playerID.
	unregister chan int

	// Handler for messages from clients
	handleMsg func(client *Client, data []byte)

	// Handler for joins
	handleJoin func(client *Client)

	// Handler for leaves
	handleLeave func(hub *Hub, wasHost bool)

	// Handler for when the game starts
	HandleStart func(hub *Hub)

	// Whether the game has started and can no longer accept players
	started bool

	// The host of the game
	host *Client
}

// NewHub creates a new *Hub object
func NewHub(
	handleMsg func(client *Client, data []byte),
	handleJoin func(client *Client),
	handleLeave func(hub *Hub, wasHost bool),
	handleStart func(hub *Hub)) *Hub {
	return &Hub{
		nextPlayerID: 0,
		mu:           sync.Mutex{},
		broadcast:    make(chan []byte),
		register:     make(chan *Client),
		unregister:   make(chan int),
		clients:      make(map[int]*Client),
		started:      false,
		handleMsg:    handleMsg,
		handleJoin:   handleJoin,
		handleLeave:  handleLeave,
		HandleStart:  handleStart,
	}
}

// Broadcast broadcasts a mess to all clients
func (h *Hub) Broadcast(msg []byte) {
	h.broadcast <- msg
}

// Started gets started
func (h *Hub) Started() bool {
	h.mu.Lock()
	defer h.mu.Unlock()
	return h.started && len(h.clients) > 0
}

// SetStarted sets started
func (h *Hub) SetStarted(val bool) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.started = val
}

// Host gets host
func (h *Hub) Host() *Client {
	h.mu.Lock()
	defer h.mu.Unlock()
	return h.host
}

// SetHost sets host
func (h *Hub) SetHost(val *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.host = val
}

// HasClient returns whether or not the pid given exists and is online
func (h *Hub) HasClient(pid int) bool {
	h.mu.Lock()
	defer h.mu.Unlock()
	c, ok := h.clients[pid]
	if !ok {
		return false
	}
	return c.IsOpen()
}

// GetClient gets a client by pid
func (h *Hub) GetClient(pid int) (*Client, error) {
	h.mu.Lock()
	defer h.mu.Unlock()
	c, ok := h.clients[pid]
	if !ok {
		return nil, fmt.Errorf("No such pid")
	}
	return c, nil
}

// EachOnline calls a function for each online client
func (h *Hub) EachOnline(callback func(c *Client)) {
	h.mu.Lock()

	// Although caching the clients is not ideal,
	//  we must release the lock before calling the callback because otherwise the
	//  callback can't use anything that requires the lock
	clients := []*Client{}

	for pid := range h.clients {
		c, ok := h.clients[pid]
		if ok && c.IsOpen() {
			clients = append(clients, c)
		}
	}

	h.mu.Unlock()

	for i := range clients {
		callback(clients[i])
	}
}

func (h *Hub) setClient(pid int, c *Client) {
	h.mu.Lock()
	defer h.mu.Unlock()

	h.clients[pid] = c
}

// Run is a goroutine that starts the Hub's event loop
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.mu.Lock()
			client.mu.Lock()
			pid := h.nextPlayerID
			h.nextPlayerID++
			client.ID = pid
			h.clients[pid] = client
			go h.handleJoin(client)
			client.mu.Unlock()
			h.mu.Unlock()
		case pid := <-h.unregister:
			h.mu.Lock()
			if client, ok := h.clients[pid]; ok {
				// Prevent any further actions on this client
				client.mu.Lock()

				client.isOpen = false
				client.conn.Close()
				close(client.send)
				delete(h.clients, pid)
				go h.handleLeave(h, h.host == client)
			}
			h.mu.Unlock()
		case message := <-h.broadcast:
			h.EachOnline(func(c *Client) {
				c.Send(message)
			})
		}
	}
}
