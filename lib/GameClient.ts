const RPC_CALLS = {
  setName: "A",
};

class GameClient {
  ws: WebSocket;

  constructor(ws: WebSocket, name: string) {
    this.ws = ws;
    this.handshake(name);
  }

  rpc(call: string, arg: any) {
    const rpcID = RPC_CALLS[call];
    if (!rpcID) {
      console.error(new Error(`Invalid RPC call ${call}`));
      return;
    }
    this.ws.send(rpcID + JSON.stringify(arg));
  }

  handshake(name: string) {
    this.rpc("setName", name);
  }
}

export default GameClient;
