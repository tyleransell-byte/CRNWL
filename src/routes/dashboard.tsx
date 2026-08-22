import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Mail,
  Phone,
  Settings,
  Trash2,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

import {
  APPLICATION_STATUSES,
  formatPay,
  timeAgo,
} from "@/lib/jobs-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      {
        title: "Your Dashboard | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Manage your Cornwall hospitality job listings and applications in one place on Work in CRNWL.",
      },
    ],
  }),

  component: Dashboard,
});

function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      void navigate({
        to: "/auth",
      });
    }
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-4 px-4 py-12">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">
        {profile?.account_type === "employer"
          ? "Employer dashboard"
          : "Your applications"}
      </h1>

      <p className="mt-2 text-muted-foreground">
        {profile?.full_name
          ? `Signed in as ${profile.full_name}`
          : user.email}
      </p>

      {profile?.account_type === "employer" ? (
        <EmployerView userId={user.id} />
      ) : (
        <CandidateView userId={user.id} />
      )}
    </div>
  );
}

function EmployerView({
  userId,
}: {
  userId: string;
}) {
  const queryClient = useQueryClient();

  /*
   * MEMBERSHIP
   */

  const {
    data: membership,
    isLoading: membershipLoading,
  } = useQuery({
    queryKey: ["employer-membership", userId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          membership_status,
          membership_expires_at,
          cancel_at_period_end,
          stripe_customer_id,
          stripe_subscription_id
          `,
        )
        .eq("id", userId)
        .single();

      if (error) throw error;

      return data;
    },
  });

  /*
   * CHECKOUT
   */

  const checkout = useMutation({
    mutationFn: async () => {
      const { data, error } =
        await supabase.functions.invoke(
          "create-checkout",
          {
            body: {},
          },
        );

      if (error) throw error;

      if (!data?.url) {
        throw new Error(
          "Stripe checkout could not be opened.",
        );
      }

      return data.url as string;
    },

    onSuccess: (url) => {
      window.location.assign(url);
    },

    onError: () => {
      toast.error(
        "Could not start checkout. Please try again.",
      );
    },
  });

  /*
   * CUSTOMER PORTAL
   */

  const portal = useMutation({
    mutationFn: async () => {
      const { data, error } =
        await supabase.functions.invoke(
          "create-portal",
          {
            body: {},
          },
        );

      if (error) throw error;

      if (!data?.url) {
        throw new Error(
          "Billing portal could not be opened.",
        );
      }

      return data.url as string;
    },

    onSuccess: (url) => {
      window.location.assign(url);
    },

    onError: () => {
      toast.error(
        "Could not open membership settings.",
      );
    },
  });

  /*
   * EMPLOYER JOBS + APPLICATIONS
   */

  const {
    data: jobs,
    isLoading,
  } = useQuery({
    queryKey: ["employer-jobs", userId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select(
          `
          *,
          applications(
            id,
            candidate_id,
            full_name,
            email,
            phone,
            cover_note,
            status,
            created_at
          )
          `,
        )
        .eq("employer_id", userId)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      return data ?? [];
    },
  });

  /*
   * PUBLISH / HIDE
   */

  const togglePublish = useMutation({
    mutationFn: async ({
      id,
      value,
    }: {
      id: string;
      value: boolean;
    }) => {
      const { error } = await supabase
        .from("jobs")
        .update({
          is_published: value,
        })
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["employer-jobs"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  /*
   * DELETE JOB
   */

  const removeJob = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("jobs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      toast.success("Listing removed");

      void queryClient.invalidateQueries({
        queryKey: ["employer-jobs"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  /*
   * APPLICATION STATUS
   */

  const setStatus = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const { error } = await supabase
        .from("applications")
        .update({
          status,
        })
        .eq("id", id);

      if (error) throw error;
    },

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["employer-jobs"],
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  /*
   * MEMBERSHIP DISPLAY
   */

  const membershipActive =
    membership?.membership_status === "active";

  const cancellationScheduled =
    membershipActive &&
    membership?.cancel_at_period_end === true;

  const expiryDate =
    membership?.membership_expires_at
      ? new Date(
          membership.membership_expires_at,
        ).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

  return (
    <div className="mt-8 space-y-6">
      {/* MEMBERSHIP */}

      {membershipLoading ? (
        <Skeleton className="h-52 w-full rounded-2xl" />
      ) : membershipActive ? (
        <div className="rounded-2xl border border-border bg-sand p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                {cancellationScheduled ? (
                  <CalendarClock className="size-6 text-primary" />
                ) : (
                  <BadgeCheck className="size-6 text-primary" />
                )}

                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  Founding Employer
                </span>
              </div>

              {cancellationScheduled ? (
                <>
                  <h2 className="mt-3 font-display text-2xl font-bold">
                    Your membership is still active.
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    You've cancelled automatic renewal but can continue using
                    CRNWL until the end of your paid membership.
                  </p>

                  {expiryDate && (
                    <p className="mt-3 font-medium">
                      Full access until {expiryDate}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h2 className="mt-3 font-display text-2xl font-bold">
                    Your membership is active
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    You can post unlimited hospitality vacancies across CRNWL.
                  </p>

                  {expiryDate && (
                    <p className="mt-3 text-sm">
                      Current membership period until {expiryDate}
                    </p>
                  )}
                </>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  disabled={portal.isPending}
                  onClick={() => portal.mutate()}
                >
                  <Settings className="mr-2 size-4" />

                  {portal.isPending
                    ? "Opening…"
                    : cancellationScheduled
                      ? "Resume or manage membership"
                      : "Manage membership"}
                </Button>

                <Button asChild variant="accent">
                  <Link to="/post-job">
                    Post a job
                  </Link>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background px-6 py-5 text-center">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Membership
              </p>

              <p className="mt-2 font-display text-2xl font-bold text-primary">
                Active
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {cancellationScheduled
                  ? "Renewal cancelled"
                  : "Unlimited listings"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-sand p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="size-6 text-primary" />

                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  Founding Employer
                </span>
              </div>

              <h2 className="mt-3 font-display text-2xl font-bold">
                Unlimited job listings for £25 a year.
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                Advertise as many hospitality vacancies as your business needs.
              </p>
            </div>

            <Button
              type="button"
              variant="accent"
              disabled={checkout.isPending}
              onClick={() => checkout.mutate()}
            >
              {checkout.isPending
                ? "Opening checkout…"
                : "Join for £25/year"}
            </Button>
          </div>
        </div>
      )}

      {/* JOBS */}

      {isLoading ? (
        <Skeleton className="h-48 w-full" />
      ) : !jobs?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Briefcase className="mx-auto size-6 text-muted-foreground" />

          <p className="mt-3 font-medium">
            No listings yet
          </p>

          {membershipActive && (
            <Button
              asChild
              className="mt-4"
              variant="accent"
            >
              <Link to="/post-job">
                Post your first job
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          {membershipActive && (
            <div className="flex justify-end">
              <Button
                asChild
                variant="accent"
                size="sm"
              >
                <Link to="/post-job">
                  Post a job
                </Link>
              </Button>
            </div>
          )}

          {jobs.map((job) => {
            const applications =
              (job.applications ?? []) as Array<{
                id: string;
                candidate_id: string;
                full_name: string;
                email: string;
                phone: string | null;
                cover_note: string | null;
                status: string;
                created_at: string;
              }>;

            return (
              <div
                key={job.id}
                className="rounded-2xl border border-border bg-card p-5 sm:p-6"
              >
                {/* JOB HEADER */}

                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl font-semibold">
                      {job.title}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                      {job.location} · {job.job_type} ·{" "}
                      {formatPay(
                        job.pay_min,
                        job.pay_max,
                        job.pay_period,
                      )}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">
                      {job.is_published
                        ? "Live"
                        : "Hidden"}
                    </span>

                    <Switch
                      checked={job.is_published}
                      onCheckedChange={(value) =>
                        togglePublish.mutate({
                          id: job.id,
                          value,
                        })
                      }
                    />

                    <Button
                      asChild
                      variant="ghost"
                      size="icon"
                      aria-label="View listing"
                    >
                      <Link
                        to="/jobs/$jobId"
                        params={{
                          jobId: job.id,
                        }}
                      >
                        <ExternalLink className="size-4" />
                      </Link>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete listing"
                      onClick={() => {
                        if (
                          confirm(
                            "Delete this listing and its applications?",
                          )
                        ) {
                          removeJob.mutate(job.id);
                        }
                      }}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>

                {/* APPLICATIONS */}

                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold">
                    {applications.length} application
                    {applications.length === 1
                      ? ""
                      : "s"}
                  </p>

                  <div className="mt-3 space-y-3">
                    {applications.map((application) => {
                      const emailSubject =
                        `Your application for ${job.title} via Work in CRNWL`;

                      const emailBody =
                        `Hi ${application.full_name},\n\n` +
                        `Thank you for applying for our ${job.title} vacancy through Work in CRNWL.\n\n`;

                      const emailHref =
                        `mailto:${application.email}` +
                        `?subject=${encodeURIComponent(emailSubject)}` +
                        `&body=${encodeURIComponent(emailBody)}`;

                      const phoneHref =
                        application.phone
                          ? `tel:${application.phone.replace(/\s+/g, "")}`
                          : null;

                      return (
                        <div
                          key={application.id}
                          className="overflow-hidden rounded-xl border border-border bg-background p-4"
                        >
                          {/*
                           * MOBILE FIX:
                           * Stack candidate details and status vertically
                           * on small screens.
                           */}

                          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="font-medium">
                                {application.full_name}
                              </p>

                              <div className="mt-1 space-y-1 text-xs text-muted-foreground">
                                <div className="flex min-w-0 items-start gap-1.5">
                                  <Mail className="mt-0.5 size-3 shrink-0" />

                                  <span className="min-w-0 break-all">
                                    {application.email}
                                  </span>
                                </div>

                                {application.phone && (
                                  <div className="flex items-center gap-1.5">
                                    <Phone className="size-3 shrink-0" />

                                    <span>
                                      {application.phone}
                                    </span>
                                  </div>
                                )}

                                <p>
                                  {timeAgo(
                                    application.created_at,
                                  )}
                                </p>
                              </div>

                              {/* CONTACT ACTIONS */}

                              <div className="mt-4 flex flex-wrap gap-2">
                                <Button
                                  asChild
                                  variant="accent"
                                  size="sm"
                                >
                                  <a href={emailHref}>
                                    <Mail className="mr-2 size-4" />
                                    Email candidate
                                  </a>
                                </Button>

                                {phoneHref && (
                                  <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                  >
                                    <a href={phoneHref}>
                                      <Phone className="mr-2 size-4" />
                                      Call candidate
                                    </a>
                                  </Button>
                                )}

                                <Button
                                  asChild
                                  variant="outline"
                                  size="sm"
                                >
                                  <Link
                                    to="/candidates/$candidateId"
                                    params={{
                                      candidateId:
                                        application.candidate_id,
                                    }}
                                  >
                                    <UserRound className="mr-2 size-4" />
                                    View profile
                                  </Link>
                                </Button>
                              </div>
                            </div>

                            {/* STATUS */}

                            <div className="w-full sm:w-44 sm:shrink-0">
                              <p className="mb-1.5 text-xs font-medium text-muted-foreground sm:hidden">
                                Application status
                              </p>

                              <Select
                                value={application.status}
                                onValueChange={(status) =>
                                  setStatus.mutate({
                                    id: application.id,
                                    status,
                                  })
                                }
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                  {APPLICATION_STATUSES.map(
                                    (status) => (
                                      <SelectItem
                                        key={status.value}
                                        value={status.value}
                                      >
                                        {status.label}
                                      </SelectItem>
                                    ),
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {/* COVER NOTE */}

                          {application.cover_note && (
                            <div className="mt-4 rounded-lg bg-secondary/40 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                Candidate note
                              </p>

                              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                                {application.cover_note}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {applications.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        No applications yet -- share the listing link to get
                        things moving.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

function CandidateView({
  userId,
}: {
  userId: string;
}) {
  /*
   * PROFILE COMPLETION
   */

  const {
    data: candidateProfile,
    isLoading: profileLoading,
  } = useQuery({
    queryKey: ["candidate-profile-completion", userId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          full_name,
          phone,
          location,
          bio,
          "current_role",
          years_experience,
          experience_tags,
          available_immediately,
          available_from,
          work_preferences,
          preferred_locations
          `,
        )
        .eq("id", userId)
        .single();

      if (error) throw error;

      return data;
    },
  });

  /*
   * APPLICATIONS
   */

  const {
    data: applications,
    isLoading: applicationsLoading,
  } = useQuery({
    queryKey: ["my-applications", userId],

    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(
          `
          id,
          status,
          created_at,
          jobs(
            id,
            title,
            company_name,
            location
          )
          `,
        )
        .eq("candidate_id", userId)
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      return data ?? [];
    },
  });

  if (
    profileLoading ||
    applicationsLoading
  ) {
    return (
      <Skeleton className="mt-8 h-40 w-full" />
    );
  }

  const profileChecks = [
    {
      label: "full name",
      complete:
        !!candidateProfile?.full_name?.trim(),
    },
    {
      label: "location",
      complete:
        !!candidateProfile?.location?.trim(),
    },
    {
      label: "bio",
      complete:
        !!candidateProfile?.bio?.trim(),
    },
    {
      label: "current or recent role",
      complete:
        !!candidateProfile?.current_role?.trim(),
    },
    {
      label: "years of experience",
      complete:
        !!candidateProfile?.years_experience,
    },
    {
      label: "experience tags",
      complete:
        (candidateProfile?.experience_tags?.length ??
          0) > 0,
    },
    {
      label: "availability",
      complete:
        candidateProfile?.available_immediately ===
          true ||
        !!candidateProfile?.available_from,
    },
    {
      label: "work preferences",
      complete:
        (candidateProfile?.work_preferences
          ?.length ?? 0) > 0,
    },
    {
      label: "preferred locations",
      complete:
        (candidateProfile?.preferred_locations
          ?.length ?? 0) > 0,
    },
    {
      label: "phone number",
      complete:
        !!candidateProfile?.phone?.trim(),
    },
  ];

  const completedItems =
    profileChecks.filter(
      (item) => item.complete,
    ).length;

  const profilePercentage = Math.round(
    (completedItems /
      profileChecks.length) *
      100,
  );

  const missingItems = profileChecks
    .filter((item) => !item.complete)
    .map((item) => item.label);

  return (
    <div className="mt-8 space-y-6">
      {/* PROFILE COMPLETION */}

      <div className="rounded-2xl border border-border bg-sand p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {profilePercentage === 100 ? (
                <CheckCircle2 className="size-6 text-primary" />
              ) : (
                <UserRound className="size-6 text-primary" />
              )}

              <p className="font-display text-xl font-bold">
                Your candidate profile
              </p>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4">
              <p className="text-sm font-medium">
                {profilePercentage === 100
                  ? "Profile complete"
                  : `${profilePercentage}% complete`}
              </p>

              <span className="text-sm font-bold text-primary">
                {profilePercentage}%
              </span>
            </div>

            <div className="mt-2 h-3 overflow-hidden rounded-full bg-background">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{
                  width: `${profilePercentage}%`,
                }}
              />
            </div>

            {profilePercentage === 100 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Your profile is complete and ready for employers to view when
                you apply.
              </p>
            ) : (
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Add a little more to help employers understand who you are.
                </p>

                <p className="mt-2 text-sm">
                  <span className="font-medium">
                    Still to add:
                  </span>{" "}
                  {missingItems
                    .slice(0, 3)
                    .join(", ")}
                  {missingItems.length > 3
                    ? ` + ${missingItems.length - 3} more`
                    : ""}
                </p>
              </div>
            )}
          </div>

          <Button
            asChild
            variant="accent"
            className="shrink-0"
          >
            <Link to="/profile">
              {profilePercentage === 100
                ? "Edit My Profile"
                : "Complete My Profile"}
            </Link>
          </Button>
        </div>
      </div>

      {/* CANDIDATE APPLICATIONS */}

      {!applications?.length ? (
        <div className="rounded-2xl border border-dashed border-border p-12 text-center">
          <Briefcase className="mx-auto size-6 text-muted-foreground" />

          <p className="mt-3 font-medium">
            You haven't applied to anything yet
          </p>

          <Button
            asChild
            className="mt-4"
          >
            <Link to="/jobs">
              Browse jobs
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((application) => {
            const job =
              application.jobs as unknown as {
                id: string;
                title: string;
                company_name: string;
                location: string;
              } | null;

            const label =
              APPLICATION_STATUSES.find(
                (status) =>
                  status.value ===
                  application.status,
              )?.label ??
              application.status;

            return (
              <div
                key={application.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5"
              >
                <div>
                  {job ? (
                    <Link
                      to="/jobs/$jobId"
                      params={{
                        jobId: job.id,
                      }}
                      className="font-display text-lg font-semibold hover:text-primary"
                    >
                      {job.title}
                    </Link>
                  ) : (
                    <p className="font-display text-lg font-semibold">
                      Listing removed
                    </p>
                  )}

                  <p className="text-sm text-muted-foreground">
                    {job
                      ? `${job.company_name} · ${job.location} · `
                      : ""}
                    applied{" "}
                    {timeAgo(
                      application.created_at,
                    ).toLowerCase()}
                  </p>
                </div>

                <Badge variant="secondary">
                  {label}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}