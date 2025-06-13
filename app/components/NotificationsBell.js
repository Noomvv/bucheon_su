'use client'
import { useState } from 'react'

export default function NotificationsBell({ notifications }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="notificationsWrapper">
      <button
        className="bellButton"
        onClick={() => setOpen(o => !o)}
        aria-label="Уведомления"
      >
        🔔{notifications.length > 0 && ` (${notifications.length})`}
      </button>
      {open && (
        <div className="notificationsList">
          {notifications.length > 0 ? (
            notifications.map((n, i) => (
              <div key={i} className="notification">
                {n}
              </div>
            ))
          ) : (
            <div className="notification empty">
              У вас нет новых уведомлений.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
