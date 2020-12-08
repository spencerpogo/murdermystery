import { Text } from "@chakra-ui/react";
import { FC } from "react";

interface NameBadgeProps {
  text: string;
}

export const NameBadge: FC<NameBadgeProps> = ({ text }: NameBadgeProps) => {
  return (
    <Text
      as="div"
      display="inline-block"
      border="1px solid gray"
      borderRadius="2px"
      padding="1"
      ml="1"
      mb="1"
    >
      {text}
    </Text>
  );
};

export default NameBadge;
