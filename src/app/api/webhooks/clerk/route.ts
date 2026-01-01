import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) throw new Error('Missing webhook secret')

  // 1. Verify the message (Security)
  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  const body = JSON.stringify(await req.json());
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Error occured', { status: 400 })
  }

  // 2. Handle the "User Created" event
  if (evt.type === 'user.created') {
    const { id, email_addresses, image_url, first_name, last_name } = evt.data;
    
    // Connect to Supabase
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

    // 3. Insert into your "profiles" table
    const { error } = await supabase.from('profiles').insert({
      id: id,
      email: email_addresses[0].email_address,
      full_name: `${first_name} ${last_name}`,
      avatar_url: image_url,
      role: 'coach' // Defaulting to coach for your current focus
    })

    if (error) console.log('Supabase Error:', error)
  }

  return new Response('', { status: 200 })
}