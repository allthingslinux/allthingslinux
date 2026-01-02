import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { formSubmissionRateLimit, apiRateLimit } from '@/lib/rate-limit';

export async function middleware(request: NextRequest) {
  // Set NEXT_PUBLIC_URL dynamically based on request host for environment detection
  // This allows prefixed secrets (DEV_*, PROD_*) to be selected correctly at runtime
  // With nodejs_compat_populate_process_env (enabled by default for compatibility_date >= 2025-04-01),
  // we can mutate process.env and it will be available to downstream code
  const host = request.headers.get('host') || '';
  const protocol =
    request.headers.get('x-forwarded-proto') ||
    (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = `${protocol}://${host}`;

  // Update process.env for runtime environment detection in env.ts
  // This works because nodejs_compat_populate_process_env is enabled (compatibility_date: 2026-01-02)
  // See: https://developers.cloudflare.com/workers/configuration/environment-variables/#environment-variables-and-nodejs-compatibility
  if (typeof process !== 'undefined' && process.env) {
    (process.env as any).NEXT_PUBLIC_URL = baseUrl;
    (process.env as any).NEXT_PUBLIC_API_URL = `${baseUrl}/api`;
  }

  // Debug middleware execution
  console.log(
    'Middleware running for path:',
    request.nextUrl.pathname,
    'Host:',
    host
  );

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

    if (
      request.nextUrl.pathname.includes('/forms/') &&
      request.method === 'POST'
    ) {
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
