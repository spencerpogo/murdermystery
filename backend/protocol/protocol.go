package protocol

import (
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"google.golang.org/protobuf/proto"
)

// Marshal marshals a message and handles any errors
func Marshal(message interface{ ProtoMessage() }) ([]byte, error) {
	var msg *pb.ServerMessage = pb.ToServerMessage(message)
	data, err := proto.Marshal(msg)
	if err != nil {
		log.Printf("Protocol error: %s\n", err)
		return []byte{}, err
	}
	return data, nil
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
