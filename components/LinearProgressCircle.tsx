/* eslint-disable react/require-default-props */
import { chakra } from "@chakra-ui/system";
import { motion } from "framer-motion";
import { FC } from "react";

const MotionCircle = motion.custom(chakra.circle);

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

  return (
    <chakra.svg width={size} height={size}>
      <MotionCircle
        fill="transparent"
        strokeWidth={thickness}
        stroke={color || "white"}
        r={radius}
        cx={halfSize}
        cy={halfSize}
        strokeDasharray={`${circumference} ${circumference}`}
        transform="rotate(-90deg)"
        transformOrigin="50% 50%"
        animate={{ strokeDashoffset: [circumference, 0] }}
        transition={{ duration }}
      />
    </chakra.svg>
  );
};

export default LinearProgressCircle;
