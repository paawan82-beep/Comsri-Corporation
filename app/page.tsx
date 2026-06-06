import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { constructMetadata } from "./seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Buy Refurbished Laptops & Desktops Online in India",
  description: "Premium refurbished laptops, desktops, workstations, and corporate IT hardware online in India. Fully tested 40+ points quality certified with 1-year warranty.",
  path: "/",
  keywords: ["refurbished laptops", "refurbished desktops", "refurbished computers", "headless e-commerce", "cheap laptops India"],
});

export default function Home() {
  return <HomeClient />;
}
