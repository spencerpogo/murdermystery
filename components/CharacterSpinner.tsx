import { Box, Flex, Heading, Image, Text } from "@chakra-ui/core";
import {
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

import { murdermystery as protobuf } from "../pbjs/protobuf";
import { forcedTranslate as t } from "../translate";

const { Character } = protobuf.SetCharacter;

// CHARACTER_INDEXES maps protobuf character enum values to indexes in filenames
const CHARACTER_INDEXES = [
  Character.CITIZEN,
  Character.WEREWOLF,
  Character.HEALER,
  Character.PROPHET,
  Character.HUNTER,
];

const FILENAMES = [
  "citizen.png",
  "werewolf.png",
  "healer.png",
  "prophet.png",
  "hunter.png",
];
const WIDTH = 226;
const HEIGHT = 330;
const REPS = 10;

const getImgs = (offset: number) =>
  FILENAMES.map((f, i) => {
    return (
      <Box d={"inline-block"} key={offset + i}>
        <Image
          src={"/" + f}
          alt={"TODO"}
          width={WIDTH + "px"}
          height={HEIGHT + "px"}
        />
      </Box>
    );
  });
let allImgs: ReactNode[] = [];
let offset = 0;
for (let i = 0; i < REPS; i++) {
  let imgs = getImgs(offset);
  allImgs = allImgs.concat(imgs);
  offset += imgs.length;
}

/**
 * @description This method finds the amount of pixels to go left from the left side of
 *  the very first card image. It is designed to land very close to the edge of the
 *  card so it is more exciting, but will always land on specified card.
 * @param card_ind The index of the card in filenames which should be landed on
 */
const getTransformAmt = (card_ind: number) => {
  // always go at least across all cards 6 times, and account for spinner position
  const min_dist = WIDTH * FILENAMES.length * 7;

  // A random px amount between 5 and 9 percent of card_width
  const rand = Math.random() * (WIDTH * 0.09) + WIDTH * 0.05;
  // Either at the beginning or end of the card
  const pos_in_card = Math.random() > 0.5 ? rand : WIDTH - rand;
  // The final amount to move
  return min_dist + card_ind * WIDTH + pos_in_card;
};

const getSpinnerPos = (
  lineContainerRef: MutableRefObject<HTMLElement | null>
) =>
  lineContainerRef.current
    ? lineContainerRef.current.getBoundingClientRect().width / 2
    : 0;

enum Stage {
  waiting = 1,
  spinning = 2,
  done = 3,
}

export default function CharacterSpinner({
  character,
}: {
  character: protobuf.SetCharacter.Character;
}) {
  const card_ind = CHARACTER_INDEXES.indexOf(character);
  if (card_ind == -1) throw new Error("Invalid character: " + character);

  const filename = FILENAMES[card_ind];
  const name = filename.split(".")[0];

  const [stage, setStage] = useState<Stage>(Stage.waiting);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);

  // We will only be setting this once, but it depends on Math.random(), and it can't
  //  be different every render, so store it in state
  const [transformAmt, setTransformAmt] = useState<number | null>(null);
  if (transformAmt == null) {
    setTransformAmt(getTransformAmt(card_ind));
  }

  // The Box with the images. We need it to get the size of it
  const lineContainerRef = useRef<HTMLElement | null>(null);

  // After 2s, start spinning, then 11s after that, switch to done
  useEffect(() => {
    let timeoutId: any;
    if (stage == Stage.waiting) {
      timeoutId = setTimeout(() => {
        setStage(Stage.spinning);
      }, 2000);
    } else if (stage == Stage.spinning) {
      timeoutId = setTimeout(() => {
        setStage(Stage.done);
      }, 11000);
    }

    return () => clearTimeout(timeoutId);
  }, [stage]);

  const onResize = () => {
    // if the window resizes, the line which represents which card they'll get will
    //  jump. This will result in the wrong card being displayed in the UI. But we
    //  can't continue the animation where we left off with a different target,
    //  so just transform directly to the correct amount without any animation.
    // The UI will be "frozen" until the animation would have finished, but this is
    //  still a better experience than seeing the wrong card "selected".
    // Once we setShouldAnimate(false), the component re-renders, the value of
    //  getSpinnerPos() will change due to the new window size, and the transform
    //  will be updated accordingly.
    setShouldAnimate(false);
  };

  // Add the resize event listener once and properly clean it up afterwards
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Guard for null tranformAmt to make typescript happy, in reality it is always set
  const finalTransform = (transformAmt || 0) - getSpinnerPos(lineContainerRef);

  if (stage == Stage.waiting || stage == Stage.spinning) {
    return (
      <>
        <style jsx global>
          {"body{overflow-x: hidden;}"}
        </style>
        <Box
          transform={
            stage == Stage.spinning ? `translateX(${-finalTransform}px)` : null
          }
          transition={
            stage == Stage.spinning && shouldAnimate
              ? "transform 9.5s cubic-bezier(.31,.9985,.31,.9985)"
              : null
          }
        >
          <Box whiteSpace="nowrap" pos="absolute" pt="4px">
            {allImgs}
          </Box>
        </Box>

        {/* Line */}
        <Box ref={lineContainerRef} pos="relative" height={HEIGHT + 21 + "px"}>
          <Box
            bg="gold"
            pos="absolute"
            left="calc(50% - 1px)"
            w="3px"
            height="100%"
            top="-5px"
          />
        </Box>
      </>
    );
  } else {
    return (
      <>
        <Flex width="full" justify="center">
          <Text color="gray">{t("You are")}</Text>
        </Flex>
        <Flex width="full" justify="center">
          <Heading>{t(name[0].toUpperCase() + name.slice(1))}</Heading>
        </Flex>
        <Flex width="full" justify="center">
          <Image src={"/" + filename} height="xl" />
        </Flex>
      </>
    );
  }
}
