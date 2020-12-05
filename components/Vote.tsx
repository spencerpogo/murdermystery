import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { STRINGS, useTranslator } from "lib/translate";
import { FC } from "react";

export interface Choice {
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
  const candidateName: string = candidate.name || "";
  const id: number = typeof candidate.id === "number" ? candidate.id : -1;
  const voters: string[] = candidate.votes || [];

  // TODO: Maybe make this a little prettier?
  return (
    <Box mr="2" width="50%">
      <Button colorScheme="gray" width="100%" onClick={() => onVote(id)}>
        {candidateName}
      </Button>
      <Box mt="2">
        {voters.map((voter) => (
          <VoterBox key={voter} name={voter} />
        ))}
      </Box>
    </Box>
  );
}

// Splits an array into chunks of at most chunkSize
function splitIntoChunks<T>(arr: T[], chunkSize: number): [T, T][] {
  const res = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (i % chunkSize === 0) {
      res.push(arr.slice(i, i + chunkSize) as [T, T]);
    }
  }
  return res;
}

export interface VoteProps {
  msg: STRINGS;
  desc?: STRINGS;
  candidates: Choice[];
  noVote: string[];
  onVote: (candidateID: number) => void;
}

export const Vote: FC<VoteProps> = ({
  msg,
  desc,
  candidates,
  noVote,
  onVote,
}: VoteProps) => {
  const t = useTranslator();
  const voteGroups: [Choice?, Choice?][] = splitIntoChunks(candidates, 2);

  return (
    <>
      <Heading>{t(msg)}</Heading>
      {desc ? <Text mt="2">{t(desc)}</Text> : null}
      {voteGroups.map((candGroup) => {
        return (
          <Flex
            mt="3"
            minHeight="200px"
            key={candGroup.map((c) => (c || {}).id).join(",")}
          >
            {candGroup.map((candidate: Choice) =>
              candidate.name ? (
                <VotesDisplay
                  key={candidate.id}
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
            {t(STRINGS.HAS_NOT_VOTED)}
          </Heading>
          {noVote.map((name) => (
            <VoterBox key={name} name={name} />
          ))}
        </>
      ) : null}
    </>
  );
};

Vote.defaultProps = {
  desc: undefined,
};

export default Vote;
