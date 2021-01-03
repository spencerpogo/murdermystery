import { Box, Flex, Heading } from "@chakra-ui/react";
import { STRINGS, useTranslator } from "lib/translate";
import { Children, FC } from "react";
import NameBadge from "./NameBadge";
import SkippableDelay from "./SkippableDelay";

export interface PlayerStatusProps {
  aliveNames: string[];
  deadNames: string[];
  onDone: () => void;
}

export const PlayerStatus: FC<PlayerStatusProps> = ({
  aliveNames,
  deadNames,
  onDone,
}: PlayerStatusProps) => {
  const t = useTranslator();

  return (
    <Box>
      <Box>
        <Heading mb="2">{t(STRINGS.ALIVE)}</Heading>
        <Flex mb="2">
          {Children.map(aliveNames, (n) => (
            <NameBadge text={n} />
          ))}
        </Flex>
      </Box>
      <Box>
        <Heading mb="2">{t(STRINGS.DEAD)}</Heading>
        <Flex>
          {Children.map(deadNames, (n) => (
            <NameBadge text={n} />
          ))}
        </Flex>
      </Box>
      <SkippableDelay duration={10} onDone={onDone} />
    </Box>
  );
};

export default PlayerStatus;
