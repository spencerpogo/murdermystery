import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
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
        <Heading>
          <Text color="red.700">{t("title")}</Text>
        </Heading>
        <Stack>
          <MenuBtn text={t("joinGame")} onClick={() => onOpen()} />
          <MenuBtn text={t("createGame")} />
        </Stack>
      </Box>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Text>TODO: Translate</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
