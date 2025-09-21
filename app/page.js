'use client'

import { useState } from 'react'
import styles from './page.module.css'
import Alert from './components/Alert'
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
} from '@heroicons/react/24/outline'

export default function StudentCouncil() {
  const [openBlocks, setOpenBlocks] = useState({}) // Управление видимостью блоков

  const toggleBlock = (block) => {
    setOpenBlocks((prev) => ({
      ...prev,
      [block]: !prev[block], // Переключаем видимость блока
    }))
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* Новый блок с логотипом и названием */}
        

        <header className={styles.header}>
          <div className={styles.chairmanContainer}>
            <div className={styles.chairmanPhoto}>
              <img src='/member-img/default.jpeg' className={styles.photoIcon} alt="Chairman Photo" />
            </div>
            <p className={styles.chairman}>
              Президент совета: <br />
              Кустиков Руслан
            </p>
          </div>
        </header>

        <Alert>
          👋 Привет, первокурсники!
          Пока у нас нет базы с вашими данными, поэтому зарегистрироваться через систему не получится.
        </Alert>

        <div className={styles.content}>
          {/* Блок "Наша миссия" */}
          <div className={styles.block}>
            <h2
              className={styles.blockTitle}
              onClick={() => toggleBlock('mission')} // Переключаем видимость
            >
              <StarIcon className={styles.blockIcon} />
              Наша миссия
            </h2>
            <div
              className={`${styles.blockContent} ${
                openBlocks.mission ? styles.blockContentOpen : ''
              }`}
            >
              <p>
                Представляем интересы студентов, организуем мероприятия и воплощаем идеи в жизнь. Ваш голос, ваша активность, ваша платформа для изменений.
              </p>
            </div>
          </div>

          {/* Блок "Возможности" */}
          <div className={styles.block}>
            <h2
              className={styles.blockTitle}
              onClick={() => toggleBlock('opportunities')} // Переключаем видимость
            >
              <MagnifyingGlassIcon className={styles.blockIcon} />
              Что вы здесь найдёте?
            </h2>
            <div
              className={`${styles.blockContent} ${
                openBlocks.opportunities ? styles.blockContentOpen : ''
              }`}
            >
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
          </div>
        </div>
      </div>
    </div>
  )
}