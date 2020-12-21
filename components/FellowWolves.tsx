import { Box, Heading, Stack } from "@chakra-ui/react";
import { S, useTranslator } from "lib/translate";
import { FC } from "react";
import { RightFloatSkippableDelay } from "./SkippableDelay";

interface FellowWolvesProps {
  names: string[];
  onDone: () => void;
}

export const FellowWolves: FC<FellowWolvesProps> = ({
  names,
  onDone,
}: FellowWolvesProps) => {
  const t = useTranslator();

  return (
    <>
      <Heading textAlign="center">{t(S.FELLOW_WOLVES)}</Heading>
      {/* Polish: maybe a wolf icon here? */}
      <Stack>
        {names.map((name) => (
          <Box key={name} w="100%" textAlign="center" mt="2">
            {name}
          </Box>
        ))}
      </Stack>
      <RightFloatSkippableDelay duration={5} onDone={onDone} />
    </>
  );
};

export default FellowWolves;
