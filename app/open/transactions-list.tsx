'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { QuickBooksTransaction } from '@/lib/integrations/quickbooks';
import { formatCurrency, formatDate } from '@/lib/utils';

const INITIAL_DISPLAY_COUNT = 20;

interface TransactionsListProps {
  transactions: QuickBooksTransaction[];
}

function TransactionCard({ transaction }: { transaction: QuickBooksTransaction }) {
  const vendorName = transaction.customerName || transaction.vendorName || 'Unknown';
  const isPositive = transaction.amount >= 0;

  return (
    <Card className="sm:hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="text-sm font-medium">{formatDate(transaction.txnDate)}</div>
          <Badge
            variant={isPositive ? 'default' : 'secondary'}
            className={`text-xs ${isPositive ? '' : 'text-red-500 bg-red-50 border-red-200'}`}
          >
            {formatCurrency(transaction.amount)}
          </Badge>
        </div>
        <div className="space-y-1">
          <div className="text-sm font-medium">{vendorName}</div>
          {transaction.description && (
            <div className="text-xs text-muted-foreground line-clamp-2">
              {transaction.description}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function TransactionRow({ transaction }: { transaction: QuickBooksTransaction }) {
  const vendorName = transaction.customerName || transaction.vendorName || '-';
  const isPositive = transaction.amount >= 0;
  const transactionType = transaction.type;

  return (
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors group">
      <td className="px-6 py-4">
        <div className="text-sm font-medium">{formatDate(transaction.txnDate)}</div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 text-green-600 flex-shrink-0" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-red-500 flex-shrink-0" />
          )}
          <div>
            <div className="text-sm font-medium">{vendorName}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{transactionType}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-muted-foreground max-w-md">
          {transaction.description || '-'}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-2">
          <div
            className={`text-sm font-semibold ${
              isPositive
                ? 'text-green-600 dark:text-green-500'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {formatCurrency(transaction.amount)}
          </div>
        </div>
      </td>
    </tr>
  );
}

export function TransactionsList({ transactions }: TransactionsListProps) {
  const [showAll, setShowAll] = useState(false);
  const hasMore = transactions.length > INITIAL_DISPLAY_COUNT;
  const displayedTransactions = showAll
    ? transactions
    : transactions.slice(0, INITIAL_DISPLAY_COUNT);
  const remainingCount = transactions.length - INITIAL_DISPLAY_COUNT;

  return (
    <div className="space-y-4">
      {/* Mobile card layout */}
      <div className="grid gap-4 sm:hidden">
        {displayedTransactions.map((transaction) => (
          <TransactionCard
            key={`${transaction.type}-${transaction.id}`}
            transaction={transaction}
          />
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden sm:block rounded-lg border-2 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/30">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Vendor / Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayedTransactions.map((transaction) => (
                <TransactionRow
                  key={`${transaction.type}-${transaction.id}`}
                  transaction={transaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Show More/Less Button */}
      {hasMore && (
        <div className="flex justify-center pt-6 pb-6">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-2"
          >
            {showAll ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show {remainingCount} More
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
