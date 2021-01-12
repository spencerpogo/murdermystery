import { LangContext, LangContextType } from "components/LangContext";
import { useContext } from "react";
import enJSON from "../locales/en.json";
import zhJSON from "../locales/zh.json";
import Lang from "./langs";

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
  ERROR_OPENING_CONN,
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
  VOTE_RESULTS,
  N_VOTES,
  PLEASE_CONFIRM,
  WAS_KILLED_CONFIRM_HEAL,
  CONFIRM_POISON,
  YES_TO_USING,
  NO_TO_USING,
  SKIP_USING,
  OK,
  SKIP,
  WAITING_FOR_VOTE,
  PICK_WEREWOLF,
  KILLS_DURING_NIGHT,
  NONE,
  CITIZENS_WIN,
  WEREWOLVES_WIN,
  GAME_OVER,
  ALIVE,
  DEAD,
  IS,
  ARE_SPECTATOR,
  USED_PROPHET,
  USED_HEAL,
  WAS_KILLED,
  VOTED_OUT,
  KILLED_BY_HEALER,
  KILLED_BY_WOLVES,
  WAITING_WOLVES_1,
  WAITING_WOLVES_2,
  WAITING_PROPHET_1,
  WAITING_PROPHET_2,
  WAITING_HEAL_1,
  WAITING_HEAL_2,
  WAITING_POISON_1,
  WAITING_POISON_2,
  WAITING_JURY,
  VOTE_STARTED,
  WOLF_VOTE_OVER,
  VOTE_TIED_1,
  VOTE_TIED_2,
}

export const S = STRINGS;

export type LanguageTranslations = {
  [key in keyof typeof STRINGS]: string;
};

export const languages: Record<Lang, LanguageTranslations> = {
  [Lang.EN]: enJSON,
  [Lang.ZH]: zhJSON,
};

export type Translator = (phrase: STRINGS) => string;

const makeTranslator = (dict: LanguageTranslations): Translator => (
  phrase: STRINGS
) => {
  const key: string = typeof phrase === "string" ? phrase : STRINGS[phrase];
  return dict[key];
};

/**
 * Gets the current translator based on the querystring.
 * If zh paramater is in querystring, will lookup key in chinese translations,
 * otherwise will use english.
 */
export function useTranslator(): Translator {
  const { lang } = useContext<LangContextType>(LangContext);

  return makeTranslator(languages[lang]);
}
