import { Box, Image, Text } from "@chakra-ui/react";
import { characterToImg } from "lib/CharacterImg";
import { STRINGS, useTranslator } from "lib/translate";
import { FC } from "react";
import { murdermystery as protobuf } from "../pbjs/protobuf.js";
import NameBadge from "./NameBadge";

export interface UpdateTextProps {
  update: protobuf.ISpectatorUpdate;
  IDToName: (id?: number | null) => string;
}

export const UpdateText: FC<UpdateTextProps> = ({
  update,
  IDToName,
}: UpdateTextProps) => {
  const t = useTranslator();

  if (update.setChar)
    return (
      <Box>
        <Text>{t(STRINGS.ASSIGNED_CHARACTER)}</Text>
        <NameBadge text={IDToName(update.setChar.id)} />
        <Image
          src={characterToImg(
            update.setChar.character || protobuf.Character.NONE
          )}
          height="1.5em"
        />
      </Box>
    );
  return null;
};

export interface UpdatesLogProps {
  updates: protobuf.ISpectatorUpdate[];
  IDToName: (id?: number | null) => string;
}

export const UpdatesLog: FC<UpdatesLogProps> = ({
  updates,
  IDToName,
}: UpdatesLogProps) => {
  return (
    <>
      {updates.map((u, i) => (
        // These updates are constant and will never change order.
        // eslint-disable-next-line react/no-array-index-key
        <UpdateText key={i} update={u} IDToName={IDToName} />
      ))}
    </>
  );
};

export default UpdatesLog;
