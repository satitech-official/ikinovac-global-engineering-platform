import type { Metadata } from "next";
import { CatalogExplorer } from "@/components/catalog-client";
import { catalogCategories, catalogProducts } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Industrial Product Catalog",
  description: "Explore IKINOVAC Global's industrial supply catalog across valves, piping, instrumentation, pumps, automation and MRO products.",
};

export default function ProductsPage() {
  return <CatalogExplorer products={catalogProducts} categories={catalogCategories} title="Industrial Product Catalog" description="Browse a scalable catalog of industrial components and equipment. Pricing, availability and final documentation are confirmed against the approved configuration and RFQ." />;
}
