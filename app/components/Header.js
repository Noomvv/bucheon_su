'use client';

import { usePathname } from 'next/navigation';
import { FaUsers, FaCalendarAlt, FaHome, FaPoll, FaLightbulb } from 'react-icons/fa';
import styles from './Header.module.css';

const pageData = {
  '/': { title: 'Студенческий актив', icon: <FaHome /> },
  '/Members': { title: 'Участники', icon: <FaUsers /> },
  '/Events': { title: 'События', icon: <FaCalendarAlt /> },
  '/Polls': { title: 'Опросы', icon: <FaPoll /> },
  '/Ideas': { title: 'Идеи', icon: <FaLightbulb /> },
};

export default function Header() {
  const pathname = usePathname();
  const { title, icon } = pageData[pathname] || pageData['/'];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.titleWrapper}>
          <span className={styles.icon}>{icon}</span>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>
    </header>
  );
}