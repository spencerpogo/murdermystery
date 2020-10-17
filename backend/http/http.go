package http

import (
	"log"
	"net/http"
	"sync"

	"github.com/Scoder12/murdermystery/backend/game"
	"github.com/gin-gonic/gin"
)

// StartServer starts the HTTP server
func StartServer(iface string) {
	r := gin.Default()

	games := make(map[string]*game.Game)
	var gamesMu sync.Mutex

	// routes
	r.GET("/", func(c *gin.Context) {
		c.String(http.StatusOK, "Murder Mystery Backend v0.0.1")
	})
	r.GET("/game/:id", func(c *gin.Context) {
		gid := c.Param("id")

		gamesMu.Lock()
		g, exists := games[gid]
		if !exists {
			g = game.New()
			games[gid] = g
		}
		gamesMu.Unlock()

		g.HandleRequest(c.Writer, c.Request)
	})

	log.Fatalln(r.Run(iface))
}
