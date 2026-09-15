"use client";

import { RaceResultFormular } from "@/components/anmeldung/race-result-anmeldung";

export default function SammelAnmeldungPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <RaceResultFormular formId="sammel" />
      </div>
    </div>
  );
}
