import { Box } from "@chakra-ui/core";
import Layout from "components/Layout";
import MainMenu from "components/MainMenu";
import t from "../translate";

function Home() {
  return (
    <Layout>
      <Box as="body" bg="black">
        <main>
          <MainMenu t={t} />
        </main>
      </Box>
    </Layout>
  );
}

export default Home;
