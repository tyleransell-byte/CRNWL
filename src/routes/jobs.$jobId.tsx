import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Banknote,
  BedDouble,
  Building2,
  Clock,
  MapPin,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import {
  categoryLabel,
  formatPay,
  timeAgo,
} from "@/lib/jobs-data";

export const Route = createFileRoute("/jobs/$jobId")({
  head: () => ({
    meta: [
      {
        title:
          "Hospitality Job in Cornwall | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Full details and one-click apply for this Cornish hospitality vacancy.",
      },
      {
        property: "og:title",
        content:
          "Hospitality Job in Cornwall | Work in CRNWL",
      },
      {
        property: "og:description",
        content:
          "Full details and one-click apply for this Cornish hospitality vacancy.",
      },
    ],
  }),

  component: JobDetail,
});

function JobDetail() {
  const { jobId } = Route.useParams();

  const { user, profile } = useAuth();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const {
    data: job,
    isLoading,
  } = useQuery({
    queryKey: ["job", jobId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .maybeSingle();

      if (error) throw error;

      return data;
    },
  });

  const {
    data: existing,
  } = useQuery({
    queryKey: [
      "application",
      jobId,
      user?.id,
    ],

    enabled: !!user,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id, status")
        .eq("job_id", jobId)
        .eq(
          "candidate_id",
          user!.id,
        )
        .maybeSingle();

      if (error) throw error;

      return data;
    },
  });

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    cover_note: "",
  });

  useEffect(() => {
    setForm((current) => ({
      ...current,

      full_name:
        current.full_name ||
        profile?.full_name ||
        "",

      email:
        current.email ||
        user?.email ||
        "",

      phone:
        current.phone ||
        profile?.phone ||
        "",
    }));
  }, [profile, user]);

  const apply = useMutation({
    mutationFn: async () => {
      if (!user) {
        throw new Error(
          "You need to sign in before applying.",
        );
      }

      const { error } = await supabase
        .from("applications")
        .insert({
          job_id: jobId,
          candidate_id: user.id,
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          phone:
            form.phone.trim() ||
            null,
          cover_note:
            form.cover_note.trim() ||
            null,
        });

      if (error) throw error;
    },

    onSuccess: () => {
      toast.success(
        "Application sent -- good luck!",
      );

      void queryClient.invalidateQueries({
        queryKey: [
          "application",
          jobId,
        ],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-10">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">
          This role is no longer listed
        </h1>

        <Button
          asChild
          className="mt-6"
        >
          <Link to="/jobs">
            Browse other jobs
          </Link>
        </Button>
      </div>
    );
  }

  const isEmployer =
    profile?.account_type ===
    "employer";

  const isOwner =
    user?.id ===
    job.employer_id;

  const shareJob = async () => {
    const shareData = {
      title: `${job.title} at ${job.company_name}`,

      text:
        `${job.title} at ${job.company_name} in ${job.location} -- ` +
        `find out more and apply on Work in CRNWL.`,

      url:
        typeof window !==
        "undefined"
          ? window.location.href
          : "",
    };

    try {
      if (
        typeof navigator !==
          "undefined" &&
        navigator.share
      ) {
        await navigator.share(
          shareData,
        );
      } else if (
        typeof navigator !==
          "undefined" &&
        navigator.clipboard
      ) {
        await navigator.clipboard.writeText(
          shareData.url,
        );

        toast.success(
          "Job link copied",
        );
      }
    } catch (error) {
      if (
        error instanceof Error &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "Could not share job:",
        error,
      );

      toast.error(
        "Could not share this job",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <Link
        to="/jobs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        All jobs
      </Link>

      {/* JOB DETAILS */}

      <div className="mt-4 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-display text-3xl font-bold leading-tight">
              {job.title}
            </h1>

            <p className="mt-1 inline-flex items-center gap-1.5 text-muted-foreground">
              <Building2 className="size-4 shrink-0" />
              {job.company_name}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">
              {categoryLabel(
                job.category,
              )}
            </Badge>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                void shareJob()
              }
            >
              <Share2 className="mr-2 size-4" />
              Share job
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="size-4" />

            {job.location}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Banknote className="size-4" />

            {formatPay(
              job.pay_min,
              job.pay_max,
              job.pay_period,
            )}
          </span>

          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" />

            {job.job_type}
          </span>

          {job.live_in && (
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="size-4" />

              Live-in available
            </span>
          )}

          <span>
            Posted{" "}
            {timeAgo(
              job.created_at,
            ).toLowerCase()}
          </span>
        </div>

        <div className="prose-sm mt-8 space-y-6">
          <section>
            <h2 className="font-display text-lg font-semibold">
              The role
            </h2>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
              {job.description}
            </p>
          </section>

          {job.requirements && (
            <section>
              <h2 className="font-display text-lg font-semibold">
                What they're after
              </h2>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {job.requirements}
              </p>
            </section>
          )}

          {job.perks && (
            <section>
              <h2 className="font-display text-lg font-semibold">
                Perks
              </h2>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {job.perks}
              </p>
            </section>
          )}
        </div>
      </div>

      {/* APPLY */}

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">
          Apply for this role
        </h2>

        {isOwner ? (
          <p className="mt-3 text-sm text-muted-foreground">
            This is your listing.{" "}

            <Link
              to="/dashboard"
              className="text-primary underline-offset-4 hover:underline"
            >
              View applicants in your
              dashboard
            </Link>
            .
          </p>
        ) : !user ? (
          <div className="mt-4">
            <p className="text-sm text-muted-foreground">
              Create a free candidate
              account to apply in
              seconds.
            </p>

            <Button
              className="mt-4"
              onClick={() =>
                navigate({
                  to: "/auth",
                })
              }
            >
              Sign in or sign up
            </Button>
          </div>
        ) : isEmployer ? (
          <p className="mt-3 text-sm text-muted-foreground">
            You're signed in with an
            employer account, so you
            can't apply to listings.
          </p>
        ) : existing ? (
          <p className="mt-3 text-sm font-medium text-primary">
            You applied for this role --
            status:{" "}
            {existing.status}.
          </p>
        ) : (
          <form
            className="mt-4 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();

              apply.mutate();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="full_name">
                  Full name
                </Label>

                <Input
                  id="full_name"
                  required
                  value={
                    form.full_name
                  }
                  onChange={(event) =>
                    setForm({
                      ...form,
                      full_name:
                        event.target.value,
                    })
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">
                  Email
                </Label>

                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email:
                        event.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">
                Phone (optional)
              </Label>

              <Input
                id="phone"
                value={form.phone}
                onChange={(event) =>
                  setForm({
                    ...form,
                    phone:
                      event.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="cover_note">
                Why you're a good fit
              </Label>

              <Textarea
                id="cover_note"
                rows={5}
                placeholder="Tell them about your experience, availability and start date…"
                value={
                  form.cover_note
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    cover_note:
                      event.target.value,
                  })
                }
              />
            </div>

            <Button
              type="submit"
              variant="accent"
              disabled={
                apply.isPending
              }
            >
              {apply.isPending
                ? "Sending…"
                : "Send application"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}