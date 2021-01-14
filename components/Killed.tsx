import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { STRINGS, useTranslator } from "lib/translate";
import { murdermystery as protobuf } from "pbjs/protobuf";
import { FC } from "react";
import { RightFloatSkippableDelay } from "./SkippableDelay";

export interface KilledProps {
  reason: protobuf.KillReason | null | undefined;
  onDone: () => void;
}

export function getPlayerKillText(
  reason: protobuf.KillReason | null | undefined
): STRINGS | null {
  switch (reason) {
    case protobuf.KillReason.VOTED:
      return STRINGS.PDEATH_VOTED;
    case protobuf.KillReason.WOLVES:
      return STRINGS.PDEATH_WOLVES;
    case protobuf.KillReason.HEALERPOISON:
      return STRINGS.PDEATH_HEALER;
    default:
      return null;
  }
}

export const Killed: FC<KilledProps> = ({ reason, onDone }: KilledProps) => {
  const t = useTranslator();
  const kText = getPlayerKillText(reason);

  return (
    <Box>
      <Heading textAlign="center">{t(STRINGS.YOU_WERE_KILLED)}</Heading>
      <Flex justify="center" mt="2">
        {kText ? <Text as="i">{t(kText)}</Text> : null}
      </Flex>
      <RightFloatSkippableDelay duration={5} onDone={onDone} />
    </Box>
  );
};

export default Killed;
