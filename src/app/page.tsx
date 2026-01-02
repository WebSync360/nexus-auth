import { Button } from "@/components/ui/button"
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
      {/* Sign In / User Button */}
      <div className="fixed top-5 right-5">
        <SignedOut>
          <SignInButton mode="modal">
            <Button variant="outline" className="text-white border-zinc-700 hover:bg-zinc-800">
              Sign In
            </Button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton showName />
        </SignedIn>
      </div>

      {/* Hero Section */}
      <h1 className="text-5xl font-extrabold text-white mb-6">
        Derian Website
      </h1>
      <p className="text-zinc-400 text-lg mb-8 max-w-md">
        Your SaaS foundation is ready. Database synced, Auth secured.
      </p>

      <SignedIn>
        <Link href="/dashboard">
          <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
            Go to Dashboard
          </Button>
        </Link>
      </SignedIn>
    </main>
  )
}