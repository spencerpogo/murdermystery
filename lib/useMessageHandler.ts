import { murdermystery as protobuf } from "pbjs/protobuf";
import { useState } from "react";

export interface PlayerIDMap {
  [id: string]: protobuf.Players.IPlayer;
}

// Typing this function's return would be too complicated, plus it only returns once
//  and the type can be inferred.
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function useMessageHandler(onError: (msg: string) => void) {
  // Our player ID
  // Set to -2 so it is different from spectator ID of -1, otherwise we will never
  //  re-render as a spectator
  const [playerID, setPlayerID] = useState<number>(-2);
  // Are we the host? Used to determine whether "Start Game" is enabled on Lobby
  const [isHost, setIsHost] = useState<boolean>(false);
  // The players we know of. Server will sync these with us whever they update.
  const [players, setPlayers] = useState<PlayerIDMap>({});
  // Who the host is. Used for showing the "Host" badge next to them in the lobby
  const [hostId, setHostId] = useState<number>(-1);
  // If set, a modal will pop with alertContent and then it will be cleared.
  // Server will tell us when to set this
  const [alertContent, setAlertContent] = useState<string | null>(null);
  // Our character. Used by the spinner.
  const [character, setCharacter] = useState<protobuf.Character>(
    protobuf.Character.NONE
  );
  // Whether the character spinner is done
  const [spinDone, setSpinDone] = useState<boolean>(false);
  // Fellow wolves. Shown to the player after character spinner.
  const [fellowWolves, setFellowWolves] = useState<number[]>([]);
  // Whether the fellow wolves screen still needs to be shown
  const [showFellowWolves, setShowFellowWolves] = useState<boolean>(false);
  // Current vote to be shown to the user.
  const [voteRequest, setVoteRequest] = useState<number[]>([]);
  // Current vote type
  const [voteType, setVoteType] = useState<protobuf.VoteRequest.Type>(0);
  // Current vote status
  const [voteInfo, setVoteInfo] = useState<protobuf.VoteSync.IVote[]>([]);
  // Prophet reveal screen
  const [
    prophetReveal,
    setProphetReveal,
  ] = useState<protobuf.IProphetReveal | null>(null);

  // Message handlers
  function handleHost(msg: protobuf.IHost) {
    setIsHost(!!msg.isHost);
  }

  function handlePlayers(msg: protobuf.IPlayers) {
    const newPlayers: PlayerIDMap = {};
    (msg.players || []).forEach((p) => {
      if (p.id && p.name) {
        newPlayers[p.id] = p;
      }
    });
    setPlayers(newPlayers);
    setHostId(msg.hostId || -1);
  }

  function handleError(err: protobuf.IError) {
    let error = "Error";
    if (err.msg === protobuf.Error.E_type.BADNAME) {
      error = "Your name is invalid";
    } else if (err.msg === protobuf.Error.E_type.DISCONNECT) {
      error =
        "Someone disconnected, reconnection is not yet implemented so game over";
    }
    onError(error);
  }

  function handleAlert(data: protobuf.IAlert) {
    let error = "There was an error while performing that action";
    if (data.msg === protobuf.Alert.Msg.NEEDMOREPLAYERS) {
      error = "You need at least 6 players to start the game";
    }
    setAlertContent(error);
  }

  function handleSetCharacter(msg: protobuf.ISetCharacter) {
    msg.character && setCharacter(msg.character);
  }

  function handleHandshake(msg: protobuf.IHandshake) {
    if (
      msg.status !== protobuf.Handshake.Status.OK &&
      msg.status !== protobuf.Handshake.Status.SPECTATOR
    ) {
      const error = "Error";
      onError(error);
    }
    if (msg.id) {
      setPlayerID(msg.id);
    }
  }

  function handleFellowWolves(msg: protobuf.IFellowWolves) {
    setFellowWolves(msg.ids || []);
    setShowFellowWolves(true);
  }

  function handleVoteRequest(msg: protobuf.IVoteRequest) {
    if (msg.choice_IDs) {
      setVoteRequest(msg.choice_IDs);
      setVoteType(msg.type || 0);
    }
  }

  function handleVoteSync(msg: protobuf.IVoteSync) {
    if (msg.votes) {
      setVoteInfo(msg.votes);
    }
  }

  function handleVoteOver() {
    // Clear vote data
    setVoteRequest([]);
    setVoteInfo([]);
  }

  function handleProphetReveal(msg: protobuf.IProphetReveal) {
    setProphetReveal(msg);
  }

  // Call the proper handler based on the ServerMessage.
  // Protobuf guarantees only one of these cases will be true due to `oneof`, so this
  //  is the best way to call the correct handler.
  const callHandler = (msg: protobuf.IServerMessage) => {
    if (msg.handshake) return handleHandshake(msg.handshake);
    if (msg.host) return handleHost(msg.host);
    if (msg.players) return handlePlayers(msg.players);
    if (msg.error) return handleError(msg.error);
    if (msg.alert) return handleAlert(msg.alert);
    if (msg.setCharacter) return handleSetCharacter(msg.setCharacter);
    if (msg.fellowWolves) return handleFellowWolves(msg.fellowWolves);
    if (msg.voteRequest) return handleVoteRequest(msg.voteRequest);
    if (msg.voteSync) return handleVoteSync(msg.voteSync);
    if (msg.voteOver) return handleVoteOver();
    if (msg.prophetReveal) return handleProphetReveal(msg.prophetReveal);
    throw new Error("Not implemented. ");
  };

  // Process a message from the websocket.
  const parseMessage = (ev: MessageEvent<ArrayBuffer>) => {
    let msg: protobuf.IServerMessage;
    try {
      msg = protobuf.ServerMessage.decode(new Uint8Array(ev.data));
      console.log(msg);
      callHandler(msg);
    } catch (e) {
      console.error("Message decode error:", e);
    }
  };

  return {
    // Message Parser
    parseMessage,
    // State variables
    playerID,
    isHost,
    players,
    hostId,
    alertContent,
    character,
    spinDone,
    setSpinDone,
    fellowWolves,
    showFellowWolves,
    voteRequest,
    voteInfo,
    voteType,
    prophetReveal,
    // State setters
    setShowFellowWolves,
    setProphetReveal,
    setAlertContent,
  };
}
