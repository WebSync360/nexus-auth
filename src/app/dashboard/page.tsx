import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Image from 'next/image'

export default async function DashboardPage() {
  // 1. Get the current logged-in user from Clerk
  const user = await currentUser()

  // 2. If no user is logged in, send them to the sign-in page
  if (!user) {
    redirect('/sign-in')
  }

  // 3. Initialize Supabase using your Service Role Key
  // Note: We use the Service Role here to bypass RLS while we test
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 4. Fetch the specific profile for this user from the database
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Dashboard</h1>
        
        {error ? (
          <div className="bg-red-50 p-4 rounded-md text-red-700">
            Error fetching profile: {error.message}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
               {profile?.avatar_url && (
                    <div className="relative h-20 w-20"> 
                      <Image 
                        src={profile.avatar_url} 
                        alt="User Avatar" 
                        fill // Makes it fill the parent div
                        className="rounded-full border-2 border-indigo-500 object-cover"
                        priority // Tells Next.js to load this immediately (improves LCP)
                      />
                    </div>
                  )}
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome, {profile?.full_name || 'User'}!
                  </h2>
                  <p className="text-gray-500">{profile?.email}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                  Database Details (Synced from Clerk)
                </h3>
                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Supabase ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {profile?.id}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Sync Status</dt>
                    <dd className="mt-1 text-sm text-green-600 font-medium">
                      ● Active & Verified
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}