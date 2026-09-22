'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { catalogueCategories, catalogueProducts } from '@/lib/catalogue';
import { assetUrl } from '@/lib/assets';
import { useRFQ } from './SiteShell';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const capabilities = [
  { number: '01', title: 'Technical Review', copy: 'Helping clarify product and application requirements before sourcing.' },
  { number: '02', title: 'Global Sourcing', copy: 'Coordinating industrial sourcing around project and destination requirements.' },
  { number: '03', title: 'Project Support', copy: 'Connecting documentation, procurement coordination and delivery support.' }
];

const getCategoryPortfolioImage = category => {
  const representativeProduct = catalogueProducts.find(product => product.categorySlug === category.slug);
  return representativeProduct?.cardImage || representativeProduct?.images?.[0] || category.image;
};

export default function CataloguePage() {
  // These controls stay in the approved hero; navigation below is deliberately category-led.
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const { openQuote } = useRFQ();

  const visibleCategories = useMemo(() => {
    const term = query.trim().toLowerCase();
    return catalogueCategories.filter(category => {
      if (activeCategory !== 'all' && category.slug !== activeCategory) return false;
      if (!term) return true;
      const categoryText = [category.name, category.summary, category.family].filter(Boolean).join(' ').toLowerCase();
      const matchingProduct = catalogueProducts.some(product =>
        product.categorySlug === category.slug &&
        [product.name, product.family, product.category, product.description].filter(Boolean).join(' ').toLowerCase().includes(term)
      );
      return categoryText.includes(term) || matchingProduct;
    });
  }, [query, activeCategory]);

  return <>
    <section className="catalogue-hero" style={{ backgroundImage: `linear-gradient(115deg,rgba(13,23,20,.98),rgba(19,33,29,.82)),url(${basePath}/assets/industry/valves.jpg)` }}>
      <p className="eyebrow light">IKINOVAC GLOBAL / INDUSTRIAL PRODUCT DIRECTORY</p>
      <h1>A WORLD OF<br /><em>ENGINEERED</em><br />POSSIBILITIES.</h1>
      <p>Find a product family, review the available information and send your requirement directly to the IKINOVAC project desk.</p>
      <label className="directory-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search a product name, category or family" /></label>
      <div className="directory-toolbelt"><span><b>{String(catalogueCategories.length).padStart(2, '0')}</b> PRODUCT CATEGORIES</span><span><b>{String(catalogueProducts.length).padStart(3, '0')}</b> PRODUCT FAMILIES</span><span>TECHNICAL ENQUIRIES WELCOME</span></div>
      <div className="category-rail"><button type="button" onClick={() => setActiveCategory('all')} className={activeCategory === 'all' ? 'active' : ''}><b>00</b>All categories</button>{catalogueCategories.map(item => <button type="button" onClick={() => setActiveCategory(item.slug)} className={activeCategory === item.slug ? 'active' : ''} key={item.slug}><b>{item.number}</b>{item.name}</button>)}</div>
    </section>

    <section className="product-portfolio-section" aria-labelledby="portfolio-heading">
      <div className="product-portfolio-intro">
        <div>
          <p className="eyebrow">01 / PRODUCT PORTFOLIO</p>
          <h2 id="portfolio-heading">OUR INDUSTRIAL<br /><em>PRODUCT RANGE.</em></h2>
        </div>
        <p>Explore IKINOVAC Global’s core industrial product categories supporting engineering, sourcing and project requirements across critical industries.</p>
      </div>

      <div className="portfolio-category-grid">
        {visibleCategories.map((category, index) => <Link href={`/products/${category.slug}`} className={`portfolio-category-card ${index % 4 === 1 ? 'portfolio-category-card-dark' : ''}`} key={category.slug}>
          <div className="portfolio-category-image"><img src={assetUrl(getCategoryPortfolioImage(category))} alt={`${category.name} representative IKINOVAC product`} loading="lazy" /></div>
          <div className="portfolio-category-copy">
            <p>{category.number} / PRODUCT CATEGORY</p>
            <h3>{category.name}</h3>
            <span>{category.summary}</span>
            <b>EXPLORE RANGE <i aria-hidden="true">→</i></b>
          </div>
        </Link>)}
        {!visibleCategories.length && <div className="portfolio-empty-state"><b>NO MATCHING PRODUCT GROUPS</b><p>Try another product name, family or category, or reset the category filter.</p><button type="button" onClick={() => { setQuery(''); setActiveCategory('all'); }}>Reset directory</button></div>}
      </div>
    </section>

    <section className="portfolio-capability-section" aria-labelledby="capability-heading">
      <div className="portfolio-capability-heading">
        <p className="eyebrow light">02 / BEYOND PRODUCT SUPPLY</p>
        <h2 id="capability-heading">MORE THAN<br /><em>PRODUCT SUPPLY.</em></h2>
      </div>
      <div className="portfolio-capabilities">
        {capabilities.map(capability => <article key={capability.number}>
          <p>{capability.number}</p>
          <h3>{capability.title}</h3>
          <span>{capability.copy}</span>
        </article>)}
      </div>
    </section>

    <section className="portfolio-requirement-cta" aria-labelledby="requirement-heading">
      <div>
        <p className="eyebrow">03 / PROJECT DESK</p>
        <h2 id="requirement-heading">HAVE A SPECIFIC<br /><em>REQUIREMENT?</em></h2>
      </div>
      <div>
        <p>Share your product or project requirement with the IKINOVAC project desk.</p>
        <button type="button" className="button button-gold" onClick={() => openQuote()}>SEND YOUR REQUIREMENT <span aria-hidden="true">→</span></button>
      </div>
    </section>
  </>;
}
