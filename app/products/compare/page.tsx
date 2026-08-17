import type { Metadata } from "next";
import { CatalogComparison } from "@/components/catalog-client";
import { catalogProducts } from "@/data/catalog";

export const metadata: Metadata = { title: "Compare Products", description: "Compare industrial product configurations before preparing an RFQ." };

export default async function CompareProductsPage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids = "" } = await searchParams;
  const selectedIds = ids.split(",").filter(Boolean).slice(0, 3);
  return <CatalogComparison products={catalogProducts.filter((product) => selectedIds.includes(product.id))} />;
}
