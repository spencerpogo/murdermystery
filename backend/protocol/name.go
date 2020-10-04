package protocol

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/Scoder12/murdermystery/backend/net"
)

// Treat like const!
var badStrings = []string{
	"\u200B", // zero width space
	"\n",
	"\r",
	"\t",
}

func setNameHandler(client *net.Client, data []byte) error {
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
	oldName := client.Name
	client.Name = name

	if oldName != "" && oldName != client.Name {
		client.Hub.Broadcast(SerializeRPC("rename", map[string]interface{}{
			"from": oldName,
			"to":   client.Name,
		}))
	}

	client.Evt.Emit("named")

	return nil
}
