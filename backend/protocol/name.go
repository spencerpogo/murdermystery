package protocol

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/Scoder12/murdermystery/backend/net"
)

type setNameMsg struct {
	Name string `json:"name"`
}

// Treat like const!
var badStrings = []string{
	"\u200B", // zero width space
	"\n",
	"\r",
	"\t",
}

func setNameHandler(client *net.Client, data []byte) error {
	var msg setNameMsg
	if err := json.Unmarshal(data, &msg); err != nil {
		return err
	}

	name := msg.Name
	for _, bad := range badStrings {
		name = strings.ReplaceAll(name, bad, "")
	}
	name = strings.TrimSpace(name)

	if len(name) == 0 || len(name) > 50 {
		return fmt.Errorf("Invalid name")
	}
	oldName := client.Name
	client.Name = msg.Name

	if oldName != "" && oldName != client.Name {
		renJSON, _ := json.Marshal(map[string]string{"type": "rename", "from": oldName, "to": client.Name})
		client.Hub.Broadcast(renJSON)
	}

	client.Evt.Emit("named")

	return nil
}
