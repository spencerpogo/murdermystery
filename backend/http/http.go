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
func MakeServer(iface string) *http.Server {
	games := make(map[string]*net.Hub)

	r := mux.NewRouter()
	// routes
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Murder Mystery Backend v0.0.1")
	})
	r.HandleFunc("/game/{id}", func(w http.ResponseWriter, r *http.Request) {
		gid := mux.Vars(r)["id"]

		log.Printf("New connection to id %s\n", gid)

		if _, exists := games[gid]; !exists {
			log.Println("Creating new server: ", gid)
			games[gid] = net.NewHub(
				game.HandleMsg,
				game.HandleJoin,
				game.HandleLeave,
				game.HandleStart)
			go games[gid].Run()
		}

		net.ServeWs(games[gid], w, r)
	})
	// use mux
	http.Handle("/", r)

	log.Printf("Starting server on http://%s\n", iface)

	return &http.Server{
		Handler: r,
		Addr:    iface,
		// Good practice: enforce timeouts for servers you create!
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
}
