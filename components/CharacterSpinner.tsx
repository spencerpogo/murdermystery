import { Box, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";
import t from "lib/translate";
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

const NAMES = ["Citizen", "Werewolf", "Healer", "Prophet", "Hunter"];
const WIDTH = 226;
const HEIGHT = 330;
const REPS = 10;

const getImgSrc = (name: string) => `/${name.toLowerCase()}.webp`;

const getImgs = () => {
  // A single round of images
  let names: string[] = [];
  for (let round = 0; round < REPS; round += 1) {
    names = names.concat(NAMES);
  }

  return Children.map(names, (name) => (
    <Box d="inline-block">
      <Image
        src={getImgSrc(name)}
        alt={t(name)}
        width={`${WIDTH}px`}
        height={`${HEIGHT}px`}
      />
    </Box>
  ));
};

// get a list of JSX that is all images repeated REPS times
const allImgs: ReactNode[] = getImgs();

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

// eslint-disable-next-line no-shadow
enum Stage {
  WAIT = 1,
  SPIN = 2,
  SHOW = 3,
}

export interface CharacterSpinnerProps {
  character: protobuf.Character;
  onFinish: () => void;
}

export const CharacterSpinner: FC<CharacterSpinnerProps> = ({
  character,
  onFinish,
}: CharacterSpinnerProps) => {
  const cardInd = CHARACTER_INDEXES.indexOf(character);
  if (cardInd === -1) throw new Error(`Invalid character: ${character}`);

  const name = NAMES[cardInd];

  const [stage, setStage] = useState<Stage>(Stage.WAIT);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);

  // We will only be setting this once, but it depends on Math.random(), and it can't
  //  be different every render, so store it in state
  const [transformAmt, setTransformAmt] = useState<number | null>(null);
  if (transformAmt == null) {
    setTransformAmt(getTransformAmt(cardInd));
  }

  // The Box with the images. We need it to get the size of it
  const lineContainerRef = useRef<HTMLDivElement | null>(null);

  // After 2s, start spinning, then 11s after that, switch to done
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    if (stage === Stage.WAIT) {
      timeoutId = setTimeout(() => {
        setStage(Stage.SPIN);
      }, 2000);
    } else if (stage === Stage.SPIN) {
      timeoutId = setTimeout(() => {
        setStage(Stage.SHOW);
      }, 11000);
    } else if (stage === Stage.SHOW) {
      timeoutId = setTimeout(() => {
        onFinish();
      }, 5000);
    }

    return () => clearTimeout(timeoutId);
  }, [stage, onFinish]);

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

  if (stage === Stage.WAIT || stage === Stage.SPIN) {
    return (
      <>
        <style jsx global>
          {"body{overflow-x: hidden;}"}
        </style>
        <MotionBox
          animate={stage === Stage.SPIN ? { x: -finalTransform } : undefined}
          transition={
            stage === Stage.SPIN && shouldAnimate
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
  }
  if (stage === Stage.SHOW) {
    return (
      <>
        <Flex width="full" justify="center">
          <Text color="gray">{t("You are")}</Text>
        </Flex>
        <Flex width="full" justify="center">
          <Heading>{t(name)}</Heading>
        </Flex>
        <Flex width="full" justify="center">
          <Image src={getImgSrc(name)} height="xl" />
        </Flex>
      </>
    );
  }
  // Should never happen
  return null;
};

export default CharacterSpinner;
