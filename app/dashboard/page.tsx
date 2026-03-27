'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '@/lib/supabase-client'
import FeedbackList from '@/components/FeedbackList'

type Board = {
  id: string
  title: string
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [boards, setBoards] = useState<Board[]>([])
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // 🔐 AUTH CHECK
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabaseClient.auth.getUser()
      setUser(data.user)
    }

    getUser()
  }, [])

  // 🔐 LOGIN
  const signIn = async () => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error) alert(error.message)
    else window.location.reload()
  }

  // 🔐 SIGNUP
  const signUp = async () => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })

    if (error) alert(error.message)
    else alert('Check your email')
  }

  // 📦 FETCH BOARDS
  const fetchBoards = async () => {
    const res = await fetch('/api/boards', {
      credentials: 'include',
    })

    const data = await res.json()
    setBoards(data || [])

    if (data.length > 0 && !selectedBoardId) {
      setSelectedBoardId(data[0].id)
    }
  }

  useEffect(() => {
    if (user) fetchBoards()
  }, [user])

  // ➕ CREATE BOARD
  const createBoard = async () => {
    if (!title.trim()) return alert('Enter title')

    const res = await fetch('/api/boards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
      credentials: 'include',
    })

    const data = await res.json()

    if (data.error) {
      alert(data.error)
    } else {
      setTitle('')
      fetchBoards()
    }
  }

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/b/${id}`
    navigator.clipboard.writeText(url)
    alert('Link copied!')
  }

  // 🚫 NOT LOGGED IN → SHOW AUTH
  if (!user) {
    return (
      <div className="container">
        <h1>Login</h1>

        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div style={{ marginTop: 10 }}>
          <button onClick={signIn}>Sign In</button>
          <button onClick={signUp} style={{ marginLeft: 10 }}>
            Sign Up
          </button>
        </div>
      </div>
    )
  }

  // ✅ LOGGED IN UI
  return (
    <div className="container">
      <h1>Dashboard</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="New board title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={createBoard}>Create</button>
      </div>

      <h2>Your Boards</h2>

      {boards.map((board) => (
        <div
          key={board.id}
          className={`board-item ${
            selectedBoardId === board.id ? 'selected' : ''
          }`}
        >
          <span onClick={() => setSelectedBoardId(board.id)}>
            {board.title}
          </span>

          <button onClick={() => copyLink(board.id)}>
            Copy Link
          </button>
        </div>
      ))}

      <hr />

      {selectedBoardId && (
        <div>
          <h2>Feedback</h2>
          <FeedbackList boardId={selectedBoardId} />
        </div>
      )}
    </div>
  )
}