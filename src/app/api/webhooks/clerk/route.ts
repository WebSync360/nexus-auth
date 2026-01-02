import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  // 1. Define bypass headers to stop ngrok from blocking the Clerk robot
  const bypassHeaders = {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  };

  // 2. Load Environment Variables
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY 

  // 3. Safety check: Ensure Supabase keys are loaded
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ ERROR: Supabase environment variables are missing in .env.local!")
    return new Response('Configuration Error', { status: 500, headers: bypassHeaders })
  }

  if (!WEBHOOK_SECRET) {
    console.error("❌ ERROR: Missing CLERK_WEBHOOK_SECRET")
    return new Response('Configuration Error', { status: 500, headers: bypassHeaders })
  }

  // 4. Get Svix headers for verification
  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { 
      status: 400, 
      headers: bypassHeaders 
    })
  }

  // 5. Verify the payload
  const payload = await req.json()
  const body = JSON.stringify(payload)
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('❌ Webhook verification failed:', err)
    return new Response('Verification Error', { 
      status: 400, 
      headers: bypassHeaders 
    })
  }

  // 6. Handle "User Created" Event
  if (evt.type === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;
    
    // Initialize Supabase with the Service Role Key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // FIXED: Added optional chaining and fallbacks to prevent "undefined" errors
    const { error } = await supabase.from('profiles').insert({
      id: id,
      email: email_addresses?.[0]?.email_address || "no-email@provided.com",
      full_name: `${first_name || ''} ${last_name || ''}`.trim() || "New User",
      avatar_url: image_url || "",
    })

    if (error) {
      console.log('❌ Supabase Insert Error:', error.message)
      return new Response('Database Error', { 
        status: 500, 
        headers: bypassHeaders 
      })
    }
    
    console.log('SUCCESS: User synced to Supabase!')
  }

  return new Response(JSON.stringify({ success: true }), { 
    status: 200, 
    headers: bypassHeaders 
  })
}