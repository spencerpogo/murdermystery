package main

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/http"
)

// TODO:
// - Create game endpoint that clients can request
// - Upper limit for concurrent games to prevent DOS
// - Lobbies expire if no one connected
// - Clients disconnect if they don't respond to pings or are afk
// - Figure out msg format: maybe <opcode><JSON arguments slice>

func main() {
	srv := http.MakeServer()
	log.Fatal(srv.ListenAndServe())
}
