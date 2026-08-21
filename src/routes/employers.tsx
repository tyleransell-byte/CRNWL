import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  BadgePoundSterling,
  Check,
  Inbox,
  MapPinned,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/employers")({
  head: () => ({
    meta: [
      { title: "Hire Hospitality Staff in Cornwall | Work in CRNWL" },
      {
        name: "description",
        content:
          "Post unlimited hospitality vacancies across Cornwall with CRNWL. Founding Employer membership is £25 per year.",
      },
      {
        property: "og:title",
        content: "Hire Hospitality Staff in Cornwall",
      },
      {
        property: "og:description",
        content:
          "Post unlimited vacancies to Cornwall's dedicated hospitality jobs board.",
      },
    ],
  }),
  component: EmployersPage,
});

const points = [
  {
    icon: MapPinned,
    title: "Cornwall only",
    body: "No national noise. Every candidate here is looking for work between Bude and Land's End.",
  },
  {
    icon: Timer,
    title: "Live in two minutes",
    body: "Write the role, set the pay and shift pattern, publish. Edit or close it whenever you like.",
  },
  {
    icon: Inbox,
    title: "Applicants in one place",
    body: "Every application lands in your dashboard with contact details and a status you control.",
  },
  {
    icon: BadgePoundSterling,
    title: "No agency fees",
    body: "Direct hiring, so the money stays in your business instead of a recruiter's margin.",
  },
];

const membershipBenefits = [
  "Unlimited job listings for 12 months",
  "Manage every vacancy from one dashboard",
  "Receive applications directly through CRNWL",
  "Post seasonal, permanent and part-time roles",
  "No per-job fees",
  "No recruitment agency commission",
];

function EmployersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14">
      {/* HERO */}
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
          Built for Cornwall hospitality
        </p>

        <h1 className="mt-3 max-w-2xl font-display text-4xl font-extrabold leading-tight">
          Hire hospitality staff who actually want to work in Cornwall.
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          Work in CRNWL is a jobs board built for Cornish pubs, hotels,
          restaurants, cafés and event caterers -- from a single seasonal KP
          to a full brigade.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="accent">
            <Link to="/auth" search={{ mode: "employer" }}>
              Create employer account
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline">
            <Link to="/post-job">Post a job</Link>
          </Button>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="mt-14 grid gap-4 sm:grid-cols-2">
        {points.map((p) => (
          <div
            key={p.title}
            className="rounded-xl border border-border bg-card p-6"
          >
            <p.icon className="size-5 text-primary" />

            <h2 className="mt-3 font-display text-lg font-semibold">
              {p.title}
            </h2>

            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              {p.body}
            </p>
          </div>
        ))}
      </section>

      {/* FOUNDING EMPLOYER */}
      <section className="mt-16">
        <div className="overflow-hidden rounded-2xl border border-border bg-sand">
          <div className="p-8 sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                <BadgeCheck className="size-3.5" />
                Founding Employer
              </span>

              <span className="text-sm font-medium text-muted-foreground">
                Early access pricing
              </span>
            </div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
              <div>
                <h2 className="font-display text-3xl font-extrabold">
                  Unlimited hiring. One simple annual price.
                </h2>

                <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
                  Become a CRNWL Founding Employer and advertise as many
                  hospitality vacancies as your business needs throughout the
                  year.
                </p>

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {membershipBenefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm"
                    >
                      <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Check className="size-3.5" />
                      </span>

                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="min-w-56 rounded-2xl border border-border bg-background p-6 text-center shadow-sm">
                <p className="text-sm font-medium text-muted-foreground">
                  Founding rate
                </p>

                <div className="mt-2">
                  <span className="font-display text-5xl font-extrabold">
                    £25
                  </span>
                  <span className="text-muted-foreground"> / year</span>
                </div>

                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Unlimited listings for one employer account.
                </p>

                <Button asChild className="mt-5 w-full" variant="accent">
                  <Link to="/auth" search={{ mode: "employer" }}>
                    Join as an employer
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EARLY EMPLOYERS */}
      <section className="mt-8">
        <div className="rounded-2xl border border-dashed border-border bg-card p-6 sm:p-8">
          <p className="font-display text-xl font-bold">
            We're building CRNWL with our first Cornish employers.
          </p>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            During the early launch, selected hospitality businesses can use
            CRNWL free while we gather feedback and build the strongest
            possible local jobs platform. Founding Employer membership will
            then be £25 per year.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="mt-14 rounded-2xl border border-border bg-sand p-8">
        <h2 className="font-display text-2xl font-bold">How it works</h2>

        <ol className="mt-4 grid gap-6 text-sm sm:grid-cols-3">
          <li>
            <span className="font-display text-2xl font-bold text-primary">
              1
            </span>

            <p className="mt-1 font-medium">Create your account</p>

            <p className="mt-1 text-muted-foreground">
              Sign up as an employer with your business name.
            </p>
          </li>

          <li>
            <span className="font-display text-2xl font-bold text-primary">
              2
            </span>

            <p className="mt-1 font-medium">Post your vacancies</p>

            <p className="mt-1 text-muted-foreground">
              Add the town, role, pay, shift pattern and anything else
              candidates need to know.
            </p>
          </li>

          <li>
            <span className="font-display text-2xl font-bold text-primary">
              3
            </span>

            <p className="mt-1 font-medium">Hire directly</p>

            <p className="mt-1 text-muted-foreground">
              Review applicants, contact candidates and find your next team
              member.
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
}