import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { formSubmissionRateLimit, apiRateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  // Debug middleware execution
  console.log('Middleware running for path:', request.nextUrl.pathname);

  // Only apply to /api routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log(
      'Middleware running for API request:',
      request.nextUrl.pathname
    );

    // Handle OPTIONS requests (preflight)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers':
            'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Apply rate limiting based on the endpoint
    let rateLimitResponse = null;
    
    if (request.nextUrl.pathname.includes('/forms/') && request.method === 'POST') {
      // Apply stricter rate limiting for form submissions
      rateLimitResponse = await formSubmissionRateLimit(request);
    } else {
      // Apply general API rate limiting
      rateLimitResponse = await apiRateLimit(request);
    }

    // If rate limit exceeded, return the rate limit response
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Get response with CORS headers
    const response = NextResponse.next();

    // Add CORS headers to all API responses
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,DELETE,OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    return response;
  }
}

export const config = {
  matcher: '/api/:path*',
};
