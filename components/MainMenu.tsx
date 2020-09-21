import styles from "../styles/Home.module.css";

export default function MainMenu({ t }: { t: (id: string) => string }) {
  return (
    <div className={styles.mainMenu}>
      <h1 className={styles.title}>{t("title")}</h1>
      <div>
        <button className={styles.menuBtn}>{t("joinGame")}</button>
        <button className={styles.menuBtn}>{t("createGame")}</button>
      </div>
    </div>
  );
}
