package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func gameHandler(w http.ResponseWriter, r *http.Request) {
	gid := mux.Vars(r)["id"]
	fmt.Fprintf(w, "Hello game id %s", gid)
}

func main() {
	r := mux.NewRouter()
	// routes
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Murder Mystery Backend v0.0.1")
	})
	r.HandleFunc("/game/{id}", gameHandler)
	// use mux
	http.Handle("/", r)

	log.Println("Starting server on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
