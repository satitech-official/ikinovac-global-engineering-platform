'use client';

import Link from 'next/link';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { catalogueCategories, catalogueProducts } from '@/lib/catalogue';
import { assetUrl } from '@/lib/assets';
import { trackEvent } from '@/lib/analytics';
import SimpleRFQModal from './rfq/SimpleRFQModal';

const RFQContext = createContext(null);
const navigationMenus = {
  company: {
    label: 'Company', eyebrow: '01 / IKINOVAC GLOBAL', title: 'The people behind the project.',
    summary: 'A focused view of the engineering-led approach, global capability and project desk behind every requirement.',
    href: '/company', action: 'Discover IKINOVAC', image: '/assets/industry/refining.jpg',
    feature: { title: 'Engineering in motion.', copy: 'Start with the context, then move the requirement forward.', href: '/company' },
    items: [
      { number: '01', label: 'Company overview', description: 'Who we are and how we work.', href: '/company' },
      { number: '02', label: 'Engineering expertise', description: 'A disciplined route to technical clarity.', href: '/company#company-story' },
      { number: '03', label: 'Global capability', description: 'Supply coordination shaped around destination.', href: '/global-presence' },
      { number: '04', label: 'Quality context', description: 'Documentation and quality in the working brief.', href: '/company#company-principles' }
    ]
  },
  industries: {
    label: 'Industries', eyebrow: '02 / APPLICATION CONTEXT', title: 'Built to operate where it counts.',
    summary: 'Choose the operating environment first. The relevant product and project conversation follows from there.',
    href: '/industries', action: 'View all industries', image: '/assets/industry/oil-gas.jpg',
    feature: { title: 'Industry-led context.', copy: 'Match the right questions to the operating environment.', href: '/industries' },
    items: [
      { number: '01', label: 'Oil & Gas', description: 'Flow control, piping and project supply.', href: '/industries#industry-oil-and-gas' },
      { number: '02', label: 'Petrochemical', description: 'Industrial product coordination.', href: '/industries#industry-petrochemical' },
      { number: '03', label: 'Refining', description: 'Process-focused product families.', href: '/industries#industry-refining' },
      { number: '04', label: 'Power Generation', description: 'Technical systems for power environments.', href: '/industries#industry-power-generation' },
      { number: '05', label: 'LNG & Cryogenics', description: 'Requirements-led technical review.', href: '/industries#industry-lng-and-cryogenics' },
      { number: '06', label: 'Marine & Offshore', description: 'Global project support for complex work.', href: '/industries#industry-marine-and-offshore' }
    ]
  },
  solutions: {
    label: 'Solutions', eyebrow: '03 / CONNECTED DELIVERY', title: 'Move the requirement forward.',
    summary: 'A single working route from technical review through sourcing, quality coordination and delivery.',
    href: '/solutions', action: 'Explore solutions', image: '/assets/industry/procurement.jpg',
    feature: { title: 'One clear project path.', copy: 'Every stage remains connected to the technical brief.', href: '/solutions' },
    items: [
      { number: '01', label: 'Engineering Support', description: 'Shape a clearer technical brief.', href: '/solutions#solution-01' },
      { number: '02', label: 'Global Sourcing', description: 'Coordinate options around the actual context.', href: '/solutions#solution-02' },
      { number: '03', label: 'Project Procurement', description: 'Connect requirements to supply coordination.', href: '/solutions#solution-03' },
      { number: '04', label: 'Expediting & Inspection', description: 'Keep status and quality visible.', href: '/solutions#solution-05' },
      { number: '05', label: 'Logistics & Delivery', description: 'Join packing, destination and delivery context.', href: '/solutions#solution-06' },
      { number: '06', label: 'Custom Fabrication', description: 'Bring custom scope into a technical conversation.', href: '/solutions#solution-07' }
    ]
  },
  presence: {
    label: 'Global Presence', eyebrow: '04 / GLOBAL CAPABILITY', title: 'Connected across global projects.',
    summary: 'A practical supply-network view for international project requirements, sourcing context and delivery planning.',
    href: '/global-presence', action: 'Explore global presence', image: '/assets/industry/power.jpg',
    feature: { title: 'Global sourcing network.', copy: 'Bring the destination and delivery context into the first conversation.', href: '/global-presence' },
    items: [
      { number: '01', label: 'Supply network', description: 'A connected route for global project supply.', href: '/global-presence#presence-network' },
      { number: '02', label: 'Project support', description: 'Coordination around international requirements.', href: '/global-presence#presence-statements' },
      { number: '03', label: 'Multi-region supply', description: 'Consider sourcing and destination together.', href: '/global-presence#presence-statements' },
      { number: '04', label: 'Start a global RFQ', description: 'Bring the requirement to the project desk.', href: '/contact' }
    ]
  }
};

