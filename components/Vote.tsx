import { Button, Heading, Stack, Text } from "@chakra-ui/core";

import { forcedTranslate as t } from "../translate";

function VoteButton({
  text,
  id,
  onVote,
}: {
  text: string;
  id: number;
  onVote: (id: number) => void;
}) {
  return (
    <Button mt="2" variantColor="gray" onClick={() => onVote(id)}>
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
  candidates,
  votes,
  onVote,
}: {
  msg: string;
  desc?: string;
  candidates: [number, string][];
  votes: { [name: string]: string[] };
  onVote: (candidateID: number) => void;
}) {
  return (
    <>
      <Heading>{t(msg)}</Heading>
      {desc && <Text mt="2">{t(desc)}</Text>}
      <Stack mt="2">
        {candidates.map(([cid, name]) => (
          <VoteButton key={cid} text={name} id={cid} onVote={onVote} />
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
