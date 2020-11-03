import { Heading } from "@chakra-ui/core";
import { forcedTranslate as t } from "../translate";

export default function ProphetReveal({
  name,
  good,
}: {
  name: string;
  good: boolean;
}) {
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
}
