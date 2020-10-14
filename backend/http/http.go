package http

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/Scoder12/murdermystery/backend/game"

	"github.com/Scoder12/murdermystery/backend/net"
	"github.com/gorilla/mux"
)

// MakeServer definies HTTP handlers and returns an HTTP server
func MakeServer(iface string) *http.Server {
	var games sync.Map

	r := mux.NewRouter()
	// routes
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Murder Mystery Backend v0.0.1")
	})
	r.HandleFunc("/game/{id}", func(w http.ResponseWriter, r *http.Request) {
		gid := mux.Vars(r)["id"]

		log.Printf("New connection to id %s\n", gid)

		var hub *net.Hub
		var exists bool
		var loaded interface{}

		if loaded, exists = games.Load(gid); exists {
			hub = loaded.(*net.Hub)
		} else {
			log.Println("Creating new server: ", gid)
			hub = net.NewHub(
				game.HandleMsg,
				game.HandleJoin,
				game.HandleLeave,
				game.HandleStart)
			games.Store(gid, hub)
			go hub.Run()
		}

		net.ServeWs(hub, w, r)
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
