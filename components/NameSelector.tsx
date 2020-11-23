import { Box, Button, Input, Stack } from "@chakra-ui/core";
import { ChangeEvent, FC, useState } from "react";
import t from "../lib/translate";

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
          placeholder={t("Enter Name")}
          onChange={(evt: ChangeEvent<HTMLInputElement>) =>
            setName(evt.target.value)
          }
          type="text"
        />
        <Button onClick={() => onSubmit(name)} variantColor="blue">
          {t("Join Game")}
        </Button>
      </Stack>
    </Box>
  );
};

export default NameSelector;
