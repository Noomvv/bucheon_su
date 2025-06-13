'use client'

export default function StatsPanel({ ideasCount, totalLikes, rank }) {
  return (
    <div className="stats">
      <div className="statCard">
        <div className="statValue">{ideasCount}</div>
        <div className="statLabel">Предложено идей</div>
      </div>
      <div className="statCard">
        <div className="statValue">{totalLikes}</div>
        <div className="statLabel">Всего лайков</div>
      </div>
      <div className="statCard">
        <div className="statValue">{rank}</div>
        <div className="statLabel">Место в рейтинге</div>
      </div>
    </div>
  )
}
