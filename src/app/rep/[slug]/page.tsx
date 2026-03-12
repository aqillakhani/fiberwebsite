import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, Phone, Mail, Gift, Zap, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TEAM_MEMBERS, PLANS, type TeamMember } from "@/lib/constants";

interface RepProfilePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata(
  { params }: RepProfilePageProps
): Promise<Metadata> {
  const { slug } = await params;
  const member = TEAM_MEMBERS.find((m) => m.slug === slug);

  if (!member) {
    return {
      title: "Rep Not Found | FiberFastUSA",
      description: "This sales representative could not be found.",
    };
  }

  return {
    title: `${member.name} | FiberFastUSA Sales Rep`,
    description: `Meet ${member.name}, your dedicated FiberFastUSA sales representative. ${member.bio}`,
    openGraph: {
      title: `${member.name} - FiberFastUSA Sales Rep`,
      description: `Get connected to fiber internet through ${member.name} at FiberFastUSA.`,
      url: `/rep/${member.slug}`,
    },
  };
}

export function generateStaticParams() {
  return TEAM_MEMBERS.map((member) => ({
    slug: member.slug,
  }));
}

export default async function RepProfilePage(
  { params }: RepProfilePageProps
) {
  const { slug } = await params;
  const member = TEAM_MEMBERS.find((m) => m.slug === slug) as TeamMember | undefined;

  if (!member) {
    notFound();
  }

  const firstName = member.name.split(" ")[0];

  return (
    <main className="min-h-screen">
      {/* Hero / Rep Card Section */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-muted/50 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Photo Placeholder & Contact */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  {/* Photo Placeholder */}
                  <div className="bg-gradient-to-br from-fiber-blue/20 via-fiber-orange/10 to-fiber-blue/20 aspect-square flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-fiber-blue/10 to-fiber-orange/10" />
                    <div className="text-center z-10">
                      <div className="text-6xl font-bold text-fiber-blue/30 mb-2">
                        {firstName[0]}
                      </div>
                      <p className="text-sm text-muted-foreground">Sales Rep</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${member.phone.replace(/\D/g, "")}`}
                        className="flex items-center gap-2 text-primary hover:underline font-medium"
                      >
                        <Phone className="size-4" />
                        {member.phone}
                      </a>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${member.email}`}
                        className="flex items-center gap-2 text-primary hover:underline font-medium break-all text-sm"
                      >
                        <Mail className="size-4 flex-shrink-0" />
                        {member.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Rep Info */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
                  {member.name}
                </h1>
                <p className="text-lg text-fiber-orange font-semibold mb-4">
                  {member.role}
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>

              <div className="rounded-lg bg-fiber-blue/5 border border-fiber-blue/20 p-6">
                <p className="text-sm font-medium text-fiber-blue flex items-start gap-2">
                  <Zap className="size-5 flex-shrink-0 mt-0.5" />
                  <span>Your dedicated FiberFastUSA representative</span>
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link href={`/get-started?rep=${member.id}`}>
                  <Button size="lg" className="w-full">
                    Get Started with {firstName}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
              Available Plans
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All plans include free installation, a free Wi-Fi router, and no data caps.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            {PLANS.map((plan) => (
              <Card
                key={plan.id}
                className={`relative flex flex-col ${
                  plan.isFeatured
                    ? "border-fiber-orange/50 bg-gradient-to-br from-fiber-orange/5 to-transparent md:col-span-2 lg:col-span-2 lg:row-span-2 lg:scale-105"
                    : ""
                }`}
              >
                {plan.isFeatured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge
                      className="bg-fiber-orange text-white border-0"
                      variant="secondary"
                    >
                      <Star className="size-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className={plan.isFeatured ? "pb-3" : ""}>
                  <CardTitle className="flex items-start justify-between gap-2">
                    <span>{plan.name}</span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{plan.speed}</p>
                </CardHeader>

                <CardContent className="flex-1 space-y-6">
                  {/* Price */}
                  <div>
                    <div className="text-3xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      ${plan.price}
                      <span className="text-base md:text-sm lg:text-base text-muted-foreground font-normal">
                        /mo
                      </span>
                    </div>
                  </div>

                  {/* Promotions */}
                  <div className="space-y-2">
                    {plan.freeMonths !== null && (
                      <Badge className="bg-fiber-success/20 text-fiber-success border-fiber-success/30 flex items-center gap-1 w-fit">
                        <Zap className="size-3" />
                        {plan.freeMonths} Months FREE!
                      </Badge>
                    )}
                    {plan.giftCard > 0 && (
                      <Badge className="bg-fiber-orange/20 text-fiber-orange border-fiber-orange/30 flex items-center gap-1 w-fit">
                        <Gift className="size-3" />
                        +${plan.giftCard} Visa Gift Card
                      </Badge>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 flex-1">
                    {plan.features.slice(0, 5).map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="size-4 text-fiber-success flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </div>
                    ))}
                    {plan.features.length > 5 && (
                      <p className="text-xs text-muted-foreground pt-2">
                        + {plan.features.length - 5} more features
                      </p>
                    )}
                  </div>

                  {/* CTA Button */}
                  <Link
                    href={`/get-started?plan=${plan.id}&rep=${member.id}`}
                    className="block pt-2"
                  >
                    <Button
                      variant={plan.isFeatured ? "default" : "outline"}
                      className="w-full"
                    >
                      Sign Up with {firstName}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
            Not sure which plan?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Let {firstName} help you choose the perfect plan for your needs.
          </p>
          <Link href={`/get-started?rep=${member.id}`}>
            <Button size="lg">
              Talk to {firstName} Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