function Brand({ onNavigate, inverse = false, header = false }) {
  return <Link className={`brand-mark ${inverse ? 'inverse' : ''}`} href="/" onClick={onNavigate} aria-label="IKINOVAC Global home">
    <span className={`brand-mark-image ${header ? 'brand-mark-image-header' : ''}`}>
      {header ? <img className="brand-logo-cropped" src={assetUrl('/assets/ikinovac-ig-emblem-header-v3.png')} alt="" /> : <img src={assetUrl('/assets/ikinovac-logo-enhanced-v2.png')} alt="" />}
    </span>
    {header && <span className="brand-wordmark"><b>IKINOVAC</b><strong>GLOBAL</strong><small>ENGINEERING SOLUTIONS. GLOBAL IMPACT.</small></span>}
  </Link>;
}

export function useRFQ() {
  const value = useContext(RFQContext);
  if (!value) throw new Error('useRFQ must be used inside SiteShell');
  return value;
}

function Preloader() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem('ikinovac-loader-seen')) return undefined;
    setVisible(true);
    const start = performance.now();
    const duration = 1420;
    let animation;
    const tick = now => {
      const next = Math.min(100, Math.round(((now - start) / duration) * 100));
      setProgress(next);
      if (next < 100) animation = requestAnimationFrame(tick);
      else window.setTimeout(() => { sessionStorage.setItem('ikinovac-loader-seen', 'true'); setVisible(false); }, 260);
    };
    animation = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animation);
  }, []);

  if (!visible) return null;
  return <div className="site-loader" aria-label="Loading IKINOVAC Global">
    <div className="loader-grain" aria-hidden="true" />
    <div className="loader-orbit loader-orbit-a" aria-hidden="true" />
    <div className="loader-orbit loader-orbit-b" aria-hidden="true" />
    <div className="loader-content">
      <div className="loader-topline"><span>IKINOVAC GLOBAL</span><b>{String(progress).padStart(3, '0')}%</b></div>
      <div className="loader-logo-frame"><img src={assetUrl('/assets/ikinovac-logo-enhanced-v2.png')} alt="IKINOVAC GLOBAL" /></div>
      <p>ENGINEERING SOLUTIONS. <em>GLOBAL IMPACT.</em></p>
      <div className="loader-progress" aria-hidden="true"><i style={{ transform: `scaleX(${progress / 100})` }} /></div>
      <small>INITIALISING PRODUCT DIRECTORY</small>
    </div>
  </div>;
}

