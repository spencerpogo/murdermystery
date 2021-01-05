import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { characterToImg } from "lib/CharacterImg";
import { STRINGS, useTranslator } from "lib/translate";
import { FC } from "react";
import { murdermystery as protobuf } from "../pbjs/protobuf.js";
import NameBadge from "./NameBadge";

export function getKillText(reason: protobuf.KillReason): STRINGS {
  switch (reason) {
    case protobuf.KillReason.VOTED:
      return STRINGS.VOTED_OUT;
    case protobuf.KillReason.HEALERPOISON:
      return STRINGS.KILLED_BY_HEALER;
    case protobuf.KillReason.WOLVES:
      return STRINGS.KILLED_BY_WOLVES;
    default:
      return STRINGS.WAS_KILLED;
  }
}

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
      <>
        <Text>{t(STRINGS.ASSIGNED_CHARACTER)}</Text>
        <NameBadge text={IDToName(update.setChar.id)} />
        <Image
          ml="2"
          src={characterToImg(
            update.setChar.character || protobuf.Character.NONE
          )}
          height="2.5em"
        />
      </>
    );
  if (update.prophetReveal)
    return (
      <>
        <NameBadge text={IDToName(update.prophetReveal.prophetId)} />
        <Text>{t(STRINGS.USED_PROPHET)}</Text>
        <NameBadge text={IDToName(update.prophetReveal.choiceId)} />
        <Text>
          {t(update.prophetReveal.good ? STRINGS.IS_GOOD : STRINGS.IS_BAD)}
        </Text>
      </>
    );
  if (update.healerHeal)
    return (
      <>
        <NameBadge text={IDToName(update.healerHeal.healer)} />
        <Text>{t(STRINGS.USED_HEAL)}</Text>
        {(update.healerHeal.healed || []).map((id) => (
          <NameBadge key={id} text={IDToName(id)} />
        ))}
      </>
    );
  if (update.kill)
    return (
      <>
        <NameBadge text={IDToName(update.kill.killed)} />
        <Text>
          {t(getKillText(update.kill.reason || protobuf.KillReason.UNKNOWN))}
        </Text>
      </>
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
  const t = useTranslator();

  return (
    <Box>
      <Heading mb="2">{t(STRINGS.ARE_SPECTATOR)}</Heading>
      {updates
        .map((u, i) => (
          // These updates are constant and will never change order.
          // eslint-disable-next-line react/no-array-index-key
          <Flex align="center" mb="2" key={i}>
            <UpdateText update={u} IDToName={IDToName} />
          </Flex>
        ))
        .reverse()}
    </Box>
  );
};

export default UpdatesLog;
