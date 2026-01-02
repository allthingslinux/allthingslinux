import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPageMetadata } from '../metadata';
import type { Metadata } from 'next';
import { env } from '@/env';
import { headers } from 'next/headers';
import type { QuickBooksTransaction } from '@/lib/integrations/quickbooks';

export const metadata: Metadata = getPageMetadata('finance');

// Explicitly set Node.js runtime for Buffer usage in dependencies
export const runtime = 'nodejs';

// Mark as dynamic since we fetch from API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * Format currency amount as USD
 */
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

/**
 * Format date string to readable format
 */
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function TransactionsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Vendor
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium">
                  Description
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, index) => {
                const rowId = `skeleton-row-${index}`;
                return (
                  <tr key={rowId} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-48" />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Skeleton className="h-4 w-20 ml-auto" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

async function TransactionsTable() {
  try {
    // Construct absolute URL for fetch (required in server components)
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol =
      headersList.get('x-forwarded-proto') ||
      headersList.get('x-forwarded-scheme') ||
      (host.includes('localhost') ? 'http' : 'https');
    const baseUrl = `${protocol}://${host}`;
    const apiUrl = `${baseUrl}/api/quickbooks`;

    // Fetch transactions via API route that has access to Cloudflare KV
    const response = await fetch(apiUrl, {
      cache: 'no-store', // Always fetch fresh data - prevents static generation
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(
        'Failed to fetch transactions:',
        response.status,
        response.statusText
      );
      return (
        <div className="text-center py-12 text-destructive">
          Failed to load transactions. Please try again later.
        </div>
      );
    }

    const data = (await response.json()) as {
      data?: QuickBooksTransaction[];
    };
    const transactions = data.data || [];

    if (transactions.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          No transactions found
        </div>
      );
    }

    // Render transactions table...

    return (
      <div className="space-y-4">
        <div className="rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Vendor
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction: QuickBooksTransaction) => (
                  <tr
                    key={`${transaction.type}-${transaction.id}`}
                    className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      {formatDate(transaction.txnDate)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {transaction.customerName ||
                        transaction.vendorName ||
                        '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {transaction.description || '-'}
                    </td>
                    <td
                      className={`px-4 py-3 text-sm text-right font-medium ${
                        transaction.amount >= 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">
                Total Transactions
              </div>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">Total Income</div>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(
                  transactions
                    .filter((t: QuickBooksTransaction) => t.amount > 0)
                    .reduce(
                      (sum: number, t: QuickBooksTransaction) => sum + t.amount,
                      0
                    )
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-muted-foreground">
                Total Expenses
              </div>
              <div className="text-2xl font-bold text-red-500">
                {formatCurrency(
                  Math.abs(
                    transactions
                      .filter((t: QuickBooksTransaction) => t.amount < 0)
                      .reduce(
                        (sum: number, t: QuickBooksTransaction) =>
                          sum + t.amount,
                        0
                      )
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return (
      <div className="text-center py-12 text-destructive">
        An error occurred while loading transactions.
      </div>
    );
  }
}

export default function FinancePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="w-full">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="space-y-8">
              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                  All Things Linux Public Ledger
                </h1>
              </div>

              {/* Transactions Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<TransactionsTableSkeleton />}>
                    <TransactionsTable />
                  </Suspense>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
