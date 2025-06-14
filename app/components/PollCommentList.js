'use client'

import styles from './PollCommentList.module.css'

export default function PollCommentList({ comments }) {
  return (
    <div className={styles.commentsContainer}>
      {comments.map(c => (
        <div key={c.id} className={styles.comment}>
          <div className={styles.commentHeader}>
            <strong className={styles.userName}>
              {c.firstname || '—'} {c.lastname || ''}
            </strong>
            
            {/* {c.faculty && (
              <span className={styles.faculty}>
                ({c.faculty})
              </span>
            )} */}
          </div>

          <div className={styles.commentText}>
            {c.comment}
          </div>

          {/* <div className={styles.timestamp}>
            {new Date(c.created_at).toLocaleString()}
          </div> */}
        </div>
      ))}
    </div>
  )
}