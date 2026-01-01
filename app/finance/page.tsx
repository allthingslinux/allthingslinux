import { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { getPageMetadata } from '../metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = getPageMetadata('finance');

// QuickBooks API types
interface QuickBooksTransaction {
  id: string;
  txnDate: string;
  amount: number;
  type: string;
  customerName?: string;
  vendorName?: string;
  description?: string;
  status: 'pending' | 'cleared' | 'reconciled';
}

async function getAccessToken(clientId: string, clientSecret: string, refreshToken: string): Promise<string | null> {
  try {
    const response = await fetch('https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      console.error('Token refresh failed:', await response.text());
      return null;
    }

    const tokens: any = await response.json();
    return tokens.access_token;
  } catch (error) {
    console.error('Error getting access token:', error);
    return null;
  }
}

async function fetchQuickBooksTransactions(): Promise<QuickBooksTransaction[]> {
  const clientId = process.env.QUICKBOOKS_CLIENT_ID;
  const clientSecret = process.env.QUICKBOOKS_CLIENT_SECRET;
  const refreshToken = process.env.QUICKBOOKS_REFRESH_TOKEN;
  const realmId = process.env.QUICKBOOKS_REALM_ID;


  if (!clientId || !clientSecret || !refreshToken || !realmId) {
    console.warn('QuickBooks credentials not configured - returning empty data');
    return [];
  }

  // Get access token
  const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);
  if (!accessToken) {
    console.error('Failed to get access token');
    return [];
  }

  const baseUrl = 'https://quickbooks.api.intuit.com';

  try {
    const transactions: QuickBooksTransaction[] = [];

    // Fetch Purchases (Expenses)
    const purchasesResponse = await fetch(
      `${baseUrl}/v3/company/${realmId}/query?query=SELECT * FROM Purchase MAXRESULTS 100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (purchasesResponse.ok) {
      const purchasesData: any = await purchasesResponse.json();
      const purchases = purchasesData?.QueryResponse?.Purchase || [];

      purchases.forEach((purchase: any) => {
        transactions.push({
          id: purchase.Id,
          txnDate: purchase.TxnDate,
          amount: -Math.abs(purchase.TotalAmt),
          type: 'Expense',
          vendorName: purchase.EntityRef?.name,
          description: purchase.PrivateNote || purchase.PaymentType || '',
          status: 'reconciled',
        });
      });
    }

    // Fetch Invoices
    const invoicesResponse = await fetch(
      `${baseUrl}/v3/company/${realmId}/query?query=SELECT * FROM Invoice MAXRESULTS 100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (invoicesResponse.ok) {
      const invoicesData: any = await invoicesResponse.json();
      const invoices = invoicesData?.QueryResponse?.Invoice || [];

      invoices.forEach((invoice: any) => {
        transactions.push({
          id: invoice.Id,
          txnDate: invoice.TxnDate,
          amount: invoice.TotalAmt,
          type: 'Invoice',
          customerName: invoice.CustomerRef?.name,
          description: invoice.PrivateNote || '',
          status: 'pending',
        });
      });
    }

    // Fetch Payments
    const paymentsResponse = await fetch(
      `${baseUrl}/v3/company/${realmId}/query?query=SELECT * FROM Payment MAXRESULTS 100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (paymentsResponse.ok) {
      const paymentsData: any = await paymentsResponse.json();
      const payments = paymentsData?.QueryResponse?.Payment || [];

      payments.forEach((payment: any) => {
        transactions.push({
          id: payment.Id,
          txnDate: payment.TxnDate,
          amount: payment.TotalAmt,
          type: 'Payment',
          customerName: payment.CustomerRef?.name,
          description: payment.PrivateNote || '',
          status: 'cleared',
        });
      });
    }

    // Fetch Deposits (Bank Deposits)
    const depositsResponse = await fetch(
      `${baseUrl}/v3/company/${realmId}/query?query=SELECT * FROM Deposit MAXRESULTS 100`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
        },
      }
    );

    if (depositsResponse.ok) {
      const depositsData: any = await depositsResponse.json();
      const deposits = depositsData?.QueryResponse?.Deposit || [];

      deposits.forEach((deposit: any) => {
        transactions.push({
          id: deposit.Id,
          txnDate: deposit.TxnDate,
          amount: deposit.TotalAmt,
          type: 'Deposit',
          customerName: deposit.PrivateNote || 'Bank Deposit',
          description: deposit.PrivateNote || '',
          status: 'cleared',
        });
      });
    }

    // Sort by date (newest first)
    transactions.sort((a, b) => new Date(b.txnDate).getTime() - new Date(a.txnDate).getTime());

    return transactions;
  } catch (error) {
    console.error('Error fetching QuickBooks transactions:', error);
    return [];
  }
}

function TransactionsTableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
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
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="px-4 py-3"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-4 py-3"><Skeleton className="h-4 w-48" /></td>
                  <td className="px-4 py-3 text-right"><Skeleton className="h-4 w-20 ml-auto" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

async function TransactionsTable() {
  const transactions = await fetchQuickBooksTransactions();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'cleared':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'reconciled':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No transactions found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border">
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
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm">
                    {formatDate(transaction.txnDate)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {transaction.customerName || transaction.vendorName || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {transaction.description || '-'}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    transaction.amount >= 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
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
            <div className="text-sm text-muted-foreground">Total Transactions</div>
            <div className="text-2xl font-bold">{transactions.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Income</div>
            <div className="text-2xl font-bold text-green-500">
              {formatCurrency(
                transactions
                  .filter(t => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Expenses</div>
            <div className="text-2xl font-bold text-red-500">
              {formatCurrency(
                Math.abs(transactions
                  .filter(t => t.amount < 0)
                  .reduce((sum, t) => sum + t.amount, 0))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
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
                <h1 className="text-4xl font-bold tracking-tight">All Things Linux Public Ledger</h1>
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
