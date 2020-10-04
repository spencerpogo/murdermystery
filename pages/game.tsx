import { Alert, AlertIcon, AlertTitle, Box, Skeleton } from "@chakra-ui/core";

import GameClient from "lib/GameClient";
import NameSelector from "components/NameSelector";
import WebsocketComponent from "../components/Websocket";
import t from "../translate";
import { useRouter } from "next/router";
import { useState } from "react";

function Loader() {
  return (
    <Box>
      <Skeleton height="20px" my="10px" />
      <Skeleton height="20px" my="10px" />
      <Skeleton height="20px" my="10px" />
    </Box>
  );
}

function setupWs(ws: WebSocket, name: string) {
  const client = new GameClient(ws);
  client.handshake(name); // TODO: make this a promise
}

function ConnectionIndicator({ name }: { name: string }) {
  if (typeof window === "undefined") {
    // we're pre-rendering
    return <Loader />;
  }

  const { query } = useRouter();
  const { id } = query;
  const server = query.srv || "ws://localhost:8080";

  //let [shouldConnect, setShouldConnect] = useState(true);
  // Set to true when websocket connection is opened and handshaked
  const [loading, setLoading] = useState(true);
  const [didDisconnect, setDidDisconnect] = useState(false);

  const wsComponent = (
    <WebsocketComponent
      url={server + `/game/${encodeURIComponent((id || "").toString())}`}
      onOpen={(ws) => {
        setupWs(ws, name);
        setLoading(false);
      }}
      onClose={(_) => setDidDisconnect(true)}
      onMessage={(msg: string) => console.log(msg)}
    />
  );

  if (!id) {
    return <p>{t("Invalid game link")}</p>;
  } else if (didDisconnect) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>{t("Disconnected from server")}</AlertTitle>
      </Alert>
    );
  } else if (loading) {
    return (
      <>
        <Loader />
        {wsComponent}
      </>
    );
  }
  return (
    <>
      <p>Connected successfully</p>
      {wsComponent}
    </>
  );
}

export default function Game() {
  const [name, setName] = useState("");
  const [nameSet, setNameSet] = useState(false);

  if (nameSet) {
    return (
      <main>
        <ConnectionIndicator name={name} />
      </main>
    );
  } else {
    // Name selector
    return (
      <main>
        <NameSelector
          onSubmit={(name) => {
            setName(name);
            setNameSet(true);
          }}
        />
      </main>
    );
  }
}