function ProductSearch({ close }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return catalogueProducts.slice(0, 6);
    return catalogueProducts.filter(product => [product.name, product.category, product.family].join(' ').toLowerCase().includes(term)).slice(0, 12);
  }, [query]);
  const categories = useMemo(() => {
    const term = query.trim().toLowerCase();
    return (term ? catalogueCategories.filter(category => category.name.toLowerCase().includes(term)) : catalogueCategories).slice(0, 6);
  }, [query]);

  return <section className="search-overlay" role="dialog" aria-modal="true" aria-label="Product search" onKeyDown={event => event.key === 'Escape' && close()}>
    <button className="overlay-close" onClick={close} aria-label="Close search">Close <b>×</b></button>
    <div className="search-overlay-inner">
      <p className="eyebrow light">SEARCH / PRODUCT DIRECTORY</p>
      <label className="search-field"><span className="sr-only">Search products</span><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="WHAT ARE YOU LOOKING FOR?" /></label>
      <div className="search-groups">
        <section><p className="eyebrow light">PRODUCTS</p>{results.map(product => <Link href={`/products/${product.categorySlug}#product-${product.slug}`} key={product.id} onClick={close}><span>{product.name}</span><small>{product.category}</small><b>↗</b></Link>)}</section>
        <section><p className="eyebrow light">BROWSE CATEGORIES</p>{categories.length ? categories.map(category => <Link href={`/products/${category.slug}`} key={category.slug} onClick={close}><span>{category.number} / {category.name}</span><b>↗</b></Link>) : <p className="no-results">Search product names, families or categories.</p>}<Link className="search-help-link" href="/contact" onClick={close}>Need technical guidance? Start an RFQ <b>→</b></Link></section>
      </div>
    </div>
  </section>;
}

function MegaMenu({ close, onPointerEnter, onPointerLeave }) {
  const [active, setActive] = useState(catalogueCategories[0]);
  const [query, setQuery] = useState('');
  const search = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return null;
    const products = catalogueProducts.filter(product => [product.name, product.category, product.family].join(' ').toLowerCase().includes(term)).slice(0, 5);
    const categories = catalogueCategories.filter(category => [category.name, category.summary].join(' ').toLowerCase().includes(term)).slice(0, 4);
    const families = [...new Map(products.map(product => [product.family, product])).values()].slice(0, 4);
    return { products, categories, families };
  }, [query]);
  return <section className="mega-menu" aria-label="Product directory" onMouseEnter={onPointerEnter} onMouseLeave={onPointerLeave}>
    <div className="mega-menu-intro"><p className="eyebrow light">01 / PRODUCT DIRECTORY</p><h2>Engineered for every <em>critical connection.</em></h2><label className="mega-menu-search"><span>⌕</span><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search the directory" aria-label="Search the product directory" /></label><Link href="/products" onClick={close}>View complete catalogue <span>→</span></Link></div>
    <div className="mega-menu-list">{search ? <div className="mega-menu-results"><section><p>PRODUCTS</p>{search.products.length ? search.products.map(product => <Link href={`/products/${product.categorySlug}#product-${product.slug}`} onClick={close} key={product.id}><span>{product.name}<small>{product.category}</small></span><b>↗</b></Link>) : <small>Nothing matched that product term.</small>}</section><section><p>PRODUCT FAMILIES</p>{search.families.length ? search.families.map(product => <Link href={`/products/${product.categorySlug}#product-${product.slug}`} onClick={close} key={`${product.id}-family`}><span>{product.family}<small>{product.name}</small></span><b>↗</b></Link>) : <small>Try a category or product family.</small>}</section><section><p>CATEGORIES</p>{search.categories.length ? search.categories.map(category => <Link href={`/products/${category.slug}`} onClick={close} key={category.slug}><span>{category.number} / {category.name}</span><b>↗</b></Link>) : <small>Try another search term.</small>}</section></div> : catalogueCategories.map(category => <Link href={`/products/${category.slug}`} onMouseEnter={() => setActive(category)} onFocus={() => setActive(category)} onClick={close} key={category.slug}><b>{category.number}</b><span>{category.name}</span><i>{category.items.length} <em>families</em></i><strong>→</strong></Link>)}</div>
    <Link href={`/products/${active.slug}`} onClick={close} className="mega-menu-feature" style={{ backgroundImage: `linear-gradient(180deg, rgba(13,23,20,.08), rgba(13,23,20,.8)), url(${assetUrl(active.image)})` }}><p>{active.number} / FEATURED RANGE</p><h3>{active.name}</h3><span>{active.summary}</span><b>Explore range →</b></Link>
  </section>;
}

