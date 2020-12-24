import { useClientOnly } from "components/ClientOnly";
import Layout from "components/Layout";
import NameSelector from "components/NameSelector";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import GameClient from "../components/GameClient";
import { STRINGS, useTranslator } from "../lib/translate";

function useGameContent() {
  const t = useTranslator();
  const { query } = useRouter();
  const [name, setName] = useState<string>("");

  const nameComponent = (
    <NameSelector onSubmit={(newName) => setName(newName)} />
  );

  if (!useClientOnly()) {
    // When pre-rednering, the id is never set so we don't want the error to be
    //  pre-rendered so pre-render the name component which will be shown the most often
    return nameComponent;
  }

  const { id } = query;
  const host = window?.location?.host || "localhost:3000";
  const server =
    query.srv ||
    (window?.location?.protocol === "https:" ? "wss://" : "ws://") +
      (host === "localhost:3000" ? "localhost:8080" : host);
  const queryName = (query.name || "").toString();

  if (!name) {
    if (queryName) {
      setName(queryName);
    }
    return nameComponent;
  }
  if (!id || Array.isArray(id)) {
    return <p>{t(STRINGS.INVALID_GAME_LINK)}</p>;
  }
  return (
    <GameClient
      id={(id || "").toString()}
      server={server.toString()}
      nameProp={name}
    />
  );
}

interface GameProps {}

export const Game: FC<GameProps> = () => {
  return (
    <Layout>
      <main>{useGameContent()}</main>
    </Layout>
  );
};

export default Game;
