import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { STRINGS, useTranslator } from "lib/translate";
import { FC } from "react";

export interface Choice {
  name?: string;
  id?: number;
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

  // TODO: Maybe make this a little prettier?
  return (
    <Box mr="2" mb="3" flex="0 0 48%">
      <Button colorScheme="gray" width="100%" onClick={() => onVote(id)}>
        {candidateName}
      </Button>
    </Box>
  );
}

export interface VoteProps {
  msg: STRINGS;
  desc?: STRINGS;
  candidates: Choice[];
  onVote: (candidateID: number) => void;
}

export const Vote: FC<VoteProps> = ({
  msg,
  desc,
  candidates,
  onVote,
}: VoteProps) => {
  const t = useTranslator();

  return (
    <>
      <Heading>{t(msg)}</Heading>
      {desc ? <Text mt="2">{t(desc)}</Text> : null}
      <Flex mt="3" flexWrap="wrap">
        {candidates.map((candidate: Choice) =>
          candidate.name ? (
            <VotesDisplay
              key={candidate.id}
              candidate={candidate}
              onVote={onVote}
            />
          ) : null
        )}
      </Flex>
    </>
  );
};

Vote.defaultProps = {
  desc: undefined,
};

export default Vote;
