# Murder Mystery

Murdermystery is an online multiplayer game of deception.

## Architecture

The client is built with next.js, typescript, and react.
It uses Chakra UI for styling.
It is meant to be fully internationalized, supporting both english and chinese.

The server is written with Go.
It uses Gin for HTTP and Melody for websockets.

Communication between client and server uses protocol buffer wire format binary messages sent over a WebSocket connection.

## Building

### Client

It is planned to soon package the client bundle to be served by the server binary,
using `next export` to generate HTML and `statik` to package the HTML, although this is
not yet implemented.

To run the frontend server in development mode:

```bash
npm run dev
```

To build and run a production build:

```bash
npm run build
npm start
```

### Protocol Buffers

The protocol buffers definitions are found in `main.proto`. They generate JS and Go
code for use by the application. I have committed the generated code to the repo anyway
so that it can be built without installing protoc, but if the proto file is changed the
generated code but also be updated so they stay in sync.

To re-generate the protocol buffers code run `./tools/protoc.sh`.
It works without any options, but you can also pass the repository root as the first
argument and a language to skip as the second argument.

```bash
./tools/protoc.sh # OR
./tools/protoc.sh </path/to/repo> [--no-js|--no-golang]
```

This will generate the following files:

```
./backend/protocol/pb/main.pb.go
./pbjs/protobuf.js
./pbjs/protobuf.d.ts
```

The script automatically checks if you have the required toolchain installed and tells
you how to install if you don't.

The script it not tested on windows but everything other than the automatic tool chekcs
should work with path modifications.

### Server

To build the server, run the following commands:

```bash
mkdir -p build
cd backend
go build -o ../build/backend
```

This generates an executable `./build/backend`. To start the server run this file.

The server will listen on `localhost:8080` by default.
It optionally takes an interface to listen on in the `-addr` paramater:

It is planned to have a `debug` build tag that will enable gin debugging and disable
the websocket origin check (because the frontend and backend servers run on different
origins).

```bash
./build/backend -addr localhost:1234
```

For development, I use `CompileDaemon` which I'm not sure is the best option but works
fine for me. This is the command I use:

```bash
PROJ="/path/to/repo"
CompileDaemon -directory=$PROJ/backend -build='go build -o $PROJ/build/backend' -command '$PROJ/build/backend' -color -log-prefix=false
```

## Development

### Bot

The bot is a script used for testing the server. The server has a player minimum, and
the bot script allows the minimum to be filled automatically.

In addition, it can be used to stress test the server under high load and consistently
reproduce server-side bugs.

To use the bot, you must have already built the protocol buffer code as described
above and installed the `ws` dev dependency with `npm`.

To run the bot, pass a game ID and number of bots, for example:

```bash
node ./tools/bot.js asdf 6
```

If you're using linux, the file is already executable and has a proper shebang, so you
can omit `node`.

## License

Copyright 2020 Scoder12.
