'use client';

import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import styles from './Header.module.css';

const pageData = {
  '/': { title: 'Студенческий совет', icon: <HomeIcon className={styles.icon} /> },
  '/Personal': { title: 'Личный кабинет', icon: <UserIcon className={styles.icon} /> },
  '/Events': { title: 'События', icon: <CalendarIcon className={styles.icon} /> },
  '/Polls': { title: 'Опросы', icon: <ChartBarIcon className={styles.icon} /> },
  '/Ideas': { title: 'Ваши предложения', icon: <LightBulbIcon className={styles.icon} /> },
  '/Members': { title: 'Состав совета', icon: <UserGroupIcon className={styles.icon} /> },
  '/Volunteering': { title: 'Волонтерство', icon: <UserGroupIcon className={styles.icon} /> },
};

export default function Header() {
  const pathname = usePathname();
  const { title, icon } = pageData[pathname] || pageData['/'];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <span className={styles.iconWrapper}>{icon}</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </header>
  );
}