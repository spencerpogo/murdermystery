import { Box, Heading, Stack } from "@chakra-ui/react";
import t from "lib/translate";
import { FC, useEffect } from "react";

interface FellowWolvesProps {
  names: string[];
  onDone: () => void;
}

export const FellowWolves: FC<FellowWolvesProps> = ({
  names,
  onDone,
}: FellowWolvesProps) => {
  useEffect(() => {
    // Call onDone after 5s
    const timeoutId = setTimeout(() => onDone(), 5000);
    return () => clearTimeout(timeoutId);
  });

  return (
    <>
      <Heading textAlign="center">{t("Your fellow wolves")}</Heading>
      {/* Polish: maybe a wolf icon here? */}
      <Stack>
        {names.map((name) => (
          <Box key={name} w="100%" textAlign="center" mt="2">
            {name}
          </Box>
        ))}
      </Stack>
    </>
  );
};

export default FellowWolves;
