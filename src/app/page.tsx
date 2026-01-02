import { Button } from "@/components/ui/button"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"
import { ArrowRight, ShieldCheck, Zap, Database } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-indigo-500/30">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] [mask:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 lg:px-12">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="h-8 w-8 rounded bg-indigo-600 flex items-center justify-center">
            <Zap size={18} fill="white" />
          </div>
          NEXUS<span className="text-indigo-500">AUTH</span>
        </div>
        
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-zinc-400 hover:text-white transition-colors">
                Sign In
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20">
                Get Started
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="mr-4 text-sm font-medium text-zinc-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </nav>

      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-12 px-4 text-center">
        <div className="mb-8 flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium text-indigo-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
          </span>
          System Online: Auth-Sync Active
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl mb-6 text-white">
          The Foundation for your <br />
          <span className="bg-linear-to-r from-indigo-400 via-white to-indigo-400 bg-clip-text text-transparent">
            Next Great SaaS Idea
          </span>
        </h1>

        <p className="max-w-2xl text-lg text-zinc-400 mb-10 leading-relaxed">
          Production-grade architecture featuring <strong>Next.js 15</strong>, 
          secure <strong>Clerk Authentication</strong>, and automated 
          <strong> Supabase</strong> user provisioning via Svix webhooks.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <SignedIn>
            <Link href="/dashboard">
              <Button size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white gap-2 text-md">
                Enter Dashboard <ArrowRight size={18} />
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <Button size="lg" className="h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white gap-2 text-md">
                Start Building <ArrowRight size={18} />
              </Button>
            </SignInButton>
          </SignedOut>
          <Button size="lg" variant="outline" className="h-12 px-8 border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-300">
            View Source Code
          </Button>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full text-left">
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
            <ShieldCheck className="text-indigo-500 mb-4" size={28} />
            <h3 className="font-semibold text-lg mb-2 text-white">Secure by Default</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Enterprise-grade Clerk authentication with protected API routes and middleware layers.</p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
            <Database className="text-indigo-500 mb-4" size={28} />
            <h3 className="font-semibold text-lg mb-2 text-white">Database Sync</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Real-time PostgreSQL synchronization ensuring user data is always consistent and ready.</p>
          </div>
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm">
            <Zap className="text-indigo-500 mb-4" size={28} />
            <h3 className="font-semibold text-lg mb-2 text-white">Next.js 15 Ready</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Leveraging the latest App Router features, Server Components, and optimized performance.</p>
          </div>
        </div>
      </main>
      
      <footer className="relative z-10 py-12 text-center text-zinc-500 text-sm border-t border-zinc-900 mt-20">
          &copy; {new Date().getFullYear()} Nexus Auth Engine. Built for Scalability.
      </footer>
    </div>
  )
}