package protocol

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"google.golang.org/protobuf/proto"
)

// Marshal marshals a message and handles any errors
func Marshal(message proto.Message) ([]byte, error) {
	msg, err := proto.Marshal(message)
	if err != nil {
		log.Printf("Protocol error: %s\n", err)
		return []byte{}, err
	}
	return msg, nil
}

// Unmarshal decodes a message. If invalid result will be nil
func Unmarshal(data []byte) (result *pb.ClientMessage) {
	defer func() {
		if r := recover(); r != nil {
			result = nil
		}
	}()

	m := &pb.ClientMessage{}
	proto.Unmarshal(data, m)
	return m
}
