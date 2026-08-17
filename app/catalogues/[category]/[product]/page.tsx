import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCatalogue } from "@/components/catalog-client";
import { catalogProducts, getProduct } from "@/data/catalog";

type Props = { params: Promise<{ category: string; product: string }> };

export function generateStaticParams() {
  return catalogProducts.map(({ categorySlug, slug }) => ({
    category: categorySlug,
    product: slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product: productSlug } = await params;
  const product = getProduct(category, productSlug);
  if (!product) return { title: "Product Catalogue" };
  return {
    title: `${product.name} Catalogue`,
    description: `Product catalogue for ${product.name} (${product.code}).`,
    alternates: { canonical: `/catalogues/${product.categorySlug}/${product.slug}` },
  };
}

export default async function IndividualCataloguePage({ params }: Props) {
  const { category, product: productSlug } = await params;
  const product = getProduct(category, productSlug);
  if (!product) notFound();
  return <ProductCatalogue product={product} />;
}
