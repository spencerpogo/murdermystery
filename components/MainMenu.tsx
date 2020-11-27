import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FC } from "react";

export interface MainMenuProps {
  t: (id: string) => string;
}

export const MainMenu: FC<MainMenuProps> = ({ t }: MainMenuProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Heading mb="6" minHeight="1em">
          <Text color="red.700">{t("Murder Mystery")}</Text>
        </Heading>
        <Stack>
          <Button colorScheme="blue" width="100%" onClick={() => onOpen()}>
            {t("Join Game")}
          </Button>
          <Button colorScheme="blue" width="100%" isDisabled>
            {t("Create Game")}
          </Button>
        </Stack>
      </Box>

      {/* Join Game Modal */}
      <Modal onClose={onClose} isOpen={isOpen} isCentered preserveScrollBarGap>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text>{t("Ask the host to send you their game link")}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainMenu;
