package protocol

import (
	"log"

	"google.golang.org/protobuf/types/dynamicpb"

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
func Unmarshal(data []byte) (result *dynamicpb.Message) {
	defer func() {
		if r := recover(); r != nil {
			result = nil
		}
	}()

	m := &dynamicpb.Message{}
	proto.Unmarshal(data, m)
	return m
}
