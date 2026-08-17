import type { Metadata } from "next";
import { ProductRouteClient } from "@/components/catalog-route-client";
import { catalogProducts } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Industrial Product",
  description: "View IKINOVAC Global industrial product specifications and request a project-specific quotation.",
};

export function generateStaticParams() {
  return catalogProducts.map((product) => ({
    category: product.categorySlug,
    product: product.slug,
  }));
}

export default function ProductPage() {
  return <ProductRouteClient />;
}
