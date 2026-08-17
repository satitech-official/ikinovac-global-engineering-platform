import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProductDetail } from "@/components/catalog-client";
import { getProduct, getRelatedProducts } from "@/data/catalog";

type Props = {
  params: Promise<{
    category: string;
    product: string;
  }>;
};

export const metadata: Metadata = {
  title: "Industrial Product",
  description:
    "View IKINOVAC Global industrial product specifications and request a project-specific quotation.",
};

export function generateStaticParams() {
  // If your catalog data exports catalogProducts, use it here.
  return [];
}

export default async function ProductPage({ params }: Props) {
  const { category, product: productSlug } = await params;

  const product = getProduct(category, productSlug);

  if (!product) {
    notFound();
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.code,
    description: product.shortDescription,
    category: product.category,
    image: product.images,
  };

  return (
    <>
      <div className="product-catalogue-shortcut">
        <div>
          <span>PRODUCT CATALOGUE AVAILABLE</span>
          <strong>
            {product.name} / {product.code}
          </strong>
        </div>

        <a
          href={`/catalogues/${product.categorySlug}/${product.slug}`}
        >
          OPEN INDIVIDUAL CATALOGUE <span>↗</span>
        </a>
      </div>

      <ProductDetail
        product={product}
        relatedProducts={getRelatedProducts(product)}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema),
        }}
      />
    </>
  );
}