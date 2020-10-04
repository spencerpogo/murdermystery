import { Box, Button, Input, Stack } from "@chakra-ui/core";
import { ChangeEvent, useState } from "react";

import t from "../translate";

function NameSelector({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");
  return (
    <Box>
      <Stack>
        <Input
          placeholder={t("Enter name")}
          onChange={(evt: ChangeEvent<HTMLInputElement>) =>
            setName(evt.target.value)
          }
        />
        <Button onClick={() => onSubmit(name)}>{t("Join Game")}</Button>
      </Stack>
    </Box>
  );
}

export default NameSelector;
