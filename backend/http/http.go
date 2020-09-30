package http

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/Scoder12/murdermystery/backend/game"
	"github.com/Scoder12/murdermystery/backend/net"
	"github.com/gorilla/mux"
)

// MakeServer definies HTTP handlers and returns an HTTP server
func MakeServer() *http.Server {
	games := make(map[string]*game.Game)

	r := mux.NewRouter()
	// routes
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Murder Mystery Backend v0.0.1")
	})
	r.HandleFunc("/game/{id}", func(w http.ResponseWriter, r *http.Request) {
		gid := mux.Vars(r)["id"]
		//fmt.Fprintf(w, "Hello game id %s", gid)
		log.Printf("New connection to id %s\n", gid)
		if _, exists := games[gid]; !exists {
			games[gid] = game.NewGame()
		}
		net.ServeWs(games[gid].Hub, w, r)
	})
	// use mux
	http.Handle("/", r)

	log.Println("Starting server on :8080")

	return &http.Server{
		Handler: r,
		Addr:    "0.0.0.0:8080",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
}
