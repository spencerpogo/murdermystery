import { Box, Skeleton } from "@chakra-ui/core";

export default function Loader() {
  return (
    <Box>
      <Skeleton height="20px" my="10px" />
      <Skeleton height="20px" my="10px" />
      <Skeleton height="20px" my="10px" />
    </Box>
  );
}
