import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  Briefcase,
  Check,
  CreditCard,
  LockKeyhole,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/post-job")({
  head: () => ({
    meta: [
      {
        title: "Post a Hospitality Job | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Post a hospitality vacancy to Cornwall's dedicated hospitality jobs board.",
      },
    ],
  }),
  component: PostJobPage,
});

const categories = [
  "Kitchen",
  "Front of house",
  "Bar",
  "Housekeeping",
  "Hotel",
  "Management",
  "Events",
  "Other",
];

const jobTypes = [
  "Full-time",
  "Part-time",
  "Seasonal",
  "Temporary",
  "Permanent",
  "Casual",
];

const payPeriods = [
  { value: "hour", label: "Per hour" },
  { value: "day", label: "Per day" },
  { value: "week", label: "Per week" },
  { value: "month", label: "Per month" },
  { value: "year", label: "Per year" },
];

const benefitOptions = [
  "Holiday pay",
  "Company car",
  "Tips / service charge",
  "Staff meals",
  "Staff accommodation",
  "Pension",
  "Flexible hours",
  "Staff discount",
  "Free parking",
  "Training provided",
  "Uniform provided",
  "Bonus scheme",
];

function PostJobPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  const [checkoutBusy, setCheckoutBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      void navigate({
        to: "/auth",
        search: { mode: "employer" },
      });
    }
  }, [loading, user, navigate]);

  const {
    data: membership,
    isLoading: membershipLoading,
    refetch: refetchMembership,
  } = useQuery({
    queryKey: ["post-job-membership", user?.id],

    enabled: !!user,

    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select(
          "account_type, company_name, membership_status, membership_expires_at",
        )
        .eq("id", user.id)
        .single();

      if (error) throw error;

      return data;
    },
  });

  const startCheckout = async () => {
    if (!user) {
      void navigate({
        to: "/auth",
        search: { mode: "employer" },
      });
      return;
    }

    setCheckoutBusy(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {},
        },
      );

      if (error) throw error;

      if (!data?.url) {
        throw new Error("Stripe checkout could not be opened.");
      }

      window.location.assign(data.url);
    } catch (error) {
      console.error(error);
      toast.error("Could not start checkout. Please try again.");
      setCheckoutBusy(false);
    }
  };

  if (loading || !user || membershipLoading) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-12">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  if (
    profile?.account_type !== "employer" ||
    membership?.account_type !== "employer"
  ) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <LockKeyhole className="mx-auto size-9 text-primary" />

          <h1 className="mt-4 font-display text-3xl font-bold">
            Employer accounts only
          </h1>

          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Job listings can only be posted through a CRNWL employer account.
          </p>

          <Button asChild className="mt-6" variant="accent">
            <Link to="/employers">For employers</Link>
          </Button>
        </div>
      </div>
    );
  }

  const membershipActive =
    membership?.membership_status === "active";

  if (!membershipActive) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-14">
        <div className="rounded-2xl border border-border bg-sand p-8 sm:p-10">
          <div className="flex items-center gap-2">
            <CreditCard className="size-6 text-primary" />

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Founding Employer
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight">
            Post unlimited jobs for £25 a year.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-muted-foreground">
            An active CRNWL employer membership is required before publishing
            vacancies.
          </p>

          <div className="mt-7 grid gap-3">
            {[
              "Unlimited job listings for 12 months",
              "Manage every vacancy from your dashboard",
              "Receive applications directly through CRNWL",
              "No per-job fees",
              "No recruitment agency commission",
            ].map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-4" />
                </span>

                <span>{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border bg-background p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Founding Employer membership
                </p>

                <p className="mt-1">
                  <span className="font-display text-4xl font-extrabold">
                    £25
                  </span>

                  <span className="text-muted-foreground"> / year</span>
                </p>
              </div>

              <Button
                type="button"
                size="lg"
                variant="accent"
                disabled={checkoutBusy}
                onClick={startCheckout}
              >
                {checkoutBusy
                  ? "Opening checkout…"
                  : "Join for £25/year"}
              </Button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void refetchMembership()}
            className="mt-5 text-sm font-medium text-primary underline underline-offset-4"
          >
            I've already paid -- refresh membership
          </button>
        </div>
      </div>
    );
  }

  return (
    <JobForm
      userId={user.id}
      companyName={
        membership?.company_name ||
        profile?.company_name ||
        ""
      }
      email={user.email ?? ""}
    />
  );
}

