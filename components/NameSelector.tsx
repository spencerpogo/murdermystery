import { Box, Button, Input, Stack } from "@chakra-ui/react";
import { STRINGS, useTranslator } from "lib/translate";
import { ChangeEvent, FC, useState } from "react";

interface NameSelectorProps {
  onSubmit: (name: string) => void;
}

export const NameSelector: FC<NameSelectorProps> = ({
  onSubmit,
}: NameSelectorProps) => {
  const t = useTranslator();
  const [name, setName] = useState("");

  return (
    <Box>
      <Stack>
        <Input
          placeholder={t(STRINGS.ENTER_NAME)}
          onChange={(evt: ChangeEvent<HTMLInputElement>) =>
            setName(evt.target.value)
          }
          type="text"
        />
        <Button onClick={() => onSubmit(name)} colorScheme="blue">
          {t(STRINGS.JOIN_GAME)}
        </Button>
      </Stack>
    </Box>
  );
};

export default NameSelector;
