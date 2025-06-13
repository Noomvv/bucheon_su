'use client'

import styles from './Information.module.css'

export default function Information() {
    return (
        <div className={styles.outerContainer}>
            <div className={styles.messageContainer}>
                <p className={styles.messageText}>
                    Есть предложение, как сделать универ лучше? Заполняй форму — мы всё читаем и обсуждаем.
                </p>
            </div>
        </div>
    )
}