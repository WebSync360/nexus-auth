import { Button } from "@/components/ui/button"
import { UserButton, SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-center">
    <div className="fixed top-5 right-5">
  <SignedOut>
    <SignInButton mode="modal">
      <Button variant="outline">Sign In..</Button>
    </SignInButton>
  </SignedOut>
  <SignedIn>
    <UserButton afterSignOutUrl="/" />
  </SignedIn>
</div>
    </main>
  )
}