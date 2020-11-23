import { Heading } from "@chakra-ui/core";
import { FC, useEffect } from "react";
import { forcedTranslate as t } from "../lib/translate";

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
  useEffect(() => {
    const timeoutId = setTimeout(() => onDone(), 5000);
    return () => clearTimeout(timeoutId);
  });

  return (
    <>
      <Heading size="lg" textAlign="center" mb="5">
        {t("Using your prophet ability, you find")}
      </Heading>
      <Heading size="md" textAlign="center" fontWeight="inherit">
        {name}
      </Heading>
      <Heading size="lg" textAlign="center" mt="5" fontWeight="inherit">
        {t(good ? "is a good person" : "is a bad person")}
      </Heading>
    </>
  );
};

export default ProphetReveal;
