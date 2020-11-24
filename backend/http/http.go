package http

import (
	"log"
	"net/http"
	"sync"

	"github.com/Scoder12/murdermystery/backend/game"
	"github.com/gin-gonic/gin"
)

// Put this closure in a separate function so more memory can be garbage collected
func getDestroyFunc(games map[string]*game.Game, gamesMu *sync.Mutex, gid string) func() {
	return func() {
		gamesMu.Lock()
		delete(games, gid)
		gamesMu.Unlock()
	}
}

// StartServer starts the HTTP server
func StartServer(iface string, fs http.FileSystem) {
	r := gin.Default()

	games := make(map[string]*game.Game)
	var gamesMu sync.Mutex

	// routes
	r.GET("/game/:id", func(c *gin.Context) {
		gid := c.Param("id")

		gamesMu.Lock()
		g, exists := games[gid]
		if !exists {
			log.Println("Creating new game")
			g = game.New(getDestroyFunc(games, &gamesMu, gid))
			games[gid] = g
		}
		gamesMu.Unlock()

		err := g.HandleRequest(c.Writer, c.Request)
		if err != nil {
			log.Println(err)
		}
	})

	r.NoRoute(func(c *gin.Context) {
		c.FileFromFS(c.Request.URL.Path, fs)
	})

	log.Fatalln(r.Run(iface))
}
