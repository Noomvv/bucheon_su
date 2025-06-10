'use client'
export default function ProfileCard({ firstName, lastName }) {
  return (
    <div style={{
      padding: 20, border: '1px solid #ddd', borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)', textAlign: 'center'
    }}>
      <h2 style={{ margin: '0 0 12px' }}>Добро пожаловать,</h2>
      <p style={{ fontSize: '1.5rem', margin: 0 }}>
        {firstName} {lastName}
      </p>
    </div>
  )
}
