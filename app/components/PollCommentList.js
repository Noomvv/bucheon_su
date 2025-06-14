'use client'

export default function PollCommentList({ comments }) {
  return (
    <div style={{ marginTop: 16 }}>
      {comments.map(c => (
        <div key={c.id} style={{
          padding: '8px 0',
          borderBottom: '1px solid #eee'
        }}>
          <strong>
            {c.firstname || '—'} {c.lastname || ''}
          </strong>
          {' '}({c.faculty || '—'})
          <div style={{ marginTop: 4 }}>
            {c.comment}
          </div>
          <small style={{ color: '#666' }}>
            {new Date(c.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  )
}
