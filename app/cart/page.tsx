import { Metadata } from "next";
import CartClient from "./CartClient";
import { constructMetadata } from "../seo/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Shopping Cart",
  description: "Review your selected refurbished computer equipment and proceed with secured payment gateways.",
  path: "/cart",
  keywords: [],
  noIndex: true, // Cart page should not be indexed by search engines
});

export default function CartPage() {
  return <CartClient />;
}
