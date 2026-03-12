import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Zap,
  Infinity,
  Network,
  Gamepad2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Why Fiber Internet? | FiberFastUSA",
  description:
    "Discover why fiber internet is the future. Learn how fiber compares to cable and who benefits most from fiber connectivity.",
};

export default function WhyFiberPage() {
  const benefitCategories = [
    {
      icon: Gamepad2,
      title: "Remote Workers",
      description:
        "Reliable uploads and downloads for video calls, file transfers, and cloud applications.",
    },
    {
      icon: Gamepad2,
      title: "Gamers",
      description: "Ultra-low latency (1-5ms) for competitive gaming without lag.",
    },
    {
      icon: Zap,
      title: "Streamers",
      description:
        "Symmetric speeds mean you can stream and upload to multiple platforms simultaneously.",
    },
    {
      icon: Network,
      title: "Smart Home Users",
      description:
        "Support dozens of connected devices without slowdowns or buffering.",
    },
    {
      icon: Infinity,
      title: "Content Creators",
      description:
        "Upload large video files in minutes instead of hours with symmetric gigabit speeds.",
    },
    {
      icon: CheckCircle2,
      title: "Large Families",
      description:
        "Everyone streams, games, and works at the same time without competition for bandwidth.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-primary/10 to-background py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Why Fiber Internet?
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              The future of home internet is here.
            </p>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Fiber vs Cable</h2>
            <p className="mt-2 text-muted-foreground">
              See how fiber outperforms traditional cable internet.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-semibold">Feature</th>
                  <th className="px-4 py-3 text-left font-semibold text-primary">
                    Fiber
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                    Cable
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="px-4 py-4 font-medium">Download Speed</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>Up to 7 Gbps</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-orange-500" />
                      <span>Up to 1 Gbps</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium">Upload Speed</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>Symmetric (matches download)</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-5 text-red-600" />
                      <span>10-50 Mbps</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium">Latency</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>1-5ms</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-5 text-red-600" />
                      <span>10-30ms</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium">Reliability</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>99.9% uptime</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-5 text-red-600" />
                      <span>Weather/distance dependent</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium">Data Caps</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>None</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <XCircle className="size-5 text-red-600" />
                      <span>Often 1-1.5 TB</span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-4 font-medium">Technology</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-5 text-green-600" />
                      <span>Light through glass</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span>Electrical through copper</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t bg-muted/30 py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Benefits of Fiber</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Symmetric Speeds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Upload equals download speeds. Perfect for video calls and
                  cloud backups.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Future-Proof</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Fiber infrastructure supports next-gen speeds without
                  replacements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">No Congestion</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Dedicated line connection, not shared bandwidth with
                  neighbors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Lower Latency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lightning-fast response times for gaming, video calls, and
                  real-time apps.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Benefits Most Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">Who Benefits Most?</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefitCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Icon className="size-6 text-primary flex-shrink-0 mt-1" />
                      <CardTitle className="text-base">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-gradient-to-b from-primary/10 to-background py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-bold">Experience the Fiber Difference</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Ready to upgrade to fiber internet? Check if it&apos;s available at
              your address.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="/check-availability">
                <Button size="lg">Check Availability</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
