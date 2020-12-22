import {
  Alert,
  AlertIcon,
  AlertTitle,
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
import Loader from "./Loader";
import Lobby from "./Lobby";
import NameBadge from "./NameBadge";
import ProphetReveal from "./ProphetReveal";
import Vote, { Candidate, Choice, VoteResult } from "./Vote";

const VoteType = protobuf.VoteRequest.Type; // shorthand

interface GameClientInnerProps {
  server: string;
  gameId: string;
  nameProp: string;
  onError: (e: STRINGS) => void;
}

const GameClientInner: FC<GameClientInnerProps> = ({
  server,
  gameId,
  nameProp,
  onError,
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
    // State setters
    setShowFellowWolves,
    setProphetReveal,
    setAlertContent,
    setVoteResult,
  } = useMessageHandler(onError);

  const { isConnected, send } = useGameSocket(
    `${server}/game/${gameId}`,
    nameProp,
    parseMessage,
    onError
  );

  // Utitility functions

  function typeToMsg(val: protobuf.VoteRequest.Type | null | undefined) {
    // Decode the vote type
    switch (val) {
      case VoteType.KILL:
        return STRINGS.PICK_KILL;
      case VoteType.PROPHET:
        return STRINGS.PICK_REVEAL;
      case VoteType.HEALERHEAL:
        return STRINGS.PLEASE_CONFIRM;
      default:
        return STRINGS.PLEASE_VOTE;
    }
  }

  function typeToDesc(
    val: protobuf.VoteRequest.Type | null | undefined
  ): JSX.Element | null {
    if (val === protobuf.VoteRequest.Type.HEALERHEAL) {
      return (
        <>
          {(killReveal || [-1]).map((id) => (
            <NameBadge key={id} text={IDToName(id) || "??"} />
          ))}
          <Text ml="1" d="inline-block">
            {t(STRINGS.WAS_KILLED_CONFIRM_HEAL)}
          </Text>
        </>
      );
    }
    if (val === protobuf.VoteRequest.Type.HEALERPOISON) {
      return <Text>{t(STRINGS.CONFIRM_POISON)}</Text>;
    }
    return null;
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
  // Use the websocket readyState as the single source of truth for whether the
  //  connection is open.
  if (!isConnected()) {
    return <Loader />;
  }
  // Don't care if connection is open but handshake is incomplete, in that case render
  //  an empty lobby instead

  // If we are here the game is all ready.

  let view; // The main component we will render
  if (playerID === -1) {
    // We are a spectator
    return <p>You are a spectator. Waiting for server to update us...</p>;
  }
  if (!character) {
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

  const [error, setError] = useState<STRINGS | null>(null);
  // The onError function will set the error variable only if it is not already set. If
  //  it is called rapidly, the error variable will be out of date and it could clobber
  //  the error. The canSet variable allow it to ensure it only sets once per render.
  let canSet = true;

  if (error) {
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
    />
  );
};

export default GameClient;
