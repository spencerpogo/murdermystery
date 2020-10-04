import GameClient from "../components/GameClient";
import Head from "next/head";
import Loader from "../components/Loader";
import NameSelector from "components/NameSelector";
import t from "../translate";
import { useRouter } from "next/router";
import { useState } from "react";

function useGameContent() {
  const { query } = useRouter();
  const { id } = query;
  const server = query.srv || "ws://localhost:8080";

  const [name, setName] = useState("");

  if (typeof window === "undefined") {
    return <Loader />;
  }
  if (!id || Array.isArray(id)) {
    return <p>{t("Invalid game link")}</p>;
  }
  if (!name) {
    return <NameSelector onSubmit={(name) => setName(name)} />;
  }
  return (
    <GameClient
      id={(id || "").toString()}
      server={server.toString()}
      name={name}
    />
  );
}

export default function Game() {
  return (
    <>
      <Head>
        <title>{t("Murder Mystery")}</title>
      </Head>
      <main>{useGameContent()}</main>
    </>
  );
}
