import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        <div>
          <p className="font-display text-lg font-bold">
            Work in <span className="text-gradient-sea">CRNWL</span>
          </p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            The hospitality jobs board for Cornwall — kitchens, bars, hotels and harbourside
            restaurants from Bude to Penzance.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Candidates</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/jobs" className="hover:text-foreground">
                Browse all jobs
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-foreground">
                Create an account
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Employers</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/employers" className="hover:text-foreground">
                Why post with us
              </Link>
            </li>
            <li>
              <Link to="/post-job" className="hover:text-foreground">
                Post a job
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Work in CRNWL · Made in Kernow
      </div>
    </footer>
  );
}
