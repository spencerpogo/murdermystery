import {
  Alert,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Heading,
  Input,
  Skeleton,
  Stack,
  Text,
} from "@chakra-ui/core";
import { ChangeEvent, FormEvent, useState } from "react";

import Websocket from "react-websocket";
import t from "../translate";
import { useRouter } from "next/router";

function getGameComponents(name: string) {
  const { query } = useRouter();
  const { id } = query;
  const server = query.srv || "ws://localhost:8080";

  //let [shouldConnect, setShouldConnect] = useState(true);
  const shouldConnect = true;
  const [connected, setConnected] = useState(false);
  const [didDisconnect, setDidDisconnect] = useState(false);

  let content;
  if (typeof window !== "undefined" && !id) {
    // For some reason, this flash-renders whenever the page loads
    // so its a small <p> to be less noticeable
    content = <p>{t("Invalid game link")}</p>;
  } else if (
    typeof window === "undefined" || // pre-rendering
    didDisconnect
  ) {
    content = (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>{t("Disconnected from server")}</AlertTitle>
      </Alert>
    );
  } else if (!connected) {
    content = (
      <Box>
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
        <Skeleton height="20px" my="10px" />
      </Box>
    );
  } else {
    content = <p>Connected successfully</p>;
  }

  let wsComponent;
  if (typeof window !== "undefined" && shouldConnect && id) {
    wsComponent = (
      <Websocket
        url={server + `/game/${encodeURIComponent((id || "").toString())}`}
        onOpen={() => setConnected(true)}
        onClose={() => [setConnected(false), setDidDisconnect(true)]}
        reconnect={false}
        onMessage={(msg: string) => console.log(msg)}
      />
    );
  }

  return [content, wsComponent];
}

export default function Game() {
  const [name, setName] = useState("");
  const [nameSet, setNameSet] = useState(false);

  let content, wsComponent;
  if (nameSet) {
    [content, wsComponent] = getGameComponents(name);
  } else {
    content = (
      <Box>
        <Stack>
          <Input
            placeholder={t("Enter name")}
            onChange={(evt: ChangeEvent<HTMLInputElement>) =>
              setName(evt.target.value)
            }
          />
          <Button onClick={() => setNameSet(true)}>{t("Join Game")}</Button>
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <main>{content}</main>
      {wsComponent}
    </>
  );
}
