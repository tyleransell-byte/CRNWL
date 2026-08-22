import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      {
        title: "Reset Password | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Choose a new password for your Work in CRNWL account.",
      },
    ],
  }),

  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [validSession, setValidSession] =
    useState(false);

  const [busy, setBusy] =
    useState(false);

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  useEffect(() => {
    let mounted = true;

    const prepareRecovery = async () => {
      try {
        /*
         * Support PKCE-style recovery links
         * that arrive with ?code=...
         */
        const url =
          new URL(window.location.href);

        const code =
          url.searchParams.get("code");

        if (code) {
          const { error } =
            await supabase.auth.exchangeCodeForSession(
              code,
            );

          if (error) {
            console.error(error);
          }
        }

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!mounted) return;

        setValidSession(
          !!session,
        );
      } finally {
        if (mounted) {
          setCheckingSession(
            false,
          );
        }
      }
    };

    void prepareRecovery();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (event, session) => {
          if (
            event ===
              "PASSWORD_RECOVERY" ||
            session
          ) {
            setValidSession(true);
            setCheckingSession(
              false,
            );
          }
        },
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updatePassword = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    if (password.length < 6) {
      toast.error(
        "Your password must be at least 6 characters.",
      );
      return;
    }

    if (
      password !==
      confirmPassword
    ) {
      toast.error(
        "The passwords don't match.",
      );
      return;
    }

    setBusy(true);

    const { error } =
      await supabase.auth.updateUser({
        password,
      });

    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Password updated successfully",
    );

    await supabase.auth.signOut();

    void navigate({
      to: "/auth",
    });
  };

  if (checkingSession) {
    return (
      <div className="mx-auto w-full max-w-md space-y-4 px-4 py-14">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <div className="text-center">
        <span className="mx-auto flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <KeyRound className="size-5" />
        </span>

        <h1 className="mt-4 font-display text-3xl font-bold">
          Choose a new password
        </h1>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Set a new password for your
          Work in CRNWL account.
        </p>
      </div>

      {!validSession ? (
        <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="font-medium">
            This reset link has expired or isn't valid.
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Request a fresh password reset link from the sign-in page.
          </p>

          <Button
            type="button"
            className="mt-5"
            onClick={() =>
              navigate({
                to: "/auth",
              })
            }
          >
            Back to sign in
          </Button>
        </div>
      ) : (
        <form
          onSubmit={updatePassword}
          className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-6"
        >
          <div className="grid gap-2">
            <Label htmlFor="new-password">
              New password
            </Label>

            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value,
                )
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="confirm-password">
              Confirm new password
            </Label>

            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              minLength={6}
              required
              value={
                confirmPassword
              }
              onChange={(event) =>
                setConfirmPassword(
                  event.target.value,
                )
              }
            />
          </div>

          <Button
            type="submit"
            variant="accent"
            disabled={busy}
          >
            {busy
              ? "Updating…"
              : "Update password"}
          </Button>
        </form>
      )}
    </div>
  );
}