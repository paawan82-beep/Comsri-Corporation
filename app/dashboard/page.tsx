import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Customer Dashboard | Comsri Corporation",
  description: "View and track your orders, warranties, and manage shipping addresses.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}
