import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getPageMetadata } from '../metadata';
import type { Metadata } from 'next';
import {
  Code,
  Users,
  DollarSign,
  Github,
  ExternalLink,
  MessageSquare,
  BookOpen,
} from 'lucide-react';
import {
  SiOpencollective,
  SiPaypal,
  SiStripe,
  SiBitcoin,
  SiCashapp,
} from 'react-icons/si';
import { FinancialSupportDialog } from '@/components/pages/contribute/financial-support-dialog';

export const metadata: Metadata = getPageMetadata('contribute');

export default function ContributePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 max-w-6xl">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl border border-primary/10 mb-12 sm:mb-16">
        <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

        <div className="relative py-4 sm:py-5 md:py-6 px-6 sm:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl sm:text-2xl md:text-3xl font-bold mb-6">
              Contribute to All Things Linux
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
              Help us build the most welcoming Linux community. Whether through
              donations, code contributions, or volunteering your time, every
              contribution makes a difference.
            </p>
          </div>
        </div>
      </div>

      {/* Ways to Contribute Section */}
      <div className="mb-16 space-y-6">
        {/* Financial Support - Full Width */}
        <Card className="border-2 hover:shadow-lg transition-all">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <CardTitle className="text-2xl">Financial Support</CardTitle>
              <FinancialSupportDialog />
            </div>
            <CardDescription className="text-lg">
              Your donations help us maintain infrastructure, run events, and
              grow our community.
              <span className="block mt-2 text-sm">
                <i>
                  In general Open Collective is the best platform to donate on.
                  However for Amex, PayPal has lower fees. For Crypto, Stripe
                  has the lowest fees but every.org provides more currency
                  options.
                </i>{' '}
                <b>
                  For larger donations or more details on how the fees work you
                  can click the "Learn More" button above.
                </b>
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button asChild className="w-full">
                <Link
                  href="https://opencollective.com/allthingslinux"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiOpencollective size={16} />
                  Open Collective
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
                  href="https://paypal.com/donate/?hosted_button_id=9R5Y3RDAMF6D8"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiPaypal size={16} />
                  PayPal
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
                  href="https://donate.stripe.com/bJe8wQf5O2ZccHW06u1wY07"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiStripe size={16} />
                  Stripe (Monthly)
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
                  href="https://every.org/allthingslinux/donate/crypto"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiBitcoin size={16} />
                  Every.org (Crypto)
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
                  href="https://cash.app/$allthingslinux"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiCashapp size={16} />
                  Cash App
                </Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link
                  href="https://donate.stripe.com/28EbJ27Dm9nAcHWdXk1wY06"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiStripe size={16} />
                  Stripe (One-Time)
                </Link>
              </Button>
            </div>
            <Button asChild variant="secondary" className="w-full mt-4">
              <Link href="/open">View our Financial Records</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Volunteer and Wiki - Second Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Volunteer Your Time */}
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                </div>
                <CardTitle className="text-2xl">Volunteer Your Time</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Join our team and help manage the community, create content, and
                organize events.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="lg">
                <Link href="/get-involved">Browse Open Roles</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Contribute to Wiki */}
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/10">
                  <BookOpen className="h-6 w-6 text-cyan-600 dark:text-cyan-500" />
                </div>
                <CardTitle className="text-2xl">
                  Contribute to the Wiki
                </CardTitle>
              </div>
              <CardDescription className="text-lg">
                Share your knowledge by contributing editing or writing articles
                and guides.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="lg">
                <Link
                  href="https://atl.wiki"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Visit Wiki
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Code Contributions and Community Support - Third Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Code Contributions */}
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Code className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                </div>
                <CardTitle className="text-2xl">Code Contributions</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Help us build and improve our open-source projects and
                infrastructure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" size="lg">
                <Link
                  href="https://github.com/allthingslinux"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  View on GitHub
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Community Support */}
          <Card className="border-2 hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <MessageSquare className="h-6 w-6 text-orange-600 dark:text-orange-500" />
                </div>
                <CardTitle className="text-2xl">Community Support</CardTitle>
              </div>
              <CardDescription className="text-lg">
                Help others learn Linux, answer questions, and share your
                knowledge.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" size="lg">
                <Link
                  href="https://discord.gg/allthingslinux"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Join Our Discord
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Why Contribute Section */}
      <Card className="border-2 mb-16">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Why Contribute?
          </CardTitle>
          <CardDescription className="text-center text-lg">
            Your contributions help us achieve our mission
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">20k+</div>
              <p className="text-sm text-muted-foreground">Community Members</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">100%</div>
              <p className="text-sm text-muted-foreground">Open Source</p>
            </div>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold text-primary">24/7</div>
              <p className="text-sm text-muted-foreground">Community Support</p>
            </div>
          </div>

          {/* Transparency Section */}
          <div className="text-center space-y-4 bg-muted/50 rounded-lg p-8">
            <h3 className="text-xl font-semibold">
              We Practice Radical Transparency
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              As a 501(c)(3) non-profit, we're committed to complete
              transparency. We publish all our financials in real-time and share
              all of our decisions openly with the community.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link href="/open">View Our Finances</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
