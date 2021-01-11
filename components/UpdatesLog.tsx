import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { characterToImg } from "lib/CharacterImg";
import { STRINGS, useTranslator } from "lib/translate";
import { FC, PropsWithChildren } from "react";
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

const VT = protobuf.VoteRequest.Type;

export function getVoteRequestText(
  t: protobuf.VoteRequest.Type
): [STRINGS | null, STRINGS | null, boolean, boolean] {
  switch (t) {
    case VT.KILL:
      return [STRINGS.WAITING_WOLVES_1, STRINGS.WAITING_WOLVES_2, false, true];
    case VT.PROPHET:
      return [
        STRINGS.WAITING_PROPHET_1,
        STRINGS.WAITING_PROPHET_2,
        false,
        true,
      ];
    case VT.HEALERHEAL:
      return [STRINGS.WAITING_HEAL_1, STRINGS.WAITING_HEAL_2, true, true];
    case VT.HEALERPOISON:
      return [STRINGS.WAITING_POISON_1, STRINGS.WAITING_POISON_2, false, true];
    case VT.JURY:
      return [STRINGS.WAITING_JURY, null, false, false];
    default:
      return [STRINGS.VOTE_STARTED, null, false, false];
  }
}

const JR = protobuf.VoteResultType;

interface UpdateProps {}

const Update: FC<UpdateProps> = ({
  children,
}: PropsWithChildren<UpdateProps>) => {
  return <Flex align="center">{children}</Flex>;
};

export interface UpdateTextProps {
  update: protobuf.ISpectatorUpdate;
  IDToName: (id?: number | null) => string;
  lastVoteType: protobuf.VoteRequest.Type;
}

export const UpdateText: FC<UpdateTextProps> = ({
  update,
  IDToName,
  lastVoteType,
}: UpdateTextProps) => {
  const t = useTranslator();

  if (update.setChar)
    return (
      <Update>
        <NameBadge text={IDToName(update.setChar.id)} />
        <Text>{t(STRINGS.IS)}</Text>
        <Image
          ml="2"
          src={characterToImg(
            update.setChar.character || protobuf.Character.NONE
          )}
          height="2.5em"
        />
      </Update>
    );
  if (update.prophetReveal)
    return (
      <Update>
        <NameBadge text={IDToName(update.prophetReveal.prophetId)} />
        <Text>{t(STRINGS.USED_PROPHET)}</Text>
        <NameBadge text={IDToName(update.prophetReveal.choiceId)} />
        <Text>
          {t(update.prophetReveal.good ? STRINGS.IS_GOOD : STRINGS.IS_BAD)}
        </Text>
      </Update>
    );
  if (update.healerHeal)
    return (
      <Update>
        <NameBadge text={IDToName(update.healerHeal.healer)} />
        <Text>{t(STRINGS.USED_HEAL)}</Text>
        {(update.healerHeal.healed || []).map((id) => (
          <NameBadge key={id} text={IDToName(id)} />
        ))}
      </Update>
    );
  if (update.kill)
    return (
      <Update>
        <NameBadge text={IDToName(update.kill.killed)} />
        <Text>
          {t(getKillText(update.kill.reason || protobuf.KillReason.UNKNOWN))}
        </Text>
      </Update>
    );
  if (update.voteRequest) {
    const [before, after, showCandidates, showVoters] = getVoteRequestText(
      update.voteRequest.voteRequest?.type || VT.UNKNOWN
    );

    return (
      <Update>
        {before ? <Text>{t(before)}</Text> : null}
        {showVoters
          ? (update.voteRequest.voters || []).map((id) => (
              <NameBadge key={id} text={IDToName(id)} />
            ))
          : null}
        {after ? <Text ml="1">{t(after)}</Text> : null}
        {showCandidates
          ? (update.voteRequest.voteRequest?.choice_IDs || []).map((id) => (
              <NameBadge key={id} text={IDToName(id)} />
            ))
          : null}
      </Update>
    );
  }
  if (update.voteOver) {
    if (lastVoteType === VT.KILL) {
      const result = (update.voteOver.voteOver?.result?.candidates || [])[0];

      return (
        <Update>
          <Text>{t(STRINGS.WOLF_VOTE_OVER)}</Text>
          {result && result.id ? (
            <NameBadge text={IDToName(result.id)} />
          ) : (
            <NameBadge text={IDToName(-1)} />
          )}
        </Update>
      );
    }
    if (lastVoteType === VT.JURY) {
      const jury = update.voteOver.voteOver?.result?.jury;

      const winner = (
        update.voteOver.voteOver?.result?.candidates || []
      ).reduce<{
        id: number;
        voters: number[];
      }>(
        (prev, u) => {
          if (u && u.id && u.voters) {
            return prev.voters.length > u.voters.length
              ? prev
              : { id: u.id || -1, voters: u.voters };
          }
          return prev;
        },
        { id: -1, voters: [] }
      );
      const totalVotes = (
        update.voteOver.voteOver?.result?.candidates || []
      ).reduce((prev, i) => prev + (i.voters?.length || 0), 0);

      if (jury?.status === JR.WIN) {
        return (
          <Update>
            <NameBadge text={IDToName(jury.winner)} />
            <Text>{t(STRINGS.VOTED_OUT)}</Text>
            <Text ml="2">(</Text>
            <Text>{winner.voters.length}</Text>
            <Text>/</Text>
            <Text>{totalVotes}</Text>
            <Text>{t(STRINGS.VOTES)}</Text>
            <Text>)</Text>
          </Update>
        );
      }
    }
    return null;
  }

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

  const revUpdates = updates.slice().reverse();
  console.log(updates, revUpdates);

  let lastVoteType = VT.UNKNOWN;
  for (let i = 0; i < revUpdates.length; i += 1) {
    const u = revUpdates[i];
    if (u.voteRequest) {
      const ut = u.voteRequest.voteRequest?.type || VT.UNKNOWN;
      if (ut !== VT.UNKNOWN) {
        lastVoteType = ut;
        break;
      }
    }
  }

  return (
    <Box>
      <Heading mb="2">{t(STRINGS.ARE_SPECTATOR)}</Heading>
      {revUpdates
        // This array will never change order so this is safe here
        /* eslint-disable react/no-array-index-key */
        .map((u, i) => (
          <UpdateText
            key={i}
            update={u}
            IDToName={IDToName}
            lastVoteType={lastVoteType}
          />
        ))
        /* eslint-enable react/no-array-index-key */
        .filter(Boolean)}
    </Box>
  );
};

export default UpdatesLog;
