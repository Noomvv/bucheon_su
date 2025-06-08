import styles from './PromoblockVova.module.css';

export default function PromoblockVova() {
  return (
    <div className={styles.promoWrapper}>
      <img
        src=""
        alt="Человек думает"
        className={styles.promoImageOverlap}
      />
      <div className={styles.promoBlock}>
        <div className={styles.promoText}>Ты уже придумал что-то крутое?</div>
      </div>
    </div>
  );
}
