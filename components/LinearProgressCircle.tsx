/* eslint-disable react/require-default-props */
import { chakra, keyframes } from "@chakra-ui/system";
import { FC } from "react";

export interface LinearProgressCircleProps {
  size: number;
  thickness?: number;
  color?: string;
  duration?: number;
}

const LinearProgressCircle: FC<LinearProgressCircleProps> = ({
  size,
  thickness = 4,
  color = "white",
  duration = 1,
}: LinearProgressCircleProps) => {
  const halfSize = size / 2;
  const radius = halfSize - thickness * 2;
  const circumference = Math.floor(radius * 2 * Math.PI);

  // to set a specific percent, use strokeDashOffset =
  // circumference - (percent / 100) * circumference
  const increase = keyframes({
    "0%": {
      strokeDashoffset: circumference,
    },
    "100%": {
      strokeDashoffset: 0,
    },
  });

  return (
    <chakra.svg width={`${size}px`} height={`${size}px`}>
      <chakra.circle
        fill="transparent"
        strokeWidth={thickness}
        stroke={color || "white"}
        r={radius}
        cx={halfSize}
        cy={halfSize}
        strokeDasharray={`${circumference} ${circumference}`}
        transform="rotate(-90deg)"
        transformOrigin="50% 50%"
        animation={`${increase} ${duration}s linear`}
      />
    </chakra.svg>
  );
};

export default LinearProgressCircle;
