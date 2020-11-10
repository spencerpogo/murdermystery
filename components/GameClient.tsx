import {
  Alert,
  AlertIcon,
  AlertTitle,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
} from "@chakra-ui/core";
import Vote, { Choice } from "./Vote";
import { useEffect, useRef, useState } from "react";

import CharacterSpinner from "./CharacterSpinner";
import FellowWolves from "./FellowWolves";
import Loader from "./Loader";
import Lobby from "./Lobby";
import ProphetReveal from "./ProphetReveal";
import { murdermystery as protobuf } from "../pbjs/protobuf.js";
import { forcedTranslate as t } from "../translate";
import useMessageHandler from "lib/useMessageHandler";

function GameClientInner({
  server,
  id,
  nameProp,
  onError,
}: {
  server: string;
  id: string;
  nameProp: string;
  onError: (e: string) => void;
}) {
  // Main websocket
  const wsRef = useRef<WebSocket | null>(null);
  let ws = wsRef.current;

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

  // Utitility functions

  function typeToMsg(val: protobuf.VoteRequest.Type | null | undefined) {
    // Decode the vote type
    const VOTE_TYPES: { [type: number]: string } = {
      [protobuf.VoteRequest.Type.KILL]: "Choose someone to kill",
      [protobuf.VoteRequest.Type.PROPHET]: "Choose someone to reveal",
    };
    return VOTE_TYPES[val || -1] || "Please vote";
  }

  const IDToName = (id: number | null | undefined) =>
    (players[id || -1] || {}).name || "";

  // Take a list of IDS and return a list of corresponding names
  const IDsToNames = (ids: number[]) =>
    ids.map((id) => (players[id] || {}).name || "").filter((n) => !!n);

  // Send encodes and sends a protobuf message to the server.
  const send = (msg: protobuf.IClientMessage) => {
    if (!ws) {
      console.error("Try to send() while ws is null");
      return;
    }
    console.log(msg);
    ws.send(protobuf.ClientMessage.encode(msg).finish());
  };

  const sendName = () => {
    send({
      setName: { name: nameProp },
    });
  };

  // setup websocket
  useEffect(() => {
    try {
      wsRef.current = new WebSocket(`${server}/game/${id}`);
    } catch (e) {
      console.error(e);
      onError("Error while opening connection");
      return;
    }
    // update ws reference
    ws = wsRef.current;
    // Use proper binary type (no blobs)
    ws.binaryType = "arraybuffer";
    // handshake when it opens
    ws.addEventListener("open", () => sendName());
    // Handle messages
    ws.addEventListener("message", (ev: MessageEvent<any>) => parseMessage(ev));
    // Handle discconects
    ws.addEventListener("close", () => {
      onError("Disconnected from server");
    });

    // Cleanup: close websocket
    return () => ws?.close();
  }, []);

  // UI

  // The order of these checks is important.
  // Use the websocket readyState as the single source of truth for whether the
  //  connection is open.
  if (!ws || ws.readyState != WebSocket.OPEN) {
    return <Loader />;
  }
  // Don't care if connection is open but handshake is incomplete, in that case render
  //  an empty lobby instead

  // If we are here the game is all ready.

  let view; // The main component we will render
  if (playerID == -1) {
    // We are a spectator
    return <p>You are a spectator. Waiting for server to update us...</p>;
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
        onFinish={() => setSpinDone(true)}
      />
    );
  } else if (showFellowWolves) {
    view = (
      <FellowWolves
        names={IDsToNames(fellowWolves.filter((id) => id != playerID))}
        onDone={() => setShowFellowWolves(false)}
      />
    );
  } else if (voteRequest.length) {
    // Process the id list (number[]) into [ [id, name] ]
    let candidates: Choice[] = [];
    for (let candidateID of voteRequest) {
      let name: string = (players[candidateID] || {}).name || "";
      if (name) {
        candidates.push({
          name,
          id: candidateID,
          votes: voteInfo
            .map((v) =>
              v && v.choice == candidateID
                ? (players[(v || {}).id || -1] || {}).name || ""
                : ""
            )
            .filter((i) => i),
        });
      }
    }

    // Process voteSync message of [{ id, choice }] into map of { [choice]: string[] }
    let noVote: string[] = [];
    for (let vote of voteInfo) {
      if (vote.id && vote.id > 0) {
        const voterName = IDToName(vote.id);
        // -1 == no vote
        if (vote.choice && vote.choice == -1) {
          noVote.push(voterName);
        }
      }
    }

    view = (
      <Vote
        msg={typeToMsg(voteType)}
        desc={
          voteType == protobuf.VoteRequest.Type.KILL
            ? "Everyone must agree"
            : ""
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
    view = <p>{t("It is night, you are sleeping")}</p>;
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
          <ModalBody>
            <Text>{alertContent ? t(alertContent) : ""}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function GameClient({
  server,
  id,
  nameProp,
}: {
  server: string;
  id: string;
  nameProp: string;
}) {
  const [error, setError] = useState<string>("");
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
      id={id}
      nameProp={nameProp}
      onError={(err: string) => {
        if (canSet && !error) {
          canSet = false;
          setError(err);
        }
      }}
    />
  );
}
