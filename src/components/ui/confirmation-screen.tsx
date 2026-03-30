'use client';

import Link from 'next/link';
import { CheckCircle, Phone } from 'lucide-react';
import { PLANS } from '@/lib/constants';
import { Button } from '@/components/ui/button';

type ConfirmationScreenProps = {
  firstName: string;
  repName?: string;
  selectedPlan?: string; // plan ID
  preferredDate?: string; // ISO date string
  giftCardAmount?: number;
  planPrice?: number;
  planName?: string;
  source?: 'door-mode' | 'check-availability' | 'rep-page' | 'get-started';
  onBackToHome?: () => void;
};

export function ConfirmationScreen({
  firstName,
  repName,
  selectedPlan,
  preferredDate,
  giftCardAmount = 0,
  planPrice,
  planName,
  source,
  onBackToHome,
}: ConfirmationScreenProps) {
  // Resolve plan details from ID if not provided
  let resolvedPlanName = planName;
  let resolvedPlanPrice = planPrice;

  if (selectedPlan && !planName) {
    const plan = PLANS.find((p) => p.id === selectedPlan);
    if (plan) {
      resolvedPlanName = plan.name;
      resolvedPlanPrice = plan.price;
    }
  }

  // Format preferred date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'a convenient time';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'a convenient time';
    }
  };

  const isDoorMode = source === 'door-mode';
  const repDisplayName = repName || 'A FiberFastUSA representative';
  const displayDate = formatDate(preferredDate);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-fiber-50 to-white px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Success Card */}
        <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12 text-center border border-border">
          {/* Checkmark Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-fiber-success" strokeWidth={1.5} />
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            You&apos;re all set, {firstName}!
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            We&apos;re excited to bring FiberFast to you.
          </p>

          {/* What Happens Next */}
          <div className="bg-fiber-50 rounded-xl p-6 md:p-8 mb-8 text-left">
            <h2 className="text-xl font-semibold text-foreground mb-6">What happens next</h2>

            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-fiber-success text-white font-semibold text-sm">
                  1
                </span>
                <span className="text-foreground pt-1">
                  {repDisplayName} will call you within 24 hours
                </span>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-fiber-success text-white font-semibold text-sm">
                  2
                </span>
                <span className="text-foreground pt-1">
                  We&apos;ll confirm fiber availability at your address
                </span>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-fiber-success text-white font-semibold text-sm">
                  3
                </span>
                <span className="text-foreground pt-1">
                  We&apos;ll schedule your installation for {displayDate}
                </span>
              </li>

              <li className="flex gap-4">
                <span className="flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full bg-fiber-success text-white font-semibold text-sm">
                  4
                </span>
                <span className="text-foreground pt-1">
                  A technician will install your fiber connection (typically 2-4 hours)
                </span>
              </li>
            </ol>
          </div>

          {/* Plan Summary */}
          {selectedPlan && resolvedPlanName && resolvedPlanPrice !== undefined && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-foreground">
                <span className="font-semibold">Your selected plan:</span>{' '}
                <span className="text-foreground">
                  {resolvedPlanName} — ${resolvedPlanPrice}/mo
                </span>
              </p>
            </div>
          )}

          {/* Gift Card Callout */}
          {giftCardAmount && giftCardAmount > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <p className="text-foreground">
                <span className="font-semibold text-amber-900">
                  Plus a ${giftCardAmount} Visa Gift Card!
                </span>
              </p>
            </div>
          )}

          {/* Door Mode Note */}
          {isDoorMode && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-foreground">
                You can close this page — {repDisplayName} has your info.
              </p>
            </div>
          )}

          {/* Contact Information */}
          <div className="flex items-center justify-center gap-2 text-foreground dark:text-foreground mb-8 bg-muted dark:bg-card rounded-lg p-4">
            <Phone className="w-5 h-5 text-fiber-success flex-shrink-0" />
            <span>
              Questions? Call us at{' '}
              <a href="tel:+14694285942" className="font-semibold text-fiber-success hover:text-fiber-600 transition-colors">
                (469) 428-5942
              </a>
            </span>
          </div>

          {/* Back to Home Button */}
          {onBackToHome ? (
            <Button
              onClick={onBackToHome}
              className="w-full bg-fiber-success hover:bg-fiber-600 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Back to Home
            </Button>
          ) : (
            <Link href="/">
              <Button className="w-full bg-fiber-success hover:bg-fiber-600 text-white font-semibold py-3 rounded-lg transition-colors">
                Back to Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
