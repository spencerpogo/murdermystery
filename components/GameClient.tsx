import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/core";

import { Component } from "react";
import { EventEmitter } from "events";
import Loader from "./Loader";

const RPC_CALLS = {
  setName: "A",
};

enum ReadyState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

// GameClient wraps around a WebSocket and has convienience methods
class GameClient extends Component {
  props: { server: string; id: string; name: string };
  ws: WebSocket;
  msgs: EventEmitter;
  disconnected: true;
  state: { error: string | undefined };

  constructor(props: { server: string; id: string; name: string }) {
    super(props);
    this.msgs = new EventEmitter();
  }

  componentDidMount() {
    this.connect();
  }

  componentWillUnmount() {
    this.disconnect();
  }

  addListeners() {
    const self = this;
    this.ws.addEventListener("message", (ev: MessageEvent<any>) =>
      self.parseMessage(ev)
    );
    this.ws.addEventListener("close", () => {
      this.disconnect();
    });
  }

  parseMessage(ev: MessageEvent<any>) {
    const self = this;
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
    self.msgs.emit(msg.type || "unknown", msg);
  }

  connect(): Promise<void> {
    return new Promise((res) => {
      this.ws = new WebSocket(`${this.props.server}/game/${this.props.id}`);
      this.addListeners();
      this.ws.addEventListener("open", () => {
        this.handshake().then(() => res());
      });
    });
  }

  disconnect(): void {
    try {
      this.ws.close();
    } catch (e) {}
    console.error(new Error("Disconnecting."));
    this.disconnected = true;
  }

  rpc(call: string, arg: any): void {
    const rpcID = RPC_CALLS[call];
    if (!rpcID) {
      console.error(new Error(`Invalid RPC call ${call}`));
      return;
    }
    this.ws.send(rpcID + JSON.stringify(arg));
  }

  // Awaits a message to be received
  recv(type: string): Promise<any> {
    const self = this;
    return new Promise((resolve) => {
      self.msgs.once(type, (...args) => resolve(args));
    });
  }

  async handshake(): Promise<void> {
    this.rpc("setName", this.props.name);
    // TODO: handle isHost
    const handshake = await this.recv("handshake");
    if (handshake.error) {
      console.error("Error in handshake:", handshake);
      await this.disconnect();
    }
  }

  render() {
    if (this.ws && this.ws.readyState == ReadyState.OPEN) {
      return <p>Looks good to me</p>;
    } else if (this.disconnected || this.state.error) {
      return (
        <Alert status="error">
          <AlertIcon />
          <AlertTitle>Disconnected from server!</AlertTitle>
        </Alert>
      );
    } else {
      return <Loader />;
    }
  }
}

export default GameClient;
