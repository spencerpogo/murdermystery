import { Button, Flex, Heading, Text } from "@chakra-ui/core";

import t from "../translate";

export default function Lobby({
  names,
  isHost,
}: {
  names: string[];
  isHost: boolean;
}) {
  return (
    <>
      <Heading as="h3" size="lg" mb={2}>
        {t("Waiting for players", true)}
      </Heading>
      <Flex mb={3} align="center" justify="space-between">
        <Text as="i">{t("Share your link to invite others", true)}</Text>
        <Button>{t("Copy", true)}</Button>
      </Flex>
      <ul>
        {names.map((name) => {
          return <li key={name}>{name}</li>;
        })}
      </ul>
      <Button variantColor="blue" float="right" mt={10} isDisabled={!isHost}>
        {isHost
          ? t("Start Game", true)
          : t("Wait for the host to start the game", true)}
      </Button>
    </>
  );
}
