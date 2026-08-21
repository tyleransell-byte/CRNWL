import { Link } from "@tanstack/react-router";
import { Banknote, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { categoryLabel, formatPay, timeAgo } from "@/lib/jobs-data";

export type JobSummary = {
  id: string;
  title: string;
  company_name: string;
  location: string;
  category: string;
  job_type: string;
  pay_min: number | null;
  pay_max: number | null;
  pay_period: string;
  live_in: boolean;
  created_at: string;
};

export function JobCard({ job }: { job: JobSummary }) {
  return (
    <Link
      to="/jobs/$jobId"
      params={{ jobId: job.id }}
      className="group block rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-harbour"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold leading-snug group-hover:text-primary">
            {job.title}
          </h3>
          <p className="text-sm text-muted-foreground">{job.company_name}</p>
        </div>
        <Badge variant="secondary">{categoryLabel(job.category)}</Badge>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-4" /> {job.location}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Banknote className="size-4" />
          {formatPay(job.pay_min, job.pay_max, job.pay_period)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-4" /> {job.job_type}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between">
        {job.live_in ? (
          <Badge variant="outline">Live-in available</Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Non live-in</span>
        )}
        <span className="text-xs text-muted-foreground">{timeAgo(job.created_at)}</span>
      </div>
    </Link>
  );
}
