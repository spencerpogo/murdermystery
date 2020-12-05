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
import { STRINGS, useTranslator } from "lib/translate";
import { FC } from "react";

export interface MainMenuProps {}

export const MainMenu: FC<MainMenuProps> = () => {
  const t = useTranslator();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Heading mb="6" minHeight="1em">
          <Text color="red.700">{t(STRINGS.TITLE)}</Text>
        </Heading>
        <Stack>
          <Button colorScheme="blue" width="100%" onClick={() => onOpen()}>
            {t(STRINGS.JOIN_GAME)}
          </Button>
          <Button colorScheme="blue" width="100%" isDisabled>
            {t(STRINGS.CREATE_GAME)}
          </Button>
        </Stack>
      </Box>

      {/* Join Game Modal */}
      <Modal onClose={onClose} isOpen={isOpen} isCentered preserveScrollBarGap>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text>{t(STRINGS.NEED_GAME_LINK)}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MainMenu;
