import { useClientOnly } from "components/ClientOnly";
import Layout from "components/Layout";
import NameSelector from "components/NameSelector";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import GameClient from "../components/GameClient";
import t from "../lib/translate";

function useGameContent() {
  const { query } = useRouter();
  const { id } = query;
  const server = query.srv || "ws://localhost:8080";
  const queryName = (query.name || "").toString();

  const [name, setName] = useState<string>("");

  const nameComponent = (
    <NameSelector onSubmit={(newName) => setName(newName)} />
  );

  if (!useClientOnly()) {
    // When pre-rednering, the id is never set so we don't want the error to be
    //  pre-rendered so pre-render the name component which will be shown the most often
    return nameComponent;
  }
  if (!name) {
    if (queryName) {
      setName(queryName);
    }
    return nameComponent;
  }
  if (!id || Array.isArray(id)) {
    return <p>{t("Invalid game link")}</p>;
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
