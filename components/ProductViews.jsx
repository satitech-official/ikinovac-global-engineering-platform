'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getRelatedCategories, getRelatedProducts, productHref } from '@/lib/catalogue';
import { useRFQ } from './SiteShell';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetUrl = path => `${basePath}${path}`;
const productVisualStyle = product => ({
  backgroundImage: `linear-gradient(180deg, rgba(5,16,13,.04), rgba(5,16,13,.82)), url(${assetUrl(product.cardImage || product.images[0])})`,
  backgroundPosition: `center, ${product.cardImagePosition || 'center'}`,
  backgroundSize: `cover, ${product.cardImageSize || 'cover'}`
});

export function CategoryView({ category, products }) {
  return <>
    <section className="category-hero" aria-label={category.imageAlt || `${category.name} industrial equipment`} style={{ backgroundImage: `linear-gradient(90deg,rgba(13,23,20,.93),rgba(13,23,20,.45)),url(${assetUrl(category.image)})` }}><p className="eyebrow light">{category.number} / PRODUCT CATEGORY</p><h1>{category.name}</h1><p>{category.summary} Browse product families, then take the configuration discussion to the project desk.</p><a href="#families" className="text-arrow light">Explore the range <span>↓</span></a></section>
    <section className="category-families" id="families"><div className="section-title"><div><p className="eyebrow">PRODUCT FAMILIES / {String(products.length).padStart(2, '0')}</p><h2>Specified around<br /><em>the requirement.</em></h2></div><p>Choose a product family to view its product context, available configuration workflow and enquiry options.</p></div><div className="family-card-grid">{products.map(product => <article className="family-product-card" key={product.id}><Link href={productHref(product)}><div className="family-product-image" role="img" aria-label={product.imageAlt} style={productVisualStyle(product)}><p>{category.number} / {String(product.order).padStart(2, '0')}</p><span>{product.family}</span></div><div className="family-product-copy"><p>{category.name}</p><h3>{product.name}</h3><span>{product.description}</span><b>View product family <i>→</i></b></div></Link></article>)}</div></section>
    <section className="related-systems"><p className="eyebrow light">RELATED SYSTEMS</p><h2>Complete the<br /><em>engineering system.</em></h2><div>{getRelatedCategories(category).map(item => <Link href={`/products/${item.slug}`} key={item.slug}><b>{item.number}</b><h3>{item.name}</h3><p>{item.summary}</p><span>Explore range →</span></Link>)}</div></section>
  </>;
}

export function ProductDetailView({ product, category }) {
  const { openConfigurator } = useRFQ();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const related = getRelatedProducts(product);
  const hasVariants = product.variants.length > 0;
  return <>
    <section className="product-detail-hero"><div className="product-gallery"><div role="img" aria-label={product.imageAlt} style={productVisualStyle(product)}><span>{product.categoryNumber} / {String(product.order).padStart(2, '0')}</span></div><p>IMAGE / REPRESENTATIVE PRODUCT FAMILY</p></div><div className="product-summary"><nav className="breadcrumb"><Link href="/products">Products</Link><span>/</span><Link href={`/products/${category.slug}`}>{category.name}</Link><span>/</span><b>{product.name}</b></nav><p className="eyebrow">{product.family} / PRODUCT FAMILY</p><h1>{product.name}</h1>{product.code && <p className="product-code">{product.code}</p>}<p>{product.description}</p><div className="product-applications"><b>APPLICATIONS</b>{product.applications.length ? product.applications.map(item => <span key={item}>{item}</span>) : <span>Application guidance available on request</span>}</div><button className="button button-dark" onClick={() => openConfigurator(product)}>CONFIGURE &amp; REQUEST QUOTE <span>→</span></button><small>Open the product requirement panel to add only the technical details you know. IKINOVAC confirms final configuration, availability and commercial terms after review.</small></div></section>
    <section className="configurator-section"><div><p className="eyebrow">AVAILABLE CONFIGURATIONS</p><h2>Built for the <em>technical brief.</em></h2><p>Select an approved variant when available. All fields remain intentionally unpopulated until source data is supplied.</p></div>{hasVariants ? <div className="configuration-table"><div className="config-head"><span>Size</span><span>Material</span><span>Rating</span><span>Standard</span><span>Connection</span><span>Operation</span><span>Availability</span></div>{product.variants.map((variant, index) => <button className={selectedVariant === variant ? 'active' : ''} onClick={() => setSelectedVariant(variant)} key={index}><span>{variant.size}</span><span>{variant.material}</span><span>{variant.pressureRating}</span><span>{variant.standard}</span><span>{variant.connection}</span><span>{variant.actuation}</span><span>{variant.availability}</span></button>)}</div> : <div className="config-empty"><b>TECHNICAL DATA ON REQUEST</b><p>Approved sizes, materials, pressure ratings, standards, end connections and operating configuration can be supplied against your requirement.</p><Link href="/contact" className="text-arrow">Send a technical enquiry <span>→</span></Link></div>}</section>
    <section className="detail-info-section"><article><p className="eyebrow">DOCUMENTS</p><h2>Documentation<br /><em>when relevant.</em></h2>{product.documents.length ? product.documents.map(document => <a href={document.url} key={document.url}>{document.title} →</a>) : <p>No document is published for this product family. Request available documentation from the project desk.</p>}</article><article><p className="eyebrow">RFQ WORKFLOW</p><h2>One product.<br /><em>Full context.</em></h2><p>The RFQ can carry product selection, quantity, application, delivery context and attached project documents without inventing a configuration online.</p><Link className="button button-dark" href="/contact">Continue to RFQ <span>→</span></Link></article></section>
    <section className="related-products-rail"><div><p className="eyebrow light">RELATED ENGINEERING SYSTEMS</p><h2>Complete the <em>system.</em></h2></div><div className="related-product-grid">{related.length ? related.map(item => <Link href={productHref(item)} key={item.id} aria-label={`${item.name}: ${item.imageAlt}`} style={productVisualStyle(item)}><p>{item.category}</p><h3>{item.name}</h3><span>Explore family →</span></Link>) : getRelatedCategories(category).map(item => <Link href={`/products/${item.slug}`} key={item.slug} aria-label={`${item.name}: ${item.imageAlt || 'industrial equipment'}`} style={{ backgroundImage: `linear-gradient(180deg, rgba(5,16,13,.04), rgba(5,16,13,.82)), url(${assetUrl(item.image)})` }}><p>{item.number} / RELATED SYSTEM</p><h3>{item.name}</h3><span>Explore system →</span></Link>)}</div></section>
  </>;
}
