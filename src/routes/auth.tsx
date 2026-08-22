import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Anchor,
  ArrowLeft,
  KeyRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type AuthSearch = {
  mode?: "employer" | "candidate" | undefined;
};

export const Route = createFileRoute("/auth")({
  validateSearch: (
    search: Record<string, unknown>,
  ): AuthSearch => ({
    mode:
      search["mode"] === "employer"
        ? "employer"
        : undefined,
  }),

  head: () => ({
    meta: [
      {
        title:
          "Sign In or Create an Account | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Sign in to apply for Cornish hospitality jobs, or create an employer account to post vacancies.",
      },
    ],
  }),

  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState(
    mode === "employer"
      ? "signup"
      : "signin",
  );

  const [accountType, setAccountType] =
    useState<
      "candidate" | "employer"
    >(
      mode === "employer"
        ? "employer"
        : "candidate",
    );

  const [busy, setBusy] =
    useState(false);

  const [
    forgotPassword,
    setForgotPassword,
  ] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    company_name: "",
  });

  useEffect(() => {
    if (user) {
      void navigate({
        to: "/dashboard",
      });
    }
  }, [user, navigate]);

  const signIn = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    setBusy(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back");

    void navigate({
      to: "/dashboard",
    });
  };

  const signUp = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    const firstName =
      form.first_name.trim();

    const lastName =
      form.last_name.trim();

    const fullName =
      `${firstName} ${lastName}`.trim();

    if (!firstName) {
      toast.error(
        "Please enter your first name.",
      );
      return;
    }

    if (!lastName) {
      toast.error(
        "Please enter your last name.",
      );
      return;
    }

    if (
      accountType === "employer" &&
      !form.company_name.trim()
    ) {
      toast.error(
        "Please enter your business name.",
      );
      return;
    }

    setBusy(true);

    const { error } =
      await supabase.auth.signUp({
        email: form.email.trim(),
        password: form.password,

        options: {
          emailRedirectTo:
            `${window.location.origin}/dashboard`,

          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
            account_type: accountType,

            company_name:
              accountType === "employer"
                ? form.company_name.trim()
                : null,
          },
        },
      });

    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Account created -- check your email to confirm your account",
    );

    setTab("signin");
  };

  const sendPasswordReset = async (
    event: React.FormEvent,
  ) => {
    event.preventDefault();

    const email =
      form.email.trim();

    if (!email) {
      toast.error(
        "Pop your email address in first.",
      );
      return;
    }

    setBusy(true);

    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            `${window.location.origin}/reset-password`,
        },
      );

    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success(
      "Sorted -- check your inbox 📬",
    );

    setForgotPassword(false);
  };

  const google = async () => {
    const { error } =
      await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
          redirectTo:
            `${window.location.origin}/dashboard`,
        },
      });

    if (error) {
      toast.error(
        "Google sign-in failed. Try email instead.",
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      {/* HEADER */}

      <div className="text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Anchor className="size-5" />
        </span>

        <h1 className="mt-4 font-display text-2xl font-bold">
          Work in CRNWL
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          One account to apply for jobs or
          hire your next team.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        {forgotPassword ? (
          /*
           * FORGOT PASSWORD
           */
          <div>
            <button
              type="button"
              onClick={() =>
                setForgotPassword(false)
              }
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />

              Back to sign in
            </button>

            <div className="mt-6">
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <KeyRound className="size-5" />
              </span>

              <h2 className="mt-4 font-display text-2xl font-bold">
                Password gone walkabout?
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                No dramas. Pop your email below
                and we’ll send you a reset link
                dreckly.
              </p>
            </div>

            <form
              className="mt-6 grid gap-4"
              onSubmit={
                sendPasswordReset
              }
            >
              <div className="grid gap-2">
                <Label htmlFor="reset-email">
                  Email
                </Label>

                <Input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  value={
                    form.email
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm({
                      ...form,
                      email:
                        event
                          .target
                          .value,
                    })
                  }
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                disabled={busy}
              >
                {busy
                  ? "Sending…"
                  : "Get me back in"}
              </Button>
            </form>

            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              We’ll send a secure link so you can
              choose a new password. Have a peek
              in spam too if it doesn’t arrive
              straight away.
            </p>
          </div>
        ) : (
          <>
            <Tabs
              value={tab}
              onValueChange={
                setTab
              }
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">
                  Sign in
                </TabsTrigger>

                <TabsTrigger value="signup">
                  Create account
                </TabsTrigger>
              </TabsList>

              {/* SIGN IN */}

              <TabsContent value="signin">
                <form
                  className="mt-4 grid gap-4"
                  onSubmit={signIn}
                >
                  <div className="grid gap-2">
                    <Label htmlFor="si-email">
                      Email
                    </Label>

                    <Input
                      id="si-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={
                        form.email
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm({
                          ...form,
                          email:
                            event
                              .target
                              .value,
                        })
                      }
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label htmlFor="si-pass">
                        Password
                      </Label>

                      <button
                        type="button"
                        onClick={() =>
                          setForgotPassword(
                            true,
                          )
                        }
                        className="text-xs font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>

                    <Input
                      id="si-pass"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={
                        form.password
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm({
                          ...form,
                          password:
                            event
                              .target
                              .value,
                        })
                      }
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={busy}
                  >
                    {busy
                      ? "Signing in…"
                      : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              {/* CREATE ACCOUNT */}

              <TabsContent value="signup">
                <form
                  className="mt-4 grid gap-4"
                  onSubmit={signUp}
                >
                  {/* ACCOUNT TYPE */}

                  <div className="grid grid-cols-2 gap-2">
                    {(
                      [
                        "candidate",
                        "employer",
                      ] as const
                    ).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setAccountType(
                            type,
                          )
                        }
                        className={`rounded-md border px-3 py-3 text-sm font-medium transition-colors ${
                          accountType ===
                          type
                            ? "border-primary bg-secondary text-secondary-foreground"
                            : "border-border text-muted-foreground hover:bg-secondary/50"
                        }`}
                      >
                        {type ===
                        "candidate"
                          ? "I'm looking for work"
                          : "I'm hiring"}
                      </button>
                    ))}
                  </div>

                  {/* NAMES */}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="su-first-name">
                        First name
                      </Label>

                      <Input
                        id="su-first-name"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={
                          form.first_name
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm({
                            ...form,
                            first_name:
                              event
                                .target
                                .value,
                          })
                        }
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="su-last-name">
                        Last name
                      </Label>

                      <Input
                        id="su-last-name"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={
                          form.last_name
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm({
                            ...form,
                            last_name:
                              event
                                .target
                                .value,
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* BUSINESS NAME */}

                  {accountType ===
                    "employer" && (
                    <div className="grid gap-2">
                      <Label htmlFor="su-company">
                        Business name
                      </Label>

                      <Input
                        id="su-company"
                        required
                        placeholder="The Harbour Inn"
                        value={
                          form.company_name
                        }
                        onChange={(
                          event,
                        ) =>
                          setForm({
                            ...form,
                            company_name:
                              event
                                .target
                                .value,
                          })
                        }
                      />
                    </div>
                  )}

                  {/* EMAIL */}

                  <div className="grid gap-2">
                    <Label htmlFor="su-email">
                      Email
                    </Label>

                    <Input
                      id="su-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={
                        form.email
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm({
                          ...form,
                          email:
                            event
                              .target
                              .value,
                        })
                      }
                    />
                  </div>

                  {/* PASSWORD */}

                  <div className="grid gap-2">
                    <Label htmlFor="su-pass">
                      Password
                    </Label>

                    <Input
                      id="su-pass"
                      type="password"
                      autoComplete="new-password"
                      required
                      minLength={6}
                      value={
                        form.password
                      }
                      onChange={(
                        event,
                      ) =>
                        setForm({
                          ...form,
                          password:
                            event
                              .target
                              .value,
                        })
                      }
                    />

                    <p className="text-xs text-muted-foreground">
                      Minimum 6 characters.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="accent"
                    disabled={busy}
                  >
                    {busy
                      ? "Creating…"
                      : "Create account"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* GOOGLE */}

            <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
              <span className="h-px flex-1 bg-border" />

              <span>or</span>

              <span className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={google}
            >
              Continue with Google
            </Button>
          </>
        )}
      </div>
    </div>
  );
}