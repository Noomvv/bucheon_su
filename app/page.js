import styles from './page.module.css';
import {
  AcademicCapIcon,
  UserIcon,
  LightBulbIcon,
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  RocketLaunchIcon,
  MagnifyingGlassIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function StudentCouncil() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Новый блок с логотипом и названием */}
        <section className={styles.logoSection}>
          <div className={styles.logoContainer}>
            <img src='/images/default.webp' className={styles.logoIcon} alt="Logo" />
            <span className={styles.logoText}>BUT Eagles</span>
          </div>
          <p className={styles.logoDescription}>
            Нынешняя команда студенческого совета.
          </p>
        </section>

        <header className={styles.header}>
          <div className={styles.chairmanContainer}>
            <div className={styles.chairmanPhoto}>
              <img src='/member-img/kim_andrey.webp' className={styles.photoIcon} alt="Chairman Photo" />
            </div>
            <p className={styles.chairman}>
              Президент совета: <br />
              Ким Андрей
            </p>
          </div>
        </header>

        <div className={styles.content}>
          <div className={styles.block}>
            <h2 className={styles.blockTitle}>
              <StarIcon className={styles.blockIcon} />
              Наша миссия
            </h2>
            <p>
              Представляем интересы студентов, организуем мероприятия и воплощаем идеи в жизнь. Ваш голос, ваша активность, ваша платформа для изменений.
            </p>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockTitle}>
              <MagnifyingGlassIcon className={styles.blockIcon} />
              Возможности
            </h2>
            <ul className={styles.list}>
              <li>
                <CalendarIcon className={styles.listIcon} />
                <span>Актуальный календарь университетских событий</span>
              </li>
              <li>
                <LightBulbIcon className={styles.listIcon} />
                <span>Платформа для студенческих инициатив</span>
              </li>
              <li>
                <UserGroupIcon className={styles.listIcon} />
                <span>Знакомство с составом студсовета</span>
              </li>
            </ul>
          </div>

          <div className={styles.block}>
            <h2 className={styles.blockTitle}>
              <RocketLaunchIcon className={styles.blockIcon} />
              Стань частью команды!
            </h2>
            <p>
              Твои идеи могут изменить университет к лучшему. Студенческий совет - это площадка для твоей реализации.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}