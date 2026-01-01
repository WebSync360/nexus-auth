import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Create a matcher for public routes
const isPublicRoute = createRouteMatcher([
  '/', 
  '/api/webhooks/clerk(.*)' // This allows Clerk to hit your webhook
]);

export default clerkMiddleware(async (auth, request) => {
  // 2. Only protect the route if it's NOT public
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};