import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/jobs", label: "Browse jobs" },
    { to: "/employers", label: "For employers" },
    { to: "/about", label: "About" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center gap-3 px-4">
        
        {/* CRNWL BRAND */}
        <Link to="/" className="flex shrink-0 flex-col justify-center leading-none">
          <span className="font-display text-base font-bold leading-none tracking-tight">
            Work in
          </span>

          <span className="mt-1 font-display text-3xl font-extrabold leading-none tracking-tight text-gradient-sea sm:text-4xl">
            CRNWL
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* ACCOUNT / ACTIONS */}
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex"
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>

              {profile?.account_type === "employer" && (
                <Button
                  asChild
                  size="sm"
                  variant="accent"
                  className="hidden sm:inline-flex"
                >
                  <Link to="/post-job">Post a job</Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Account menu"
                  >
                    <span className="text-xs font-semibold">
                      {(profile?.full_name || user.email || "?")
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => navigate({ to: "/dashboard" })}
                  >
                    Dashboard
                  </DropdownMenuItem>

                  {profile?.account_type === "employer" && (
                    <DropdownMenuItem
                      onClick={() => navigate({ to: "/post-job" })}
                    >
                      Post a job
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="mr-2 size-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/auth">Sign in</Link>
              </Button>

              <Button asChild size="sm" variant="accent">
                <Link to="/auth" search={{ mode: "employer" }}>
                  Post a job
                </Link>
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Toggle navigation"
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <nav className="border-t border-border bg-background px-4 py-2 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}