import Head from "next/head";
import PropTypes from 'prop-types'
import { i18n, Link, withTranslation } from '../i18n'
import styles from "../styles/Home.module.css";

function Home({ t }) {
  return (
    <div>
      <Head>
        <title>Murder Mystery</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>{t("title")}</h1>
      </main>
    </div>
  );
}

Home.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

Home.propTypes = {
  t: PropTypes.func.isRequired,
}

export default withTranslation('common')(Home)
