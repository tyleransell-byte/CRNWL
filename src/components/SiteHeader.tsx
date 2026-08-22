import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth";

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
};

/*
 * FOUNDING EMPLOYER OFFER
 *
 * Currently set to end at 23:59 on 21 September 2026.
 *
 * If you ever want to change the offer deadline,
 * this is the ONLY date you need to change.
 */
const FOUNDING_OFFER_END = new Date(
  "2026-09-21T23:59:59+01:00",
).getTime();

function getCountdown(): Countdown {
  const difference =
    FOUNDING_OFFER_END - Date.now();

  if (difference <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      expired: true,
    };
  }

  return {
    days: Math.floor(
      difference / (1000 * 60 * 60 * 24),
    ),

    hours: Math.floor(
      (difference /
        (1000 * 60 * 60)) %
        24,
    ),

    minutes: Math.floor(
      (difference / (1000 * 60)) %
        60,
    ),

    seconds: Math.floor(
      (difference / 1000) % 60,
    ),

    expired: false,
  };
}

export function SiteHeader() {
  const { user, profile, signOut } =
    useAuth();

  const navigate = useNavigate();

  const [open, setOpen] =
    useState(false);

  const [bannerOpen, setBannerOpen] =
    useState(true);

  const [countdown, setCountdown] =
    useState<Countdown | null>(null);

  const links = [
    {
      to: "/jobs",
      label: "Browse jobs",
    },
    {
      to: "/employers",
      label: "For employers",
    },
    {
      to: "/about",
      label: "About",
    },
    {
      to: "/founder",
      label: "Our Story",
    },
    {
      to: "/suggestions",
      label: "Suggestions",
    },
  ] as const;

  /*
   * COUNTDOWN TIMER
   */
  useEffect(() => {
    const updateCountdown = () => {
      setCountdown(getCountdown());
    };

    updateCountdown();

    const timer = window.setInterval(
      updateCountdown,
      1000,
    );

    return () =>
      window.clearInterval(timer);
  }, []);

  const showOfferBanner =
    bannerOpen &&
    countdown &&
    !countdown.expired;

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur">
      {/* FOUNDING EMPLOYER OFFER */}

      {showOfferBanner && (
        <div className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto flex min-h-9 w-full max-w-6xl items-center justify-center gap-2 px-10 py-1.5 text-center text-xs sm:text-sm">
            <span className="font-semibold">
              Founding Employer
            </span>

            <span className="hidden sm:inline">
              ·
            </span>

            <span className="font-bold">
              £25/year
            </span>

            <span className="hidden sm:inline">
              ·
            </span>

            <span className="tabular-nums">
              {countdown.days}d{" "}
              {countdown.hours}h{" "}
              {countdown.minutes}m
            </span>

            <Link
              to="/employers"
              className="ml-1 font-semibold underline underline-offset-2 hover:no-underline"
            >
              Join now
            </Link>

            <button
              type="button"
              aria-label="Close offer"
              onClick={() =>
                setBannerOpen(false)
              }
              className="absolute right-3 flex size-7 items-center justify-center rounded-md transition-colors hover:bg-primary-foreground/10"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN HEADER */}

      <div className="mx-auto flex min-h-20 w-full max-w-6xl items-center gap-3 px-4">
        {/* CRNWL BRAND */}

        <Link
          to="/"
          className="flex shrink-0 flex-col justify-center leading-none"
        >
          <span className="font-display text-base font-bold leading-none tracking-tight">
            Work in
          </span>

          <span className="mt-1 font-display text-3xl font-extrabold leading-none tracking-tight text-gradient-sea sm:text-4xl">
            CRNWL
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{
                className:
                  "text-foreground bg-secondary",
              }}
            >
              {link.label}
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
                <Link to="/dashboard">
                  Dashboard
                </Link>
              </Button>

              {profile?.account_type ===
                "employer" && (
                <Button
                  asChild
                  size="sm"
                  variant="accent"
                  className="hidden sm:inline-flex"
                >
                  <Link to="/post-job">
                    Post a job
                  </Link>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                >
                  <Button
                    variant="outline"
                    size="icon"
                    aria-label="Account menu"
                  >
                    <span className="text-xs font-semibold">
                      {(
                        profile?.full_name ||
                        user.email ||
                        "?"
                      )
                        .slice(0, 2)
                        .toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                >
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: "/dashboard",
                      })
                    }
                  >
                    Dashboard
                  </DropdownMenuItem>

                  {profile?.account_type ===
                    "candidate" && (
                    <DropdownMenuItem
                      onClick={() =>
                        navigate({
                          to: "/profile",
                        })
                      }
                    >
                      My Profile
                    </DropdownMenuItem>
                  )}

                  {profile?.account_type ===
                    "employer" && (
                    <DropdownMenuItem
                      onClick={() =>
                        navigate({
                          to: "/post-job",
                        })
                      }
                    >
                      Post a job
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();

                      navigate({
                        to: "/",
                      });
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
              <Button
                asChild
                variant="ghost"
                size="sm"
              >
                <Link to="/auth">
                  Sign in
                </Link>
              </Button>

              <Button
                asChild
                size="sm"
                variant="accent"
              >
                <Link
                  to="/auth"
                  search={{
                    mode: "employer",
                  }}
                >
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
            onClick={() =>
              setOpen(
                (current) => !current,
              )
            }
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* MOBILE MENU */}

      {open && (
        <nav className="border-t border-border bg-background px-4 py-2 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() =>
                setOpen(false)
              }
              className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}