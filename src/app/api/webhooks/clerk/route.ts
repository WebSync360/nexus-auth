import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) throw new Error('Missing webhook secret')

  // 1. Verify the message (Updated for Next.js 16)
  const headerPayload = await headers(); // Added await
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 })
  }

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
    console.error('Webhook verification failed:', err) // Now 'err' is used!
    return new Response('Error occured', { status: 400 })
  }

  // 2. Handle the "User Created" event
  if (evt.type === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;
    
    // Connect to Supabase
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!, 
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 3. Insert into "profiles" (Tailored to your Screenshot)
    const { error } = await supabase.from('profiles').insert({
      id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name || ''} ${last_name || ''}`.trim(),
      avatar_url: image_url,
      // Removed 'role' because it is not in your screenshot table
    })

    if (error) {
        console.log('Supabase Error:', error.message)
        return new Response('Database Error', { status: 500 })
    }
    
    console.log('User synced to Supabase successfully!')
  }

  return new Response('Success', { status: 200 })
}