import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Anchor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type AuthSearch = { mode?: "employer" | "candidate" | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    mode: search["mode"] === "employer" ? "employer" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Sign In or Create an Account | Work in CRNWL" },
      {
        name: "description",
        content:
          "Sign in to apply for Cornish hospitality jobs, or create an employer account to post vacancies.",
      },
      { property: "og:title", content: "Sign In or Create an Account | Work in CRNWL" },
      {
        property: "og:description",
        content: "Candidate and employer accounts for Cornwall's hospitality jobs board.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(mode === "employer" ? "signup" : "signin");
  const [accountType, setAccountType] = useState<"candidate" | "employer">(
    mode === "employer" ? "employer" : "candidate",
  );
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    company_name: "",
  });

  useEffect(() => {
    if (user) void navigate({ to: "/dashboard" });
  }, [user, navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back");
    void navigate({ to: "/dashboard" });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: form.full_name,
          account_type: accountType,
          company_name: accountType === "employer" ? form.company_name : null,
        },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created — you're all set");
    void navigate({ to: "/dashboard" });
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      toast.error("Google sign-in failed. Try email instead.");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-14">
      <div className="text-center">
        <span className="mx-auto flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Anchor className="size-5" />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold">Work in CRNWL</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One account to apply for jobs or hire your next team.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form className="mt-4 grid gap-4" onSubmit={signIn}>
              <div className="grid gap-2">
                <Label htmlFor="si-email">Email</Label>
                <Input
                  id="si-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="si-pass">Password</Label>
                <Input
                  id="si-pass"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <Button type="submit" disabled={busy}>
                {busy ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form className="mt-4 grid gap-4" onSubmit={signUp}>
              <div className="grid grid-cols-2 gap-2">
                {(["candidate", "employer"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAccountType(t)}
                    className={`rounded-md border px-3 py-2 text-sm font-medium transition-colors ${
                      accountType === t
                        ? "border-primary bg-secondary text-secondary-foreground"
                        : "border-border text-muted-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {t === "candidate" ? "I'm looking for work" : "I'm hiring"}
                  </button>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="su-name">Full name</Label>
                <Input
                  id="su-name"
                  required
                  value={form.full_name}
                  onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                />
              </div>
              {accountType === "employer" && (
                <div className="grid gap-2">
                  <Label htmlFor="su-company">Business name</Label>
                  <Input
                    id="su-company"
                    required
                    placeholder="The Harbour Inn"
                    value={form.company_name}
                    onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="su-email">Email</Label>
                <Input
                  id="su-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="su-pass">Password</Label>
                <Input
                  id="su-pass"
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <Button type="submit" variant="accent" disabled={busy}>
                {busy ? "Creating…" : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <Button variant="outline" className="w-full" onClick={google}>
          Continue with Google
        </Button>
      </div>
    </div>
  );
}
