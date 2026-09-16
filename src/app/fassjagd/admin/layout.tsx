import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fassjagd Admin",
  robots: { index: false, follow: false },
};

export default function FassjagdAdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
