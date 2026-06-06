import { constructMetadata } from "@/app/seo/metadata";
import LoginClient from "./LoginClient";

export const metadata = constructMetadata({
  title: "Login to Your Account",
  description: "Log in to your Comsri account to manage orders, track shipping, and customize settings.",
  path: "/login",
  noIndex: true,
});

export default function LoginPage() {
  return <LoginClient />;
}
