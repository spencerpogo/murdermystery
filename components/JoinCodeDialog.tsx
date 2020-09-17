import styles from "../styles/Home.module.css";

export default function JoinCodeDialog({ text }: { text: string }) {
  return (
    <>
      <input type="text"></input>
      <button className={styles.menuBtn}>{text}</button>
    </>
  );
}
