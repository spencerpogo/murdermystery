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
        <div class="mainMenu">
          <h1 class="title">Murder Mystery</h1>
          <div >
            <button class="menu-btn">Join Game</button>
            <button class="menu-btn">Create Game</button>
          <div>
        </div>
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
