import { Metadata } from "next";
import AboutClient from "./AboutClient";
import { constructMetadata } from "../seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "About Us — India's Trusted Refurbished Computer Store",
  description: "Learn about Comsri Corporation, a leading online store of refurbished laptops, desktops, workstations, and mini PCs in India. Quality-tested devices, bulk orders, and reliable IT hardware solutions.",
  path: "/about-us",
  keywords: [
    "About Comsri Corporation",
    "Comsri Corporation",
    "Refurbished Computer Company India",
    "IT Hardware Supplier India",
    "Refurbished Laptops India",
    "Refurbished Desktops India",
    "Workstations India",
    "Mini PCs India",
    "Corporate IT Solutions",
    "Business IT Hardware Supplier",
    "Trusted Refurbished Computer Supplier",
    "New and Refurbished Computers"
  ],
});

export default function AboutPage() {
  return <AboutClient />;
}
