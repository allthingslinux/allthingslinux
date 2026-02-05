'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Info } from 'lucide-react';

export function FinancialSupportDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="ml-auto">
          <Info className="h-4 w-4 mr-1" />
          Learn More
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>About Financial Support</DialogTitle>
          <DialogDescription>
            Your donations directly support our mission to build and maintain
            the most welcoming Linux community. All donations are tax-deductible
            as we are a registered 501(c)(3) non-profit organization.
            <br /> <br />
            Below is a breakdown of the fees that we are charged on your
            donations. These are included in the total amount you donate, so you
            don't have to worry about any additional fees.
            <br /> <br />
            In general Open Collective is the best platform to donate on, it has
            the most donation options and charges the lowest fees (via Stripe
            with no platform fee), however for Amex cards PayPal has lower fees.
            For Crypto donations, Stripe has the lowest fees but every.org
            provides more currency options.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <h4 className="font-semibold text-foreground">Payment Methods:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>
                <strong>Stripe:</strong> 2.2% + $0.30, +1% for non-US, +1.3% for
                Amex
              </li>
              <li>
                <strong>Open Collective:</strong> Stripe Fees
              </li>
              <li>
                <strong>PayPal:</strong> 2.2% + $0.30, +1.5% for non-US
              </li>

              <li>
                <strong>Every.org:</strong> Stripe Fees + 1% platform fee
              </li>
              <li>
                <strong>Cash App:</strong> 2.6% + $0.15, US Only
              </li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            For large donations or questions, please contact us via{' '}
            <a href="mailto:admin@allthingslinux.org">
              admin@allthingslinux.org
            </a>{' '}
            to ensure as much as your donation as possible goes directly to
            supporting our community. We will work with you to find the best way
            to donate with the lowest fees possible.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
