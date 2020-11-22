import Layout from "components/Layout";
import MainMenu from "components/MainMenu";
import t from "../lib/translate";

function Home() {
  return (
    <Layout>
      <main>
        <MainMenu t={t} />
      </main>
    </Layout>
  );
}

export default Home;
