import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  Search,
  Ship,
  UtensilsCrossed,
  Waves,
} from "lucide-react";

import heroImage from "@/assets/hero-cornwall.jpg";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JobCard, type JobSummary } from "@/components/JobCard";
import { Skeleton } from "@/components/ui/skeleton";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  CATEGORIES,
  CORNWALL_LOCATIONS,
} from "@/lib/jobs-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Work in CRNWL -- Cornwall Hospitality Jobs",
      },
      {
        name: "description",
        content:
          "Find hospitality work across Cornwall: chefs, bar staff, front of house, housekeeping and management roles in Newquay, St Ives, Falmouth, Padstow and beyond.",
      },
      {
        property: "og:title",
        content: "Work in CRNWL -- Cornwall Hospitality Jobs",
      },
      {
        property: "og:description",
        content:
          "Cornwall's dedicated hospitality jobs board for candidates and employers.",
      },
    ],
  }),

  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [q, setQ] = useState("");

  const firstName =
    profile?.full_name
      ?.trim()
      .split(/\s+/)[0] || "";

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["latest-jobs"],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          "id, title, company_name, location, category, job_type, pay_min, pay_max, pay_period, live_in, created_at",
        )
        .eq("is_published", true)
        .order("created_at", {
          ascending: false,
        })
        .limit(6);

      if (error) throw error;

      return (data ?? []) as JobSummary[];
    },
  });

  return (
    <>
      {/* PERSONALISED GREETING */}

      {user && firstName && (
        <section className="border-b border-border bg-sand">
          <div className="mx-auto w-full max-w-6xl px-4 py-3">
            <p className="font-display text-lg font-bold text-foreground">
              Wasson, {firstName} 👋
            </p>
          </div>
        </section>
      )}

      {/* HERO */}

      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="Cornish harbour at golden hour with a busy quayside pub terrace"
          width={1600}
          height={1008}
          className="absolute inset-0 size-full object-cover"
        />

        <div className="absolute inset-0 bg-harbour opacity-85" />

        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:py-32">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground/85">
            <Waves className="size-3.5" />
            Kernow hospitality
          </p>

          <h1 className="mt-5 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] text-primary-foreground sm:text-6xl">
            Cornwall's hospitality jobs, all in one place.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-primary-foreground/85">
            Season-long kitchen gigs, year-round hotel roles and harbourside
            bar shifts -- posted direct by Cornish employers.
          </p>

          <form
            className="mt-8 flex max-w-xl flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();

              navigate({
                to: "/jobs",
                search: {
                  q: q || undefined,
                },
              });
            }}
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={q}
                onChange={(event) =>
                  setQ(event.target.value)
                }
                placeholder="Chef de partie, bartender, St Ives…"
                aria-label="Search jobs"
                className="h-12 bg-background pl-9"
              />
            </div>

            <Button
              type="submit"
              size="lg"
              variant="hero"
              className="h-12"
            >
              Search jobs
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap gap-2">
            {CORNWALL_LOCATIONS.slice(
              0,
              6,
            ).map((location) => (
              <Link
                key={location}
                to="/jobs"
                search={{
                  location,
                }}
                className="rounded-full border border-primary-foreground/25 px-3 py-1 text-sm text-primary-foreground/85 transition-colors hover:bg-primary-foreground/10"
              >
                {location}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BROWSE BY TRADE */}

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <h2 className="font-display text-2xl font-bold">
          Browse by trade
        </h2>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.value}
              to="/jobs"
              search={{
                category:
                  category.value,
              }}
              className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-secondary/50"
            >
              <span className="font-medium">
                {category.label}
              </span>

              <ArrowRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </section>

      {/* LATEST ROLES */}

      <section className="mx-auto w-full max-w-6xl px-4 pb-4">
        <div className="flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold">
            Latest roles
          </h2>

          <Button
            asChild
            variant="ghost"
            size="sm"
          >
            <Link to="/jobs">
              View all
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {isLoading &&
            Array.from({
              length: 4,
            }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-40 rounded-xl"
              />
            ))}

          {jobs?.map((job) => (
            <JobCard
              key={job.id}
              job={job}
            />
          ))}

          {!isLoading &&
            jobs?.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center md:col-span-2">
                <UtensilsCrossed className="mx-auto size-6 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  No jobs posted yet
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Be the first Cornish employer
                  on the board.
                </p>

                <Button
                  asChild
                  className="mt-4"
                  variant="accent"
                >
                  <Link to="/post-job">
                    Post a job
                  </Link>
                </Button>
              </div>
            )}
        </div>
      </section>

      {/* NO CVS */}

      <section className="mx-auto mt-16 w-full max-w-6xl px-4">
        <div className="rounded-2xl border border-border bg-sand p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
            CRNWL believes in people
          </p>

          <h2 className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
            NO CVs.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Hospitality is about people, not paperwork. Tell employers who you
            are, what experience you have and when you can work -- no polished
            CV required.
          </p>

          <Button
            asChild
            className="mt-6"
            variant="accent"
          >
            <Link to="/jobs">
              Find a job
            </Link>
          </Button>
        </div>
      </section>

      {/* EMPLOYERS */}

      <section className="mx-auto mt-16 w-full max-w-6xl px-4">
        <div className="rounded-2xl border border-border bg-sand p-8 sm:p-12">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <Ship className="size-6 text-primary" />

              <h2 className="mt-3 font-display text-2xl font-bold">
                Hiring for the season?
              </h2>

              <p className="mt-2 text-muted-foreground">
                Create an employer account, post your role in a couple of
                minutes and manage applicants in one dashboard. No agency fees.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              variant="accent"
            >
              <Link to="/employers">
                Post a job
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}