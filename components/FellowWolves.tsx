import { Box, Heading, Stack } from "@chakra-ui/core";

import { forcedTranslate as t } from "../translate";
import { useEffect } from "react";

export default function FellowWolves({
  names,
  onDone,
}: {
  names: string[];
  onDone: () => void;
}) {
  useEffect(() => {
    // Call onDone after 5s
    let timeoutId = setTimeout(() => onDone(), 5000);
    return () => clearTimeout(timeoutId);
  });

  return (
    <>
      <Heading textAlign="center">{t("Your fellow wolves")}</Heading>
      {/* Polish: maybe a wolf icon here? */}
      <Stack>
        {names.map((n) => (
          <Box key={n} w="100%" textAlign="center" mt="2">
            {n}
          </Box>
        ))}
      </Stack>
    </>
  );
}
