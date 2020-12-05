import { murdermystery as protobuf } from "pbjs/protobuf";
import { useEffect, useRef } from "react";
import { STRINGS } from "./translate";

interface GameSocket {
  send: (msg: protobuf.IClientMessage) => void;
  isConnected: () => boolean;
}

export default function useGameSocket(
  wsUrl: string,
  name: string,
  parseMessage: (ev: MessageEvent) => void,
  onError: (msg: STRINGS) => void
): GameSocket {
  // Main websocket
  const wsRef = useRef<WebSocket | null>(null);
  let ws = wsRef.current;

  // Send encodes and sends a protobuf message to the server.
  const send = (msg: protobuf.IClientMessage) => {
    if (!ws) {
      console.error("Try to send() while ws is null");
      return;
    }
    console.log(msg);
    ws.send(protobuf.ClientMessage.encode(msg).finish());
  };

  const sendName = () => {
    send({
      setName: { name },
    });
  };

  // setup websocket
  useEffect(() => {
    try {
      wsRef.current = new WebSocket(wsUrl);
    } catch (e) {
      console.error(e);
      onError(STRINGS.ERROR_OPENING_CONN);
      return;
    }
    // Already storing it in a ref, so this warning is invalid
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ws = wsRef.current;
    // Use proper binary type (no blobs)
    ws.binaryType = "arraybuffer";
    // handshake when it opens
    ws.addEventListener("open", () => sendName());
    // Handle messages
    ws.addEventListener("message", (ev: MessageEvent) => parseMessage(ev));
    // Handle discconects
    ws.addEventListener("close", () => {
      onError(STRINGS.SERVER_DISCONNECTED);
    });

    // Cleanup: close websocket
    // eslint-disable-next-line consistent-return
    return () => ws?.close();
  }, []);

  return {
    send,
    isConnected: (): boolean => !!ws && ws.readyState === WebSocket.OPEN,
  };
}
