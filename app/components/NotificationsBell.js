'use client'
import { useState } from 'react'
import { BellAlertIcon } from '@heroicons/react/24/outline'
import styles from './NotificationsBell.module.css'

export default function NotificationsBell({ notifications }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.notificationsWrapper}>
      <button
        className={styles.bellButton}
        onClick={() => setOpen(o => !o)}
        aria-label="Уведомления"
      >
        <BellAlertIcon className={styles.bellIcon} />
        {notifications.length > 0 && (
          <span className={styles.badge}>{notifications.length}</span>
        )}
      </button>
      {open && (
        <div className={styles.notificationsList}>
          {notifications.length > 0 ? (
            notifications.map((n, i) => (
              <div key={i} className={styles.notification}>
                {n}
              </div>
            ))
          ) : (
            <div className={`${styles.notification} ${styles.empty}`}>
              У вас нет новых уведомлений.
            </div>
          )}
        </div>
      )}
    </div>
  )
}