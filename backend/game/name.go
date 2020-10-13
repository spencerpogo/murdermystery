package game

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/Scoder12/murdermystery/backend/net"
	"github.com/Scoder12/murdermystery/backend/protocol"
)

// Treat like const!
var badStrings = []string{
	"\u200B", // zero width space
	"\n",
	"\r",
	"\t",
}

func setNameHandler(client *net.Client, data []byte) error {
	if len(client.Name) > 0 {
		// No renames
		return nil
	}

	var name string
	if err := json.Unmarshal(data, &name); err != nil {
		return err
	}

	for _, bad := range badStrings {
		name = strings.ReplaceAll(name, bad, "")
	}
	name = strings.TrimSpace(name)

	if len(name) == 0 || len(name) > 50 {
		return fmt.Errorf("Invalid name")
	}
	client.Name = name

	protocol.SyncPlayers(client.Hub)

	client.Evt.Emit("named")

	return nil
}
