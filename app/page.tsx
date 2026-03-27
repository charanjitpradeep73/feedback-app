'use client'

import Auth from '@/components/Auth'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Auth />

      <h2>Go to Dashboard</h2>
      <Link href="/dashboard">Dashboard</Link>
    </div>
  )
}