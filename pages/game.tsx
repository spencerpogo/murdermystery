import CharacterSpinner from "components/CharacterSpinner";
import GameClient from "../components/GameClient";
import Layout from "components/Layout";
import NameSelector from "components/NameSelector";
import t from "../translate";
import { useRouter } from "next/router";
import { useState } from "react";

function useGameContent() {
  /*const { query } = useRouter();
  const { id } = query;
  const server = query.srv || "ws://localhost:8080";

  const [name, setName] = useState("");

  const nameComponent = <NameSelector onSubmit={(name) => setName(name)} />;

  if (typeof window === "undefined") {
    // When pre-rednering, the id is never set so we don't want the error to be
    //  pre-rendered so pre-render the name component which will be shown the most often
    return nameComponent;
  }
  if (!name) {
    return nameComponent;
  }
  if (!id || Array.isArray(id)) {
    return <p>{t("Invalid game link")}</p>;
  }*/
  return (
    /*<GameClient
      id={(id || "").toString()}
      server={server.toString()}
      nameProp={name}
    />*/
    <CharacterSpinner character={"Werewolf"} />
  );
}

export default function Game() {
  return (
    <Layout>
      <main>{useGameContent()}</main>
    </Layout>
  );
}
