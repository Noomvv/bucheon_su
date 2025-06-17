'use client';
import styles from './page.module.css';

export default function Events() {
  return (
    <div>
        <div className={styles.calendar}>
            <iframe
            src="https://calendar.google.com/calendar/embed?height=400&wkst=2&ctz=Asia%2FSamarkand&showTz=0&showCalendars=0&showPrint=0&src=YnV0Lml0LnN0dWRlbnRAZ21haWwuY29t&src=cnUudXoub2ZmaWNpYWwjaG9saWRheUBncm91cC52LmNhbGVuZGFyLmdvb2dsZS5jb20&color=%23039BE5&color=%230B8043"
            style={{ borderWidth: 0 }}
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            ></iframe>
        </div>


        <div className={styles.promoWrapper}>
            <img
            src="/images/promo4.png" // Указан правильный путь к изображению
            alt="Человек думает"
            className={styles.promoImageOverlap}/>
            <div className={styles.promoBlock}>
                <div className={styles.promoText}>Это календарь всех ключевых событий нашего университета. Просто и понятно.</div>
            </div>
        </div>
    </div>
  );
}