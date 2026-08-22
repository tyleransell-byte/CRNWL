import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
        {/* BRAND */}

        <div>
          <p className="font-display text-lg font-bold">
            Work in <span className="text-gradient-sea">CRNWL</span>
          </p>

          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            The hospitality jobs board for Cornwall -- kitchens, bars,
            hotels and harbourside restaurants from Bude to Penzance.
          </p>
        </div>

        {/* CANDIDATES */}

        <div className="text-sm">
          <p className="font-semibold">Candidates</p>

          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link
                to="/jobs"
                className="hover:text-foreground"
              >
                Browse all jobs
              </Link>
            </li>

            <li>
              <Link
                to="/auth"
                className="hover:text-foreground"
              >
                Create an account
              </Link>
            </li>
          </ul>
        </div>

        {/* EMPLOYERS */}

        <div className="text-sm">
          <p className="font-semibold">Employers</p>

          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link
                to="/employers"
                className="hover:text-foreground"
              >
                Why post with us
              </Link>
            </li>

            <li>
              <Link
                to="/post-job"
                className="hover:text-foreground"
              >
                Post a job
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}

      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} Work in CRNWL · Made in Kernow
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>

            <span aria-hidden="true">·</span>

            <Link
              to="/terms"
              className="transition-colors hover:text-foreground"
            >
              Terms of Use
            </Link>

            <span aria-hidden="true">·</span>

            <a
              href="mailto:wasson@workincrnwl.co.uk"
              className="transition-colors hover:text-foreground"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}