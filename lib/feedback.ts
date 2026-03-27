import { getSupabaseServerClient } from './supabase-server'

// GET
export async function getAllFeedback() {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw new Error('Failed to fetch')

  return data
}

// CREATE
export async function createFeedback(message: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('feedback')
    .insert([{ message }]) // user_id auto from RLS

  if (error) throw new Error('Insert failed')
}

// DELETE
export async function deleteFeedback(id: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('feedback')
    .delete()
    .eq('id', id)

  if (error) throw new Error('Delete failed')
}

// UPDATE
export async function updateFeedback(id: string, message: string) {
  const supabase = getSupabaseServerClient()

  const { error } = await supabase
    .from('feedback')
    .update({ message })
    .eq('id', id)

  if (error) throw new Error('Update failed')
}