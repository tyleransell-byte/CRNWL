import { createFileRoute, Link } from "@tanstack/react-router";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      {
        title: "Privacy Policy | Work in CRNWL",
      },
      {
        name: "description",
        content:
          "How Work in CRNWL collects, uses and protects your personal information.",
      },
    ],
  }),

  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ShieldCheck className="size-5" />
        </span>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-primary">
            Your information
          </p>

          <h1 className="font-display text-3xl font-bold">
            Privacy Policy
          </h1>
        </div>
      </div>

      <p className="mt-4 max-w-2xl text-muted-foreground">
        We believe finding work should be simple -- and understanding
        what happens to your information should be simple too.
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
            Work in CRNWL is an online hospitality jobs platform
            connecting people looking for work with employers in
            Cornwall.
          </p>

          <p className="mt-3 text-muted-foreground">
            This Privacy Policy explains what personal information we
            collect, why we use it, who it may be shared with and the
            choices you have regarding your information.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            2. Information we collect
          </h2>

          <p className="mt-3 text-muted-foreground">
            The information we collect depends on how you use Work in
            CRNWL.
          </p>

          <h3 className="mt-5 font-semibold">
            Candidate accounts
          </h3>

          <p className="mt-2 text-muted-foreground">
            This may include your name, email address, phone number,
            general location, date of birth, hospitality experience,
            current or recent role, availability, work preferences,
            preferred work locations, transport information, interest
            in live-in roles and information you choose to include in
            your candidate profile.
          </p>

          <h3 className="mt-5 font-semibold">
            Employer accounts
          </h3>

          <p className="mt-2 text-muted-foreground">
            This may include your name, email address, business name,
            account information, job listings, applicant management
            information and information relating to your membership.
          </p>

          <h3 className="mt-5 font-semibold">
            Technical information
          </h3>

          <p className="mt-2 text-muted-foreground">
            We may also process technical information required to
            operate, secure and improve the website, such as browser,
            device, authentication and security information.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            3. How we use your information
          </h2>

          <p className="mt-3 text-muted-foreground">
            We use personal information where necessary to operate
            Work in CRNWL and provide the services you request.
          </p>

          <ul className="mt-4 list-disc space-y-2 pl-5 text-muted-foreground">
            <li>Create and manage your account.</li>
            <li>Allow candidates to build and manage profiles.</li>
            <li>Allow candidates to apply for jobs.</li>
            <li>
              Allow relevant employers to review applications and
              contact candidates.
            </li>
            <li>
              Allow employers to create and manage job listings.
            </li>
            <li>Process and manage employer memberships.</li>
            <li>
              Send important account, security and service emails.
            </li>
            <li>
              Prevent misuse and protect the security of the platform.
            </li>
            <li>
              Maintain and improve the Work in CRNWL service.
            </li>
            <li>Comply with legal obligations.</li>
          </ul>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            4. Candidate profiles and employers
          </h2>

          <p className="mt-3 text-muted-foreground">
            When you apply for a job, information connected with your
            application and candidate profile may be made available to
            the employer responsible for that vacancy so they can
            consider your application and contact you about it.
          </p>

          <p className="mt-3 text-muted-foreground">
            If Work in CRNWL provides an "Open to work" or candidate
            discovery feature, your profile may also be discoverable by
            eligible employers when you choose to enable that feature.
          </p>

          <p className="mt-3 text-muted-foreground">
            Please avoid putting sensitive or unnecessary personal
            information in your profile or application.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            5. Date of birth
          </h2>

          <p className="mt-3 text-muted-foreground">
            Where we collect your date of birth, we use it for account,
            eligibility, safety or age-related purposes where
            appropriate. Your date of birth is not intended to be
            displayed as part of your public candidate profile.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            6. Our service providers
          </h2>

          <p className="mt-3 text-muted-foreground">
            We use trusted technology providers to help operate Work in
            CRNWL. These may process information on our behalf where
            necessary to provide their services.
          </p>

          <p className="mt-3 text-muted-foreground">
            These services include infrastructure used for database,
            authentication, website hosting, email delivery and payment
            processing.
          </p>

          <p className="mt-3 text-muted-foreground">
            Employer membership payments are processed by our payment
            provider. Work in CRNWL does not need to store your complete
            payment card details itself.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            7. Legal bases
          </h2>

          <p className="mt-3 text-muted-foreground">
            Depending on the circumstances, we may process personal
            information because it is necessary to provide our service
            or perform a contract with you, because we have a legitimate
            interest in operating and protecting Work in CRNWL, because
            we need to comply with a legal obligation, or because you
            have given consent where consent is appropriate.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            8. Keeping your information safe
          </h2>

          <div className="mt-4 rounded-2xl border border-border bg-sand p-5">
            <div className="flex gap-3">
              <LockKeyhole className="mt-0.5 size-5 shrink-0 text-primary" />

              <p className="text-sm text-muted-foreground">
                We use reasonable technical and organisational measures
                designed to protect personal information. However, no
                online system can guarantee absolute security.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            9. How long we keep information
          </h2>

          <p className="mt-3 text-muted-foreground">
            We keep personal information only for as long as reasonably
            necessary for the purpose it was collected, including
            providing your account, handling applications, maintaining
            appropriate business records, resolving disputes, preventing
            abuse and meeting legal obligations.
          </p>

          <p className="mt-3 text-muted-foreground">
            Retention periods may differ depending on the type of
            information and why we hold it.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            10. Your data protection rights
          </h2>

          <p className="mt-3 text-muted-foreground">
            Depending on the circumstances, UK data protection law may
            give you rights over your personal information. These can
            include asking for a copy of your information, correcting
            inaccurate information, requesting deletion, restricting or
            objecting to certain processing, and asking for certain
            information to be transferred.
          </p>

          <p className="mt-3 text-muted-foreground">
            Some rights are subject to legal conditions and exceptions.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            11. Younger users
          </h2>

          <p className="mt-3 text-muted-foreground">
            We recognise that younger people may look for hospitality
            work. We aim to handle younger users' personal information
            with particular care and to limit collection and sharing to
            what is appropriate for providing the service.
          </p>

          <p className="mt-3 text-muted-foreground">
            Employers remain responsible for complying with employment
            laws and any additional rules that apply when employing
            younger workers.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            12. Marketing
          </h2>

          <p className="mt-3 text-muted-foreground">
            Essential account and service messages are different from
            marketing. If we introduce optional marketing communications,
            we will provide appropriate choices and you will be able to
            unsubscribe from marketing communications.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            13. Changes to this policy
          </h2>

          <p className="mt-3 text-muted-foreground">
            We may update this Privacy Policy as Work in CRNWL develops.
            The latest version will be published on this page and the
            "Last updated" date will be changed when appropriate.
          </p>
        </section>

        <section className="border-t border-border pt-7">
          <h2 className="font-display text-xl font-bold">
            14. Contact us
          </h2>

          <p className="mt-3 text-muted-foreground">
            If you have a question about your personal information,
            privacy or this policy, contact:
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

          <p className="mt-4 text-muted-foreground">
            You also have the right to raise a data protection concern
            with the UK Information Commissioner's Office where
            applicable.
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