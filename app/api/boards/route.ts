import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Create Supabase server client with auth cookies
async function getSupabase() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        },
      },
    }
  )
}

// =======================
// GET → Fetch user's boards
// =======================
export async function GET() {
  try {
    const supabase = await getSupabase()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    // If not logged in → return empty
    if (authError || !user) {
      return NextResponse.json([])
    }

    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch boards' },
      { status: 500 }
    )
  }
}

// =======================
// POST → Create board (AUTH REQUIRED)
// =======================
export async function POST(req: Request) {
  try {
    const supabase = await getSupabase()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const title = body?.title?.trim()

    if (!title) {
      return NextResponse.json(
        { error: 'Title required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('boards')
      .insert([
        {
          title,
          user_id: user.id, // ✅ critical for RLS
        },
      ])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Insert failed' },
      { status: 500 }
    )
  }
}