import { useEffect, useRef } from "react";

import { murdermystery as protobuf } from "pbjs/protobuf";

export default function useGameSocket(
  wsUrl: string,
  name: string,
  parseMessage: (ev: MessageEvent<any>) => void,
  onError: (msg: string) => void
) {
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
      onError("Error while opening connection");
      return;
    }
    // update ws reference
    ws = wsRef.current;
    // Use proper binary type (no blobs)
    ws.binaryType = "arraybuffer";
    // handshake when it opens
    ws.addEventListener("open", () => sendName());
    // Handle messages
    ws.addEventListener("message", (ev: MessageEvent<any>) => parseMessage(ev));
    // Handle discconects
    ws.addEventListener("close", () => {
      onError("Disconnected from server");
    });

    // Cleanup: close websocket
    return () => ws?.close();
  }, []);

  return {
    send,
    isConnected: (): boolean => !!ws && ws.readyState == WebSocket.OPEN,
  };
}
