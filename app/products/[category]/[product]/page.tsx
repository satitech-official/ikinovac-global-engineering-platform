import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/catalog-client";
import { catalogProducts, getProduct, getRelatedProducts } from "@/data/catalog";

type Props = { params: Promise<{ category: string; product: string }> };

export function generateStaticParams() {
  return catalogProducts.map((product) => ({
    category: product.categorySlug,
    product: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, product: productSlug } = await params;
  const product = getProduct(category, productSlug);
  if (!product) return { title: "Product" };
  return { title: product.name, description: product.shortDescription, alternates: { canonical: `/products/${product.categorySlug}/${product.slug}` } };
}

export default async function ProductPage({ params }: Props) {
  const { category, product: productSlug } = await params;
  const product = getProduct(category, productSlug);
  if (!product) notFound();
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    description: product.shortDescription,
    category: product.category,
    image: product.images,
  };
  return <><ProductDetail product={product} relatedProducts={getRelatedProducts(product)} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} /></>;
}
