import styles from './PromoblockVova.module.css';

export default function PromoblockVova() {
  return (
    <div className={styles.promoWrapper}>
      <img
        src="/images/promo3.png" // Указан правильный путь к изображению
        alt="Человек думает"
        className={styles.promoImageOverlap}
      />
      <div className={styles.promoBlock}>
        <div className={styles.promoText}>Поставьте аквариум</div>
      </div>
    </div>
  );
}
