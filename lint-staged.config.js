module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    () => "npm run eslint --cache --fix",
    () => "npx tsc --noemit",
  ],
  "*.{md,yml,json}": "prettier --write",
  "{backend/**/*.go,main.proto}": () => "npm run go-vet",
};
