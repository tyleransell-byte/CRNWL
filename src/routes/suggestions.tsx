import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Lightbulb, MessageSquarePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/suggestions")({
  head: () => ({
    meta: [
      {
        title: "Suggestions | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Tell us what you'd like to see added or improved on Work in CRNWL.",
      },
    ],
  }),
  component: SuggestionsPage,
});

function SuggestionsPage() {
  const { user, profile } = useAuth();

  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({
    name: profile?.full_name ?? "",
    email: user?.email ?? "",
    message: "",
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    if (!form.message.trim()) {
      toast.error("Please add your suggestion.");
      return;
    }

    setBusy(true);

    const { error } = await supabase
      .from("suggestions")
      .insert({
        user_id: user?.id ?? null,
        name: form.name.trim() || null,
        email: form.email.trim() || null,
        message: form.message.trim(),
      });

    setBusy(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Thanks -- suggestion sent!");

    setForm((current) => ({
      ...current,
      message: "",
    }));
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-14">
      <div className="text-center">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Lightbulb className="size-6" />
        </span>

        <h1 className="mt-4 font-display text-3xl font-bold">
          Help shape CRNWL.
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          Got an idea, spotted something confusing, or think CRNWL is missing
          something? Send it over.
        </p>
      </div>

      <form
        onSubmit={submit}
        className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="grid gap-2">
          <Label htmlFor="name">
            Name
          </Label>

          <Input
            id="name"
            placeholder="Your name"
            value={form.name}
            onChange={(event) =>
              setForm({
                ...form,
                name: event.target.value,
              })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">
            Email
          </Label>

          <Input
            id="email"
            type="email"
            placeholder="Optional"
            value={form.email}
            onChange={(event) =>
              setForm({
                ...form,
                email: event.target.value,
              })
            }
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="message">
            Your suggestion
          </Label>

          <Textarea
            id="message"
            required
            rows={7}
            maxLength={1500}
            placeholder="What would you like us to add, improve or change?"
            value={form.message}
            onChange={(event) =>
              setForm({
                ...form,
                message: event.target.value,
              })
            }
          />

          <p className="text-right text-xs text-muted-foreground">
            {form.message.length}/1500
          </p>
        </div>

        <Button
          type="submit"
          variant="accent"
          className="w-full"
          disabled={busy}
        >
          <MessageSquarePlus className="mr-2 size-4" />

          {busy
            ? "Sending…"
            : "Send suggestion"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Button
          asChild
          variant="ghost"
        >
          <Link to="/">
            Back to CRNWL
          </Link>
        </Button>
      </div>
    </div>
  );
}