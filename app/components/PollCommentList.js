// app/components/PollCommentList.js
'use client'

export default function PollCommentList({ comments }) {
  // Убедимся, что comments всегда массив
  const safeComments = comments || []

  return (
    <div style={{ marginTop: 8 }}>
      {safeComments.length > 0 ? (
        safeComments.map(c => (
          <div key={c.id} style={{
            padding: '6px 0',
            borderBottom: '1px solid #eee'
          }}>
            <strong>
              {c.students?.firstname || 'Имя'} {c.students?.lastname || 'Фамилия'}
            </strong>
            : {c.comment}
          </div>
        ))
      ) : (
        <p style={{ color: '#888' }}>Нет комментариев</p>
      )}
    </div>
  )
}
