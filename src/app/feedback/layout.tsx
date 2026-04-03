import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Feedback & Kontakt",
  description:
    "Rückmeldung zum Koderlauf, Verbesserungsvorschläge und Fragen an das Team – Nachricht an info@koderlauf.de.",
};

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
