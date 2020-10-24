#!/usr/bin/env bash

set -e

# Usage: ./tools/build.sh [binary output]

# Assumes that we are in the repo root and `npm ci` has already been run. 
if [ ! -f package.json ]; then
  >&2 echo "No package.json, are we in the repo root?"
  exit 1
fi

if [[ ! $(command -v statik)  ]]; then
  >&2 echo "Must install statik to build."
  >&2 echo "$ go get github.com/rakyll/statik"
  exit 1
fi

if [ ! -d ./pbjs ]; then
  >&2 echo "Must run ./tools/protoc.sh first!"
  exit 1
fi

# Setup build directory
mkdir -p build

# Generate a next build
npm run build

# Export HTML
rm -rf build/html
mkdir -p build/html
npm run export -- -o build/html

# Rewrite /game.html to be /game
mv build/html/game.html build/html/game

# Run statik
echo
echo "======> Running statik..."
statik -src build/html -dest backend -f

# Build
echo
echo "======> Building binary..."
cd backend
go build -v -o ${1:-"../build/backend"}
cd ..

echo "Build successful!"

if [ "$2" == "--no-clean" ]; then
  echo "To clean remove the ./build/html directory"
else
  rm -rf ./build/html
fi
