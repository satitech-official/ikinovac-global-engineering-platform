'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { catalogueCategories, catalogueProducts, productHref } from '@/lib/catalogue';

const majorCategorySlugs = ['valves', 'automation', 'pipe-fittings-flanges', 'instrumentation', 'equipment', 'sealing-items', 'mining-machinery', 'motors'];
const requirements = [
  ['Flow control', ['valves', 'automation']],
  ['Process connection', ['pipe-fittings-flanges', 'sealing-items']],
  ['Measurement', ['instrumentation', 'process-utility']],
  ['Automation', ['automation', 'instrumentation']],
  ['Rotating equipment', ['equipment', 'motors', 'mining-machinery']],
  ['MRO', ['sealing-items', 'mining-machinery']],
  ['Safety', ['safety', 'welding']],
  ['Filtration', ['filtration', 'equipment', 'process-utility']]
];

export default function EngineeringProductFinder() {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState('browse');
  const [activeRequirement, setActiveRequirement] = useState(requirements[0][0]);
  const selectedRequirement = requirements.find(([name]) => name === activeRequirement);
  const majorCategories = majorCategorySlugs.map(slug => catalogueCategories.find(item => item.slug === slug)).filter(Boolean);
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return { products: [], categories: [], families: [] };
    const products = catalogueProducts.filter(product => [product.name, product.family, product.category, product.description].join(' ').toLowerCase().includes(term)).slice(0, 6);
    const categories = catalogueCategories.filter(category => [category.name, category.family, category.summary].join(' ').toLowerCase().includes(term)).slice(0, 4);
    const families = [...new Map(products.map(product => [product.family, product])).values()].slice(0, 4);
    return { products, categories, families };
  }, [query]);
  const recommendationCategories = (selectedRequirement?.[1] || []).map(slug => catalogueCategories.find(item => item.slug === slug)).filter(Boolean);
  const hasResults = query.trim().length > 0;

  return <section className="product-finder" id="product-finder" data-reveal>
    <div className="finder-heading reveal-up"><div><p className="eyebrow">01 / ENGINEERING PRODUCT FINDER</p><h2>WHAT ARE YOU<br /><em>SOURCING?</em></h2></div><p>Find the right product family faster, then carry the requirement into a clear RFQ. Product suitability is confirmed with the project desk.</p></div>
    <label className="finder-search reveal-clip"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products, families, applications or technical requirements" /><small>LIVE DIRECTORY SEARCH</small></label>
    {hasResults ? <div className="finder-results"><section><p className="eyebrow">PRODUCTS</p>{results.products.length ? results.products.map(product => <Link href={productHref(product)} key={product.id}><b>{product.categoryNumber}</b><span>{product.name}<small>{product.category} / {product.family}</small></span><i>↗</i></Link>) : <p>No approved family is matched yet.</p>}</section><section><p className="eyebrow">PRODUCT FAMILIES</p>{results.families.length ? results.families.map(product => <Link href={productHref(product)} key={product.id}><span>{product.family}<small>View a relevant family</small></span><i>↗</i></Link>) : <p>Family guidance is available on request.</p>}</section><section><p className="eyebrow">CATEGORIES</p>{results.categories.length ? results.categories.map(category => <Link href={`/products/${category.slug}`} key={category.slug}><b>{category.number}</b><span>{category.name}</span><i>↗</i></Link>) : <p>Search products, families or categories.</p>}</section><section><p className="eyebrow">APPLICATIONS</p><p>Application context is confirmed with the project desk before selection.</p><Link href="/contact">Start a technical RFQ <i>↗</i></Link></section></div> : <><div className="finder-switch"><button className={mode === 'browse' ? 'active' : ''} onClick={() => setMode('browse')}>Browse by product <span>→</span></button><button className={mode === 'requirement' ? 'active' : ''} onClick={() => setMode('requirement')}>Find by requirement <span>→</span></button></div>{mode === 'browse' ? <div className="finder-category-grid">{majorCategories.map(category => <Link href={`/products/${category.slug}`} key={category.slug}><b>{category.number}</b><span>{category.name}</span><small>{category.items.length} families</small><i>→</i></Link>)}<Link className="finder-all-categories" href="/products"><span>View all</span><b>{catalogueCategories.length} categories</b><i>→</i></Link></div> : <div className="finder-requirements"><div>{requirements.map(([name]) => <button className={name === activeRequirement ? 'active' : ''} onClick={() => setActiveRequirement(name)} key={name}>{name}<span>→</span></button>)}</div><section><p className="eyebrow">RELEVANT PRODUCT GROUPS</p><h3>{activeRequirement}</h3><p>These groups provide a useful starting point. Final product selection depends on the verified technical brief.</p><div>{recommendationCategories.map(category => <Link href={`/products/${category.slug}`} key={category.slug}><b>{category.number}</b>{category.name}<i>↗</i></Link>)}</div></section></div>}</>}
    <Link href="/contact" className="finder-help">Not sure what to specify? Start a technical RFQ <span>→</span></Link>
  </section>;
}
