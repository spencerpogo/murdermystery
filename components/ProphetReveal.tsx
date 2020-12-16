import { Flex, Heading, useTimeout } from "@chakra-ui/react";
import { FC } from "react";
import { STRINGS, useTranslator } from "../lib/translate";
import NameBadge from "./NameBadge";

export interface ProphetRevealProps {
  name: string;
  good: boolean;
  onDone: () => void;
}

export const ProphetReveal: FC<ProphetRevealProps> = ({
  name,
  good,
  onDone,
}: ProphetRevealProps) => {
  const t = useTranslator();

  useTimeout(onDone, 5000);

  return (
    <>
      <Heading size="lg" textAlign="center" mb="5">
        {t(STRINGS.REVEAL_FOUND)}
      </Heading>
      <Flex justify="center">
        <NameBadge text={name} />
      </Flex>
      <Heading size="lg" textAlign="center" mt="5" fontWeight="inherit">
        {t(good ? STRINGS.IS_GOOD : STRINGS.IS_BAD)}
      </Heading>
    </>
  );
};

export default ProphetReveal;
