import type { Metadata } from "next";
import { CategoryRouteClient } from "@/components/catalog-route-client";
import { catalogCategories } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Industrial Product Category",
  description: "Explore IKINOVAC Global industrial products and engineered supply solutions.",
};

export function generateStaticParams() {
  return catalogCategories.map((category) => ({ category: category.slug }));
}

export default function ProductCategoryPage() {
  return <CategoryRouteClient />;
}
