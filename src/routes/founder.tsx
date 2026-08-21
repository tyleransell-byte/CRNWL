import { createFileRoute, Link } from "@tanstack/react-router";
import { Anchor, Heart, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/founder")({
  head: () => ({
    meta: [
      {
        title: "Our Story | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Why CRNWL was created -- a simpler, more human way to connect hospitality businesses and people across Cornwall.",
      },
    ],
  }),
  component: FounderPage,
});

function FounderPage() {
  return (
    <main>
      {/* HERO */}
      <section className="mx-auto w-full max-w-4xl px-4 py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-primary">
          Our story
        </p>

        <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-6xl">
          Why I started CRNWL.
        </h1>

        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted-foreground">
          Hospitality in Cornwall deserves something built specifically for
          the people who live and work here.
        </p>
      </section>

      {/* STORY */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16">
        <div className="rounded-2xl border border-border bg-sand p-7 sm:p-10">
          <Anchor className="size-8 text-primary" />

          <div className="mt-6 space-y-5 text-base leading-8 text-muted-foreground sm:text-lg">
            <p>
              I started CRNWL because finding hospitality work in Cornwall
              shouldn't mean searching through endless social media posts,
              generic job boards and word of mouth.
            </p>

            <p>
              At the same time, independent pubs, restaurants, hotels and
              other hospitality businesses need a simple and affordable way
              to find the right people.
            </p>

            <p>
              So I decided to build one place dedicated to Cornwall's
              hospitality industry -- connecting local businesses directly
              with people looking for work.
            </p>
          </div>
        </div>
      </section>

      {/* PEOPLE NOT PAPERWORK */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border bg-card p-6">
            <Heart className="size-6 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold">
              People first
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Hospitality is about personality, attitude and people -- not who
              has the best-looking CV.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <MapPin className="size-6 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold">
              Proudly Cornish
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              CRNWL is focused on hospitality jobs across Cornwall, from Bude
              to Penzance and everywhere in between.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <Users className="size-6 text-primary" />
            <h2 className="mt-4 font-display text-xl font-bold">
              Direct connections
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              No recruitment agency in the middle. Businesses and candidates
              can connect directly.
            </p>
          </div>
        </div>
      </section>

      {/* FOUNDER */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-20">
        <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Founder
          </p>

          <h2 className="mt-3 font-display text-3xl font-bold">
            Built in Cornwall, for Cornwall.
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
            CRNWL is just getting started. The aim is to build a useful,
            affordable and genuinely local place for Cornwall's hospitality
            community to find each other.
          </p>

          <div className="mt-6">
            <p className="font-display text-lg font-bold">Tyler Ansell</p>
            <p className="text-sm text-muted-foreground">Founder, CRNWL</p>
          </div>

          <Button asChild variant="accent" className="mt-8">
            <Link to="/jobs">Explore jobs</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}