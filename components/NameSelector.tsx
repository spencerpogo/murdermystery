import { Box, Button, Input, Stack } from "@chakra-ui/react";
import { useTranslate } from "lib/translate";
import { ChangeEvent, FC, useState } from "react";

interface NameSelectorProps {
  onSubmit: (name: string) => void;
}

export const NameSelector: FC<NameSelectorProps> = ({
  onSubmit,
}: NameSelectorProps) => {
  const [name, setName] = useState("");

  return (
    <Box>
      <Stack>
        <Input
          placeholder={useTranslate("Enter Name")}
          onChange={(evt: ChangeEvent<HTMLInputElement>) =>
            setName(evt.target.value)
          }
          type="text"
        />
        <Button onClick={() => onSubmit(name)} colorScheme="blue">
          {useTranslate("Join Game")}
        </Button>
      </Stack>
    </Box>
  );
};

export default NameSelector;
