import { currentUser } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { UserButton } from "@clerk/nextjs"
import { 
  LayoutDashboard, 
  Settings, 
  Database, 
  ShieldCheck, 
  Activity, 
  Bell,
  Search,
  ArrowRight
} from "lucide-react"

export default async function DashboardPage() {
  const user = await currentUser()
  if (!user) redirect('/sign-in')

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 mb-4"></div>
        <p>Synchronizing your secure profile...</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans">
      <aside className="w-64 border-r border-zinc-900 bg-zinc-950 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center">
              <span className="text-xs text-white">N</span>
            </div>
            NEXUS
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          {[
            { icon: LayoutDashboard, label: 'Overview', active: true },
            { icon: Activity, label: 'Analytics', active: false },
            { icon: Database, label: 'Database', active: false },
            { icon: ShieldCheck, label: 'Security', active: false },
            { icon: Settings, label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                item.active ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-zinc-900">
          <div className="bg-indigo-600/10 p-4 rounded-xl border border-indigo-500/20">
            <p className="text-xs font-semibold text-indigo-400 mb-1">SYSTEM STATUS</p>
            <p className="text-[11px] text-indigo-300/70">All nodes operational. Auth-sync latency: 12ms.</p>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-zinc-900/50 px-4 py-1.5 rounded-full border border-zinc-800">
            <Search size={16} className="text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search resources..." 
              className="bg-transparent border-none text-sm focus:outline-none w-48 text-zinc-300"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-zinc-400 hover:text-white transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 h-2 w-2 bg-indigo-500 rounded-full border border-zinc-950"></span>
            </button>
            <div className="h-8 w-px bg-zinc-800"></div>
            <UserButton afterSignOutUrl="/" showName appearance={{
              elements: {
                userButtonAvatarBox: "h-8 w-8",
                userButtonOuterIdentifier: "text-zinc-300 font-medium"
              }
            }} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {profile?.full_name?.split(' ')[0] || 'Engineer'}
              </h1>
              <p className="text-zinc-500 italic">&quot;The best way to predict the future is to invent it.&quot;</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500">
                    <Database size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Connected</span>
                </div>
                <p className="text-zinc-500 text-sm">PostgreSQL Instance</p>
                <p className="text-2xl font-bold text-white mt-1 uppercase tracking-tight">Supabase DB</p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500">
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <p className="text-zinc-500 text-sm">Webhook Identity</p>
                <p className="text-2xl font-bold text-white mt-1">Svix Verified</p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                    <Activity size={20} />
                  </div>
                </div>
                <p className="text-zinc-500 text-sm">Last Auth Pulse</p>
                <p className="text-2xl font-bold text-white mt-1 uppercase">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <section className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
                  <div className="h-32 bg-linear-to-r from-indigo-900 to-indigo-600 opacity-50"></div>
                  <div className="px-8 pb-8">
                    <div className="relative -top-12 flex items-end justify-between">
                      <div className="relative h-24 w-24 rounded-3xl border-4 border-zinc-900 overflow-hidden bg-zinc-800 shadow-2xl">
                        {profile?.avatar_url ? (
                          <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-zinc-500">U</div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div>
                        <h3 className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.2em] mb-4">Identity Metadata</h3>
                        <div className="space-y-6">
                          <div>
                            <p className="text-[11px] text-zinc-500 mb-1 font-semibold uppercase">Legal Name</p>
                            <p className="text-white text-lg">{profile?.full_name}</p>
                          </div>
                          <div>
                            <p className="text-[11px] text-zinc-500 mb-1 font-semibold uppercase">Primary Email</p>
                            <p className="text-white text-lg">{profile?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 bg-zinc-950/50 rounded-2xl border border-zinc-800">
                        <h3 className="text-xs font-bold text-zinc-400 mb-4 flex items-center gap-2">
                          <Database size={14} className="text-indigo-500" /> SYSTEM UNIQUE ID
                        </h3>
                        <p className="text-[12px] font-mono text-indigo-300 break-all leading-relaxed bg-indigo-500/5 p-3 rounded-lg border border-indigo-500/10">
                          {profile?.id}
                        </p>
                        <p className="mt-4 text-[10px] text-zinc-600 italic">
                          This ID is synchronized across Clerk and your PostgreSQL instance.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="space-y-6">
                <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
                  <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    Quick Access
                  </h3>
                  <div className="space-y-2">
                    {[
                      'Documentation',
                      'API Reference',
                      'Security Logs'
                    ].map((btn) => (
                      <button key={btn} className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-indigo-500 transition-all group">
                        <span className="text-sm text-zinc-500 group-hover:text-zinc-200">{btn}</span>
                        <ArrowRight size={14} className="text-zinc-700 group-hover:text-indigo-500 transition-colors" />
                      </button>
                    ))}
                  </div>
                </section>

                <div className="p-6 bg-indigo-600 rounded-3xl text-white relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={120} />
                  </div>
                  <h3 className="font-bold mb-1 relative z-10 text-lg">Infrastructure Verified</h3>
                  <p className="text-xs text-indigo-100/80 relative z-10 leading-relaxed">
                    This profile is secured using Clerk&#39;s production-tier middleware.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}