import { Metadata } from "next";
import ContactClient from "./ContactClient";
import { constructMetadata } from "../seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Contact Us — Comsri Corporation",
  description:
    "Get in touch with Comsri Corporation for product inquiries, bulk orders, technical support, and general information. We're here to help you find the right refurbished laptop or desktop.",
  path: "/contact",
  keywords: [
    "Contact Comsri Corporation",
    "Comsri Corporation Contact",
    "Refurbished Laptop Inquiry India",
    "Bulk Order Inquiry",
    "IT Hardware Support India",
    "Comsri Support",
    "Buy Refurbished Laptops India Contact",
    "Computer Store Contact Mumbai",
  ],
});

export default function ContactPage() {
  return <ContactClient />;
}
