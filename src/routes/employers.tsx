import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgePoundSterling, Inbox, MapPinned, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/employers")({
  head: () => ({
    meta: [
      { title: "Hire Hospitality Staff in Cornwall | Work in CRNWL" },
      {
        name: "description",
        content:
          "Post chef, bar, front of house and housekeeping vacancies to a Cornwall-only audience. Free to list, no agency fees, applicants in one dashboard.",
      },
      { property: "og:title", content: "Hire Hospitality Staff in Cornwall" },
      {
        property: "og:description",
        content: "Post your vacancy to Cornwall's dedicated hospitality jobs board.",
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

function EmployersPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14">
      <h1 className="max-w-2xl font-display text-4xl font-extrabold leading-tight">
        Hire hospitality staff who actually want to work in Cornwall.
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Work in CRNWL is a jobs board built for Cornish pubs, hotels, restaurants, cafés and event
        caterers — from a single seasonal KP to a full brigade.
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

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {points.map((p) => (
          <div key={p.title} className="rounded-xl border border-border bg-card p-6">
            <p.icon className="size-5 text-primary" />
            <h2 className="mt-3 font-display text-lg font-semibold">{p.title}</h2>
            <p className="mt-1.5 text-sm text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 rounded-2xl border border-border bg-sand p-8">
        <h2 className="font-display text-2xl font-bold">How it works</h2>
        <ol className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          <li>
            <span className="font-display text-2xl font-bold text-primary">1</span>
            <p className="mt-1 font-medium">Create your account</p>
            <p className="text-muted-foreground">Sign up as an employer with your business name.</p>
          </li>
          <li>
            <span className="font-display text-2xl font-bold text-primary">2</span>
            <p className="mt-1 font-medium">Post the role</p>
            <p className="text-muted-foreground">
              Town, trade, pay, shift pattern and whether live-in is available.
            </p>
          </li>
          <li>
            <span className="font-display text-2xl font-bold text-primary">3</span>
            <p className="mt-1 font-medium">Hire</p>
            <p className="text-muted-foreground">
              Track applicants through reviewing, interview and hired.
            </p>
          </li>
        </ol>
      </div>
    </div>
  );
}
