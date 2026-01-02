import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define which routes REQUIRE a login (the Dashboard)
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // 2. If the user tries to go to the dashboard, make sure they are logged in
  if (isProtectedRoute(req)) {
    await auth.protect() // This will bounce them to login if they aren't authenticated
  }
});

export const config = {
  matcher: [
    // This complex "matcher" tells Next.js to run this middleware on all pages 
    // EXCEPT static files (images, css, etc.)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};