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
import { EventEmitter2 } from "eventemitter2";
import Loader from "./Loader";
import Lobby from "./Lobby";
import { forcedTranslate as t } from "../translate";

enum RPC_CALLS {
  setName = 0,
  startGame = 1,
}

enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

const serverMessages = {
  disconnect:
    "Someone disconnected, reconnection is not yet implemented so game over",
  started: "The game has already started",
  notEnoughPlayers: "You need at least 6 players to start the game",
};

const getServerMessage = (key: string, fallback: string) =>
  serverMessages[key] || key || fallback;

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
  const msgsRef = useRef<EventEmitter2 | null>(null);
  if (!msgsRef.current) {
    msgsRef.current = new EventEmitter2();
  }
  const msgs = msgsRef.current;

  // isOpen is only used to re-render when connection is complete
  const [, setIsOpen] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [didDisconnect, setDidDisconnect] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [names, setNames] = useState<{ name: string; isHost: boolean }[]>([]);
  const [alertContent, setAlertContent] = useState<string | null>(null);

  const [character, setCharacter] = useState<string | null>(null);

  const LISTENERS = {
    host: function handleHost(msg: any) {
      if (!msg || !msg.hasOwnProperty("isHost")) return;
      setIsHost(!!msg.isHost);
    },

    players: function updatePlayers(msg: any) {
      if (!msg || !msg.names) return;
      const newNames = Object.keys(msg.names).map((pid: any, i: number) => {
        return {
          pid,
          name: msg.names[pid],
          isHost: msg.hostID == pid,
        };
      });
      setNames(newNames);
    },

    error: function handleError(msg: any) {
      if (!msg) return;
      setErrorNotice(getServerMessage(msg.reason, "Server closed connection"));
    },

    alert: function handleAlert(data: any) {
      if (!data || !data.msg) return;
      setAlertContent(
        getServerMessage(
          data.msg,
          "There was an error while performing that action"
        )
      );
    },
    setCharacter: function handleSetCharacter(msg: any) {
      if (!msg || !msg.value) return;
      setCharacter(msg.value);
    },
  };

  const parseMessage = (ev: MessageEvent<any>) => {
    let msg;
    try {
      msg = JSON.parse(ev.data);
    } catch (e) {
      console.error("Message decode error:", e);
      return;
    }
    if (!msg.type) {
      console.error("Missing message type!");
    }
    console.log(msg);
    msgs.emit(msg.type || "unknown", msg);
  };

  const addListeners = () => {
    if (!ws) {
      console.error("Try to addListeners() while ws is null");
      return;
    }
    ws.addEventListener("message", (ev: MessageEvent<any>) => parseMessage(ev));
    ws.addEventListener("close", () => {
      setDidDisconnect(true);
    });
    for (const evt of Object.keys(LISTENERS)) {
      msgs.on(evt, (msg) => LISTENERS[evt](msg));
    }
  };

  const rpc = (call: string, arg: any) => {
    if (!ws) {
      console.error("Try to rpc() while ws is null");
      return;
    }
    const rpcID = RPC_CALLS[call];
    if (typeof rpcID === "undefined") {
      console.error(new Error(`Invalid RPC call ${call}`));
      return;
    }
    ws.send(String.fromCharCode(65 + rpcID) + JSON.stringify(arg));
  };

  const waitForMessage = (type: string): Promise<any> => {
    return new Promise((resolve) => {
      msgs.once(type, (msg) => resolve(msg));
    });
  };

  const handshake = async () => {
    rpc("setName", nameProp);
    const handshakeRes = await waitForMessage("handshake");
    if (!handshakeRes) setErrorNotice("Error");
    const { error } = handshakeRes;
    console.log(handshakeRes);
    if (error) {
      console.log(error);
      setErrorNotice(getServerMessage(error, "Error"));
    }
    setIsOpen(true);
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
          names={names}
          isHost={isHost}
          start={() => rpc("startGame", {})}
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
              <Text>{t(alertContent || "")}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  } else {
    return <Loader />;
  }
}
