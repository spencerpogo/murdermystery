import { Box, Image } from "@chakra-ui/core";
import { ReactNode, useEffect, useState } from "react";

const filenames = [
  "citizen.png",
  "werewolf.png",
  "healer.png",
  "prophet.png",
  "hunter.png",
];
const WIDTH = 226;
const HEIGHT = 330;
const reps = 10;

const getImgs = (offset: number) =>
  filenames.map((f, i) => {
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
for (let i = 0; i < reps; i++) {
  let imgs = getImgs(offset);
  allImgs = allImgs.concat(imgs);
  offset += imgs.length;
}

enum Stage {
  waiting = 1,
  spinning = 2,
  done = 3,
}

export default function CharacterSpinner({ character }: { character: string }) {
  const [stage, setStage] = useState<Stage>(Stage.waiting);

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

  if (stage == Stage.waiting || stage == Stage.spinning) {
    return (
      <>
        <style jsx global>
          {"body{overflow-x: hidden;}"}
        </style>
        <Box
          transform={stage == Stage.spinning ? "translateX(-9500px)" : null}
          transition={
            stage == Stage.spinning
              ? "transform 9.5s cubic-bezier(.31,.9985,.31,.9985)"
              : null
          }
        >
          <Box whiteSpace="nowrap" pos="absolute" pt="4px">
            {allImgs}
          </Box>
        </Box>
        {/* Line */}
        <Box pos="relative" height={HEIGHT + 21 + "px"}>
          <Box
            pos="absolute"
            bg="gold"
            left="calc(50% - 1px)"
            w="3px"
            height="100%"
            top="-5px"
          />
        </Box>
      </>
    );
  } else {
    return <p>TODO</p>;
  }
}
