'use client';

import Link from 'next/link';
import { useState } from 'react';
import { getRelatedProducts, productHref } from '@/lib/catalogue';
import { useRFQ } from './SiteShell';

export default function HomeProductShelf({ products }) {
  const { add } = useRFQ();
  const [requirements, setRequirements] = useState({});
  const [quantities, setQuantities] = useState({});

  return <section className="home-product-shelf">
    <div className="shelf-heading"><div><p className="eyebrow">04 / FEATURED PRODUCT DESK</p><h2>PRODUCTS WITH<br /><em>PROJECT CONTEXT.</em></h2></div><p>A purchase-style shortlist for the homepage. Pricing, approved sizes and technical variants are requested—not invented—until the authorised catalogue data is available.</p></div>
    <div className="shelf-grid">{products.map(product => {
      const quantity = quantities[product.id] || 1;
      const requirement = requirements[product.id] || '';
      const related = getRelatedProducts(product).slice(0, 2);
      return <article className="shelf-card" key={product.id}><Link href={productHref(product)} className="shelf-image" role="img" aria-label={product.imageAlt} style={{ backgroundImage: `linear-gradient(180deg,rgba(13,23,20,.06),rgba(13,23,20,.78)),url(${product.images[0]})` }}><span>{product.categoryNumber} / {String(product.order).padStart(2, '0')}</span><b>View details ↗</b></Link><div className="shelf-card-copy"><p>{product.category}</p><h3>{product.name}</h3><small>{product.description}</small><label>Size / configuration<input value={requirement} onChange={event => setRequirements(current => ({ ...current, [product.id]: event.target.value }))} placeholder="Enter required size or configuration" /></label><div className="shelf-meta"><div><span>PRICE</span><b>On request</b></div><label><span>QTY</span><input type="number" min="1" value={quantity} onChange={event => setQuantities(current => ({ ...current, [product.id]: Math.max(1, Number(event.target.value) || 1) }))} /></label></div><div className="shelf-actions"><button onClick={() => add({ ...product, priceLabel: 'Price on request' }, { size: requirement || 'Configuration to be confirmed' }, quantity)}>Add to RFQ <i>+</i></button><Link href={productHref(product)}>Configure →</Link></div>{related.length > 0 && <div className="shelf-related"><span>RELATED</span>{related.map(item => <Link href={productHref(item)} key={item.id}>{item.name}</Link>)}</div>}</div></article>;
    })}</div>
  </section>;
}
