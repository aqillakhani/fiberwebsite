import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FiberFastUSA",
  description: "FiberFastUSA privacy policy. Learn how we protect your personal data.",
  openGraph: {
    title: "Privacy Policy | FiberFastUSA",
    description: "We protect your data with industry-leading security practices and transparency.",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 prose prose-sm dark:prose-invert">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: March 2025
          </p>
        </div>

        <section className="space-y-8 mt-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
            <p>
              FiberFastUSA collects information necessary to provide our services and
              improve your experience. The types of information we collect include:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Personal Information:</strong> Name, email address, phone number,
                residential address, and account creation data from forms and inquiries.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how you interact with our
                website, including pages visited, time spent, and links clicked.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies and similar technologies to track
                user preferences and improve our website functionality.
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating system, IP
                address, and other technical information.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
            <p>
              We use the information we collect for the following purposes:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Service Delivery:</strong> Processing service requests, managing
                your account, and providing customer support.
              </li>
              <li>
                <strong>Communication:</strong> Sending service updates, promotional
                materials, and responding to inquiries.
              </li>
              <li>
                <strong>Service Improvement:</strong> Analyzing usage patterns to enhance
                our website and services.
              </li>
              <li>
                <strong>Legal Compliance:</strong> Fulfilling legal obligations and
                protecting our rights.
              </li>
              <li>
                <strong>Marketing:</strong> With your consent, sending marketing
                communications about new plans and offers.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Information Sharing</h2>
            <p>
              FiberFastUSA does not sell, trade, or rent your personal information to
              third parties. We may share information only in these limited circumstances:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Service Providers:</strong> With vendors who provide services on
                our behalf (e.g., payment processors, analytics platforms) under strict
                confidentiality agreements.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to protect
                our legal rights.
              </li>
              <li>
                <strong>Business Transfers:</strong> In the event of a merger or
                acquisition, your information may be transferred as part of that
                transaction.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect
              your personal information against unauthorized access, alteration, disclosure,
              or destruction. However, no method of transmission over the internet is
              completely secure, and we cannot guarantee absolute security of your data.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Your Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your
              personal information:
            </p>
            <ul className="mt-4 space-y-2">
              <li>
                <strong>Right of Access:</strong> You can request a copy of the
                information we hold about you.
              </li>
              <li>
                <strong>Right of Correction:</strong> You can request that we correct
                inaccurate or incomplete information.
              </li>
              <li>
                <strong>Right of Deletion:</strong> You can request that we delete your
                personal information, subject to legal exceptions.
              </li>
              <li>
                <strong>Right of Opt-Out:</strong> You can opt out of marketing
                communications at any time.
              </li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at hello@fiberfastusa.com.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Cookies</h2>
            <p>
              FiberFastUSA uses cookies to enhance your browsing experience. Most web
              browsers accept cookies by default, but you can usually refuse cookies or
              set your browser to alert you when cookies are being sent. Note that
              disabling cookies may affect the functionality of our website.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p>
              If you have questions about this privacy policy or how we handle your
              information, please contact us:
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
              FiberFastUSA reserves the right to update this privacy policy at any time.
              We will notify you of material changes by posting the updated policy on our
              website with a new &quot;last updated&quot; date. Your continued use of our website
              following the posting of changes constitutes your acceptance of the updated
              policy.
            </p>
          </div>
        </section>
      </article>
    </main>
  );
}
