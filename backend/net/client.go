// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package net

import (
	"bytes"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 15 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true // for debug, allow all origins
	},
}

// Client represents a player in the game.
// It also acts as middleman between the websocket connection and the hub.
type Client struct {
	Hub *Hub

	// The ID of the client
	ID int

	// The mutex for this client
	mu sync.Mutex

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	send chan []byte

	// Name is the name of the player
	name string

	// isOpen is whether the client is open
	isOpen bool

	// The Character this player has
	role int
}

// Exported Functions

// Send sends a message to the client
func (c *Client) Send(msg []byte) {
	c.mu.Lock()
	defer c.mu.Unlock()
	if !c.isOpen {
		c.Hub.unregister <- c.ID
		return
	}
	log.Printf("%s < %s\n", c.name, string(msg))
	c.send <- msg
}

// Close closes the client
func (c *Client) Close() {
	log.Println("Close called")
	c.Hub.unregister <- c.ID
}

// IsOpen returns whether the client is open
func (c *Client) IsOpen() bool {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.isOpen && len(c.name) > 0
}

// SetIsOpen sets isOpen
func (c *Client) SetIsOpen(val bool) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.isOpen = val
}

// Name returns name
func (c *Client) Name() string {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.name
}

// SetName sets name
func (c *Client) SetName(val string) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.name = val
}

// Role returns role
func (c *Client) Role() int {
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.role
}

// SetRole sets role
func (c *Client) SetRole(val int) {
	c.mu.Lock()
	defer c.mu.Unlock()
	c.role = val
}

// WebSocket Internal Message Handling

// readPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) readPump() {
	defer c.Close()
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			//if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
			log.Printf("error: %v", err)
			//}
			break
		}
		message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		go c.Hub.handleMsg(c, message)
	}
	log.Println("readPump exiting")
}

// writePump pumps messages from the hub to the websocket connection.
//
// A goroutine running writePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			//n := len(c.send)
			//for i := 0; i < n; i++ {
			//	w.Write(newline)
			//	w.Write(<-c.send)
			//}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

// ServeWs handles websocket requests from the peer.
func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{
		Hub: hub,
		ID:  -1,
		//mu:     sync.Mutex{},
		conn:   conn,
		send:   make(chan []byte, 256),
		isOpen: true,
		name:   "",
		role:   0,
	}
	hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump()
	go client.readPump()
}
