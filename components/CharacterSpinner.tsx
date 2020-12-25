import { Box, Flex, Heading, Image, Text, useTimeout } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { S, STRINGS, Translator, useTranslator } from "lib/translate";
import { murdermystery as protobuf } from "pbjs/protobuf";
import {
  Children,
  FC,
  MutableRefObject,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import SkippableDelay, { RightFloatSkippableDelay } from "./SkippableDelay";

const { Character } = protobuf;

const MotionBox = motion.custom(Box);

// CHARACTER_INDEXES has protobuf character enum values in the same positions as the
//  corresponding value in the NAMES array
const CHARACTER_INDEXES = [
  Character.CITIZEN,
  Character.WEREWOLF,
  Character.HEALER,
  Character.PROPHET,
  Character.HUNTER,
];

const NAMES = ["citizen", "werewolf", "healer", "prophet", "hunter"];
const NAME_STRINGS = [S.CITIZEN, S.WEREWOLF, S.HEALER, S.PROPHET, S.HUNTER];
const WIDTH = 226;
const HEIGHT = 330;
const REPS = 10;

const getImgSrc = (name: STRINGS) =>
  `/${(typeof name === "string" ? name : STRINGS[name])
    .toString()
    .toLowerCase()}.webp`;

const getImgs = (t: Translator) => {
  // A single round of images
  let names: STRINGS[] = [];
  for (let round = 0; round < REPS; round += 1) {
    names = names.concat(NAME_STRINGS);
  }

  return Children.map(names, (name, i: number) => (
    <Box d="inline-block">
      <Image
        src={getImgSrc(name)}
        alt={t(NAME_STRINGS[i])}
        width={`${WIDTH}px`}
        height={`${HEIGHT}px`}
      />
    </Box>
  ));
};

/**
 * @description This method finds the amount of pixels to go left from the left side of
 *  the very first card image. It is designed to land very close to the edge of the
 *  card so it is more exciting, but will always land on specified card.
 * @param card_ind The index of the card in filenames which should be landed on
 */
const getTransformAmt = (cardInd: number) => {
  // always go at least across all cards 6 times, and account for spinner position
  const minDist = WIDTH * NAMES.length * 7;

  // A random px amount between 5 and 9 percent of card_width
  const rand = Math.random() * (WIDTH * 0.09) + WIDTH * 0.05;
  // Either at the beginning or end of the card
  const posInCard = Math.random() > 0.5 ? rand : WIDTH - rand;
  // The final amount to move
  return minDist + cardInd * WIDTH + posInCard;
};

const getSpinnerPos = (
  lineContainerRef: MutableRefObject<HTMLElement | null>
) =>
  lineContainerRef.current
    ? lineContainerRef.current.getBoundingClientRect().width / 2
    : 0;

export interface CharacterResultProps {
  name: STRINGS;
}

export const CharacterResult: FC<CharacterResultProps> = ({
  name,
}: CharacterResultProps) => {
  const t = useTranslator();

  return (
    <>
      <Flex width="full" justify="center">
        <Text color="gray">{t(S.YOU_ARE)}</Text>
      </Flex>
      <Flex width="full" justify="center">
        <Heading>{t(name)}</Heading>
      </Flex>
      <Flex width="full" justify="center">
        <Image src={getImgSrc(name)} height="xl" />
      </Flex>
    </>
  );
};

export interface CharacterDisplayProps {
  character: protobuf.Character;
}

export const CharacterDisplay: FC<CharacterDisplayProps> = ({
  character,
}: CharacterDisplayProps) => {
  const t = useTranslator();

  // get a list of JSX that is all images repeated REPS times
  const allImgs: ReactNode[] = getImgs(t);

  const cardInd = CHARACTER_INDEXES.indexOf(character);
  if (cardInd === -1) throw new Error(`Invalid character: ${character}`);

  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);

  // We will only be setting this once, but it depends on Math.random(), and it can't
  //  be different every render, so store it in state
  const transformAmtRef = useRef<number>(-1);
  if (transformAmtRef.current === -1) {
    transformAmtRef.current = getTransformAmt(cardInd);
  }
  const transformAmt = transformAmtRef.current;

  // The Box with the images. We need it to get the size of it
  const lineContainerRef = useRef<HTMLDivElement | null>(null);

  // Start spinning after 2s
  useTimeout(() => setIsSpinning(true), 2000);

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

  return (
    <>
      <style jsx global>
        {"body{overflow-x:hidden;}"}
      </style>
      <MotionBox
        animate={isSpinning ? { x: -finalTransform } : undefined}
        transition={
          isSpinning && shouldAnimate
            ? { duration: 9.5, ease: [0.31, 0.9985, 0.31, 0.9985] }
            : undefined
        }
      >
        <Box whiteSpace="nowrap" pos="absolute" pt="4px">
          {allImgs}
        </Box>
      </MotionBox>

      {/* Line */}
      <Box ref={lineContainerRef} pos="relative" height={`${HEIGHT + 21}px`}>
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
};

export interface CharacterSpinnerProps {
  character: protobuf.Character;
  onDone: () => void;
}

export const CharacterSpinner: FC<CharacterSpinnerProps> = ({
  character,
  onDone,
}: CharacterSpinnerProps) => {
  const cardInd = CHARACTER_INDEXES.indexOf(character);
  if (cardInd === -1) throw new Error(`Invalid character: ${character}`);
  const [spinDone, setSpinDone] = useState<boolean>(false);

  if (!spinDone) {
    return (
      <>
        <CharacterDisplay character={character} />
        <RightFloatSkippableDelay
          duration={11}
          onDone={() => setSpinDone(true)}
        />
      </>
    );
  }

  const name = NAME_STRINGS[cardInd];
  return (
    <>
      <CharacterResult name={name} />
      <Flex justifyContent="flex-end" mt="2">
        <SkippableDelay duration={3} onDone={onDone} />
      </Flex>
    </>
  );
};

export default CharacterSpinner;
