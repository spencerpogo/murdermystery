package protocol

import (
	"fmt"
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"google.golang.org/protobuf/proto"
)

func toServerMessage(m interface{ ProtoMessage() }) *pb.ServerMessage {
	switch r := m.(type) {
	case *pb.Handshake:
		return &pb.ServerMessage{Data: &pb.ServerMessage_Handshake{Handshake: r}}
	case *pb.Host:
		return &pb.ServerMessage{Data: &pb.ServerMessage_Host{Host: r}}
	case *pb.Players:
		return &pb.ServerMessage{Data: &pb.ServerMessage_Players{Players: r}}
	case *pb.Error:
		return &pb.ServerMessage{Data: &pb.ServerMessage_Error{Error: r}}
	case *pb.Alert:
		return &pb.ServerMessage{Data: &pb.ServerMessage_Alert{Alert: r}}
	case *pb.SetCharacter:
		return &pb.ServerMessage{Data: &pb.ServerMessage_SetCharacter{SetCharacter: r}}
	case *pb.FellowWolves:
		return &pb.ServerMessage{Data: &pb.ServerMessage_FellowWolves{FellowWolves: r}}
	case *pb.VoteRequest:
		return &pb.ServerMessage{Data: &pb.ServerMessage_VoteRequest{VoteRequest: r}}
	case *pb.VoteSync:
		return &pb.ServerMessage{Data: &pb.ServerMessage_VoteSync{VoteSync: r}}
	case *pb.VoteOver:
		return &pb.ServerMessage{Data: &pb.ServerMessage_VoteOver{VoteOver: r}}
	case *pb.ProphetReveal:
		return &pb.ServerMessage{Data: &pb.ServerMessage_ProphetReveal{ProphetReveal: r}}
	default:
		return nil
	}
}

// Marshal marshals a message and handles any errors
func Marshal(message interface{ ProtoMessage() }) ([]byte, error) {
	var msg *pb.ServerMessage = toServerMessage(message)
	log.Println("Marshaled:", msg)
	data := []byte{}
	var err error = nil
	if msg == nil {
		err = fmt.Errorf("Invalid message type")
	} else {
		data, err = proto.Marshal(msg)
	}
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