function JobForm({
  userId,
  companyName,
  email,
}: {
  userId: string;
  companyName: string;
  email: string;
}) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    title: "",
    company_name: companyName,
    location: "",
    category: "Other",
    job_type: "Full-time",
    pay_min: "",
    pay_max: "",
    pay_period: "hour",
    description: "",
    requirements: "",
    perks: "",
    benefits: [] as string[],
    contact_email: email,
    live_in: false,
  });

  const toggleBenefit = (benefit: string) => {
    setForm((current) => ({
      ...current,
      benefits: current.benefits.includes(benefit)
        ? current.benefits.filter((item) => item !== benefit)
        : [...current.benefits, benefit],
    }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Add a job title.");
      return;
    }

    if (!form.company_name.trim()) {
      toast.error("Add your business name.");
      return;
    }

    if (!form.location.trim()) {
      toast.error("Add the job location.");
      return;
    }

    if (!form.description.trim()) {
      toast.error("Add a job description.");
      return;
    }

    setBusy(true);

    try {
      const { data: membership, error: membershipError } =
        await supabase
          .from("profiles")
          .select("account_type, membership_status")
          .eq("id", userId)
          .single();

      if (membershipError) throw membershipError;

      if (
        membership.account_type !== "employer" ||
        membership.membership_status !== "active"
      ) {
        toast.error(
          "An active employer membership is required to post jobs.",
        );
        setBusy(false);
        return;
      }

      const payMin =
        form.pay_min.trim() === ""
          ? null
          : Number(form.pay_min);

      const payMax =
        form.pay_max.trim() === ""
          ? null
          : Number(form.pay_max);

      const newJob = {
        employer_id: userId,
        title: form.title.trim(),
        company_name: form.company_name.trim(),
        location: form.location.trim(),
        category: form.category,
        job_type: form.job_type,
        pay_min: payMin,
        pay_max: payMax,
        pay_period: form.pay_period,
        description: form.description.trim(),
        requirements: form.requirements.trim() || null,
        perks: form.perks.trim() || null,
        benefits: form.benefits,
        contact_email: form.contact_email.trim() || null,
        live_in: form.live_in,
        is_published: true,
      };

      const { data, error } = await supabase
        .from("jobs")
        .insert(newJob as any)
        .select("id")
        .single();

      if (error) throw error;

      toast.success("Your job is live");

      void navigate({
        to: "/jobs/$jobId",
        params: {
          jobId: data.id,
        },
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not publish the job.",
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Briefcase className="size-5" />
        </span>

        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
            <BadgeCheck className="size-4" />
            Active employer membership
          </p>

          <h1 className="font-display text-3xl font-bold">
            Post a job
          </h1>
        </div>
      </div>

      <p className="mt-4 text-muted-foreground">
        Tell candidates what the role involves, where they'll be working and
        what you're offering.
      </p>

      <form
        onSubmit={submit}
        className="mt-8 space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <section className="space-y-5">
          <h2 className="font-display text-xl font-bold">
            The role
          </h2>

          <div className="grid gap-2">
            <Label htmlFor="title">Job title</Label>

            <Input
              id="title"
              required
              placeholder="Chef de Partie"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="company">Business name</Label>

            <Input
              id="company"
              required
              value={form.company_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  company_name: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="location">Location</Label>

            <Input
              id="location"
              required
              placeholder="St Ives"
              value={form.location}
              onChange={(e) =>
                setForm({
                  ...form,
                  location: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Category</Label>

              <Select
                value={form.category}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    category: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem
                      key={category}
                      value={category}
                    >
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Job type</Label>

              <Select
                value={form.job_type}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    job_type: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-5 border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            Pay
          </h2>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="grid gap-2">
              <Label htmlFor="pay-min">Minimum</Label>

              <Input
                id="pay-min"
                type="number"
                min="0"
                step="0.01"
                placeholder="12"
                value={form.pay_min}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pay_min: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="pay-max">Maximum</Label>

              <Input
                id="pay-max"
                type="number"
                min="0"
                step="0.01"
                placeholder="15"
                value={form.pay_max}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pay_max: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Pay period</Label>

              <Select
                value={form.pay_period}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    pay_period: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {payPeriods.map((period) => (
                    <SelectItem
                      key={period.value}
                      value={period.value}
                    >
                      {period.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        <section className="space-y-5 border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            About the job
          </h2>

          <div className="grid gap-2">
            <Label htmlFor="description">
              Job description
            </Label>

            <textarea
              id="description"
              required
              rows={7}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Tell candidates what a typical shift looks like..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="requirements">
              Experience / requirements
            </Label>

            <textarea
              id="requirements"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Experience helpful, but attitude matters..."
              value={form.requirements}
              onChange={(e) =>
                setForm({
                  ...form,
                  requirements: e.target.value,
                })
              }
            />
          </div>
        </section>

        {/* BENEFITS */}

        <section className="space-y-5 border-t border-border pt-7">
          <div>
            <h2 className="font-display text-xl font-bold">
              Benefits & perks
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Select everything that comes with this role.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {benefitOptions.map((benefit) => {
              const selected =
                form.benefits.includes(benefit);

              return (
                <label
                  key={benefit}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    selected
                      ? "border-primary bg-secondary"
                      : "border-border bg-background hover:bg-secondary/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      toggleBenefit(benefit)
                    }
                    className="size-4 accent-current"
                  />

                  <span className="text-sm font-medium">
                    {benefit}
                  </span>
                </label>
              );
            })}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="perks">
              Anything else?
            </Label>

            <textarea
              id="perks"
              rows={4}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Add any other benefits or perks..."
              value={form.perks}
              onChange={(e) =>
                setForm({
                  ...form,
                  perks: e.target.value,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">
                Live-in accommodation available
              </p>

              <p className="text-sm text-muted-foreground">
                Let candidates know accommodation can be provided.
              </p>
            </div>

            <Switch
              checked={form.live_in}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  live_in: checked,
                })
              }
            />
          </div>
        </section>

        <section className="space-y-5 border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            Contact
          </h2>

          <div className="grid gap-2">
            <Label htmlFor="contact-email">
              Contact email
            </Label>

            <Input
              id="contact-email"
              type="email"
              value={form.contact_email}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact_email: e.target.value,
                })
              }
            />
          </div>
        </section>

        <div className="flex flex-col gap-3 border-t border-border pt-7 sm:flex-row sm:justify-end">
          <Button asChild type="button" variant="outline">
            <Link to="/dashboard">Cancel</Link>
          </Button>

          <Button
            type="submit"
            variant="accent"
            disabled={busy}
          >
            {busy ? "Publishing…" : "Publish job"}
          </Button>
        </div>
      </form>
    </div>
  );
}