'use client'

import { useState } from 'react'
import { supabaseClient } from '@/lib/supabase-client'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signUp = async () => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    })

    if (error) alert(error.message)
    else alert('Check your email')
  }

  const signIn = async () => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    })

    if (error) alert(error.message)
  }

  const signOut = async () => {
    await supabaseClient.auth.signOut()
    window.location.reload()
  }

  return (
    <div>
      <h2>Auth</h2>

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

      <button onClick={signUp}>Sign Up</button>
      <button onClick={signIn}>Sign In</button>
      <button onClick={signOut}>Logout</button>
    </div>
  )
}