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
} from "@chakra-ui/core";

const MenuBtn = ({ text, ...rest }: { text: string; [rest: string]: any }) => (
  <Button variantColor="blue" width="100%" {...rest}>
    {text}
  </Button>
);

export default function MainMenu({ t }: { t: (id: string) => string }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box>
        <Heading mb="6" minHeight="1em">
          <Text color="red.700">{t("Murder Mystery")}</Text>
        </Heading>
        <Stack>
          <MenuBtn text={t("Join Game")} onClick={() => onOpen()} />
          <MenuBtn text={t("Create Game")} isDisabled />
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
}
