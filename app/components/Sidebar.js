'use client';

import { useState } from 'react';
import styles from './Sidebar.module.css';

export default function Sidebar({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <div className={`${styles.pageContent} ${menuOpen ? styles.pageContentBlur : ''}`}>
        {children} {/* Оборачиваем весь контент страницы */}
      </div>
      <button className={styles.menuButton} onClick={toggleMenu}>
        ☰
      </button>
      <div className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <nav className={styles.sidebarNav}>
          <a href="/Members" className={styles.sidebarLink}>Состав совета</a>
          <a href="/Documents" className={styles.sidebarLink}>Положение</a>
        </nav>
      </div>
    </>
  );
}