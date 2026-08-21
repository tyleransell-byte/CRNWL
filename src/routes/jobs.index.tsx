import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { JobCard, type JobSummary } from "@/components/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORIES, CORNWALL_LOCATIONS, JOB_TYPES } from "@/lib/jobs-data";

type JobSearch = {
  q?: string | undefined;
  location?: string | undefined;
  category?: string | undefined;
  type?: string | undefined;
};

export const Route = createFileRoute("/jobs/")({
  validateSearch: (search: Record<string, unknown>): JobSearch => ({
    q: typeof search["q"] === "string" && search["q"] ? (search["q"] as string) : undefined,
    location:
      typeof search["location"] === "string" && search["location"]
        ? (search["location"] as string)
        : undefined,
    category:
      typeof search["category"] === "string" && search["category"]
        ? (search["category"] as string)
        : undefined,
    type: typeof search["type"] === "string" && search["type"] ? (search["type"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Browse Hospitality Jobs in Cornwall | Work in CRNWL" },
      {
        name: "description",
        content:
          "Search live hospitality vacancies across Cornwall by town, trade and contract type — chefs, bar, front of house, housekeeping and management.",
      },
      { property: "og:title", content: "Browse Hospitality Jobs in Cornwall" },
      {
        property: "og:description",
        content: "Live Cornish hospitality vacancies, updated daily on Work in CRNWL.",
      },
    ],
  }),
  component: JobsPage,
});

const ANY = "__any";

function JobsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/jobs/" });
  const [keyword, setKeyword] = useState(search.q ?? "");

  const setSearch = (patch: Partial<JobSearch>) =>
    navigate({ search: (prev: JobSearch) => ({ ...prev, ...patch }) });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs", search],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select(
          "id, title, company_name, location, category, job_type, pay_min, pay_max, pay_period, live_in, created_at",
        )
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (search.location) query = query.eq("location", search.location);
      if (search.category) query = query.eq("category", search.category);
      if (search.type) query = query.eq("job_type", search.type);
      if (search.q) {
        const term = `%${search.q}%`;
        query = query.or(
          `title.ilike.${term},company_name.ilike.${term},description.ilike.${term}`,
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data ?? []) as JobSummary[];
    },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Hospitality jobs in Cornwall</h1>
      <p className="mt-2 text-muted-foreground">
        {isLoading ? "Loading roles…" : `${jobs?.length ?? 0} live role${jobs?.length === 1 ? "" : "s"}`}
      </p>

      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <form
          className="flex flex-col gap-3 md:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch({ q: keyword || undefined });
          }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job title, pub or keyword"
              aria-label="Keyword"
              className="pl-9"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Select
            value={search.location ?? ANY}
            onValueChange={(v) => setSearch({ location: v === ANY ? undefined : v })}
          >
            <SelectTrigger aria-label="Location">
              <SelectValue placeholder="Anywhere in Cornwall" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Anywhere in Cornwall</SelectItem>
              {CORNWALL_LOCATIONS.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={search.category ?? ANY}
            onValueChange={(v) => setSearch({ category: v === ANY ? undefined : v })}
          >
            <SelectTrigger aria-label="Category">
              <SelectValue placeholder="All trades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>All trades</SelectItem>
              {CATEGORIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={search.type ?? ANY}
            onValueChange={(v) => setSearch({ type: v === ANY ? undefined : v })}
          >
            <SelectTrigger aria-label="Contract type">
              <SelectValue placeholder="Any contract" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ANY}>Any contract</SelectItem>
              {JOB_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)}
        {jobs?.map((job) => <JobCard key={job.id} job={job} />)}
      </div>

      {!isLoading && jobs?.length === 0 && (
        <div className="mt-6 rounded-xl border border-dashed border-border p-12 text-center">
          <SlidersHorizontal className="mx-auto size-6 text-muted-foreground" />
          <p className="mt-3 font-medium">No roles match those filters</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setKeyword("");
              navigate({
                search: { q: undefined, location: undefined, category: undefined, type: undefined },
              });
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
