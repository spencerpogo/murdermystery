package main

import (
	"flag"

	"github.com/Scoder12/murdermystery/backend/http"
)

// TODO:
// - Create game endpoint that clients can request
// - Upper limit for concurrent games to prevent DOS
// - Lobbies expire if no one connected
// - Clients disconnect if they don't respond to pings or are afk
// - Figure out msg format: maybe <opcode><JSON arguments slice>

var addr = flag.String("addr", "127.0.0.1:8080", "http service address")

func main() {
	flag.Parse()
	http.StartServer(*addr)
}
