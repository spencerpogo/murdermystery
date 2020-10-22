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

export default function GameClient({
  server,
  id,
  nameProp,
}: {
  server: string;
  id: string;
  nameProp: string;
}) {
  const wsRef = useRef<WebSocket | null>(null);
  let ws = wsRef.current;

  // isOpen is only used to re-render when connection is complete
  const [, setIsOpen] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [didDisconnect, setDidDisconnect] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [players, setPlayers] = useState<protobuf.Players.IPlayer[]>([]);
  const [hostId, setHostId] = useState<number>(-1);
  const [alertContent, setAlertContent] = useState<string | null>(null);

  const [character, setCharacter] = useState<protobuf.SetCharacter.Character>(
    protobuf.SetCharacter.Character.NONE
  );

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
    setErrorNotice(error);
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
      setErrorNotice(error);
    }
    setIsOpen(true);
  }

  const callHandler = (msg: protobuf.IServerMessage) => {
    if (msg.handshake) return handleHandshake(msg.handshake);
    if (msg.host) return handleHost(msg.host);
    if (msg.players) return handlePlayers(msg.players);
    if (msg.error) return handleError(msg.error);
    if (msg.alert) return handleAlert(msg.alert);
    if (msg.setCharacter) return handleSetCharacter(msg.setCharacter);
    if (msg.fellowWolves) return () => {};
    throw new Error("Not implemented. ");
  };

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

  const send = (msg: protobuf.IClientMessage) => {
    if (!ws) {
      console.error("Try to send() while ws is null");
      return;
    }
    console.log(msg);
    ws.send(protobuf.ClientMessage.encode(msg).finish());
  };

  const addListeners = () => {
    if (!ws) {
      console.error("Try to addListeners() while ws is null");
      return;
    }
    ws.binaryType = "arraybuffer";
    ws.addEventListener("message", (ev: MessageEvent<any>) => parseMessage(ev));
    ws.addEventListener("close", () => {
      setDidDisconnect(true);
    });
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
      setErrorNotice("Error while opening connection");
      return;
    }
    ws = wsRef.current;
    addListeners();
    ws.addEventListener("open", () => handshake());
    return () => ws?.close();
  }, []);

  if (errorNotice || didDisconnect) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>{t(errorNotice || "Disconnected from server")}</AlertTitle>
      </Alert>
    );
  } else if (ws && ws.readyState == ReadyState.OPEN) {
    let view;
    if (character) {
      view = <CharacterSpinner character={character || ""} />;
    } else {
      view = (
        <Lobby
          players={players}
          hostId={hostId}
          isHost={isHost}
          start={() => send({ startGame: {} })}
        />
      );
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
  } else {
    return <Loader />;
  }
}
