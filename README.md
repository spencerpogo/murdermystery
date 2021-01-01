# Murder Mystery

Murdermystery is an online multiplayer game of deception.

## Architecture

The client is built with next.js, typescript, and react.
It uses Chakra UI for styling.
It is meant to be fully internationalized, supporting both english and chinese.

The server is written with Go.
It uses Gin for HTTP and Melody for websockets.

Communication between client and server uses protocol buffer wire format binary
messages sent over a WebSocket connection. Although this is overkill for such a small
project, it allows me to learn about protocol buffers hands on.

## Building

### Client

In production, the client bundle is exported into HTML and then server by the backend
binary. This means that advanced Next.JS routing features such may not be available so
that the app can be server by a different HTTP server.

To run the frontend server in development mode:

```bash
npm run dev
```

To generate a production build of both the server and client, refer to the backend
section of the building guide.

### Protocol Buffers

The protocol buffers definitions are found in `main.proto`. They generate JS and Go
code for use by the application. I have committed the generated code to the repo anyway
so that it can be built without installing protoc, but if the proto file is changed the
generated code but also be updated so they stay in sync.

To re-generate the protocol buffers code run `./tools/protoc.sh`.
It works without any options, but you can also pass the repository root as the first
argument and a language to skip as the second argument. The skip MUST be second.

```
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

The build scripts do not support Windows, but with modifications can definitely work on
it. I may add Windows support later but it is not high priority as I develop and deploy
exclusively on linux.

### Server

To generate a development build of the server, ensure the build directory exists, and
run:

```
cd backend
go build -o ../build/backend
```

The directory the build command is run in matters. I have not yet figured out how to
build it while being in the repository root.

To generate a production build of the server, including bundling the frontend run the
build script:

```bash
./tools/build.sh
```

The arguments for this script work similarly to the protobuf build script:

```
./tools/build.sh # OR
./tools/build.sh </path/to/repo> [--no-clean]
```

If `--no-clean` is passed, the `build/html` directory will not be removed.

This generates an executable `./build/backend`. To start the server run this file.

The server will listen on `http://localhost:8080` by default.
It optionally takes an interface to listen on in the `-addr` paramater which is in
the form of `iface:port`.

To run the binary in production mode, set the environment variable `GIN_MODE=release`.

It is planned to have a `GOENV=prod` variable that will disable many debug features,
such as the disabled origin check and extra logging, but it is not yet implemented so
the only way to disable these features is to edit the code.

```bash
./build/backend -addr localhost:1234
```

For development, I use `CompileDaemon` to automatically build the binary whenver any
souce files change. It probably isn't the best option but covers my needs fine.

You can install it like this:

```bash
go get github.com/githubnemo/CompileDaemon
```

This is the command I use to run it:

```bash
PROJ="/path/to/repo"
CompileDaemon -directory=$PROJ/backend -build='go build -o $PROJ/build/backend' -command '$PROJ/build/backend' -color -log-prefix=false
```

## Roadmap

- Core functionality

  - [x] Basic architecture
  - [x] Setting Names
  - [x] Handling Host
  - [x] Starting game
  - [x] Assigning characters
  - [x] Implementing Votes
  - [x] Prophet ability
  - [x] Healer ability
  - [ ] Kills
  - [ ] Voting to kill
  - [ ] Showing amount of each character left
  - [ ] Spectating

- Polish

  - [ ] Pie indicator for timed components and button to skip
  - [ ] Minigame for lobby / night screen
  - [ ] Prophet screen animation
  - [ ] Character visualization styling
  - [ ] And more...

- Preparing for production

  - [ ] Remove unecessary logs
  - [ ] Use environment effictively
  - [ ] Server performance improvements
  - [ ] Frontend performance improvements (such as `useMemo`)
  - [ ] And more...

## Other Details

### Statik file and git

The `backend/statik/statik.go` file is a go source file that contains zipped static assets such as HTML/CSS/JS that are served by the binary when it runs.
The binary depends upon being able to import this file and will not build without it.
The only way to generate it is to run statik with the proper arguments.
To make it easy on anyone trying to build the backend, I have checked an placeholder version of this file into git.
It has a simple HTML page explaining why its there and the command to bundle the real UI.
This allows developers to build the binary without having to figure out what statik is because go complains about missing the file.
I also don't want a normal build of the binary, which modifies this file to be checked into git, because this would cause the repository to have a quickly outdated UI bundle included by default which could be confusing.

TL;DR The statik go file is autogenerated, use this command to prevent changes to it from being picked up by git:

```
git update-index --assume-unchanged backend/statik/statik.go
```

I will not accept pull requests which don't run this command and consequently modify
this file in git.

To go back to the template version, run

```
git checkout origin/master backend/statik/statik.go
```

### CI

The CI system is run by GitHub Actions. I have not written any tests for either the
frontend or backend yet, so the CI just checks if the frontend and backend builds are
successful. This just makes sure no bad code is pushed to the repo.

The backend CI job only runs whenever the `tools/` or `backend/` paths are changed to
save CI minutes (not that I'm in danger of running out).

Whenver a GitHub release is created, a release CI job will automatically generate a
production linux amd64 build and attach it to the release.

Badges:

![Node.js CI](https://github.com/Scoder12/murdermystery/workflows/Node.js%20CI/badge.svg)

![Build Backend](https://github.com/Scoder12/murdermystery/workflows/Build%20Backend/badge.svg)

![Release](https://github.com/Scoder12/murdermystery/workflows/Release/badge.svg)

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
