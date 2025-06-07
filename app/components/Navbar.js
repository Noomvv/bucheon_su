'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserGroupIcon,
  CalendarIcon,
  ChartBarIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.iconGrid}>
        <Link href="/Members" className={`${styles.iconButton} ${isActive('/Members') ? styles.active : ''}`}>
          <UserGroupIcon className={styles.icon} />
        </Link>
        <Link href="/Events" className={`${styles.iconButton} ${isActive('/Events') ? styles.active : ''}`}>
          <CalendarIcon className={styles.icon} />
        </Link>
        <Link href="/" className={`${styles.iconButton} ${isActive('/') ? styles.active : ''}`}>
          <HomeIcon className={styles.icon} />
        </Link>
        <Link href="/Polls" className={`${styles.iconButton} ${isActive('/Polls') ? styles.active : ''}`}>
          <ChartBarIcon className={styles.icon} />
        </Link>
        <Link href="/Ideas" className={`${styles.iconButton} ${isActive('/Ideas') ? styles.active : ''}`}>
          <LightBulbIcon className={styles.icon} />
        </Link>
      </div>
    </nav>
  );
}