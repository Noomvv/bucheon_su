'use client';

import { useState } from 'react';
import styles from './ApplicationForm.module.css';

export default function ApplicationForm() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, faculty, message } = e.target.elements;
    const payload = { name: name.value, faculty: faculty.value, message: message.value };

    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      e.target.reset();
      setShowModal(true);
    } catch {
      alert('Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          name="name"
          type="text"
          placeholder="Ваше имя"
          required
          className={styles.input}
        />
        <select name="faculty" required className={styles.input}>
          <option value="" disabled>
            Выберите факультет
          </option>
          <option value="IT">IT</option>
          <option value="Мультимедиа и игровой контент">Мультимедиа и игровой контент</option>
            <option value="Электронный бизнес">Электронный бизнес</option>
            <option value="Эстетика красоты">Эстетика красоты</option>
            <option value="Менеджмент">Менеджмент</option>
            <option value="Дошкольное образование">Дошкольное образование</option>
            <option value="Архитектура">Архитектура</option>
            <option value="Диетология и нутрициология">Диетология и нутрициология</option>
          {/* ... */}
        </select>
        <textarea
          name="message"
          placeholder="Ваша идея..."
          rows={4}
          className={styles.textarea}
        />
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? 'Отправка...' : 'Отправить'}
        </button>
      </form>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>Спасибо за вашу идею!</p>
            <button onClick={() => setShowModal(false)} className={styles.closeButton}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
}