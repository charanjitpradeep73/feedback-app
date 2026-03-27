'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="container">
      <h1>FeedbackBoard</h1>
      <p>Collect feedback from anyone using a simple link.</p>

      <Link href="/dashboard">
        <button>Go to Dashboard</button>
      </Link>
    </div>
  )
}