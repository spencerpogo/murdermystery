#!/usr/bin/env node
const NodeWebSocket = require("ws");
const {
  ServerMessage,
  ClientMessage,
  VoteRequest,
} = require("../pbjs/protobuf.js").murdermystery;

const SERVER = process.env.BOT_SERVER || "ws://localhost:8080";
const MIN_PLAYERS = 6;

const getName = (i) => `Bot${i + 1}`;

// Handlers for each message
const handlers = [
  // Sets ctx.isHost
  (msg, ctx) => {
    if (msg.host && msg.host.isHost) {
      ctx.isHost = true;
    }
  },
  // Will start game if we should
  (msg, ctx) => {
    if (
      msg.players &&
      ctx.isHost &&
      msg.players.players &&
      msg.players.players.length >= MIN_PLAYERS
    ) {
      ctx.send({ startGame: {} });
    }
  },
  // When a vote starts
  (msg, ctx) => {
    if (msg.voteRequest) {
      // Strategy: every client will randomly vote after a random amount of time.
      // If another vote is received, they will copy it instead of voting themself.

      const voteReq = msg.voteRequest;
      ctx.voteRequest = voteReq;
      const sendRandomVote = () => {
        // If the vote is still going on
        if (ctx.voteRequest === voteReq) {
          const choice =
            ctx.voteRequest.type === VoteRequest.Type.HEALERHEAL
              ? 2 // 2 = yes, heal
              : voteReq.choice_IDs[
                  Math.floor(Math.random() * voteReq.choice_IDs.length)
                ];
          console.log(
            ctx.name,
            "got",
            ctx.voteRequest,
            "heal",
            VoteRequest.Type.HEALERHEAL,
            "isHeal",
            ctx.voteRequest.type === VoteRequest.Type.HEALERHEAL,
            "choice",
            choice
          );
          ctx.send({ vote: { choice } });
        }
      };
      ctx.randVoteTimer = setTimeout(sendRandomVote, Math.random() * 1000);
    }
  },
  // When a vote is received
  (msg, ctx) => {
    if (msg.voteSync && msg.voteSync.votes) {
      const vote = msg.voteSync.votes.filter((v) => v.choice !== -1)[0];
      if (vote && vote.choice) {
        if (ctx.randVoteTimer) clearTimeout(ctx.randVoteTimer);
        ctx.send({ vote: { choice: vote.choice } });
      }
    }
  },
  // When a vote is over
  (msg, ctx) => {
    if (msg.voteOver && ctx.randVoteTimer) {
      clearTimeout(ctx.randVoteTimer);
    }
  },
];

const runBot = (gid, i) => {
  const name = getName(i);
  const ws = new NodeWebSocket(`${SERVER}/game/${gid}`);
  const ctx = { isHost: false, name };

  const send = (pbMsg) => {
    console.log(`[${name}] ↑`, pbMsg);
    ws.send(ClientMessage.encode(pbMsg).finish());
  };
  ctx.send = send;

  ws.on("message", (buffer) => {
    const msg = ServerMessage.decode(buffer);
    // msg.players gets collapsed so log it top level
    console.log(`[${name}] ↓`, msg.players ? msg.players : msg);

    handlers.forEach((callback) => callback(msg, ctx));
  });

  ws.on("open", () => send({ setName: { name } }));
};

if (require.main === module) {
  const argv = process.argv.slice(1);

  const gameId = argv[1];
  const count = Number(argv[2]);
  console.log(argv[2], count);

  if (!gameId || Number.isNaN(count) || count < 1) {
    process.stderr.write(
      `Usage: [BOT_SERVER=ws://xxx] ${argv[0]} <game id> <bot count>`
    );
  }

  for (let i = 0; i < count; i += 1) {
    runBot(gameId, i);
  }
}
