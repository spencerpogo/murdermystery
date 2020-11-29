import Layout from "components/Layout";
import MainMenu from "components/MainMenu";
import { FC } from "react";

interface HomeProps {}

const Home: FC<HomeProps> = () => {
  return (
    <Layout>
      <main>
        <MainMenu />
      </main>
    </Layout>
  );
};

export default Home;
