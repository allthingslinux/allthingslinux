import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getPageMetadata } from '../metadata';
import { formatCurrency } from '@/lib/utils';
import type { Metadata } from 'next';
import type { QuickBooksTransaction } from '@/lib/integrations/quickbooks';
import { fetchQuickBooksTransactions, getCloudflareEnv } from '@/lib/integrations/quickbooks';
import { TransactionsList } from './transactions-list';
import { MetricsSection } from './metrics-section';
import { UpdatesSection } from './updates-section';
import { ArrowRight, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = getPageMetadata('open');

// Explicitly set Node.js runtime for Buffer usage in dependencies
export const runtime = 'nodejs';

// Mark as dynamic since we fetch from API
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function HeroSection() {
  return (
    <div className="text-center space-y-6 mb-16">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
        A transparent organization since 2023
      </h1>
      <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
        As a 501(c)(3) non-profit, we practice radical transparency. Our finances, community growth, and project metrics are open for everyone to see.
      </p>
    </div>
  );
}

function TransactionsSkeleton() {
  return (
    <div className="space-y-4">
      {/* Mobile card layout skeleton */}
      <div className="grid gap-4 sm:hidden">
        {Array.from({ length: 5 }, (_, index) => (
          <Card key={`mobile-skeleton-${index}`}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop table skeleton */}
      <div className="hidden sm:block rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Vendor</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                <th className="px-4 py-3 text-right text-sm font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }, (_, index) => (
                <tr key={`desktop-skeleton-${index}`} className="border-b last:border-0">
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

interface TransactionStats {
  total: number;
  income: number;
  expenses: number;
}


function SummaryStats({ stats }: { stats: TransactionStats }) {
  const netAmount = stats.income - stats.expenses;
  const netIsPositive = netAmount >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-6 pt-6">
      <Card className="relative overflow-hidden border-2 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Transactions
            </div>
            <div className="p-2 rounded-lg bg-primary/10">
              <Receipt className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight">
            {stats.total.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            All-time record
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-2 border-green-500/20 bg-green-500/5 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Income
            </div>
            <div className="p-2 rounded-lg bg-green-500/20">
              <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-green-600 dark:text-green-500">
            {formatCurrency(stats.income)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Revenue received
          </div>
        </CardContent>
      </Card>

      <Card className="relative overflow-hidden border-2 border-red-500/20 bg-red-500/5 hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </div>
            <div className="p-2 rounded-lg bg-red-500/20">
              <TrendingDown className="h-5 w-5 text-red-500 dark:text-red-400" />
            </div>
          </div>
          <div className="text-3xl font-bold tracking-tight text-red-500 dark:text-red-400">
            {formatCurrency(stats.expenses)}
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            Costs incurred
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

async function TransactionsContent() {
  // Directly call the function instead of making HTTP request
  // This works better in Cloudflare Workers and avoids network issues
  // Works the same on both port 3000 (Next.js dev) and port 8787 (Wrangler dev)
  const cfEnv = await getCloudflareEnv();
  const transactions = await fetchQuickBooksTransactions(cfEnv);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16 px-4">
        <div className="text-muted-foreground text-lg mb-2">No transactions found</div>
        <div className="text-sm text-muted-foreground mb-4">
          This could mean:
        </div>
        <ul className="text-sm text-muted-foreground text-left max-w-md mx-auto space-y-2 mb-4">
          <li>• No transactions exist in QuickBooks</li>
          <li>• QuickBooks credentials need to be refreshed</li>
          <li>• Check server logs for authentication errors</li>
        </ul>
        <div className="text-xs text-muted-foreground">
          If you see "invalid_grant" errors in the logs, you may need to re-authenticate via the admin setup route.
        </div>
      </div>
    );
  }

  // Calculate summary stats
  const stats: TransactionStats = transactions.reduce(
    (acc, transaction) => {
      acc.total++;
      if (transaction.amount >= 0) {
        acc.income += transaction.amount;
      } else {
        acc.expenses += Math.abs(transaction.amount);
      }
      return acc;
    },
    { total: 0, income: 0, expenses: 0 } as TransactionStats
  );

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <SummaryStats stats={stats} />

      {/* Transactions List with expand/collapse */}
      <TransactionsList transactions={transactions} />
    </div>
  );
}

function TransactionsSection() {
  return (
    <Card className="border-2">
      <CardContent className="p-0">
        <Suspense fallback={<TransactionsSkeleton />}>
          <TransactionsContent />
        </Suspense>
      </CardContent>
    </Card>
  );
}

export default function OpenPage() {
  return (
    <div className="min-h-screen bg-background">
      <main className="w-full">
        <section className="py-12 sm:py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-7xl">
            {/* Hero Section */}
            <HeroSection />

            <div className="space-y-12">
              {/* Metrics Section */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">
                  Monthly metrics
                </h2>
                <Suspense
                  fallback={
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }, (_, i) => (
                        <Card key={i}>
                          <CardContent className="p-6">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-32" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  }
                >
                  <MetricsSection />
                </Suspense>
              </div>

              {/* Financial Section */}
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">
                  Financial transparency
                </h2>
                <TransactionsSection />
              </div>

              {/* Updates Section */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                      Community updates
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recent news and milestones from our community
                    </p>
                  </div>
                  <Link
                    href="/blog"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors self-start sm:self-auto"
                  >
                    View all
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <Suspense
                  fallback={
                    <div className="space-y-3">
                      {Array.from({ length: 3 }, (_, i) => (
                        <Card key={i}>
                          <CardContent className="p-4">
                            <Skeleton className="h-5 w-32 mb-2" />
                            <Skeleton className="h-4 w-full" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  }
                >
                  <UpdatesSection />
                </Suspense>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
