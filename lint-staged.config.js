module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "npx eslint --cache --fix",
    () => "npx tsc --noemit",
  ],
  "*.{md,yml,json}": "prettier --write",
  "{backend/**/*.go,main.proto}": () => "npm run go-vet",
};
