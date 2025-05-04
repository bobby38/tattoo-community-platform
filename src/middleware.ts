import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Old R2 domain to replace
const OLD_R2_DOMAIN = 'pub-7de639d71ac205cf86c59c89880753fa.r2.dev';
// Custom domain to use instead
const CUSTOM_DOMAIN = 'imagetat.getrezult.com';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Log all requests for debugging
  console.log('[Middleware] Request path:', request.nextUrl.pathname);

  // Special handling for API routes that might return R2 URLs
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Clone the request to pass through
    const response = NextResponse.next();
    
    // Add a header to indicate that responses should be processed
    response.headers.set('x-replace-r2-urls', 'true');
    
    return response;
  }
  
  // Special handling for uploads directory (local fallback storage)
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    console.log('[Middleware] Handling upload file request:', request.nextUrl.pathname);
    
    // Just pass through for now, but we could add caching headers here
    return NextResponse.next();
  }

  // For all other requests, just pass through
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    // Match all API routes
    '/api/:path*',
    // Match all upload routes
    '/uploads/:path*',
    '/studio-admin/:path*',
    '/gallery/:path*',
  ],
};
