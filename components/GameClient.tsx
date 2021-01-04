import {
  Alert,
  AlertIcon,
  AlertTitle,
  Flex,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { S, STRINGS, useTranslator } from "lib/translate";
import useGameSocket from "lib/useGameSocket";
import useMessageHandler from "lib/useMessageHandler";
import { FC, useState } from "react";
import { murdermystery as protobuf } from "../pbjs/protobuf.js";
import CharacterSpinner from "./CharacterSpinner";
import FellowWolves from "./FellowWolves";
import GameOver from "./GameOver";
import Loader from "./Loader";
import Lobby from "./Lobby";
import NameBadge from "./NameBadge";
import PlayerStatus from "./PlayerStatus";
import ProphetReveal from "./ProphetReveal";
import Vote, { Candidate, Choice, VoteResult } from "./Vote";

const VoteType = protobuf.VoteRequest.Type; // shorthand

interface GameClientInnerProps {
  server: string;
  gameId: string;
  nameProp: string;
  onError: (e: STRINGS) => void;
  onGameOver: () => void;
}

const GameClientInner: FC<GameClientInnerProps> = ({
  server,
  gameId,
  nameProp,
  onError,
  onGameOver,
}: GameClientInnerProps) => {
  const t = useTranslator();

  // State
  const {
    // Message Parser
    parseMessage,
    // State variables
    playerID,
    isHost,
    players,
    hostId,
    alertContent,
    character,
    spinDone,
    setSpinDone,
    fellowWolves,
    showFellowWolves,
    voteRequest,
    voteResult,
    voteType,
    prophetReveal,
    killReveal,
    gameIsOver,
    gameOverRef,
    alive,
    spectatorUpdates,
    // State setters
    setShowFellowWolves,
    setProphetReveal,
    setAlertContent,
    setVoteResult,
    setAlive,
  } = useMessageHandler(onError, onGameOver);

  const { isConnected, send } = useGameSocket(
    `${server}/game/${gameId}`,
    nameProp,
    parseMessage,
    onError
  );

  // Utitility functions

  function typeToMsg(
    val: protobuf.VoteRequest.Type | null | undefined
  ): STRINGS {
    // Decode the vote type
    switch (val) {
      case VoteType.KILL:
        return STRINGS.PICK_KILL;
      case VoteType.PROPHET:
        return STRINGS.PICK_REVEAL;
      case VoteType.HEALERHEAL:
      case VoteType.HEALERPOISON:
        return STRINGS.PLEASE_CONFIRM;
      case VoteType.JURY:
        return STRINGS.PICK_WEREWOLF;
      default:
        return STRINGS.PLEASE_VOTE;
    }
  }

  function typeToDesc(
    val: protobuf.VoteRequest.Type | null | undefined
  ): JSX.Element | null {
    switch (val) {
      case protobuf.VoteRequest.Type.HEALERHEAL:
        return (
          <Flex align="center">
            <HStack>
              {(killReveal || [-1]).map((id) => (
                <NameBadge key={id} text={IDToName(id) || "??"} />
              ))}
            </HStack>
            <Text ml="1" d="inline-block">
              {t(STRINGS.WAS_KILLED_CONFIRM_HEAL)}
            </Text>
          </Flex>
        );
      case protobuf.VoteRequest.Type.HEALERPOISON:
        return <Text>{t(STRINGS.CONFIRM_POISON)}</Text>;
      case protobuf.VoteRequest.Type.JURY:
        return (
          <>
            <Text fontSize="xl" mb="2">
              {t(STRINGS.KILLS_DURING_NIGHT)}
            </Text>
            {killReveal && killReveal.length ? (
              <HStack>
                {(killReveal || []).map((id) => (
                  <NameBadge key={id} text={IDToName(id) || "?"} />
                ))}
              </HStack>
            ) : (
              <Text as="i" size="lg">
                {t(STRINGS.NONE)}
              </Text>
            )}
          </>
        );
      default:
        return null;
    }
  }

  const IDToName = (id: number | null | undefined) =>
    (players[id || -1] || {}).name || "";

  // Take a list of IDS and return a list of corresponding names
  const IDsToNames = (ids: number[]) =>
    ids.map((id) => (players[id] || {}).name || "").filter((n) => !!n);

  // Process the id list (number[]) into [ [id, name] ]
  const voteRequestToCandidates = (vr: protobuf.IVoteRequest): Choice[] => {
    if (vr.type === protobuf.VoteRequest.Type.HEALERHEAL) {
      // Special case: this is a yes/no vote
      return [
        { name: t(STRINGS.YES_TO_USING), id: 2 },
        { name: t(STRINGS.NO_TO_USING), id: 1 },
      ];
    }
    const candidates: Choice[] = [];
    (vr.choice_IDs || []).forEach((candidateID) => {
      const name: string = (players[candidateID] || {}).name || "";
      if (name) {
        candidates.push({
          name,
          id: candidateID,
        });
      }
    });
    if (vr.type === protobuf.VoteRequest.Type.HEALERPOISON) {
      candidates.push({
        id: -1,
        name: <Text as="b">{t(STRINGS.SKIP_USING)}</Text>,
      });
    }
    return candidates;
  };

  // UI

  // The order of these checks is important.

  // Don't care if connection is open but handshake is incomplete, in that case render
  //  an empty lobby instead

  let view; // The main component we will render
  if (gameIsOver) {
    const gameOver: protobuf.IGameOver = gameOverRef.current || {};
    view = (
      <GameOver
        winReason={gameOver.reason || protobuf.GameOver.Reason.NONE}
        players={(gameOver.players || []).map((p) => ({
          id: p.id || -1,
          name: IDToName(p.id),
          role: p.character || protobuf.Character.NONE,
        }))}
      />
    );
  } else if (!isConnected()) {
    // If the game is over, we don't care if the server is disconnected, so only
    //  check this after checking for gameover.
    // Use the websocket readyState as the single source of truth for whether the
    //  connection is open.
    return <Loader />;
  } else if (alive && alive.length) {
    const aliveNames: string[] = [];
    const deadNames: string[] = [];

    Object.keys(players).forEach((id) => {
      const { name } = players[id];
      if (name) {
        if (alive.includes(Number(id))) {
          aliveNames.push(name);
        } else {
          deadNames.push(name);
        }
      }
    });

    view = (
      <PlayerStatus
        aliveNames={aliveNames}
        deadNames={deadNames}
        onDone={() => setAlive(null)}
      />
    );
  } else if (spectatorUpdates) {
    view = <p>Not implemented</p>;
  } else if (playerID === -1) {
    // We are a spectator, and we are waiting for updates.
    view = <Loader />;
  } else if (!character) {
    view = (
      <Lobby
        players={players}
        hostId={hostId}
        isHost={isHost}
        start={() => send({ startGame: {} })}
      />
    );
  } else if (!spinDone) {
    view = (
      <CharacterSpinner
        character={character || ""}
        onDone={() => setSpinDone(true)}
      />
    );
  } else if (showFellowWolves) {
    view = (
      <FellowWolves
        names={IDsToNames(fellowWolves.filter((id) => id !== playerID))}
        onDone={() => setShowFellowWolves(false)}
      />
    );
  } else if (voteResult) {
    const votes: Candidate[] = [];
    voteResult.forEach((c) => {
      const candidateName = IDToName(c.id);
      if (candidateName && c.voters && c.voters.length) {
        votes.push({
          id: c.id || -1,
          name: candidateName,
          voters: IDsToNames(c.voters),
        });
      }
    });
    view = <VoteResult votes={votes} onDone={() => setVoteResult(null)} />;
  } else if (voteRequest) {
    view = (
      <Vote
        msg={typeToMsg(voteType)}
        desc={typeToDesc(voteType)}
        candidates={voteRequestToCandidates(voteRequest)}
        onVote={(candidateID: number) =>
          send({ vote: { choice: candidateID } })
        }
      />
    );
  } else if (prophetReveal) {
    view = (
      <ProphetReveal
        name={IDToName(prophetReveal.id)}
        good={!!prophetReveal.good}
        onDone={() => setProphetReveal(null)}
      />
    );
  } else {
    // TODO: Prettify this, maybe an image here
    view = <p>{t(S.IS_NIGHT)}</p>;
  }

  return (
    <>
      {view}
      <Modal
        onClose={() => setAlertContent(null)}
        isOpen={alertContent != null}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>{alertContent ? t(alertContent.title) : ""}</ModalHeader>
          <ModalBody>
            <Text>{alertContent ? t(alertContent.body) : ""}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

interface GameClientProps {
  server: string;
  id: string;
  nameProp: string;
}

export const GameClient: FC<GameClientProps> = ({
  server,
  id,
  nameProp,
}: GameClientProps) => {
  const t = useTranslator();

  const [gameOver, setGameOver] = useState<boolean>(false);
  const [error, setError] = useState<STRINGS | null>(null);
  // The onError function will set the error variable only if it is not already set. If
  //  it is called rapidly, the error variable will be out of date and it could clobber
  //  the error. The canSet variable allow it to ensure it only sets once per render.
  let canSet = true;

  if (!gameOver && error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle>{t(error)}</AlertTitle>
      </Alert>
    );
  }
  return (
    <GameClientInner
      server={server}
      gameId={id}
      nameProp={nameProp}
      onError={(err: STRINGS) => {
        if (canSet && !error) {
          canSet = false;
          setError(err);
        }
      }}
      onGameOver={() => setGameOver(true)}
    />
  );
};

export default GameClient;
