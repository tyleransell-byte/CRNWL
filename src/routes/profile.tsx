import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  Car,
  MapPin,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      {
        title: "Your Candidate Profile | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Build your CRNWL candidate profile and tell Cornwall hospitality employers about your experience and availability.",
      },
    ],
  }),
  component: CandidateProfilePage,
});

const experienceOptions = [
  "Kitchen",
  "Chef",
  "Kitchen Porter",
  "Front of House",
  "Waiting",
  "Bar",
  "Barista",
  "Housekeeping",
  "Reception",
  "Hotel",
  "Management",
  "Events",
  "Customer Service",
];

const workPreferenceOptions = [
  "Full-time",
  "Part-time",
  "Seasonal",
  "Casual",
  "Temporary",
  "Permanent",
];

const cornwallLocations = [
  "Bodmin",
  "Bude",
  "Camborne",
  "Falmouth",
  "Fowey",
  "Hayle",
  "Helston",
  "Launceston",
  "Liskeard",
  "Looe",
  "Newquay",
  "Padstow",
  "Penzance",
  "Redruth",
  "St Austell",
  "St Ives",
  "Truro",
  "Wadebridge",
];

function CandidateProfilePage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    date_of_birth: "",
    location: "",
    bio: "",
    current_role: "",
    years_experience: "",
    phone: "",
    experience_tags: [] as string[],
    available_immediately: false,
    available_from: "",
    work_preferences: [] as string[],
    preferred_locations: [] as string[],
    driving_licence: "prefer_not_to_say",
    own_transport: false,
    interested_in_live_in: false,
    open_to_work: true,
  });

  useEffect(() => {
    if (!loading && !user) {
      void navigate({ to: "/auth" });
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      setPageLoading(true);

      const { data, error } = await supabase
        .from("profiles")
        .select(
          `
          full_name,
          account_type,
          date_of_birth,
          location,
          bio,
          "current_role",
          years_experience,
          phone,
          experience_tags,
          available_immediately,
          available_from,
          work_preferences,
          preferred_locations,
          driving_licence,
          own_transport,
          interested_in_live_in,
          open_to_work
          `,
        )
        .eq("id", user.id)
        .single();

      setPageLoading(false);

      if (error) {
        toast.error(error.message);
        return;
      }

      if (data.account_type !== "candidate") {
        toast.error("Candidate profiles are for job seekers.");
        void navigate({ to: "/dashboard" });
        return;
      }

      setForm({
        full_name: data.full_name ?? "",
        date_of_birth: data.date_of_birth ?? "",
        location: data.location ?? "",
        bio: data.bio ?? "",
        current_role: data.current_role ?? "",
        years_experience: data.years_experience ?? "",
        phone: data.phone ?? "",
        experience_tags: data.experience_tags ?? [],
        available_immediately: data.available_immediately ?? false,
        available_from: data.available_from ?? "",
        work_preferences: data.work_preferences ?? [],
        preferred_locations: data.preferred_locations ?? [],
        driving_licence: data.driving_licence ?? "prefer_not_to_say",
        own_transport: data.own_transport ?? false,
        interested_in_live_in: data.interested_in_live_in ?? false,
        open_to_work: data.open_to_work ?? true,
      });
    };

    void loadProfile();
  }, [user, navigate]);

  const toggleArrayValue = (
    field: "experience_tags" | "work_preferences" | "preferred_locations",
    value: string,
  ) => {
    setForm((current) => {
      const selected = current[field];

      return {
        ...current,
        [field]: selected.includes(value)
          ? selected.filter((item) => item !== value)
          : [...selected, value],
      };
    });
  };

  const saveProfile = async () => {
    if (!user) return;

    if (!form.full_name.trim()) {
      toast.error("Please add your full name.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name.trim(),
        date_of_birth: form.date_of_birth || null,
        location: form.location.trim() || null,
        bio: form.bio.trim() || null,
        current_role: form.current_role.trim() || null,
        years_experience: form.years_experience || null,
        phone: form.phone.trim() || null,
        experience_tags: form.experience_tags,
        available_immediately: form.available_immediately,
        available_from: form.available_immediately
          ? null
          : form.available_from || null,
        work_preferences: form.work_preferences,
        preferred_locations: form.preferred_locations,
        driving_licence: form.driving_licence,
        own_transport: form.own_transport,
        interested_in_live_in: form.interested_in_live_in,
        open_to_work: form.open_to_work,
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    await refreshProfile();

    toast.success("Profile saved");
  };

  if (loading || !user || pageLoading) {
    return (
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4 py-12">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (profile?.account_type === "employer") {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <UserRound className="size-5" />
        </span>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Candidate profile
          </p>

          <h1 className="font-display text-3xl font-bold">
            Tell employers about you.
          </h1>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-muted-foreground">
        No CV required. Build a simple profile showing your experience,
        availability and what kind of hospitality work you're looking for.
      </p>

      <div className="mt-8 space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        {/* VISIBILITY */}

        <section className="rounded-2xl border border-border bg-sand p-5">
          <div className="flex items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-5 text-primary" />

                <p className="font-display text-lg font-bold">
                  Open to work
                </p>
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                Turn this on when you're happy for employers to discover your
                candidate profile.
              </p>
            </div>

            <Switch
              checked={form.open_to_work}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  open_to_work: checked,
                })
              }
            />
          </div>
        </section>

        {/* ABOUT YOU */}

        <section className="space-y-5">
          <h2 className="font-display text-xl font-bold">
            About you
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="full-name">Full name</Label>

              <Input
                id="full-name"
                required
                value={form.full_name}
                onChange={(event) =>
                  setForm({
                    ...form,
                    full_name: event.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dob">
                Date of birth
              </Label>

              <Input
                id="dob"
                type="date"
                value={form.date_of_birth}
                onChange={(event) =>
                  setForm({
                    ...form,
                    date_of_birth: event.target.value,
                  })
                }
              />

              <p className="text-xs text-muted-foreground">
                Kept private and not shown to employers.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="location">
                Where are you based?
              </Label>

              <Input
                id="location"
                placeholder="Newquay"
                value={form.location}
                onChange={(event) =>
                  setForm({
                    ...form,
                    location: event.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="phone">
                Phone
              </Label>

              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm({
                    ...form,
                    phone: event.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">
              About me
            </Label>

            <textarea
              id="bio"
              rows={6}
              maxLength={800}
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Tell employers a little about yourself, what you enjoy about hospitality and what you're looking for..."
              value={form.bio}
              onChange={(event) =>
                setForm({
                  ...form,
                  bio: event.target.value,
                })
              }
            />

            <p className="text-right text-xs text-muted-foreground">
              {form.bio.length}/800
            </p>
          </div>
        </section>

        {/* EXPERIENCE */}

        <section className="space-y-5 border-t border-border pt-7">
          <div className="flex items-center gap-2">
            <BriefcaseBusiness className="size-5 text-primary" />

            <h2 className="font-display text-xl font-bold">
              Experience
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="current-role">
                Current / most recent role
              </Label>

              <Input
                id="current-role"
                placeholder="Bartender"
                value={form.current_role}
                onChange={(event) =>
                  setForm({
                    ...form,
                    current_role: event.target.value,
                  })
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Hospitality experience</Label>

              <Select
                value={form.years_experience}
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    years_experience: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose experience" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="none">
                    Just starting out
                  </SelectItem>

                  <SelectItem value="under_1">
                    Less than 1 year
                  </SelectItem>

                  <SelectItem value="1_2">
                    1–2 years
                  </SelectItem>

                  <SelectItem value="3_5">
                    3–5 years
                  </SelectItem>

                  <SelectItem value="5_plus">
                    5+ years
                  </SelectItem>

                  <SelectItem value="10_plus">
                    10+ years
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>What have you worked in?</Label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {experienceOptions.map((tag) => {
                const selected =
                  form.experience_tags.includes(tag);

                return (
                  <label
                    key={tag}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-colors ${
                      selected
                        ? "border-primary bg-secondary"
                        : "border-border bg-background hover:bg-secondary/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleArrayValue(
                          "experience_tags",
                          tag,
                        )
                      }
                      className="size-4 accent-current"
                    />

                    <span className="text-sm font-medium">
                      {tag}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* AVAILABILITY */}

        <section className="space-y-5 border-t border-border pt-7">
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-primary" />

            <h2 className="font-display text-xl font-bold">
              Availability
            </h2>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">
                Available immediately
              </p>

              <p className="text-sm text-muted-foreground">
                Turn this on if you could start a new role now.
              </p>
            </div>

            <Switch
              checked={form.available_immediately}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  available_immediately: checked,
                })
              }
            />
          </div>

          {!form.available_immediately && (
            <div className="grid gap-2">
              <Label htmlFor="available-from">
                Available from
              </Label>

              <Input
                id="available-from"
                type="date"
                value={form.available_from}
                onChange={(event) =>
                  setForm({
                    ...form,
                    available_from: event.target.value,
                  })
                }
              />
            </div>
          )}

          <div>
            <Label>What kind of work?</Label>

            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {workPreferenceOptions.map((preference) => {
                const selected =
                  form.work_preferences.includes(preference);

                return (
                  <label
                    key={preference}
                    className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                      selected
                        ? "border-primary bg-secondary"
                        : "border-border bg-background"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        toggleArrayValue(
                          "work_preferences",
                          preference,
                        )
                      }
                      className="size-4"
                    />

                    <span className="text-sm font-medium">
                      {preference}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </section>

        {/* LOCATIONS */}

        <section className="space-y-5 border-t border-border pt-7">
          <div className="flex items-center gap-2">
            <MapPin className="size-5 text-primary" />

            <h2 className="font-display text-xl font-bold">
              Where would you work?
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {cornwallLocations.map((location) => {
              const selected =
                form.preferred_locations.includes(location);

              return (
                <label
                  key={location}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 ${
                    selected
                      ? "border-primary bg-secondary"
                      : "border-border bg-background"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() =>
                      toggleArrayValue(
                        "preferred_locations",
                        location,
                      )
                    }
                    className="size-4"
                  />

                  <span className="text-sm font-medium">
                    {location}
                  </span>
                </label>
              );
            })}
          </div>
        </section>

        {/* TRANSPORT */}

        <section className="space-y-5 border-t border-border pt-7">
          <div className="flex items-center gap-2">
            <Car className="size-5 text-primary" />

            <h2 className="font-display text-xl font-bold">
              Travel & accommodation
            </h2>
          </div>

          <div className="grid gap-2">
            <Label>Driving licence</Label>

            <Select
              value={form.driving_licence}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  driving_licence: value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="yes">
                  Yes
                </SelectItem>

                <SelectItem value="no">
                  No
                </SelectItem>

                <SelectItem value="learning">
                  Learning
                </SelectItem>

                <SelectItem value="prefer_not_to_say">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">
                I have my own transport
              </p>

              <p className="text-sm text-muted-foreground">
                Useful for roles outside major Cornish towns.
              </p>
            </div>

            <Switch
              checked={form.own_transport}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  own_transport: checked,
                })
              }
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="font-medium">
                Interested in live-in roles
              </p>

              <p className="text-sm text-muted-foreground">
                Show employers that accommodation-based roles may suit you.
              </p>
            </div>

            <Switch
              checked={form.interested_in_live_in}
              onCheckedChange={(checked) =>
                setForm({
                  ...form,
                  interested_in_live_in: checked,
                })
              }
            />
          </div>
        </section>

        {/* SAVE */}

        <div className="flex flex-col gap-3 border-t border-border pt-7 sm:flex-row sm:justify-end">
          <Button
            asChild
            type="button"
            variant="outline"
          >
            <Link to="/dashboard">
              Back to dashboard
            </Link>
          </Button>

          <Button
            type="button"
            variant="accent"
            disabled={saving}
            onClick={() => void saveProfile()}
          >
            {saving
              ? "Saving…"
              : "Save profile"}
          </Button>
        </div>
      </div>
    </div>
  );
}