import { NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

const rateLimitMap = new Map<string, number>()

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

//
// ✅ GET — FETCH FEEDBACK
//
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const board_id = searchParams.get('board_id')

    if (!board_id) {
      return NextResponse.json([], { status: 200 })
    }

    const supabase = await getSupabase()

    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('board_id', board_id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    console.error(err)
    return NextResponse.json([], { status: 200 })
  }
}

//
// ✅ POST — INSERT FEEDBACK
//
export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'unknown'

    const now = Date.now()
    const last = rateLimitMap.get(ip) || 0

    if (now - last < 5000) {
      return NextResponse.json(
        { error: 'Too many requests. Slow down.' },
        { status: 429 }
      )
    }

    rateLimitMap.set(ip, now)

    const supabase = await getSupabase()

    const body = await req.json()
    const { message, board_id } = body

    if (!message || !board_id) {
      return NextResponse.json(
        { error: 'Message and board_id required' },
        { status: 400 }
      )
    }

    const { error } = await supabase.from('feedback').insert([
      {
        message,
        board_id,
      },
    ])

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Insert failed' }, { status: 500 })
  }
}