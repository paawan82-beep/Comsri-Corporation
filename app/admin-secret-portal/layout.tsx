import type { Metadata } from "next";

// Keep the internal admin/cache-control portal out of all search indexes.
export const metadata: Metadata = {
  title: "Admin Portal",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminPortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
