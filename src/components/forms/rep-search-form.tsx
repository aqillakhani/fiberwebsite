"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Search, CheckCircle2 } from "lucide-react";

import { repSearchSchema, type RepSearchFormData } from "@/lib/validations/schemas";
import { searchRep, type SalesRep } from "@/actions/verify-rep";
import { trackRepVerified } from "@/lib/analytics";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RepSearchForm() {
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [results, setResults] = useState<SalesRep[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<RepSearchFormData>({
    resolver: zodResolver(repSearchSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: RepSearchFormData) => {
    setIsSearching(true);
    setSearchError(null);
    setHasSearched(true);

    try {
      const result = await searchRep(data.query);

      if (result.success) {
        setResults([...result.reps]);
      } else {
        setSearchError(result.error || "No results found.");
        setResults([]);
      }
    } catch (error) {
      setSearchError("Search failed. Please try again.");
      console.error("Rep search error:", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleRepClick = (repId: string) => {
    trackRepVerified(repId);
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Find Your FiberFastUSA Rep</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="query">Search by Name or ID</Label>
            <div className="relative">
              <Input
                id="query"
                placeholder="Enter your rep's name or ID"
                {...register("query")}
                aria-invalid={!!errors.query}
                onBlur={() => trigger("query")}
                className="pr-10"
              />
              <Search className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            {errors.query && (
              <p className="mt-1 text-sm text-destructive">
                {errors.query.message}
              </p>
            )}
          </div>

          {searchError && !hasSearched && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {searchError}
            </div>
          )}

          <Button type="submit" disabled={isSearching} className="w-full">
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </form>

        {hasSearched && (
          <div className="space-y-4">
            {results.length > 0 ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Found {results.length} rep{results.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-3">
                  {results.map((rep) => (
                    <div
                      key={rep.id}
                      className="flex flex-col gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-5 text-green-600" />
                            <span className="text-xs font-semibold tracking-wider text-green-600">
                              VERIFIED FIBERFASTUSA REP
                            </span>
                          </div>

                          <h3 className="mt-2 font-semibold">{rep.name}</h3>

                          <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                            <p>ID: {rep.employeeId}</p>
                            <p>Region: {rep.region}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Link
                          href={`/get-started?rep=${rep.employeeId}`}
                          onClick={() => handleRepClick(rep.id)}
                          className="flex-1"
                        >
                          <Button className="w-full">
                            Get Started with {rep.name.split(" ")[0]}
                          </Button>
                        </Link>

                        <Link href="/contact" className="flex-1">
                          <Button
                            variant="outline"
                            className="w-full"
                          >
                            Report Issue
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : searchError ? (
              <div className="space-y-4 rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Can&apos;t find your rep? Contact us to verify.
                </p>
                <Link href="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
