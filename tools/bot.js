#!/usr/bin/env node
const NodeWebSocket = require("ws");
const {
  ServerMessage,
  ClientMessage,
} = require("../pbjs/protobuf.js").murdermystery;

const SERVER = process.env.BOT_SERVER || "ws://localhost:8080";

const getName = (i) => `Bot${i + 1}`;

const runBot = (gid, i) => {
  const name = getName(i);
  const ws = new NodeWebSocket(`${SERVER}/game/${gid}`);
  let isHost = false;

  const send = (pbMsg) => {
    console.log(`[${name}] ↑`, pbMsg);
    ws.send(ClientMessage.encode(pbMsg).finish());
  };

  ws.on("message", (buffer) => {
    const msg = ServerMessage.decode(buffer);
    // msg.players gets collapsed so log it top level
    console.log(`[${name}] ↓`, msg.players ? msg.players : msg);

    if (msg.host && msg.host.isHost) {
      isHost = true;
    } else if (
      msg.players &&
      isHost &&
      msg.players.players &&
      msg.players.players.length >= 6
    ) {
      send({ startGame: {} });
    }
  });

  ws.on("open", () => send({ setName: { name } }));
};

if (require.main == module) {
  const argv = process.argv.slice(1);

  const gameId = argv[1];
  const count = parseInt(argv[2]);
  console.log(argv[2], count);

  if (!gameId || isNaN(count) || count < 1) {
    process.stderr.write(
      `Usage: [BOT_SERVER=ws://xxx] ${argv[0]} <game id> <bot count>`
    );
  }

  for (let i = 0; i < count; i++) {
    runBot(gameId, i);
  }
}
