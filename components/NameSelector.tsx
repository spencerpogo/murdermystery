import { STRINGS, useTranslate } from "lib/translate";
import { ChangeEvent, FC, useState } from "react";

import { Box, Button, Input, Stack } from "@chakra-ui/react";

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
          placeholder={useTranslate(STRINGS.ENTER_NAME)}
          onChange={(evt: ChangeEvent<HTMLInputElement>) =>
            setName(evt.target.value)
          }
          type="text"
        />
        <Button onClick={() => onSubmit(name)} colorScheme="blue">
          {useTranslate(STRINGS.JOIN_GAME)}
        </Button>
      </Stack>
    </Box>
  );
};

export default NameSelector;
