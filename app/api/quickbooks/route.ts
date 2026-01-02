import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/env';
import {
  fetchQuickBooksTransactions,
  type QuickBooksCloudflareEnv,
} from '@/lib/integrations/quickbooks';

// Extend NextRequest to include Cloudflare environment
interface CloudflareNextRequest extends NextRequest {
  env?: QuickBooksCloudflareEnv;
}

// Cloudflare Workers runtime - using nodejs for Buffer/crypto compatibility
export const runtime = 'nodejs';

/**
 * GET /api/quickbooks
 *
 * Public endpoint that returns QuickBooks transaction data for transparency.
 * This is intentionally public to provide financial transparency for the organization.
 *
 * Data includes: transaction amounts, types, dates, and basic descriptions.
 * Sensitive details like full customer/vendor information are limited.
 */
export async function GET(request: CloudflareNextRequest) {
  try {
    // Get Cloudflare environment from request
    const cfEnv = request.env;

    // Fetch transactions with Cloudflare environment
    const transactions = await fetchQuickBooksTransactions(cfEnv);

    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching QuickBooks data:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch QuickBooks data',
        details:
          env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/quickbooks
 *
 * Administrative endpoint for token refresh operations.
 * Requires authentication to prevent abuse and unauthorized token operations.
 */
export async function POST(request: CloudflareNextRequest) {
  try {
    // Basic authentication check - require admin access
    const authHeader = request.headers.get('authorization');
    const adminKey = env.QUICKBOOKS_ADMIN_KEY;

    if (!adminKey || authHeader !== `Bearer ${adminKey}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - admin access required' },
        { status: 401 }
      );
    }

    const body: { action?: string } = await request.json();
    const { action } = body;

    if (action === 'refresh_tokens') {
      // Force token refresh by clearing cache and fetching new data
      const cfEnv = request.env;
      const transactions = await fetchQuickBooksTransactions(cfEnv);

      return NextResponse.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: transactions,
        count: transactions.length,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in QuickBooks API:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'API request failed',
        details:
          env.NODE_ENV === 'development'
            ? error instanceof Error
              ? error.message
              : 'Unknown error'
            : undefined,
      },
      { status: 500 }
    );
  }
}
