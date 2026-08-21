import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { CATEGORIES, CORNWALL_LOCATIONS, JOB_TYPES } from "@/lib/jobs-data";

export const Route = createFileRoute("/post-job")({
  head: () => ({
    meta: [
      { title: "Post a Hospitality Job in Cornwall | Work in CRNWL" },
      {
        name: "description",
        content:
          "Publish your Cornish hospitality vacancy in minutes — set the town, trade, pay, shift pattern and live-in options.",
      },
      { property: "og:title", content: "Post a Hospitality Job in Cornwall" },
      {
        property: "og:description",
        content: "List your vacancy on Cornwall's hospitality jobs board.",
      },
    ],
  }),
  component: PostJobPage,
});

function PostJobPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    company_name: "",
    location: "Newquay",
    category: "kitchen",
    job_type: "Full-time",
    pay_min: "",
    pay_max: "",
    pay_period: "hour",
    description: "",
    requirements: "",
    perks: "",
    contact_email: "",
    live_in: false,
  });

  useEffect(() => {
    if (!loading && !user) void navigate({ to: "/auth", search: { mode: "employer" } });
  }, [loading, user, navigate]);

  useEffect(() => {
    if (profile) {
      setForm((f) => ({
        ...f,
        company_name: f.company_name || profile.company_name || "",
        location: profile.company_location || f.location,
      }));
    }
  }, [profile]);

  if (!loading && user && profile && profile.account_type !== "employer") {
    return (
      <div className="mx-auto w-full max-w-xl px-4 py-20 text-center">
        <h1 className="font-display text-2xl font-bold">Employer accounts only</h1>
        <p className="mt-2 text-muted-foreground">
          You're signed in as a candidate. Sign out and create an employer account to post roles.
        </p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("jobs")
      .insert({
        employer_id: user.id,
        title: form.title,
        company_name: form.company_name,
        location: form.location,
        category: form.category,
        job_type: form.job_type,
        pay_min: form.pay_min ? Number(form.pay_min) : null,
        pay_max: form.pay_max ? Number(form.pay_max) : null,
        pay_period: form.pay_period,
        description: form.description,
        requirements: form.requirements || null,
        perks: form.perks || null,
        contact_email: form.contact_email || null,
        live_in: form.live_in,
      })
      .select("id")
      .single();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Your job is live");
    void navigate({ to: "/jobs/$jobId", params: { jobId: data.id } });
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12">
      <h1 className="font-display text-3xl font-bold">Post a job</h1>
      <p className="mt-2 text-muted-foreground">
        Clear pay and shift details get up to three times more applications.
      </p>

      <form className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6" onSubmit={submit}>
        <div className="grid gap-2">
          <Label htmlFor="title">Job title</Label>
          <Input
            id="title"
            required
            placeholder="Chef de Partie"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="company">Business name</Label>
          <Input
            id="company"
            required
            placeholder="The Harbour Inn"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label>Town</Label>
            <Select
              value={form.location}
              onValueChange={(v) => setForm({ ...form, location: v })}
            >
              <SelectTrigger aria-label="Town">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CORNWALL_LOCATIONS.map((l) => (
                  <SelectItem key={l} value={l}>
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Trade</Label>
            <Select
              value={form.category}
              onValueChange={(v) => setForm({ ...form, category: v })}
            >
              <SelectTrigger aria-label="Trade">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Contract</Label>
            <Select
              value={form.job_type}
              onValueChange={(v) => setForm({ ...form, job_type: v })}
            >
              <SelectTrigger aria-label="Contract type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {JOB_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="pay_min">Pay from (£)</Label>
            <Input
              id="pay_min"
              type="number"
              step="0.01"
              min="0"
              value={form.pay_min}
              onChange={(e) => setForm({ ...form, pay_min: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="pay_max">Pay to (£)</Label>
            <Input
              id="pay_max"
              type="number"
              step="0.01"
              min="0"
              value={form.pay_max}
              onChange={(e) => setForm({ ...form, pay_max: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Per</Label>
            <Select
              value={form.pay_period}
              onValueChange={(v) => setForm({ ...form, pay_period: v })}
            >
              <SelectTrigger aria-label="Pay period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">Hour</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="year">Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Job description</Label>
          <Textarea
            id="description"
            required
            rows={7}
            placeholder="What the role involves, the team, covers per service, shift pattern…"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="requirements">Requirements (optional)</Label>
          <Textarea
            id="requirements"
            rows={4}
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="perks">Perks (optional)</Label>
          <Textarea
            id="perks"
            rows={3}
            placeholder="Tips, staff food, accommodation, season bonus…"
            value={form.perks}
            onChange={(e) => setForm({ ...form, perks: e.target.value })}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact_email">Contact email (optional)</Label>
          <Input
            id="contact_email"
            type="email"
            value={form.contact_email}
            onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border p-4">
          <div>
            <p className="text-sm font-medium">Live-in accommodation available</p>
            <p className="text-xs text-muted-foreground">A big draw for seasonal candidates.</p>
          </div>
          <Switch
            checked={form.live_in}
            onCheckedChange={(v) => setForm({ ...form, live_in: v })}
            aria-label="Live-in available"
          />
        </div>

        <Button type="submit" size="lg" variant="accent" disabled={busy}>
          {busy ? "Publishing…" : "Publish job"}
        </Button>
      </form>
    </div>
  );
}
