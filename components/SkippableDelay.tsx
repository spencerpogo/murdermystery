import { Button, useTimeout } from "@chakra-ui/react";
import { FC } from "react";
import LinearProgressCircle from "./LinearProgressCircle";

export interface SkippableDelayProps {
  duration: number;
  onDone?: () => void;
  circleColor?: string;
}

const SkippableDelay: FC<SkippableDelayProps> = ({
  duration,
  onDone = () => undefined,
  circleColor = "gray.300",
}: SkippableDelayProps) => {
  useTimeout(() => {
    onDone();
    console.log("called");
  }, duration * 1000);

  return (
    <Button onClick={onDone}>
      <LinearProgressCircle duration={duration} size={40} color={circleColor} />
      <>{`Skip (${duration})`}</>
    </Button>
  );
};

export default SkippableDelay;
