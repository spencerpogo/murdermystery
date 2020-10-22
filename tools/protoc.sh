#!/usr/bin/env bash

set -e

# Generates protocol buffers code - YMMV
# Should work on windows with some modifications
if [ ! $(command -v protoc) ]; then
  >&2 echo "You must install protoc into your path before running this script."
  >&2 echo "You can install it here: https://developers.google.com/protocol-buffers/docs/downloads"
  exit 1
fi

if [ ! $(command -v protoc-gen-go) ]; then
  >&2 echo "You must install protoc-gen-go into your path before running this script."
  >&2 echo "You can install by running: go get google.golang.org/protobuf/cmd/protoc-gen-go"
  exit 1
fi

# TODO: Require pbjs
ROOT=${1:-$(pwd)}

GO_PB_PKG=$ROOT/backend/protocol/pb

echo "Generating go code..."
protoc -I=$ROOT --go_out=$GO_PB_PKG $ROOT/*.proto

# This is absolutely terrible, but protobuf has forced my hand. 
echo "type IsServerMessage_Data = isServerMessage_Data" >> $GO_PB_PKG/main.pb.go

echo "Generating JS code..."
npm run pbjs -- -t static-module -w commonjs -o $ROOT/pbjs/protobuf.js $ROOT/*.proto

echo "Generating Typescript definitions..."
npm run pbts -- -o $ROOT/pbjs/protobuf.d.ts $ROOT/pbjs/protobuf.js
