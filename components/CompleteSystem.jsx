'use client';

import Link from 'next/link';
import { useState } from 'react';
import { catalogueProducts, getRelatedProducts, productHref } from '@/lib/catalogue';
import { assetUrl } from '@/lib/assets';

const nodeImage = product => ({
  backgroundImage: `linear-gradient(135deg, rgba(5, 16, 13, .22), rgba(5, 16, 13, .86)), url(${assetUrl(product.images[0])})`
});

export default function CompleteSystem() {
  const centre = catalogueProducts.find(product => product.id === 'valves-ball-valves') || catalogueProducts[0];
  const related = getRelatedProducts(centre).slice(0, 6);
  const [active, setActive] = useState(centre);
  return <section className="complete-system" data-reveal><div className="system-demo-heading reveal-up"><p className="eyebrow light">05 / COMPLETE THE SYSTEM</p><h2>MORE THAN<br />A PRODUCT.<br /><em>A COMPLETE SYSTEM.</em></h2><p>Explore the connected industrial product groups around one requirement. Relationships are directory-level pointers, not compatibility claims.</p></div><div className="system-demo-stage reveal-scale"><div className="system-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div><button className="system-centre" onClick={() => setActive(centre)}><small>CORE FAMILY</small><b>{centre.name}</b><span>{centre.category}</span></button><div className="system-node-grid">{related.map((product, index) => <button key={product.id} className={`system-node node-${index + 1} ${active.id === product.id ? 'active' : ''}`} style={nodeImage(product)} aria-label={`${product.name}: ${product.imageAlt}`} onClick={() => setActive(product)}><small>{product.categoryNumber}</small><b>{product.name}</b><i>↗</i></button>)}</div><article className="system-selection"><p className="eyebrow">SELECTED FAMILY</p><h3>{active.name}</h3><span>{active.category} / {active.family}</span><Link href={productHref(active)}>Explore product family <i>→</i></Link></article></div></section>;
}

