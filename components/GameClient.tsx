import {
  Alert,
  AlertIcon,
  AlertTitle,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/core";
import { useEffect, useRef, useState } from "react";

import CharacterSpinner from "./CharacterSpinner";
import Loader from "./Loader";
import Lobby from "./Lobby";
import { murdermystery as protobuf } from "../pbjs/protobuf.js";
import { forcedTranslate as t } from "../translate";

enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

/*enum Scene {
  NONE = 0,
  SPINNER = 1,
}*/

function GameClientInner({
  server,
  id,
  nameProp,
  onError,
}: {
  server: string;
  id: string;
  nameProp: string;
  onError: (e: string) => void;
}) {
  // Main websocket
  const wsRef = useRef<WebSocket | null>(null);
  let ws = wsRef.current;

  // State

  // Are we the host? Used to determine whether "Start Game" is enabled on Lobby
  const [isHost, setIsHost] = useState<boolean>(false);
  // The players we know of. Server will sync these with us whever they update.
  const [players, setPlayers] = useState<protobuf.Players.IPlayer[]>([]);
  // Who the host is. Used for showing the "Host" badge next to them in the lobby
  const [hostId, setHostId] = useState<number>(-1);
  // If set, a modal will pop with alertContent and then it will be cleared.
  // Server will tell us when to set this
  const [alertContent, setAlertContent] = useState<string | null>(null);
  // Our character. Used by the spinner.
  const [character, setCharacter] = useState<protobuf.SetCharacter.Character>(
    protobuf.SetCharacter.Character.NONE
  );
  // Fellow wolves. Shown to the player after character spinner.
  //const [fellowWolves, setFellowWolves] = useState<number[]>([]);
  // The scene the game is in right now
  //const [scene, setScene] = useState<Scene>(Scene.NONE);

  // Message handlers
  function handleHost(msg: protobuf.IHost) {
    setIsHost(!!msg.isHost);
  }

  function handlePlayers(msg: protobuf.IPlayers) {
    setPlayers(msg.players || []);
    setHostId(msg.hostId || -1);
  }

  function handleError(err: protobuf.IError) {
    let error = "Error";
    if (err.msg == protobuf.Error.E_type.BADNAME) {
      error = "Your name is invalid";
    } else if (err.msg == protobuf.Error.E_type.DISCONNECT) {
      error =
        "Someone disconnected, reconnection is not yet implemented so game over";
    }
    onError(error);
  }

  function handleAlert(data: protobuf.IAlert) {
    let error = "There was an error while performing that action";
    if (data.msg == protobuf.Alert.Msg.NEEDMOREPLAYERS) {
      error = "You need at least 6 players to start the game";
    }
    setAlertContent(error);
  }

  function handleSetCharacter(msg: protobuf.ISetCharacter) {
    msg.character && setCharacter(msg.character);
  }

  function handleHandshake(msg: protobuf.IHandshake) {
    if (msg.err != protobuf.Handshake.Error.OK) {
      let error = "Error";
      if (msg.err == protobuf.Handshake.Error.STARTED) {
        error = "The game has already started";
      }
      onError(error);
    }
  }

  function handleFellowWolves(msg: protobuf.IFellowWolves) {
    //setFellowWolves(msg.ids || []);
  }

  // Utitility functions

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

  // Send encodes and sends a protobuf message to the server.
  const send = (msg: protobuf.IClientMessage) => {
    if (!ws) {
      console.error("Try to send() while ws is null");
      return;
    }
    console.log(msg);
    ws.send(protobuf.ClientMessage.encode(msg).finish());
  };

  const handshake = async () => {
    send({
      setName: { name: nameProp },
    });
  };

  // setup websocket
  useEffect(() => {
    try {
      wsRef.current = new WebSocket(`${server}/game/${id}`);
    } catch (e) {
      console.error(e);
      onError("Error while opening connection");
      return;
    }
    // update ws reference
    ws = wsRef.current;
    // Use proper binary type (no blobs)
    ws.binaryType = "arraybuffer";
    // handshake when it opens
    ws.addEventListener("open", () => handshake());
    // Handle messages
    ws.addEventListener("message", (ev: MessageEvent<any>) => parseMessage(ev));
    // Handle discconects
    ws.addEventListener("close", () => {
      onError("Disconnected from server");
    });

    // Cleanup: close websocket
    return () => ws?.close();
  }, []);

  // UI

  // The order of these checks is important.
  // Use the websocket readyState as the single source of truth for whether the connection is open.
  if (!ws || ws.readyState != ReadyState.OPEN) {
    return <Loader />;
  }
  // Don't care if connection is open but handshake is incomplete, in that case render
  //  an empty lobby instead

  // If we are here the game is all ready.

  let view; // The main component we will render
  if (!character) {
    view = (
      <Lobby
        players={players}
        hostId={hostId}
        isHost={isHost}
        start={() => send({ startGame: {} })}
      />
    );
  } else {
    // TODO: Store whether this has completed
    view = <CharacterSpinner character={character || ""} />;
  }

  return (
    <>
      {view}
      <Modal
        onClose={() => setAlertContent(null)}
        isOpen={alertContent != null}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text>{alertContent ? t(alertContent) : ""}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function GameClient({
  server,
  id,
  nameProp,
}: {
  server: string;
  id: string;
  nameProp: string;
}) {
  const [error, setError] = useState<string>("");
  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>{t(error)}</AlertTitle>
      </Alert>
    );
  }
  return (
    <GameClientInner
      server={server}
      id={id}
      nameProp={nameProp}
      onError={(err: string) => !error && setError(err)}
    />
  );
}
