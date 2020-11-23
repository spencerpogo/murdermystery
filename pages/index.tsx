import Layout from "components/Layout";
import MainMenu from "components/MainMenu";
import { FC } from "react";
import t from "../lib/translate";

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <Layout>
      <main>
        <MainMenu t={t} />
      </main>
    </Layout>
  );
};

export default Home;
