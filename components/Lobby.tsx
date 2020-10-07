import { Badge, Button, Flex, Heading, Text } from "@chakra-ui/core";

import { forcedTranslate as t } from "../translate";

export default function Lobby({
  names,
  isHost,
}: {
  names: { name: string; isHost: boolean }[];
  isHost: boolean;
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
          return (
            <li key={player.name + player.isHost.toString()}>
              {player.name}
              {player.isHost && hostBadge}
            </li>
          );
        })}
      </ul>
      <Button variantColor="blue" float="right" mt={10} isDisabled={!isHost}>
        {isHost ? t("Start Game") : t("Wait for the host to start the game")}
      </Button>
    </>
  );
}
