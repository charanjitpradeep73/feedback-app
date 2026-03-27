'use client'

import { useEffect, useState } from 'react'

export function useFeedback(boardId?: string) {
  const [feedback, setFeedback] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  // Fetch feedback (filtered by board)
  const fetchFeedback = async () => {
    if (!boardId) return

    const res = await fetch(`/api/feedback?board_id=${boardId}`)
    const data = await res.json()
    setFeedback(data)
  }

  // Add feedback
  const addFeedback = async (message: string) => {
    if (!boardId) {
      alert('Board not selected')
      return
    }

    setLoading(true)

    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        board_id: boardId, // ✅ REQUIRED
      }),
    })

    const data = await res.json()

    if (data.error) {
      alert(data.error)
    }

    setLoading(false)
    fetchFeedback()
  }

  // Delete feedback
  const deleteFeedback = async (id: string) => {
    await fetch('/api/feedback', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    fetchFeedback()
  }

  // Update feedback
  const updateFeedback = async (id: string, message: string) => {
    await fetch('/api/feedback', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, message }),
    })

    fetchFeedback()
  }

  useEffect(() => {
    fetchFeedback()
  }, [boardId])

  return {
    feedback,
    addFeedback,
    deleteFeedback,
    updateFeedback,
    loading,
  }
}