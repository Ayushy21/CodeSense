import { clerkMiddleware } from "@clerk/nextjs/server";

// Let clerkMiddleware handle auth context setup only.
// Route protection is handled client-side and in API routes.
const handler = clerkMiddleware();

export { handler as proxy };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
