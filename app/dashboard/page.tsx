import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Customer Dashboard | Comsri Corporation",
  description: "View and track your orders, warranties, and manage shipping addresses.",
  // Private, per-user account page — must not be indexed (previously it was
  // indexable and even canonicalised to the homepage).
  robots: { index: false, follow: false },
  alternates: { canonical: "/dashboard" },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
