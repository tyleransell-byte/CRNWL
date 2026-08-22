import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BriefcaseBusiness,
  ScrollText,
} from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      {
        title: "Terms of Use | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "Terms for candidates and employers using Work in CRNWL.",
      },
    ],
  }),

  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ScrollText className="size-5" />
        </span>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            The important stuff
          </p>

          <h1 className="font-display text-3xl font-bold">
            Terms of Use
          </h1>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-muted-foreground">
        These terms explain the rules for candidates and employers
        using Work in CRNWL.
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Last updated: 22 August 2026
      </p>

      <div className="mt-8 space-y-8 rounded-2xl border border-border bg-card p-6 sm:p-8">
        <section>
          <h2 className="font-display text-xl font-bold">
            1. About Work in CRNWL
          </h2>

          <p className="mt-3 text-muted-foreground">
            Work in CRNWL is an online platform designed to connect
            hospitality employers in Cornwall with people looking for
            work.
          </p>

          <p className="mt-3 text-muted-foreground">
            By creating an account or using the platform, you agree to
            these Terms of Use.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            2. What CRNWL does
          </h2>

          <p className="mt-3 text-muted-foreground">
            Work in CRNWL provides technology that allows employers to
            advertise vacancies and candidates to discover and apply
            for opportunities.
          </p>

          <div className="mt-4 rounded-2xl border border-border bg-sand p-5">
            <div className="flex gap-3">
              <BriefcaseBusiness className="mt-0.5 size-5 shrink-0 text-primary" />

              <p className="text-sm text-muted-foreground">
                Work in CRNWL is not the employer. Unless expressly
                stated otherwise, employment decisions, interviews,
                offers, contracts, pay and working arrangements are
                between the candidate and the employer.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            3. Accounts
          </h2>

          <p className="mt-3 text-muted-foreground">
            You must provide accurate information when creating and
            using an account and keep your account information
            reasonably up to date.
          </p>

          <p className="mt-3 text-muted-foreground">
            You are responsible for keeping your login details secure
            and should tell us promptly if you believe somebody has
            accessed your account without permission.
          </p>

          <p className="mt-3 text-muted-foreground">
            You must not impersonate another person or business or
            create an account using information you are not entitled
            to use.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            4. Candidate accounts
          </h2>

          <p className="mt-3 text-muted-foreground">
            Candidates can create a profile, provide information about
            their experience and availability, search vacancies and
            apply for jobs.
          </p>

          <p className="mt-3 text-muted-foreground">
            Information you provide should be truthful and should not
            deliberately misrepresent your experience, qualifications,
            availability or right to undertake a particular role.
          </p>

          <p className="mt-3 text-muted-foreground">
            Applying through Work in CRNWL does not guarantee an
            interview, job offer or employment.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            5. Employer accounts
          </h2>

          <p className="mt-3 text-muted-foreground">
            Employers are responsible for ensuring that their business,
            vacancies and job advertisements are genuine, accurate and
            lawful.
          </p>

          <p className="mt-3 text-muted-foreground">
            Employers are responsible for recruitment decisions and for
            complying with applicable employment, equality, pay, working
            time, health and safety, right-to-work and other legal
            requirements.
          </p>

          <p className="mt-3 text-muted-foreground">
            Where an applicant is a younger worker, the employer is
            responsible for checking and following any additional legal
            restrictions or safeguards that apply.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            6. Job advertisements
          </h2>

          <p className="mt-3 text-muted-foreground">
            Job advertisements must describe genuine opportunities and
            must not contain deliberately misleading, discriminatory,
            fraudulent, unlawful or inappropriate content.
          </p>

          <p className="mt-3 text-muted-foreground">
            We may hide, reject or remove a listing where we reasonably
            believe it breaches these terms, creates a safety concern,
            is misleading, is no longer genuine or could harm users or
            the platform.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            7. Employer membership
          </h2>

          <p className="mt-3 text-muted-foreground">
            Certain employer features require a paid Work in CRNWL
            membership. The applicable price and membership period are
            displayed before purchase.
          </p>

          <p className="mt-3 text-muted-foreground">
            Where a membership renews automatically, this will be
            communicated as part of the purchase process. Employers can
            manage or cancel renewal through the available membership
            management tools.
          </p>

          <p className="mt-3 text-muted-foreground">
            Cancelling automatic renewal does not normally remove access
            immediately. Access may continue until the end of the
            membership period already paid for.
          </p>

          <p className="mt-3 text-muted-foreground">
            Any statutory rights that apply to a purchase are not
            excluded by these terms.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            8. Candidate information
          </h2>

          <p className="mt-3 text-muted-foreground">
            Employers receiving candidate information through Work in
            CRNWL must use it responsibly and for legitimate recruitment
            purposes.
          </p>

          <p className="mt-3 text-muted-foreground">
            Candidate contact details and profile information must not
            be harvested, sold, published, used for unrelated marketing
            or otherwise misused.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            9. Acceptable use
          </h2>

          <p className="mt-3 text-muted-foreground">
            You must not use Work in CRNWL to commit fraud, harass
            another person, distribute malicious software, attempt
            unauthorised access, scrape or harvest user information,
            interfere with the operation of the platform or otherwise
            use the service unlawfully.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            10. Employer and candidate checks
          </h2>

          <p className="mt-3 text-muted-foreground">
            Unless we explicitly state that a particular check has been
            completed, you should not assume that Work in CRNWL has
            independently verified every employer, candidate,
            qualification, statement or vacancy appearing on the
            platform.
          </p>

          <p className="mt-3 text-muted-foreground">
            Candidates should make sensible checks before accepting
            employment, and employers remain responsible for carrying
            out appropriate recruitment and right-to-work checks.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            11. Availability of the service
          </h2>

          <p className="mt-3 text-muted-foreground">
            We aim to keep Work in CRNWL available and working well, but
            we cannot guarantee that the platform will always be
            uninterrupted or error-free.
          </p>

          <p className="mt-3 text-muted-foreground">
            We may update, change, suspend or remove features where
            reasonably necessary to maintain, secure or develop the
            service.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            12. Our responsibility
          </h2>

          <p className="mt-3 text-muted-foreground">
            Nothing in these terms excludes or limits liability where
            doing so would be unlawful.
          </p>

          <p className="mt-3 text-muted-foreground">
            Subject to applicable law, Work in CRNWL is not responsible
            for recruitment decisions made by employers, whether a
            candidate accepts a role, or the subsequent employment
            relationship between an employer and candidate.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            13. Suspending or closing accounts
          </h2>

          <p className="mt-3 text-muted-foreground">
            We may restrict, suspend or close an account where we
            reasonably believe these terms have been seriously or
            repeatedly breached, the platform is being misused, users
            may be at risk, or action is necessary for security or legal
            reasons.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            14. Privacy
          </h2>

          <p className="mt-3 text-muted-foreground">
            Our Privacy Policy explains how we handle personal
            information when you use Work in CRNWL.
          </p>

          <Button
            asChild
            variant="outline"
            className="mt-4"
          >
            <Link to="/privacy">
              Read our Privacy Policy
            </Link>
          </Button>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            15. Changes to these terms
          </h2>

          <p className="mt-3 text-muted-foreground">
            We may update these terms as Work in CRNWL develops or where
            changes are needed for legal, security or operational
            reasons.
          </p>

          <p className="mt-3 text-muted-foreground">
            The latest version will be published on this page.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            16. Contact
          </h2>

          <p className="mt-3 text-muted-foreground">
            Questions about these terms can be sent to:
          </p>

          <p className="mt-3 font-medium">
            Work in CRNWL
          </p>

          <a
            href="mailto:wasson@workincrnwl.co.uk"
            className="mt-1 inline-block font-medium text-primary hover:underline"
          >
            wasson@workincrnwl.co.uk
          </a>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            17. Governing law
          </h2>

          <p className="mt-3 text-muted-foreground">
            These terms are governed by the applicable laws of England
            and Wales, subject to any mandatory legal rights that apply
            to you.
          </p>
        </section>

        <div className="border-t border-border pt-7">
          <Button asChild variant="outline">
            <Link to="/">
              Back to Work in CRNWL
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}