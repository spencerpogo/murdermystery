package protocol

import (
	"fmt"
	"log"

	"github.com/Scoder12/murdermystery/backend/protocol/pb"

	"google.golang.org/protobuf/proto"
)

// ToServerMessage converts a message that is in the ServerMessage oneof to a ServerMessage object
func ToServerMessage(m interface{ ProtoMessage() }) *pb.ServerMessage {
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
	case *pb.VoteOver:
		return &pb.ServerMessage{Data: &pb.ServerMessage_VoteOver{VoteOver: r}}
	case *pb.ProphetReveal:
		return &pb.ServerMessage{Data: &pb.ServerMessage_ProphetReveal{ProphetReveal: r}}
	case *pb.SpectatorUpdate:
		return &pb.ServerMessage{Data: &pb.ServerMessage_SpectatorUpdate{SpectatorUpdate: r}}
	case *pb.KillReveal:
		return &pb.ServerMessage{Data: &pb.ServerMessage_KillReveal{KillReveal: r}}
	case *pb.Killed:
		return &pb.ServerMessage{Data: &pb.ServerMessage_Killed{Killed: r}}
	case *pb.GameOver:
		return &pb.ServerMessage{Data: &pb.ServerMessage_GameOver{GameOver: r}}
	case *pb.BulkSpectatorUpdate:
		return &pb.ServerMessage{Data: &pb.ServerMessage_BulkSpectatorUpdate{BulkSpectatorUpdate: r}}
	case *pb.PlayerStatus:
		return &pb.ServerMessage{Data: &pb.ServerMessage_PlayerStatus{PlayerStatus: r}}
	default:
		return nil
	}
}

// ToSpectatorUpdate converts a message that is in the SpectatorUpdate oneof to a SpectatorUpdate object
func ToSpectatorUpdate(msg interface{ ProtoMessage() }) *pb.SpectatorUpdate {
	switch r := msg.(type) {
	case *pb.SpectatorAssignedCharacter:
		return &pb.SpectatorUpdate{Evt: &pb.SpectatorUpdate_SetChar{SetChar: r}}
	case *pb.SpectatorProphetReveal:
		return &pb.SpectatorUpdate{Evt: &pb.SpectatorUpdate_ProphetReveal{ProphetReveal: r}}
	case *pb.SpectatorHealerHeal:
		return &pb.SpectatorUpdate{Evt: &pb.SpectatorUpdate_HealerHeal{HealerHeal: r}}
	case *pb.SpectatorKill:
		return &pb.SpectatorUpdate{Evt: &pb.SpectatorUpdate_Kill{Kill: r}}
	case *pb.SpectatorVoteRequest:
		return &pb.SpectatorUpdate{Evt: &pb.SpectatorUpdate_VoteRequest{VoteRequest: r}}
	case *pb.SpectatorVoteOver:
		return &pb.SpectatorUpdate{Evt: &pb.SpectatorUpdate_VoteOver{VoteOver: r}}
	default:
		return nil
	}
}

// Marshal marshals a message and handles any errors
func Marshal(message interface{ ProtoMessage() }) ([]byte, error) {
	var msg *pb.ServerMessage = ToServerMessage(message)
	log.Println("Marshaled:", msg)
	data := []byte{}
	var err error = nil
	if msg == nil {
		err = fmt.Errorf("invalid message type")
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
	err := proto.Unmarshal(data, m)
	if err != nil {
		log.Println(err)
		return nil
	}
	return m
}
