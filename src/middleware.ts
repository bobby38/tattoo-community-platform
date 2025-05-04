import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will log all requests to help debug file access issues
export function middleware(request: NextRequest) {
  // Log the request path
  console.log(`[Middleware] Request path: ${request.nextUrl.pathname}`);

  // Special handling for uploads directory
  if (request.nextUrl.pathname.startsWith('/uploads/')) {
    console.log(`[Middleware] Handling upload file request: ${request.nextUrl.pathname}`);
    
    // Add CORS headers for upload files
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Cache-Control', 'public, max-age=86400');
    
    return response;
  }

  return NextResponse.next();
}

// Configure the middleware to run only for specific paths
export const config = {
  matcher: [
    '/uploads/:path*',
    '/studio-admin/:path*',
    '/gallery/:path*',
    '/api/upload/:path*',
    '/api/gallery/:path*',
  ],
};