function NavigationMegaMenu({ menu, close, onPointerEnter, onPointerLeave }) {
  return <section className="mega-menu nav-mega-menu" aria-label={`${menu.label} navigation`} onMouseEnter={onPointerEnter} onMouseLeave={onPointerLeave}>
    <div className="mega-menu-intro nav-mega-menu-intro"><p className="eyebrow light">{menu.eyebrow}</p><h2>{menu.title}</h2><p>{menu.summary}</p><Link href={menu.href} onClick={close}>{menu.action} <span>→</span></Link></div>
    <div className="nav-mega-menu-list">{menu.items.map(item => <Link href={item.href} onClick={close} key={`${menu.label}-${item.label}`}><b>{item.number}</b><span>{item.label}<small>{item.description}</small></span><strong>→</strong></Link>)}</div>
    <Link href={menu.feature.href} onClick={close} className="mega-menu-feature nav-mega-menu-feature" style={{ backgroundImage: `linear-gradient(180deg, rgba(2,2,2,.08), rgba(2,2,2,.85)), url(${assetUrl(menu.image)})` }}><p>{menu.label.toUpperCase()} / FEATURED</p><h3>{menu.feature.title}</h3><span>{menu.feature.copy}</span><b>Explore {menu.label.toLowerCase()} →</b></Link>
  </section>;
}

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openQuote, closeQuote, quoteCount } = useRFQ();
  const menuCloseTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onKey = event => { if (event.key === 'Escape') { setNavOpen(false); setProductsOpen(false); setSearchOpen(false); closeQuote(); } };
    window.addEventListener('scroll', onScroll, { passive: true }); window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('keydown', onKey); if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current); };
  }, []);
  const clearMenuClose = () => { if (menuCloseTimer.current) window.clearTimeout(menuCloseTimer.current); };
  const openProducts = () => { clearMenuClose(); setProductsOpen(true); };
  const scheduleMenuClose = () => { clearMenuClose(); menuCloseTimer.current = window.setTimeout(() => setProductsOpen(false), 180); };
  const closeNav = () => { clearMenuClose(); setNavOpen(false); setProductsOpen(false); };

  return <>
    <div className="utility-bar"><span>info@ikinovac.com</span><div><Link href="/contact">GLOBAL ENQUIRY</Link><span>GLOBAL / EN</span></div></div>
    <div className="header-signal"><span>Precision engineering for global industrial projects.</span><Link href="/contact">Start a project <b>↗</b></Link></div>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="header-main-cluster"><Brand onNavigate={closeNav} header />
        <nav className={navOpen ? 'site-nav open' : 'site-nav'} aria-label="Main navigation">
          <Link href="/" onClick={closeNav}>Home</Link>
          <Link href="/company" onClick={closeNav}>Company</Link>
          <div className="products-nav-item" onPointerEnter={event => event.pointerType === 'mouse' && openProducts()} onPointerLeave={event => event.pointerType === 'mouse' && scheduleMenuClose()}>
            <div><Link href="/products" onFocus={openProducts} onClick={closeNav}>Products</Link><button type="button" onFocus={openProducts} onClick={() => setProductsOpen(current => !current)} aria-expanded={productsOpen} aria-label="Open product directory">+</button></div>
            <div className={productsOpen ? 'mobile-product-list open' : 'mobile-product-list'}>{catalogueCategories.map(category => <Link href={`/products/${category.slug}`} onClick={closeNav} key={category.slug}><b>{category.number}</b>{category.name}</Link>)}</div>
          </div>
          <Link href="/industries" onClick={closeNav}>Industries</Link>
          <Link href="/solutions" onClick={closeNav}>Solutions</Link>
          <Link href="/global-presence" onClick={closeNav}>Global Presence</Link>
          <Link href="/contact" onClick={closeNav}>Contact</Link>
          <div className="mobile-nav-actions"><button onClick={() => { setSearchOpen(true); setNavOpen(false); }}>Search products</button><button onClick={() => { openQuote(); closeNav(); }}>{quoteCount ? `RFQ list · ${quoteCount}` : 'Request a quote'} →</button></div>
        </nav>
      </div>
      <div className="header-actions"><button className="search-button" onClick={() => setSearchOpen(true)} aria-label="Search products">⌕</button><button className="header-quote" onClick={() => openQuote()}>{quoteCount ? `RFQ list · ${quoteCount}` : 'Request a quote'} <span>→</span></button><button className="menu-button" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation" aria-expanded={navOpen}><i /><i /></button></div>
      {productsOpen && !navOpen && <MegaMenu close={closeNav} onPointerEnter={openProducts} onPointerLeave={scheduleMenuClose} />}
    </header>
    {searchOpen && <ProductSearch close={() => setSearchOpen(false)} />}
  </>;
}

