import { Badge, Button, Flex, Heading, Text } from "@chakra-ui/core";

import { murdermystery as protobuf } from "../pbjs/protobuf.js";
import { forcedTranslate as t } from "../translate";

export default function Lobby({
  players,
  isHost,
  hostId,
  start,
}: {
  players: {
    [id: string]: protobuf.Players.IPlayer;
  };
  hostId: number;
  isHost: boolean;
  start: () => void;
}) {
  const hostBadge = (
    <Badge variant="outline" ml={1}>
      {t("Host")}
    </Badge>
  );

  return (
    <>
      <Heading as="h3" size="lg" mb={2}>
        {t("Waiting for players")}
      </Heading>
      <Flex mb={3} align="center" justify="space-between">
        <Text as="i">{t("Share your link to invite others")}</Text>
        <Button>{t("Copy")}</Button>
      </Flex>
      {/* Polish: style this a bit more, don't use <ul> */}
      <ul>
        {Object.keys(players).map((id) => {
          let p = players[id];
          if (!p || !p.name) return null;
          let pIsHost = p.id == hostId;
          return (
            <li key={p.name + pIsHost.toString()}>
              <span>{p.name}</span>
              {pIsHost && hostBadge}
            </li>
          );
        })}
      </ul>
      <Button
        variantColor="blue"
        float="right"
        mt={10}
        isDisabled={!isHost}
        onClick={() => start()}
      >
        {isHost ? t("Start Game") : t("Wait for the host to start the game")}
      </Button>
    </>
  );
}
