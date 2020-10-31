import { Button, Heading, Stack, Text } from "@chakra-ui/core";

import { forcedTranslate as t } from "../translate";

function VoteButton({ text }: { text: string }) {
  return (
    <Button mt="2" variantColor="gray">
      {text}
    </Button>
  );
}

function VotesDisplay({ name, voters }: { name: string; voters: string[] }) {
  // TODO: Maybe make this a little prettier?
  return (
    <>
      <Heading size="md">{name}</Heading>
      {voters.map((voter) => (
        <Text key={voter}>{voter}</Text>
      ))}
    </>
  );
}

export default function Vote({
  msg,
  desc,
  names,
  votes,
}: {
  msg: string;
  desc?: string;
  names: string[];
  votes: { [name: string]: string[] };
}) {
  return (
    <>
      <Heading>{t(msg)}</Heading>
      {desc && <Text mt="2">{t(desc)}</Text>}
      <Stack mt="2">
        {names.map((n) => (
          <VoteButton key={n} text={n} />
        ))}
      </Stack>
      <Heading as="h4" size="lg" mt="3" mb="2">
        {t("Votes")}
      </Heading>
      {Object.keys(votes)
        .filter((name) => votes[name].length)
        .map((name) => (
          <VotesDisplay
            // I don't know what else to use
            key={name + "\x00" + votes[name].join("\x00")}
            name={name}
            voters={votes[name]}
          />
        ))}
    </>
  );
}
