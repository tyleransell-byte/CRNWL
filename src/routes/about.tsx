import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Work in CRNWL | Cornwall Hospitality Jobs Board" },
      {
        name: "description",
        content:
          "Work in CRNWL is a Cornwall-only hospitality jobs board connecting local pubs, hotels and restaurants with chefs, bar staff and front of house teams.",
      },
      { property: "og:title", content: "About Work in CRNWL" },
      {
        property: "og:description",
        content: "Why we built a Cornwall-only hospitality jobs board.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl font-extrabold">About Work in CRNWL</h1>
      <div className="mt-6 space-y-5 text-muted-foreground">
        <p>
          Cornish hospitality runs on people — the chef who moves down for a season and stays for a
          decade, the bar team that carries a harbourside pub through August, the housekeepers who
          turn a hotel around before noon.
        </p>
        <p>
          Finding those people on a national jobs site is painful. Listings get buried, applicants
          are three counties away, and agencies take a cut nobody budgeted for. Work in CRNWL does
          one thing: hospitality roles, in Cornwall, posted directly by the businesses hiring.
        </p>
        <p>
          Candidates can search by town, trade and contract type, see the pay up front and whether
          live-in accommodation is offered, then apply in a couple of clicks. Employers get a simple
          dashboard with every applicant and their status.
        </p>
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/jobs">Browse jobs</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/employers">For employers</Link>
        </Button>
      </div>
    </div>
  );
}
