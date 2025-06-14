// app/components/PollCommentList.js
'use client'

export default function PollCommentList({ comments }) {
  return (
    <div style={{ marginTop: 8 }}>
      {comments.map(c => (
        <div key={c.id} style={{
          padding: '6px 0',
          borderBottom: '1px solid #eee'
        }}>
          <strong>
            {c.students.firstname} {c.students.lastname}
          </strong>
          : {c.comment}
        </div>
      ))}
    </div>
  )
}
