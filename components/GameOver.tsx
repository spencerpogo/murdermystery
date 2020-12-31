import { Box, Flex, Heading, HStack, Image } from "@chakra-ui/react";
import { characterToImg, characterToString } from "lib/CharacterImg";
import { STRINGS, useTranslator } from "lib/translate";
import { murdermystery as protobuf } from "pbjs/protobuf";
import { FC } from "react";
import NameBadge from "./NameBadge";

export interface Player {
  id: number;
  name: string;
  role: protobuf.Character;
}

const C = protobuf.Character;
const R = protobuf.GameOver.Reason;

export interface CharacterImageProps {
  character: protobuf.Character;
  width?: string;
}

export const CharacterImage: FC<CharacterImageProps> = ({
  character,
  width = "125px",
}: CharacterImageProps) => {
  return <Image src={characterToImg(character)} width={width} />;
};

export interface PlayerGroupProps {
  role: protobuf.Character;
  players: Player[];
}

export const PlayerGroup: FC<PlayerGroupProps> = ({
  role,
  players,
}: PlayerGroupProps) => {
  const t = useTranslator();

  return (
    <Box mt="3">
      <Flex align="center" justify="center">
        <CharacterImage character={role} />
        <Heading ml="3">{t(characterToString(role))}</Heading>
      </Flex>
      <Flex align="center" justify="center">
        <HStack mt="3" wrap="wrap">
          {players.map((p: Player) => (
            <NameBadge key={p.id} text={p.name} />
          ))}
        </HStack>
      </Flex>
    </Box>
  );
};

function winReasonToString(r: protobuf.GameOver.Reason): STRINGS {
  switch (r) {
    case protobuf.GameOver.Reason.CITIZEN_WIN:
      return STRINGS.CITIZENS_WIN;
    case protobuf.GameOver.Reason.WEREWOLF_WIN:
      return STRINGS.WEREWOLVES_WIN;
    default:
      return STRINGS.GAME_OVER;
  }
}

export interface GameOverProps {
  winReason: protobuf.GameOver.Reason;
  players: Player[];
}

export const GameOver: FC<GameOverProps> = ({
  winReason,
  players,
}: GameOverProps) => {
  const t = useTranslator();

  const wolves: Player[] = [];
  const citizens: Player[] = [];
  const special: Player[] = [];

  const getList = (r: protobuf.Character): Player[] => {
    switch (r) {
      case C.WEREWOLF:
        return wolves;
      case C.CITIZEN:
        return citizens;
      default:
        return special;
    }
  };

  players.forEach((p) => getList(p.role).push(p));

  const werewolfGroup = <PlayerGroup role={C.WEREWOLF} players={wolves} />;
  const citizenGroup = <PlayerGroup role={C.CITIZEN} players={citizens} />;
  const specialGroup = special.map((p: Player) => (
    <PlayerGroup key={p.id} role={p.role} players={[p]} />
  ));

  let view;
  if (winReason === R.WEREWOLF_WIN) {
    view = (
      <>
        {werewolfGroup}
        {citizenGroup}
        {specialGroup}
      </>
    );
  } else {
    view = (
      <>
        {citizenGroup}
        {specialGroup}
        {werewolfGroup}
      </>
    );
  }

  return (
    <Box>
      <Heading>{t(winReasonToString(winReason))}</Heading>
      {view}
    </Box>
  );
};

export default GameOver;
