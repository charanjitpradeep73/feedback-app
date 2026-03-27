'use client'

import { use, useState } from 'react'

export default function PublicBoard({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: boardId } = use(params)

  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')

  const submitFeedback = async () => {
    if (!message.trim()) return

    setLoading(true)
    setStatus('')

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          board_id: boardId,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setStatus(data.error)
      } else {
        setMessage('')
        setStatus('✅ Feedback submitted')
      }
    } catch {
      setStatus('Something went wrong')
    }

    setLoading(false)
  }

  return (
    <div className="container">
      <h1>Leave Feedback</h1>

      <input
        placeholder="Your feedback..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button onClick={submitFeedback} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>

      {status && <p style={{ marginTop: 10 }}>{status}</p>}
    </div>
  )
}