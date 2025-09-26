// app/components/IdeaList.js
'use client'

import { useState } from 'react'
import { useIdeas, useCategories } from '../hooks/useIdeas'
import IdeaVoting from './IdeaVoting'
import styles from './IdeaList.module.css'

export default function IdeaList() {
  const [page, setPage] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const { data: ideas = [], isLoading, error } = useIdeas({
    categoryFilter: ['asc', 'desc'].includes(categoryFilter) ? '' : categoryFilter,
    searchTerm,
    page
  })

  const { data: categories = [] } = useCategories()

  const handleFilterChange = (value) => {
    setCategoryFilter(value)
    setPage(1)
  }

  const handleSearchChange = (value) => {
    setSearchTerm(value)
    setPage(1)
  }

  if (error) {
    return (
      <div className={styles.emptyState}>
        Ошибка загрузки идей: {error.message}
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Поиск по тексту..."
          value={searchTerm}
          onChange={e => handleSearchChange(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={categoryFilter}
          onChange={e => handleFilterChange(e.target.value)}
          className={styles.select}
        >
          <option value="">Все категории</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
          <option value="asc">По возрастанию лайков</option>
          <option value="desc">По убыванию лайков</option>
        </select>
      </div>

      {isLoading && (
        <div className={styles.listContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonTitle}></div>
              <div className={styles.skeletonMeta}></div>
              <div className={styles.skeletonButtons}></div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && ideas.length === 0 && (
        <div className={styles.emptyState}>
          {searchTerm || categoryFilter 
            ? "Идей по вашему запросу не найдено" 
            : "Пока нет ни одной идеи. Будьте первым!"}
        </div>
      )}

      {!isLoading && ideas.map(idea => (
        <div key={idea.id} className={styles.card}>
          <p className={styles.content}>{idea.content}</p>
          <p className={styles.metaText}>
            Категория: {idea.category || 'Без категории'}<br />
            Автор: {idea.students?.firstname} {idea.students?.lastname}, {idea.students?.faculty}
          </p>
          <IdeaVoting ideaId={idea.id} />
        </div>
      ))}

      <div className={styles.pagination}>
        <button
          className={styles.paginationButton}
          disabled={page === 1 || isLoading}
          onClick={() => setPage(p => Math.max(p - 1, 1))}
        >
          ← Назад
        </button>
        <span className={styles.pageInfo}>Страница {page}</span>
        <button
          className={styles.paginationButton}
          disabled={ideas.length < 10 || isLoading}
          onClick={() => setPage(p => p + 1)}
        >
          Вперед →
        </button>
      </div>
    </div>
  )
}