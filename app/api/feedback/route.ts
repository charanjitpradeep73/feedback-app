import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
// GET (AUTH REQUIRED)
// =======================
export async function GET(req: Request) {
  try {
    const supabase = await getSupabase()

    // 🔥 FORCE AUTH
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json([], { status: 200 })
    }

    const { searchParams } = new URL(req.url)
    const board_id = searchParams.get('board_id')

    let query = supabase
      .from('feedback')
      .select('*')
      .order('created_at', { ascending: false })

    if (board_id) {
      query = query.eq('board_id', board_id)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to fetch' },
      { status: 500 }
    )
  }
}

// =======================
// POST (PUBLIC)
// =======================
export async function POST(req: Request) {
  try {
    const supabase = await getSupabase()

    const body = await req.json()
    const message = body?.message?.trim()
    const board_id = body?.board_id

    if (!message || !board_id) {
      return NextResponse.json(
        { error: 'Message and board_id required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('feedback')
      .insert([{ message, board_id }])

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

// =======================
// DELETE (OWNER ONLY)
// =======================
export async function DELETE(req: Request) {
  try {
    const supabase = await getSupabase()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id } = body

    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Delete failed' },
      { status: 500 }
    )
  }
}

// =======================
// PUT (OWNER ONLY)
// =======================
export async function PUT(req: Request) {
  try {
    const supabase = await getSupabase()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { id, message } = body

    const { error } = await supabase
      .from('feedback')
      .update({ message })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Update failed' },
      { status: 500 }
    )
  }
}