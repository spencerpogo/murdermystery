import { Box, Button, Flex, Heading, Text } from "@chakra-ui/core";

import { forcedTranslate as t } from "../translate";

interface Choice {
  name?: string;
  id?: number;
  votes?: string[];
}

function VoterBox({ name }: { name: string }) {
  return (
    <Box
      ml="2"
      mr="2"
      mb="1"
      pt="1"
      pr="1"
      pb="1"
      pl="1"
      wordBreak="break-word"
      border="1px solid white"
      borderRadius="2px"
    >
      {name}
    </Box>
  );
}

function VotesDisplay({
  candidate,
  onVote,
}: {
  candidate: Choice;
  onVote: (cid: number) => void;
}) {
  const name: string = candidate.name || "";
  const id: number = typeof candidate.id === "number" ? candidate.id : -1;
  const voters: string[] = candidate.votes || [];

  // TODO: Maybe make this a little prettier?
  return (
    <Box mr="2" width="50%">
      <Button variantColor="gray" width="100%" onClick={() => onVote(id)}>
        {name}
      </Button>
      <Box mt="2">
        {voters.map((name) => (
          <VoterBox key={name} name={name} />
        ))}
      </Box>
    </Box>
  );
}

// Splits an array into chunks of at most chunkSize
function splitIntoChunks(arr: any[], chunkSize: number): any[] {
  return arr
    .map((_, i) => (i % chunkSize == 0 ? arr.slice(i, i + chunkSize) : null))
    .filter((i) => i != null);
}

export default function Vote({
  msg,
  desc,
  candidates,
  votes,
  noVote,
  onVote,
}: {
  msg: string;
  desc?: string;
  candidates: [number, string][];
  votes: { [name: string]: string[] };
  noVote: string[];
  onVote: (candidateID: number) => void;
}) {
  let voteGroups: [Choice?, Choice?][] = splitIntoChunks(
    candidates.map(([id, name]) => ({ name, id, votes: votes[name || ""] })),
    2
  );

  return (
    <>
      <Heading>{t(msg)}</Heading>
      {desc && <Text mt="2">{t(desc)}</Text>}
      {voteGroups.map((candidates) => {
        console.log(candidates);
        return (
          <Flex mt="3" minHeight="200px" key={JSON.stringify(candidates)}>
            {candidates.map((candidate: Choice) =>
              candidate.name ? (
                <VotesDisplay
                  key={JSON.stringify(candidate)}
                  candidate={candidate}
                  onVote={onVote}
                />
              ) : null
            )}
          </Flex>
        );
      })}

      {noVote.length ? (
        <>
          <Heading size="md" mb="2">
            {t("Has not voted")}
          </Heading>
          {noVote.map((name) => (
            <VoterBox key={name} name={name} />
          ))}
        </>
      ) : null}
    </>
  );
}
