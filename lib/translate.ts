import { useClientOnly } from "components/ClientOnly";
import enJSON from "../locales/en.json";
import zhJSON from "../locales/zh.json";

// ESLint is being weird
// eslint-disable-next-line no-shadow
export enum STRINGS {
  TITLE,
  JOIN_GAME,
  JOIN,
  CREATE_GAME,
  NEED_GAME_LINK,
  ENTER_NAME,
  INVALID_GAME_LINK,
  SERVER_DISCONNECTED,
  START_GAME,
  WAIT_FOR_HOST,
  GAME_ALREADY_STARTED,
  ERROR,
  WAITING_FOR_PLAYERS,
  SHARE_TO_INVITE,
  COPY,
  HOST,
  SERVER_CLOSED_CONN,
  INVALID_NAME,
  PLAYER_DISCONNECTED,
  ERROR_PERFORMING_ACTION,
  NEED_MORE_PLAYERS,
  YOU_ARE,
  CITIZEN,
  WEREWOLF,
  HEALER,
  PROPHET,
  HUNTER,
  FELLOW_WOLVES,
  VOTES,
  HAS_NOT_VOTED,
  PLEASE_VOTE,
  PICK_KILL,
  NEED_CONSENSUS,
  IS_NIGHT,
  PICK_REVEAL,
  REVEAL_FOUND,
  IS_GOOD,
  IS_BAD,
  YOU_CANT_START,
}

export const S = STRINGS;

type Language = {
  [key in keyof typeof STRINGS]: string;
};

const zh: Language = zhJSON;
const en: Language = enJSON;

/**
 * Get translated version of a string from english.
 * If zh paramater is in querystring, will lookup key in chinese translations.
 * If chinese translation does not exist, warn and fallback to english.
 * @param k The key to translate, in english
 */
export default function translate(s: STRINGS): string {
  if (typeof window !== "undefined" && window.location) {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("zh") === "") {
      return zh[s];
    }
  }

  return en[s];
}

export const useTranslate = (phrase: STRINGS): string =>
  useClientOnly() ? translate(phrase) : en[phrase];
