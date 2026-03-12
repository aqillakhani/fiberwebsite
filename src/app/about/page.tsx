import type { Metadata } from "next";
import Link from "next/link";
import { Zap, Shield, Heart, MapPin, Users, Award, CheckCircle, ArrowRight } from "lucide-react";

import { TEAM_MEMBERS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | FiberFastUSA",
  description:
    "Learn about FiberFastUSA's mission to bring reliable, fast, and affordable fiber internet to Colorado. Meet our team and discover our story.",
};

export default function AboutPage() {
  const serviceAreas = [
    "Denver",
    "Colorado Springs",
    "Aurora",
    "Boulder",
    "Fort Collins",
    "Lakewood",
    "Westminster",
    "Thornton",
    "Arvada",
    "Broomfield",
  ];

  const valuePillars = [
    {
      icon: Zap,
      title: "Speed",
      description: "Blazing-fast fiber speeds from 500 Mbps to 7 Gbps",
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "Rock-solid uptime and consistent performance you can count on",
    },
    {
      icon: Heart,
      title: "Simplicity",
      description: "No contracts, no hidden fees, no data caps. Just great internet.",
    },
  ];

  const trustItems = [
    { icon: CheckCircle, label: "Licensed & Insured" },
    { icon: Users, label: "Local Team" },
    { icon: Award, label: "5,000+ Homes Served" },
    { icon: CheckCircle, label: "30-Day Money-Back Guarantee" },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Bringing Real Internet to Real People
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
              FiberFastUSA started with one simple idea: fiber internet shouldn&apos;t be expensive or
              complicated. We&apos;re building the network Colorado deserves.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Our Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {valuePillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <Card key={pillar.title}>
                  <CardContent className="pt-6 text-center">
                    <Icon className="size-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
                    <p className="text-muted-foreground">{pillar.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why We Started */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6">
            Why We Started
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            We got tired of watching Colorado families deal with slow cable internet, data caps that
            make no sense, and customer service that doesn&apos;t care. The big ISPs promised change, but
            kept raising prices and lowering service. So we decided to build something different.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Fiber internet is the future. It&apos;s faster, more reliable, and can actually be affordable
            and simple. That&apos;s what FiberFastUSA stands for.
          </p>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Where We Serve
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Currently available in these Colorado areas. Expanding every month.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto">
            {serviceAreas.map((city) => (
              <div key={city} className="flex items-center gap-3 bg-background rounded-lg p-4">
                <MapPin className="size-5 text-primary flex-shrink-0" />
                <span className="font-medium">{city}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Why Customers Trust Us
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {trustItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center">
                  <Icon className="size-10 text-primary mx-auto mb-3" />
                  <p className="font-medium text-foreground">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Real people building real internet for real people.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {TEAM_MEMBERS.map((member) => (
              <Link key={member.id} href={`/rep/${member.slug}`} className="group">
                <Card className="h-full transition-all duration-200 group-hover:ring-2 group-hover:ring-[var(--fiber-orange)] group-hover:shadow-lg">
                  <CardContent className="pt-6">
                    <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg h-40 mb-4 flex items-center justify-center">
                      <span className="text-4xl font-bold text-primary/30">
                        {member.name.split(" ")[0][0]}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold group-hover:text-[var(--fiber-orange)] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-2">{member.role}</p>
                    <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                    <span className="inline-flex items-center gap-1 text-sm font-medium text-[var(--fiber-orange)]">
                      View Profile <ArrowRight className="size-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-gradient-to-r from-orange-50 to-orange-100/50 p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground mb-4">
              Ready to Join Us?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Check if fiber internet is available at your address and experience the FiberFastUSA
              difference.
            </p>
            <Link href="/get-started">
              <Button size="lg">Get Started Today</Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
