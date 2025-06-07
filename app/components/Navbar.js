'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaUsers, FaCalendarAlt, FaHome, FaPoll, FaLightbulb } from 'react-icons/fa';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path ? styles.active : '';
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.btnGrid}>
        <Link href="/Members" className={`${styles.btn} ${isActive('/Members')}`}>
          <FaUsers />
          <span>Участники</span>
        </Link>
        <Link href="/Events" className={`${styles.btn} ${isActive('/Events')}`}>
          <FaCalendarAlt />
          <span>События</span>
        </Link>
        <Link href="/" className={`${styles.btn} ${isActive('/')}`}>
          <FaHome />
          <span>Главная</span>
        </Link>
        <Link href="/Polls" className={`${styles.btn} ${isActive('/polls')}`}>
          <FaPoll />
          <span>Опросы</span>
        </Link>
        <Link href="/Ideas" className={`${styles.btn} ${isActive('/ideas')}`}>
          <FaLightbulb />
          <span>Идеи</span>
        </Link>
      </div>
    </nav>
  );
}