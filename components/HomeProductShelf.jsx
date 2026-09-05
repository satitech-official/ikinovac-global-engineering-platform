'use client';

import Link from 'next/link';
import { productHref } from '@/lib/catalogue';
import { assetUrl } from '@/lib/assets';
import { useRFQ } from './SiteShell';

export default function HomeProductShelf({ products }) {
  const { openQuote } = useRFQ();

  return <section className="home-product-shelf">
    <div className="shelf-heading"><div><p className="eyebrow">04 / FEATURED PRODUCT DESK</p><h2>PRODUCTS WITH<br /><em>PROJECT CONTEXT.</em></h2></div><p>Explore selected product families and start a direct engineering enquiry when your requirement is ready.</p></div>
    <div className="shelf-grid">{products.map(product => {
      return <article className="shelf-card" key={product.id}><Link href={productHref(product)} className="shelf-image" role="img" aria-label={product.imageAlt} style={{ backgroundImage: `linear-gradient(180deg,rgba(13,23,20,.06),rgba(13,23,20,.78)),url(${assetUrl(product.images[0])})` }}><span>{product.categoryNumber} / {String(product.order).padStart(2, '0')}</span><b>View details ↗</b></Link><div className="shelf-card-copy"><p>{product.category}</p><h3>{product.name}</h3><small>{product.description}</small><div className="shelf-actions"><Link href={productHref(product)}>View details →</Link><button onClick={() => openQuote(product)}>Request quote <i>→</i></button></div></div></article>;
    })}</div>
  </section>;
}

