import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | FiberFastUSA",
  description:
    "FiberFastUSA terms of service. Review the terms and conditions for using our fiber internet service.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 prose prose-sm dark:prose-invert">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: March 2025
          </p>
        </div>

        <section className="space-y-8 mt-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Acceptance of Terms</h2>
            <p>
              By accessing and using the FiberFastUSA website and services, you accept and
              agree to be bound by the terms and provisions of this agreement. If you do
              not agree to abide by the above, please do not use this service.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Services Description</h2>
            <p>
              FiberFastUSA provides fiber optic internet service to residential customers
              in our service areas. Our services include broadband internet connectivity,
              Wi-Fi router provision, and customer support. Service availability depends on
              your location. We reserve the right to modify, suspend, or discontinue
              services with notice.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Account and Registration</h2>
            <p>
              To use certain services, you may be required to register for an account. You
              agree to:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the confidentiality of your account credentials</li>
              <li>Accept responsibility for all activity under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Be at least 18 years old or have parental/guardian consent</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Pricing and Payment</h2>
            <p>
              All prices are subject to change with 30 days notice. FiberFastUSA may offer
              promotional pricing for new customers. You agree to:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                Pay all charges incurred under your account in accordance with the pricing
                displayed
              </li>
              <li>Authorize FiberFastUSA to charge your chosen payment method</li>
              <li>Notify us of any billing errors within 30 days</li>
              <li>Pay any applicable taxes and fees</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Service Level</h2>
            <p>
              FiberFastUSA commits to providing reliable service. However, we do not
              guarantee uninterrupted service. Service interruptions may occur due to:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Scheduled maintenance</li>
              <li>Emergency repairs</li>
              <li>Equipment failures</li>
              <li>Force majeure events</li>
            </ul>
            <p className="mt-4">
              We will make reasonable efforts to notify customers of planned maintenance.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Cancellation</h2>
            <p>
              FiberFastUSA offers month-to-month service with no long-term contracts. You
              may cancel your service at any time by:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Calling customer support at (888) 555-FAST</li>
              <li>Emailing hello@fiberfastusa.com</li>
              <li>Providing written notice with 30 days notice</li>
            </ul>
            <p className="mt-4">
              Cancellations are effective at the end of your current billing period. No
              early termination fees apply.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, FiberFastUSA shall not be liable for
              any indirect, incidental, special, consequential, or punitive damages arising
              from your use of or inability to use the service, including but not limited
              to:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Loss of data or files</li>
              <li>Loss of business or revenue</li>
              <li>Service interruptions</li>
              <li>Business interruption</li>
            </ul>
            <p className="mt-4">
              Our total liability for any claim shall not exceed the amount paid by you
              for services in the 12 months preceding the claim.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">User Conduct</h2>
            <p>
              You agree not to use FiberFastUSA services for:
            </p>
            <ul className="mt-4 space-y-2">
              <li>Illegal or unauthorized activities</li>
              <li>Transmission of malware or harmful code</li>
              <li>Hacking, cracking, or unauthorized access attempts</li>
              <li>Harassment, abuse, or threatening behavior</li>
              <li>Violation of intellectual property rights</li>
              <li>Spamming or unsolicited communications</li>
            </ul>
            <p className="mt-4">
              Violations may result in service suspension or termination without refund.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of the
              State of Colorado, without regard to its conflict of law provisions. You agree
              to submit to the exclusive jurisdiction of the state and federal courts
              located in Denver, Colorado for any legal proceedings arising from these terms.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            <p>
              For questions regarding these terms of service, please contact us:
            </p>
            <div className="mt-4 space-y-2">
              <p>
                <strong>Email:</strong> hello@fiberfastusa.com
              </p>
              <p>
                <strong>Phone:</strong> (888) 555-FAST
              </p>
              <p>
                <strong>Address:</strong> 123 Fiber Lane, Denver, CO 80202
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-muted/50 p-4 mt-8">
            <p className="text-sm text-muted-foreground">
              FiberFastUSA reserves the right to modify these terms at any time. Continued
              use of our services following the posting of modified terms constitutes your
              acceptance of the changes.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
