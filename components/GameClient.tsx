import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/core";
import { useEffect, useRef, useState } from "react";

import { EventEmitter } from "events";
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
};

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
  const msgsRef = useRef<EventEmitter | null>(null);
  if (!msgsRef.current) {
    msgsRef.current = new EventEmitter();
  }
  const msgs = msgsRef.current;

  // isOpen is only used to re-render when connection is complete
  const [, setIsOpen] = useState<boolean>(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [didDisconnect, setDidDisconnect] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [names, setNames] = useState<{ name: string; isHost: boolean }[]>([]);

  const LISTENERS = {
    host: function handleHost(msg: any) {
      if (!msg || !msg.hasOwnProperty("isHost")) return;
      setIsHost(!!msg.isHost);
    },

    players: function updatePlayers(msg: any) {
      console.log(msg);
      if (!msg || !Array.isArray(msg.names)) return;
      const newNames = msg.names.map((name: string, i: number) => ({
        name,
        isHost: msg.hostInd == i,
      }));
      setNames(newNames);
    },

    error: function handleError(msg: any) {
      console.log(msg);
      if (!msg) return;
      let reason = msg.reason || "Server closed connection";
      if (serverMessages[reason]) reason = serverMessages[reason];
      setErrorNotice(reason);
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
      setErrorNotice(
        serverMessages[error] ? serverMessages[error] : error || "Error"
      );
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
    return (
      <Lobby names={names} isHost={isHost} start={() => rpc("startGame", {})} />
    );
  } else {
    return <Loader />;
  }
}
