'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaUsers, 
  FaCalendarAlt, 
  FaHome, 
  FaPoll, 
  FaLightbulb 
} from 'react-icons/fa';
import styles from './Navbar.module.css';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.navbar}>
      <div className={styles.iconGrid}>
        <Link 
          href="/Members" 
          className={`${styles.iconButton} ${isActive('/Members') ? styles.active : ''}`}
          aria-label="Участники"
        >
          <FaUsers />
        </Link>
        <Link 
          href="/Events" 
          className={`${styles.iconButton} ${isActive('/Events') ? styles.active : ''}`}
          aria-label="События"
        >
          <FaCalendarAlt />
        </Link>
        <Link 
          href="/" 
          className={`${styles.iconButton} ${isActive('/') ? styles.active : ''}`}
          aria-label="Главная"
        >
          <FaHome />
        </Link>
        <Link 
          href="/Polls" 
          className={`${styles.iconButton} ${isActive('/Polls') ? styles.active : ''}`}
          aria-label="Опросы"
        >
          <FaPoll />
        </Link>
        <Link 
          href="/Ideas" 
          className={`${styles.iconButton} ${isActive('/Ideas') ? styles.active : ''}`}
          aria-label="Идеи"
        >
          <FaLightbulb />
        </Link>
      </div>
    </nav>
  );
}