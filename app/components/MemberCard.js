import Image from 'next/image';
import styles from './MemberCard.module.css';

export default function StudentCard({ student }) {
  const getYearString = (year) => {
    if (year === 1) return '1 курс';
    if (year >= 2 && year <= 4) return `${year} курс`;
    return `${year} курсов`;
  };

  return (
    <div className={styles.card}>
      <div className={styles.photoContainer}>
        <Image
          src={student.photoUrl}
          alt={`${student.firstName} ${student.lastName}`}
          fill
          className="object-cover"
          sizes="56px"
        />
      </div>

      <div className={styles.infoContainer}>
        <h3 className={styles.name}>
          {student.lastName} {student.firstName}
        </h3>
        <p className={styles.faculty}>{student.faculty}</p>
        <div className={styles.details}>
          <span className={styles.yearBadge}>
            {getYearString(student.year)}
          </span>
          <a
            href={`https://t.me/${student.telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.telegramLink}
          >
            <svg className={styles.telegramIcon} viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.14-.26.26-.534.26l.213-3.053 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
            </svg>
            @{student.telegram}
          </a>
        </div>
      </div>
    </div>
  );
}