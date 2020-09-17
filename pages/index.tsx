import JoinCodeDialog from "components/JoinCodeDialog";
import Head from "next/head";
import PropTypes from "prop-types";
import { useState } from "react";
import { Link, withTranslation } from "../i18n";
import styles from "../styles/Home.module.css";

function Home({ t }: { t: (id: string) => string }) {
  const [joinShown, setJoinShown] = useState(false);
  return (
    <>
      <Head>
        <title>Murder Mystery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <body className={styles.night}>
        <main>
          <div className={styles.mainMenu}>
            <h1 className={styles.title}>{t("title")}</h1>
            <div>
              <button
                className={styles.menuBtn}
                onClick={() => setJoinShown(!joinShown)}
              >
                {t("join")}
              </button>
              <button className={styles.menuBtn}>{t("create")}</button>
            </div>
            {joinShown ? <JoinCodeDialog /> : null}
          </div>
        </main>
      </body>
    </>
  );
}

Home.getInitialProps = async () => ({
  namespacesRequired: ["common"],
});

Home.propTypes = {
  t: PropTypes.func.isRequired,
};

export default withTranslation("common")(Home);
