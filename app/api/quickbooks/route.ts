import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { fetchQuickBooksTransactions } from '@/lib/integrations/quickbooks';

// Cloudflare Workers runtime
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    // Get Cloudflare environment from request
    const cfEnv = (request as any).env;
    
    // Fetch transactions with Cloudflare environment
    const transactions = await fetchQuickBooksTransactions(cfEnv);
    
    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching QuickBooks data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch QuickBooks data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'refresh_tokens') {
      // Force token refresh by clearing cache and fetching new data
      const cfEnv = (request as any).env;
      const transactions = await fetchQuickBooksTransactions(cfEnv);
      
      return NextResponse.json({
        success: true,
        message: 'Tokens refreshed successfully',
        data: transactions,
        count: transactions.length,
        timestamp: new Date().toISOString()
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
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
