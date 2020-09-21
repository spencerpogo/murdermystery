package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

// TODO:
// - Create game endpoint that clients can request
// - Upper limit for concurrent games to prevent DOS
// - Lobbies expire if no one connected
// - Clients disconnect if they don't respond to pings or are afk
// - Figure out msg format: maybe <opcode><JSON arguments slice>

func main() {
	games := make(map[string]*Game)

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
			games[gid] = newGame()
		}
		serveWs(games[gid].hub, w, r)
	})
	// use mux
	http.Handle("/", r)

	log.Println("Starting server on :8080")

	srv := &http.Server{
		Handler: r,
		Addr:    "0.0.0.0:8080",
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
