import t, { S, STRINGS } from "lib/translate";
import useGameSocket from "lib/useGameSocket";
import useMessageHandler from "lib/useMessageHandler";
import { FC, useState } from "react";

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

import { murdermystery as protobuf } from "../pbjs/protobuf.js";
import CharacterSpinner from "./CharacterSpinner";
import FellowWolves from "./FellowWolves";
import Loader from "./Loader";
import Lobby from "./Lobby";
import ProphetReveal from "./ProphetReveal";
import Vote, { Choice } from "./Vote";

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
    voteInfo,
    voteType,
    prophetReveal,
    // State setters
    setShowFellowWolves,
    setProphetReveal,
    setAlertContent,
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
    const VOTE_TYPES: { [type: number]: STRINGS } = {
      [protobuf.VoteRequest.Type.KILL]: STRINGS.PICK_KILL,
      [protobuf.VoteRequest.Type.PROPHET]: STRINGS.PICK_REVEAL,
    };
    return VOTE_TYPES[val || -1] || STRINGS.PLEASE_VOTE;
  }

  const IDToName = (id: number | null | undefined) =>
    (players[id || -1] || {}).name || "";

  // Take a list of IDS and return a list of corresponding names
  const IDsToNames = (ids: number[]) =>
    ids.map((id) => (players[id] || {}).name || "").filter((n) => !!n);

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
        onFinish={() => setSpinDone(true)}
      />
    );
  } else if (showFellowWolves) {
    view = (
      <FellowWolves
        names={IDsToNames(fellowWolves.filter((id) => id !== playerID))}
        onDone={() => setShowFellowWolves(false)}
      />
    );
  } else if (voteRequest.length) {
    // Process the id list (number[]) into [ [id, name] ]
    const candidates: Choice[] = [];
    voteRequest.forEach((candidateID) => {
      const name: string = (players[candidateID] || {}).name || "";
      if (name) {
        candidates.push({
          name,
          id: candidateID,
          votes: voteInfo
            .map((v) =>
              v && v.choice === candidateID
                ? (players[(v || {}).id || -1] || {}).name || ""
                : ""
            )
            .filter((i) => i),
        });
      }
    });

    // Process voteSync message of [{ id, choice }] into map of { [choice]: string[] }
    const noVote: string[] = [];
    voteInfo.forEach((vote) => {
      if (vote.id && vote.id > 0) {
        const voterName = IDToName(vote.id);
        // -1 == no vote
        if (vote.choice && vote.choice === -1) {
          noVote.push(voterName);
        }
      }
    });

    view = (
      <Vote
        msg={typeToMsg(voteType)}
        desc={
          voteType === protobuf.VoteRequest.Type.KILL
            ? STRINGS.NEED_CONSENSUS
            : undefined
        }
        candidates={candidates}
        noVote={noVote}
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
          <ModalHeader>{alertContent ? alertContent.title : ""}</ModalHeader>
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
