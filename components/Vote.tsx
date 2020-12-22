import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { STRINGS, useTranslator } from "lib/translate";
import { FC, useState } from "react";
import NameBadge from "./NameBadge";
import { RightFloatSkippableDelay } from "./SkippableDelay";

export interface Choice {
  name?: string | JSX.Element;
  id?: number;
}

function VotesDisplay({
  candidate,
  onVote,
}: {
  candidate: Choice;
  onVote: (cid: number) => void;
}) {
  const candidateName: string | JSX.Element = candidate.name || "";
  const id: number = typeof candidate.id === "number" ? candidate.id : -1;

  return (
    <Box mr="2" mb="3" flex="0 0 48%">
      <Button colorScheme="blue" width="100%" onClick={() => onVote(id)}>
        {candidateName}
      </Button>
    </Box>
  );
}

export interface VoteProps {
  msg: STRINGS;
  desc?: JSX.Element | null;
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
  const [didVote, setDidVote] = useState<boolean>(false);

  if (didVote) {
    return <Text>{t(STRINGS.WAITING_FOR_VOTE)}</Text>;
  }

  return (
    <>
      <Heading>{t(msg)}</Heading>
      {desc ? <Box mt="2">{desc}</Box> : null}
      <Flex mt="3" flexWrap="wrap">
        {candidates.map((candidate: Choice) =>
          candidate.name ? (
            <VotesDisplay
              key={candidate.id}
              candidate={candidate}
              onVote={(cid) => {
                onVote(cid);
                setDidVote(true);
              }}
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

export interface Candidate {
  id: number;
  name: string;
  voters: string[];
}

export interface VoteResultProps {
  votes: Candidate[];
  onDone: () => void;
}

export const VoteResult: FC<VoteResultProps> = ({
  votes,
  onDone,
}: VoteResultProps) => {
  const t = useTranslator();

  return (
    <>
      <Box>
        <Heading mb="2">{t(STRINGS.VOTE_RESULTS)}</Heading>
        {votes.map((c) => (
          <Box key={c.id} mb="2">
            <Heading size="lg" mb="1">
              {c.name}
            </Heading>
            <Text as="b">{c.voters.length + t(STRINGS.N_VOTES)}</Text>
            <Flex display="inline">
              {c.voters.map((v) => (
                <NameBadge key={v} text={v} />
              ))}
            </Flex>
          </Box>
        ))}
      </Box>
      <RightFloatSkippableDelay duration={10} onDone={onDone} />
    </>
  );
};
