import { FC } from "react";

import { Box, Skeleton } from "@chakra-ui/core";

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
