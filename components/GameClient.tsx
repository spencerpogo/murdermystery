import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/core";
import { useEffect, useRef, useState } from "react";

import { EventEmitter } from "events";
import Loader from "./Loader";
import t from "../translate";

enum RPC_CALLS {
  setName = 0,
}

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
  const msgsRef = useRef<EventEmitter | null>(null);
  if (!msgsRef.current) {
    msgsRef.current = new EventEmitter();
  }
  const msgs = msgsRef.current;

  // isOpen is only used to re-render when connection is complete
  const [, setIsOpen] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHost, setIsHost] = useState<boolean>(false);
  const [names, setNames] = useState<string[]>([]);

  const LISTENERS = {
    host: function handleHost(msg: any) {
      if (!msg || !msg.hasOwnProperty("isHost")) return;
      setIsHost(!!msg.isHost);
    },

    players: function updatePlayers(msg: any) {
      console.log(msg);
      if (!msg || !Array.isArray(msg.names)) return;
      setNames(msg.names);
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
      setError("Disconnected from server");
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
    if (handshakeRes.error) {
      setError(handshakeRes.error);
    }
    setIsOpen(true);
  };

  // setup websocket
  useEffect(() => {
    try {
      wsRef.current = new WebSocket(`${server}/game/${id}`);
    } catch (e) {
      console.error(e);
      setError("Error while opening connection");
      return;
    }
    ws = wsRef.current;
    addListeners();
    ws.addEventListener("open", () => handshake());
    return () => ws?.close();
  }, []);

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>{t(error)}</AlertTitle>
      </Alert>
    );
  } else if (ws && ws.readyState == ReadyState.OPEN) {
    return (
      <>
        {isHost && <h3>You are the host</h3>}
        <h3>Players:</h3>
        <ul>
          {names.map((name) => {
            return <li key={name}>{name}</li>;
          })}
        </ul>
      </>
    );
  } else {
    return <Loader />;
  }
}
