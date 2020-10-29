import { Box, Heading, Stack } from "@chakra-ui/core";

import { forcedTranslate as t } from "../translate";

export default function FellowWolves({ names }: { names: string[] }) {
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
