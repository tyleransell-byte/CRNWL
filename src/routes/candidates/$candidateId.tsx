import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CalendarDays,
  Car,
  Home,
  MapPin,
  UserRound,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/candidates/$candidateId")({
  head: () => ({
    meta: [
      {
        title: "Candidate Profile | Work in CRNWL",
      },
      {
        name: "description",
        content: "Candidate profile on Work in CRNWL.",
      },
    ],
  }),
  component: CandidateProfile,
});

function experienceLabel(value: string | null) {
  switch (value) {
    case "none":
      return "Just starting out";
    case "under_1":
      return "Less than 1 year";
    case "1_2":
      return "1–2 years";
    case "3_5":
      return "3–5 years";
    case "5_plus":
      return "5+ years";
    case "10_plus":
      return "10+ years";
    default:
      return value || "Not specified";
  }
}

function drivingLabel(value: string | null) {
  switch (value) {
    case "yes":
      return "Full driving licence";
    case "no":
      return "No driving licence";
    case "learning":
      return "Learning to drive";
    default:
      return "Not specified";
  }
}

function CandidateProfile() {
  const { candidateId } = Route.useParams();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  const { data: candidate, isLoading } = useQuery({
    queryKey: ["candidate-profile", candidateId],

    enabled:
      !!user &&
      profile?.account_type === "employer",

    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          id,
          full_name,
          location,
          bio,
          "current_role",
          years_experience,
          experience_tags,
          available_immediately,
          available_from,
          work_preferences,
          preferred_locations,
          driving_licence,
          own_transport,
          interested_in_live_in,
          open_to_work
          `,
        )
        .eq("id", candidateId)
        .eq("account_type", "candidate")
        .maybeSingle();

      if (error) throw error;

      return data;
    },
  });

  if (loading || isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (!user || profile?.account_type !== "employer") {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold">
          Employer access only
        </h1>

        <p className="mt-3 text-muted-foreground">
          Candidate profiles are available to relevant employers.
        </p>

        <Button asChild className="mt-6">
          <Link to="/dashboard">
            Back to dashboard
          </Link>
        </Button>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-bold">
          Candidate profile unavailable
        </h1>

        <p className="mt-3 text-muted-foreground">
          You can only view profiles belonging to candidates who have applied
          to one of your jobs.
        </p>

        <Button asChild className="mt-6">
          <Link to="/dashboard">
            Back to dashboard
          </Link>
        </Button>
      </div>
    );
  }

  const experienceTags =
    candidate.experience_tags ?? [];

  const workPreferences =
    candidate.work_preferences ?? [];

  const preferredLocations =
    candidate.preferred_locations ?? [];

  const availableFrom =
    candidate.available_from
      ? new Date(
          candidate.available_from,
        ).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to applicants
      </Link>

      <div className="mt-5 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <UserRound className="size-7" />
          </span>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
              Candidate
            </p>

            <h1 className="mt-1 font-display text-3xl font-bold">
              {candidate.full_name}
            </h1>

            {candidate.location && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4" />
                {candidate.location}
              </p>
            )}

            {candidate.available_immediately && (
              <div className="mt-3">
                <Badge
                  variant="secondary"
                  className="inline-flex items-center gap-1.5"
                >
                  <Zap className="size-3.5" />
                  Available immediately
                </Badge>
              </div>
            )}

            {!candidate.available_immediately && availableFrom && (
              <div className="mt-3">
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-1.5"
                >
                  <CalendarDays className="size-3.5" />
                  Available from {availableFrom}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {candidate.bio && (
          <section className="mt-8">
            <h2 className="font-display text-xl font-bold">
              About
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-muted-foreground">
              {candidate.bio}
            </p>
          </section>
        )}

        <section className="mt-8 border-t border-border pt-7">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="size-5 text-primary" />

            <h2 className="font-display text-xl font-bold">
              Experience
            </h2>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-sand p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Most recent role
              </p>

              <p className="mt-1 font-medium">
                {candidate.current_role || "Not specified"}
              </p>
            </div>

            <div className="rounded-xl border border-border bg-sand p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Hospitality experience
              </p>

              <p className="mt-1 font-medium">
                {experienceLabel(
                  candidate.years_experience,
                )}
              </p>
            </div>
          </div>

          {experienceTags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {experienceTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8 border-t border-border pt-7">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />

            <h2 className="font-display text-xl font-bold">
              Availability
            </h2>
          </div>

          <p className="mt-4 font-medium">
            {candidate.available_immediately
              ? "Available immediately"
              : availableFrom
                ? `Available from ${availableFrom}`
                : "Availability not specified"}
          </p>

          {workPreferences.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {workPreferences.map((type) => (
                <Badge
                  key={type}
                  variant="outline"
                >
                  {type}
                </Badge>
              ))}
            </div>
          )}
        </section>

        {preferredLocations.length > 0 && (
          <section className="mt-8 border-t border-border pt-7">
            <div className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />

              <h2 className="font-display text-xl font-bold">
                Preferred locations
              </h2>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {preferredLocations.map(
                (location) => (
                  <Badge
                    key={location}
                    variant="outline"
                  >
                    {location}
                  </Badge>
                ),
              )}
            </div>
          </section>
        )}

        <section className="mt-8 border-t border-border pt-7">
          <div className="flex items-center gap-2">
            <Car className="size-5 text-primary" />

            <h2 className="font-display text-xl font-bold">
              Travel & accommodation
            </h2>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">
                Driving
              </p>

              <p className="mt-1 text-sm font-medium">
                {drivingLabel(
                  candidate.driving_licence,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">
                Own transport
              </p>

              <p className="mt-1 text-sm font-medium">
                {candidate.own_transport
                  ? "Yes"
                  : "No"}
              </p>
            </div>

            <div className="rounded-xl border border-border p-4">
              <p className="text-xs text-muted-foreground">
                Live-in roles
              </p>

              <p className="mt-1 text-sm font-medium">
                {candidate.interested_in_live_in
                  ? "Interested"
                  : "Not currently interested"}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 rounded-xl border border-border bg-sand p-4 text-sm text-muted-foreground">
          <Home className="mr-2 inline size-4 text-primary" />
          This profile contains information the candidate has chosen to share
          with employers. Their date of birth is kept private.
        </div>
      </div>
    </div>
  );
}