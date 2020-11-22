import { FC } from "react";

import { Badge, Button, Flex, Heading, Text } from "@chakra-ui/core";

import { forcedTranslate as t } from "../lib/translate";
import { murdermystery as protobuf } from "../pbjs/protobuf.js";

interface LobbyProps {
  players: {
    [id: string]: protobuf.Players.IPlayer;
  };
  hostId: number;
  isHost: boolean;
  start: () => void;
}

export const Lobby: FC<LobbyProps> = ({
  players,
  isHost,
  hostId,
  start,
}: LobbyProps) => {
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
          const p = players[id];
          if (!p || !p.name) return null;
          const pIsHost = p.id === hostId;
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
};

export default Lobby;