function Footer() {
  return <footer className="site-footer-v3">
    <div className="footer-v3-main">
      <section className="footer-v3-brand" aria-label="IKINOVAC Global footer">
        <Brand inverse />
        

        <div className="footer-v3-socials" aria-label="Social media">
          <a href="https://www.linkedin.com/in/ikinovac-global/" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
          <a href="https://www.facebook.com/ikinovacglobal" target="_blank" rel="noreferrer" aria-label="Facebook">f</a>
          <a href="https://www.instagram.com/ikinovacglobal/" target="_blank" rel="noreferrer" aria-label="Instagram">◎</a>
        </div>

        <div className="footer-v3-contact">
          <p className="footer-v3-heading">CONTACT</p>
          <a href="mailto:info@ikinovac.com"><span aria-hidden="true">✉</span> info@ikinovac.com</a>
          <Link href="/contact"><span aria-hidden="true">↗</span> Start an enquiry</Link>
        </div>
      </section>

      <nav className="footer-v3-links" aria-label="Footer products">
        <p className="footer-v3-heading">PRODUCTS</p>
        <Link href="/products/valves">Valves <span>→</span></Link>
        <Link href="/products/equipment">Pumps <span>→</span></Link>
        <Link href="/products/automation">Automation <span>→</span></Link>
        <Link href="/products/pipe-fittings-flanges">Pipe &amp; Fittings <span>→</span></Link>
      </nav>

      <nav className="footer-v3-links" aria-label="Footer company links">
        <p className="footer-v3-heading">COMPANY</p>
        <Link href="/company">About Us <span>→</span></Link>
        <Link href="/industries">Industries <span>→</span></Link>
        <Link href="/global-presence">Global Presence <span>→</span></Link>
        <Link href="/contact">Contact Us <span>→</span></Link>
      </nav>

      <section className="footer-v3-network" aria-label="Global supply network">
        <svg className="footer-v3-map" viewBox="0 0 1000 470" role="img" aria-label="Illustrative global supply network map">
          <g className="footer-v3-land">
            <path d="M77 107l39-34 82-11 68 22 23 32-18 29-42 6-27 24-46-4-20 25-38-20-8-34z" />
            <path d="M236 205l34 13 18 46-14 39 9 63-24 72-23-39 2-65-19-48 9-42z" />
            <path d="M432 101l38-22 41 9 13 20-26 17-34 0-32 21-24-15z" />
            <path d="M467 151l46 8 29 42-5 71-27 59-33-17-15-63-25-39 8-42z" />
            <path d="M532 109l60-32 107 12 77 37 72 5 26 35-35 22-61-10-42 30-58-8-40 27-82-26-34-37z" />
            <path d="M742 256l39 7 33 27-11 31-45-1-23-29z" />
            <path d="M775 351l28-12 34 18-4 25-42 6-25-16z" />
            <path d="M103 75l26-26 25 8-13 22-25 8z" />
          </g>
          <g className="footer-v3-routes">
            <path d="M182 130C305 83 425 119 492 157S669 123 765 164" />
            <path d="M257 285C341 245 413 235 490 226S662 279 776 274" />
            <path d="M493 157C516 204 505 231 492 267" />
          </g>
          <g className="footer-v3-nodes">
            <circle cx="182" cy="130" r="8" />
            <circle cx="257" cy="285" r="8" />
            <circle cx="492" cy="157" r="8" />
            <circle cx="492" cy="267" r="8" />
            <circle cx="765" cy="164" r="8" />
            <circle cx="776" cy="274" r="8" />
          </g>
        </svg>
        <p>SUPPLYING INDUSTRY<br />ACROSS BORDERS</p>
        <i aria-hidden="true" />
      </section>
    </div>

    <div className="footer-v3-bottom">
      <span>© {new Date().getFullYear()} IKINOVAC Global. All Rights Reserved.</span>
      <span className="footer-v3-motto">Engineering Solutions. Global Impact.</span>
      <span className="footer-v3-credit">Designed &amp; Developed by <a href="https://satitechnologies.com/" target="_blank" rel="noreferrer">Sati Technologies</a> <b aria-hidden="true">↗</b></span>
      <a className="footer-v3-top" href="#" aria-label="Back to top">↑</a>
    </div>
  </footer>;
}

