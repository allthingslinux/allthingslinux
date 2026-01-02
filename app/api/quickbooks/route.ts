import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { env } from '@/env';
import {
  fetchQuickBooksTransactions,
  type QuickBooksCloudflareEnv,
} from '@/lib/integrations/quickbooks';
import { getCloudflareContext } from '@opennextjs/cloudflare';

// Cloudflare Workers runtime - using nodejs for Buffer/crypto compatibility
export const runtime = 'nodejs';

/**
 * Helper to get Cloudflare env with KV access
 * Uses getCloudflareContext() which is the recommended way in OpenNext Cloudflare
 * Falls back gracefully if not available
 */
function getCloudflareEnv(): QuickBooksCloudflareEnv | undefined {
  try {
    const context = getCloudflareContext();
    if (context?.env?.KV_QUICKBOOKS) {
      return context.env as QuickBooksCloudflareEnv;
    }
  } catch {
    // getCloudflareContext() throws if not in a request context or during SSG
    // This is expected and fine - we'll fall back to environment variables
  }
  return undefined;
}

/**
 * GET /api/quickbooks
 *
 * Public endpoint that returns QuickBooks transaction data for transparency.
 * This is intentionally public to provide financial transparency for the organization.
 *
 * Data includes: transaction amounts, types, dates, and basic descriptions.
 * Sensitive details like full customer/vendor information are limited.
 */
export async function GET(request: NextRequest) {
  try {
    // Get Cloudflare environment
    // Uses getCloudflareContext() which is the recommended way in OpenNext Cloudflare
    const cfEnv = getCloudflareEnv();
    
    console.log('[QuickBooks API] Request received, KV namespace available:', !!cfEnv?.KV_QUICKBOOKS);

    // Fetch transactions with Cloudflare environment
    const transactions = await fetchQuickBooksTransactions(cfEnv);
    
    console.log('[QuickBooks API] Returning', transactions.length, 'transactions');

    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[QuickBooks API] ❌ Error fetching QuickBooks data:', error);
    console.error('[QuickBooks API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

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
        // Always include error in dev environment for debugging
        ...(env.NODE_ENV === 'development' && error instanceof Error
          ? { stack: error.stack }
          : {}),
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
export async function POST(request: NextRequest) {
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
      const cfEnv = getCloudflareEnv();
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
