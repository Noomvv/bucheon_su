import ApplicationForm from "../components/ApplicationForm"
import PromoblockVova from "../components/PromoblockVova";
import styles from "./page.module.css";

export default function Ideas() {
  return (
    <div>
        <p className={styles.info}>Есть предложение, как сделать универ лучше? Заполняй форму — мы всё читаем и обсуждаем!</p>
        <ApplicationForm title="Идеи" description="Здесь можно предложить идею для нашего сообщества" />
        {/* <PromoblockVova /> */}
    </div>
  )
}