export default function SiteShell({ children }) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteProducts, setQuoteProducts] = useState([]);

  useEffect(() => {
    try {
      const ids = JSON.parse(window.localStorage.getItem('ikinovac-rfq-products-v1') || '[]');
      if (Array.isArray(ids)) setQuoteProducts(ids.map(id => catalogueProducts.find(product => product.id === id)).filter(Boolean).slice(0, 20));
    } catch {}
  }, []);

  useEffect(() => {
    try { window.localStorage.setItem('ikinovac-rfq-products-v1', JSON.stringify(quoteProducts.map(product => product.id))); } catch {}
  }, [quoteProducts]);
  useEffect(() => {
    const sections = [...document.querySelectorAll('main section')].filter(section => !section.classList.contains('home-hero'));
    const reveal = section => section.classList.add('is-in-view');
    // A percentage threshold can never be reached by a very tall directory
    // section (only a viewport-height slice is visible at once). Reveal on the
    // first visible pixel instead, so catalogue pages never remain transparent.
    if (!('IntersectionObserver' in window)) {
      sections.forEach(section => { section.classList.add('motion-section'); reveal(section); });
      return undefined;
    }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        reveal(entry.target);
        observer.unobserve(entry.target);
      }
    }), { threshold: 0, rootMargin: '0px' });
    sections.forEach(section => {
      section.classList.add('motion-section');
      const bounds = section.getBoundingClientRect();
      if (bounds.top < window.innerHeight * 1.04 && bounds.bottom > 0) reveal(section);
      else observer.observe(section);
    });
    return () => observer.disconnect();
  }, [children]);
  const value = useMemo(() => ({
    quoteOpen,
    quoteProducts,
    quoteProduct: quoteProducts[quoteProducts.length - 1] || null,
    quoteCount: quoteProducts.length,
    addQuoteProduct(product) {
      if (!product) return;
      setQuoteProducts(current => current.some(item => item.id === product.id) ? current : [...current, product].slice(0, 20));
    },
    removeQuoteProduct(productId) {
      setQuoteProducts(current => current.filter(item => item.id !== productId));
    },
    clearQuoteProducts() { setQuoteProducts([]); },
    openQuote(product = null) {
      trackEvent('rfq_open', { product_name: product?.name || 'general requirement', product_category: product?.category || 'general enquiry' });
      if (product) setQuoteProducts(current => current.some(item => item.id === product.id) ? current : [...current, product].slice(0, 20));
      setQuoteOpen(true);
    },
    closeQuote() { setQuoteOpen(false); }
  }), [quoteOpen, quoteProducts]);
  return <RFQContext.Provider value={value}><Preloader /><Header /><main>{children}</main><Footer /><SimpleRFQModal /></RFQContext.Provider>;
}

