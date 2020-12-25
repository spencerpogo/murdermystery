import { S, STRINGS } from "lib/translate";
import { murdermystery as protobuf } from "pbjs/protobuf";

const C = protobuf.Character;

export const CHARACTER_INDEXES = [
  C.CITIZEN,
  C.WEREWOLF,
  C.HEALER,
  C.PROPHET,
  C.HUNTER,
];
export const NAMES = ["citizen", "werewolf", "healer", "prophet", "hunter"];
export const NAME_STRINGS = [
  S.CITIZEN,
  S.WEREWOLF,
  S.HEALER,
  S.PROPHET,
  S.HUNTER,
];

export const characterToString = (c: protobuf.Character): STRINGS =>
  NAME_STRINGS[CHARACTER_INDEXES.indexOf(c)];

export const characterToImg = (c: protobuf.Character): string =>
  `/${NAMES[CHARACTER_INDEXES.indexOf(c)]}.webp`;
