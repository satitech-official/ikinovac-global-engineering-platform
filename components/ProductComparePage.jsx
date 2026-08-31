'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { catalogueProducts, productHref } from '@/lib/catalogue';
import { assetUrl } from '@/lib/assets';
import { useRFQ } from './SiteShell';

const fields = [
  ['Category', product => product.category],
  ['Product family', product => product.family],
  ['Applications', product => product.applications.length ? product.applications.join(', ') : 'Application guidance on request'],
  ['Configurations', product => product.variants.length ? `${product.variants.length} approved configurations` : 'Technical configuration on request'],
  ['Documents', product => product.documents.length ? `${product.documents.length} available` : 'Available on request']
];

export default function ProductComparePage() {
  const [ids, setIds] = useState([]);
  const { add } = useRFQ();
  useEffect(() => { setIds((new URLSearchParams(window.location.search).get('ids') || '').split(',').filter(Boolean).slice(0, 3)); }, []);
  const products = useMemo(() => ids.map(id => catalogueProducts.find(product => product.id === id)).filter(Boolean), [ids]);
  const remove = id => setIds(current => current.filter(item => item !== id));
  if (!products.length) return <section className="compare-page compare-empty"><p className="eyebrow">PRODUCT DIRECTORY / COMPARE</p><h1>Choose up to three<br /><em>product families.</em></h1><p>Use the product directory to build a practical comparison. Only approved data is shown; unavailable technical fields remain on request.</p><Link href="/products" className="button button-dark">Browse products <span>→</span></Link></section>;
  return <section className="compare-page"><div className="compare-page-intro"><p className="eyebrow light">PRODUCT DIRECTORY / COMPARE</p><h1>Compare the<br /><em>requirement.</em></h1><p>Compare selected product families before carrying them into one RFQ. This view does not infer technical compatibility.</p></div><div className="compare-matrix">{products.map(product => <article key={product.id} className="compare-product"><button className="compare-remove" onClick={() => remove(product.id)} aria-label={`Remove ${product.name}`}>×</button><div style={{ backgroundImage:`linear-gradient(180deg,rgba(9,28,23,.04),rgba(9,28,23,.78)),url(${assetUrl(product.images[0])})` }}><p>{product.categoryNumber} / {String(product.order).padStart(2, '0')}</p><span>{product.category}</span></div><h2>{product.name}</h2><p>{product.description}</p><Link href={productHref(product)}>Explore family →</Link><button className="button button-gold" onClick={() => add(product)}>Add to RFQ <span>→</span></button></article>)}</div><div className="compare-data"><div className="compare-data-label"><p className="eyebrow">AVAILABLE INFORMATION</p>{fields.map(([label]) => <b key={label}>{label}</b>)}</div>{products.map(product => <div className="compare-data-column" key={product.id}>{fields.map(([label, getValue]) => <span key={label}>{getValue(product)}</span>)}</div>)}</div><div className="compare-page-actions"><Link href="/products" className="text-arrow light">Continue browsing <span>→</span></Link><button className="button button-gold" onClick={() => products.forEach(product => add(product))}>Add all to RFQ <span>→</span></button></div></section>;
}

