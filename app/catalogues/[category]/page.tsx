import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogExplorer } from "@/components/catalog-client";
import { catalogCategories, getCategory, getProductsForCategory } from "@/data/catalog";

type Props = { params: Promise<{ category: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return catalogCategories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return { title: "Product Catalogue" };
  return { title: `${category.name} Catalogue`, description: category.description };
}

export default async function CategoryCataloguePage({ params }: Props) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();
  return <CatalogExplorer products={getProductsForCategory(category.slug)} categories={catalogCategories} fixedCategory={category} title={`${category.name} Catalogue`} description={category.description} />;
}
