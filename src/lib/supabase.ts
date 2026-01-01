import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// 1. CLIENT-SIDE: Use this for fetching data in the browser (respects RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. SERVER-SIDE: The "Master Key" for Webhooks and Admin tasks
// This bypasses RLS—use ONLY in /api routes or Server Actions
export const getSupabaseAdmin = () => {
  if (!supabaseServiceKey) {
    throw new Error("DANGER: SUPABASE_SERVICE_ROLE_KEY is missing!")
  }
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}