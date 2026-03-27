'use client'

import { useEffect, useState } from 'react'

type Feedback = {
  id: string
  message: string
  created_at: string
}

export default function FeedbackList({ boardId }: { boardId: string }) {
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)

  const fetchFeedback = async () => {
    try {
      const res = await fetch(`/api/feedback?board_id=${boardId}`, {
        credentials: 'include',
      })
      const data = await res.json()

      setFeedbackList(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error(err)
      setFeedbackList([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeedback()
    const interval = setInterval(fetchFeedback, 5000)
    return () => clearInterval(interval)
  }, [boardId])

  if (loading) return <p>Loading feedback...</p>

  if (feedbackList.length === 0) {
    return <p>No feedback yet. Share your link 🚀</p>
  }

  return (
    <div>
      {feedbackList.map((item) => (
        <div key={item.id} className="card">
          <p>{item.message}</p>
          <small>
            {new Date(item.created_at).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  )
}