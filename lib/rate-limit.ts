import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
const store: { [key: string]: { count: number; resetTime: number } } = {};

// Get client IP address
function getClientIP(req: NextRequest): string {
  const cfConnectingIP = req.headers.get('cf-connecting-ip');
  if (cfConnectingIP) return cfConnectingIP;

  const xForwardedFor = req.headers.get('x-forwarded-for');
  if (xForwardedFor) return xForwardedFor.split(',')[0].trim();

  return 'unknown';
}

// Simple rate limiter for form submissions: 1 per hour
export async function formSubmissionRateLimit(
  req: NextRequest
): Promise<NextResponse | null> {
  const ip = getClientIP(req);
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const resetTime = now + windowMs;

  // Clean up expired entries
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });

  // Check if IP exists and is within window
  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = { count: 1, resetTime };
    return null; // Allow request
  }

  // Block if already submitted within the last hour
  return NextResponse.json(
    {
      error:
        'You can only submit 1 application per hour. Please try again later.',
    },
    { status: 429 }
  );
}

// General API rate limiter: 100 requests per hour
export async function apiRateLimit(
  req: NextRequest
): Promise<NextResponse | null> {
  const ip = getClientIP(req);
  const now = Date.now();
  const windowMs = 60 * 60 * 1000; // 1 hour
  const maxRequests = 100;
  const resetTime = now + windowMs;

  // Clean up expired entries
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });

  // Check if IP exists and is within window
  if (!store[ip] || store[ip].resetTime < now) {
    store[ip] = { count: 1, resetTime };
    return null; // Allow request
  }

  // Increment count if within window
  if (store[ip].count < maxRequests) {
    store[ip].count++;
    return null; // Allow request
  }

  // Block if rate limit exceeded
  return NextResponse.json(
    { error: 'Rate limit exceeded. Please try again later.' },
    { status: 429 }
  );
}
