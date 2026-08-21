import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { toast } from "sonner";
import { Briefcase, ExternalLink, Mail, Phone, Trash2 } from "lucide-react";
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
import { APPLICATION_STATUSES, formatPay, timeAgo } from "@/lib/jobs-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Dashboard | Work in CRNWL" },
      {
        name: "description",
        content:
          "Manage your Cornwall hospitality job listings and applications in one place on Work in CRNWL.",
      },
      { property: "og:title", content: "Your Dashboard | Work in CRNWL" },
      {
        property: "og:description",
        content: "Manage listings and applications on Cornwall's hospitality jobs board.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth" });
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
        {profile?.account_type === "employer" ? "Employer dashboard" : "Your applications"}
      </h1>
      <p className="mt-2 text-muted-foreground">
        {profile?.full_name ? `Signed in as ${profile.full_name}` : user.email}
      </p>

      {profile?.account_type === "employer" ? (
        <EmployerView userId={user.id} />
      ) : (
        <CandidateView userId={user.id} />
      )}
    </div>
  );
}

function EmployerView({ userId }: { userId: string }) {
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["employer-jobs", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*, applications(id, full_name, email, phone, cover_note, status, created_at)")
        .eq("employer_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const togglePublish = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      const { error } = await supabase.from("jobs").update({ is_published: value }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["employer-jobs"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const removeJob = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("jobs").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Listing removed");
      void queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: ["employer-jobs"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  if (isLoading) return <Skeleton className="mt-8 h-48 w-full" />;

  if (!jobs?.length) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center">
        <Briefcase className="mx-auto size-6 text-muted-foreground" />
        <p className="mt-3 font-medium">No listings yet</p>
        <Button asChild className="mt-4" variant="accent">
          <Link to="/post-job">Post your first job</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-5">
      <div className="flex justify-end">
        <Button asChild variant="accent" size="sm">
          <Link to="/post-job">Post a job</Link>
        </Button>
      </div>

      {jobs.map((job) => {
        const applications = (job.applications ?? []) as Array<{
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          cover_note: string | null;
          status: string;
          created_at: string;
        }>;

        return (
          <div key={job.id} className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold">{job.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {job.location} · {job.job_type} ·{" "}
                  {formatPay(job.pay_min, job.pay_max, job.pay_period)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">
                  {job.is_published ? "Live" : "Hidden"}
                </span>
                <Switch
                  checked={job.is_published}
                  aria-label="Published"
                  onCheckedChange={(v) => togglePublish.mutate({ id: job.id, value: v })}
                />
                <Button asChild variant="ghost" size="icon" aria-label="View listing">
                  <Link to="/jobs/$jobId" params={{ jobId: job.id }}>
                    <ExternalLink className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete listing"
                  onClick={() => {
                    if (confirm("Delete this listing and its applications?"))
                      removeJob.mutate(job.id);
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-sm font-semibold">
                {applications.length} application{applications.length === 1 ? "" : "s"}
              </p>
              <div className="mt-3 space-y-3">
                {applications.map((a) => (
                  <div key={a.id} className="rounded-lg border border-border bg-background p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">{a.full_name}</p>
                        <p className="mt-1 flex flex-wrap gap-x-4 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <Mail className="size-3" /> {a.email}
                          </span>
                          {a.phone && (
                            <span className="inline-flex items-center gap-1">
                              <Phone className="size-3" /> {a.phone}
                            </span>
                          )}
                          <span>{timeAgo(a.created_at)}</span>
                        </p>
                      </div>
                      <Select
                        value={a.status}
                        onValueChange={(v) => setStatus.mutate({ id: a.id, status: v })}
                      >
                        <SelectTrigger className="w-44" aria-label="Application status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {APPLICATION_STATUSES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {a.cover_note && (
                      <p className="mt-3 whitespace-pre-wrap text-sm text-muted-foreground">
                        {a.cover_note}
                      </p>
                    )}
                  </div>
                ))}
                {applications.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No applications yet — share the listing link to get things moving.
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CandidateView({ userId }: { userId: string }) {
  const { data: applications, isLoading } = useQuery({
    queryKey: ["my-applications", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("applications")
        .select("id, status, created_at, jobs(id, title, company_name, location)")
        .eq("candidate_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) return <Skeleton className="mt-8 h-40 w-full" />;

  if (!applications?.length) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-border p-12 text-center">
        <Briefcase className="mx-auto size-6 text-muted-foreground" />
        <p className="mt-3 font-medium">You haven't applied to anything yet</p>
        <Button asChild className="mt-4">
          <Link to="/jobs">Browse jobs</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-3">
      {applications.map((a) => {
        const job = a.jobs as unknown as {
          id: string;
          title: string;
          company_name: string;
          location: string;
        } | null;
        const label =
          APPLICATION_STATUSES.find((s) => s.value === a.status)?.label ?? a.status;
        return (
          <div
            key={a.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card p-5"
          >
            <div>
              {job ? (
                <Link
                  to="/jobs/$jobId"
                  params={{ jobId: job.id }}
                  className="font-display text-lg font-semibold hover:text-primary"
                >
                  {job.title}
                </Link>
              ) : (
                <p className="font-display text-lg font-semibold">Listing removed</p>
              )}
              <p className="text-sm text-muted-foreground">
                {job ? `${job.company_name} · ${job.location} · ` : ""}
                applied {timeAgo(a.created_at).toLowerCase()}
              </p>
            </div>
            <Badge variant="secondary">{label}</Badge>
          </div>
        );
      })}
    </div>
  );
}
