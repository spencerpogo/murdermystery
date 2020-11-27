import { Box, Skeleton } from "@chakra-ui/react";
import { FC } from "react";

interface LoaderProps {}

export const Loader: FC<LoaderProps> = () => {
  return (
    <Box>
      <Skeleton height="20px" my="10px" />
      <Skeleton height="20px" my="10px" />
      <Skeleton height="20px" my="10px" />
    </Box>
  );
};

export default Loader;
