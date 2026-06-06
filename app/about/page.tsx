import { Metadata } from "next";
import AboutClient from "./AboutClient";
import { constructMetadata } from "../seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "About Comsri Corporation | Certified Refurbished IT Sourcing",
  description: "About Comsri Corporation - Trusted supplier of new and refurbished laptops, desktops, workstations, and mini PCs in India since 2020.",
  path: "/about",
  keywords: ["about Comsri", "computer seller India", "refurbished computer store", "IT solutions company"],
});

export default function AboutPage() {
  return <AboutClient />;
}
