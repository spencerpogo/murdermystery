#!/usr/bin/env bash

set -e

# Generates protocol buffers code - YMMV
# Should work on windows with some modifications
# TODO: Require pbjs

ROOT=${1:-$(pwd)}

GO_PB_PKG=$ROOT/backend/protocol/pb
JS_PB_PKG=$ROOT/pbjs

if [[ "$2" != "--no-golang" ]]; then
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

  echo "Generating go code..."
  mkdir -p $GO_PB_PKG
  protoc -I=$ROOT --go_out=$GO_PB_PKG $ROOT/*.proto

  # This is absolutely terrible, but protobuf has forced my hand. 
  echo "type IsServerMessage_Data = isServerMessage_Data" >> $GO_PB_PKG/main.pb.go
fi

if [[ "$2" != "--no-js" ]]; then
  echo "Generating JS code..."
  mkdir -p $JS_PB_PKG
  npm run pbjs -- -t static-module -w commonjs -o $JS_PB_PKG/protobuf.js $ROOT/*.proto

  echo "Generating Typescript definitions..."
  npm run pbts -- -o $JS_PB_PKG/protobuf.d.ts $JS_PB_PKG/protobuf.js
fi
