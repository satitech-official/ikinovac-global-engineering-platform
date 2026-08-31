'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { catalogueCategories, catalogueProducts, productHref } from '@/lib/catalogue';
import { useRFQ } from './SiteShell';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function CataloguePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('directory');
  const [compare, setCompare] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { add } = useRFQ();
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = catalogueProducts.filter(product => (category === 'all' || product.categorySlug === category) && (!needle || [product.name, product.category, product.family, product.description].join(' ').toLowerCase().includes(needle)));
    return sort === 'alpha' ? [...filtered].sort((a, b) => a.name.localeCompare(b.name)) : filtered;
  }, [query, category, sort]);
  const toggleCompare = product => setCompare(current => current.some(item => item.id === product.id) ? current.filter(item => item.id !== product.id) : current.length < 3 ? [...current, product] : current);
  const clearFilters = () => { setQuery(''); setCategory('all'); setSort('directory'); };

  return <>
    <section className="catalogue-hero" style={{ backgroundImage: `linear-gradient(115deg,rgba(13,23,20,.98),rgba(19,33,29,.82)),url(${basePath}/assets/industry/valves.jpg)` }}><p className="eyebrow light">IKINOVAC GLOBAL / INDUSTRIAL PRODUCT DIRECTORY</p><h1>A WORLD OF<br /><em>ENGINEERED</em><br />POSSIBILITIES.</h1><p>Find a product family quickly, compare the relevant options and send one complete RFQ to the project desk. Technical data is supplied on request where not yet published.</p><label className="directory-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a product name, category or family" /></label><div className="directory-toolbelt"><span><b>{String(catalogueCategories.length).padStart(2, '0')}</b> PRODUCT CATEGORIES</span><span><b>{String(catalogueProducts.length).padStart(3, '0')}</b> PRODUCT FAMILIES</span><span>COMPARE UP TO 3 / ADD TO RFQ</span></div><div className="category-rail">{catalogueCategories.map(item => <button onClick={() => setCategory(item.slug)} className={category === item.slug ? 'active' : ''} key={item.slug}><b>{item.number}</b>{item.name}</button>)}</div></section>
    <section className="catalogue-content"><button className="mobile-filter-button" onClick={() => setFiltersOpen(true)}>Filter & sort <span>→</span></button><aside className={`catalogue-filter ${filtersOpen ? 'open' : ''}`}><header><p className="eyebrow">FILTER DIRECTORY</p><button className="filter-close" onClick={() => setFiltersOpen(false)}>×</button></header><div><label>Search products<input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search" /></label><label>Category<select value={category} onChange={event => setCategory(event.target.value)}><option value="all">All categories</option>{catalogueCategories.map(item => <option value={item.slug} key={item.slug}>{item.number} / {item.name}</option>)}</select></label><label>Sort by<select value={sort} onChange={event => setSort(event.target.value)}><option value="directory">Directory order</option><option value="alpha">Alphabetical</option></select></label><div className="filter-unavailable"><b>MORE FILTERS</b><span>Material, size, rating, standard, application and availability will surface automatically when approved source data is added.</span></div><button className="clear-filter" onClick={clearFilters}>Clear filters</button></div></aside><div className="catalogue-results"><div className="result-head"><p><b>{String(results.length).padStart(3, '0')}</b> PRODUCT FAMILIES</p><span>{category === 'all' ? 'All categories' : catalogueCategories.find(item => item.slug === category)?.name}</span></div><div className="product-directory-grid">{results.map((product, index) => <article key={product.id} className={`product-directory-card item-${(index % 5) + 1}`}><Link href={productHref(product)}><div style={{ backgroundImage: `linear-gradient(180deg, rgba(13,23,20,.04), rgba(13,23,20,.82)), url(${basePath}${product.cardImage || product.images[0]})`, backgroundPosition: `center, ${product.cardImagePosition || 'center'}`, backgroundSize: `cover, ${product.cardImageSize || 'cover'}` }}><p>{product.categoryNumber} / {String(product.order).padStart(2, '0')}</p><span>{product.category}</span></div><h2>{product.name}</h2><p>{product.description}</p><b>Explore configuration <i>→</i></b></Link><div className="product-card-actions"><button onClick={() => add(product)}>Add to RFQ +</button><button className={compare.some(item => item.id === product.id) ? 'selected' : ''} onClick={() => toggleCompare(product)} aria-pressed={compare.some(item => item.id === product.id)}>{compare.some(item => item.id === product.id) ? 'Selected' : 'Compare'}</button></div></article>)}</div>{!results.length && <div className="catalogue-empty"><p className="eyebrow">NO RESULT FOUND</p><h2>Try another product, family or category.</h2><button className="button button-dark" onClick={clearFilters}>Reset directory <span>→</span></button></div>}</div></section>
    {compare.length > 0 && <aside className="compare-bar"><div><p className="eyebrow">COMPARE / UP TO 3 FAMILIES</p>{compare.map(product => <span key={product.id}>{product.name}<button onClick={() => toggleCompare(product)}>×</button></span>)}</div><div className="compare-bar-actions"><Link className="button button-ghost" href={`/products/compare?ids=${compare.map(product => product.id).join(',')}`}>Compare selected <span>→</span></Link><button className="button button-gold" onClick={() => compare.forEach(product => add(product))}>Add to RFQ <span>→</span></button></div></aside>}
  </>;
}
