"use client";

import { useEffect, useState } from "react";
import { CatalogExplorer, ProductDetail } from "@/components/catalog-client";
import { catalogCategories, catalogProducts, getCategory, getProduct, getProductsForCategory, getRelatedProducts } from "@/data/catalog";

function getProductSegments() {
  if (typeof window === "undefined") return [] as string[];
  const parts = window.location.pathname.split("/").filter(Boolean);
  const productsIndex = parts.lastIndexOf("products");
  return productsIndex >= 0 ? parts.slice(productsIndex + 1) : [];
}

export function CategoryRouteClient() {
  const [categorySlug, setCategorySlug] = useState<string | null>(null);

  useEffect(() => {
    setCategorySlug(getProductSegments()[0] ?? "");
  }, []);

  if (categorySlug === null) {
    return <CatalogExplorer products={catalogProducts} categories={catalogCategories} title="Industrial Products" description="Loading product category…" />;
  }

  const category = getCategory(categorySlug);
  if (!category) {
    return <CatalogExplorer products={catalogProducts} categories={catalogCategories} title="Industrial Products" description="Explore IKINOVAC Global industrial product categories and engineered supply solutions." />;
  }

  return <CatalogExplorer products={getProductsForCategory(category.slug)} categories={catalogCategories} fixedCategory={category} title={category.name} description={category.description} />;
}

export function ProductRouteClient() {
  const [segments, setSegments] = useState<string[] | null>(null);

  useEffect(() => {
    setSegments(getProductSegments());
  }, []);

  const fallback = catalogProducts[0];
  if (segments === null) {
    return fallback ? <ProductDetail product={fallback} relatedProducts={getRelatedProducts(fallback)} /> : null;
  }

  const product = getProduct(segments[0] ?? "", segments[1] ?? "");
  if (!product) {
    return <CatalogExplorer products={catalogProducts} categories={catalogCategories} title="Industrial Products" description="Explore IKINOVAC Global industrial products and request project-specific quotations." />;
  }

  return <ProductDetail product={product} relatedProducts={getRelatedProducts(product)} />;
}
