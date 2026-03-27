'use client'

type Props = {
  message: string
  setMessage: (val: string) => void
  onSubmit: () => void
  loading: boolean
}

export default function FeedbackForm({
  message,
  setMessage,
  onSubmit,
  loading,
}: Props) {
  return (
    <div>
      <h1>Feedback</h1>

      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
        placeholder="Enter feedback"
      />

      <button onClick={onSubmit} disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </div>
  )
}