import { Badge, Button, Flex, Heading, Text } from "@chakra-ui/core";

import { forcedTranslate as t } from "../translate";

export default function Lobby({
  names,
  isHost,
  start,
}: {
  names: { name: string; isHost: boolean }[];
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
      <ul>
        {names.map((player) => {
          if (!player || !player.name) return null;
          return (
            <li key={player.name + player.isHost.toString()}>
              {player.name}
              {player.isHost && hostBadge}
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
