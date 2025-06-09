'use client';

import { useState } from 'react';
import styles from './ApplicationForm.module.css';

export default function ApplicationForm() {
  const [expanded, setExpanded] = useState(false); // Управляет состоянием кнопки и textarea
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Предотвращаем перезагрузку страницы
    if (!message.trim()) {
      
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      setMessage('');
      alert('Спасибо за вашу идею!');
    } catch {
      alert('Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={`${styles.textareaWrapper} ${expanded ? styles.expanded : ''}`}>
          {expanded && (
            <textarea
              name="message"
              placeholder="Эмм.. ну это самое. Не расслабляйтесь там"
              rows={4}
              className={styles.textarea}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          )}
        </div>
        <button
          type={expanded ? 'submit' : 'button'}
          className={styles.button}
          onClick={() => !expanded && setExpanded(true)} // Раскрывает textarea
          disabled={loading}
        >
          {loading ? 'Отправка...' : expanded ? 'Отправить' : 'Предложить идею'}
        </button>
      </form>
    </div>
  );
}