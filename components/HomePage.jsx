'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { catalogueCategories, catalogueProducts } from '@/lib/catalogue';
import { industries, processSteps } from '@/lib/content';
import HomeProductShelf from './HomeProductShelf';
import BusinessVerticals from './BusinessVerticals';
import CompleteSystem from './CompleteSystem';
import KnowledgePreview from './KnowledgePreview';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetUrl = path => `${basePath}${path}`;
const capability = ['Valves', 'Global Sourcing', 'Engineering', 'Automation', 'Piping', 'Procurement', 'Instrumentation', 'Project Supply', 'MRO'];
const shelfProductIds = ['valves-ball-valves', 'pipe-fittings-flanges-pipes-seamless-and-welded', 'instrumentation-pressure-instruments', 'equipment-pumps'];
const shelfProducts = shelfProductIds.map(id => catalogueProducts.find(product => product.id === id)).filter(Boolean);

export default function HomePage() {
  const [activeProcess, setActiveProcess] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroOffset, setHeroOffset] = useState({ x: 0, y: 0 });
  const featured = catalogueCategories.slice(0, 6);

  useEffect(() => {
    const id = window.setInterval(() => setActiveProcess(current => (current + 1) % processSteps.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const updateProgress = () => setScrollProgress((window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)) * 100);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('is-revealed')), { threshold: .12 });
    document.querySelectorAll('[data-reveal]').forEach(element => observer.observe(element));
    updateProgress(); window.addEventListener('scroll', updateProgress, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener('scroll', updateProgress); };
  }, []);

  return <>
    <div className="page-scroll-progress" style={{ transform: `scaleX(${scrollProgress / 100})` }} aria-hidden="true" />
    <section className="home-hero" onMouseMove={event => { if (!window.matchMedia('(pointer: fine)').matches) return; const bounds = event.currentTarget.getBoundingClientRect(); setHeroOffset({ x: ((event.clientX - bounds.left) / bounds.width - .5) * -10, y: ((event.clientY - bounds.top) / bounds.height - .5) * -8 }); }} onMouseLeave={() => setHeroOffset({ x: 0, y: 0 })}>
      <div className="hero-image-v2" style={{ backgroundImage: `url(${assetUrl('/assets/industry/equipment.jpg')})`, '--hero-x': `${heroOffset.x}px`, '--hero-y': `${heroOffset.y}px` }} />
      <div className="hero-image-wash" aria-hidden="true" />
      <div className="hero-architecture" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero-section-number" aria-hidden="true">01</div>
      <div className="hero-technical-label" aria-hidden="true"><span>GLOBAL INDUSTRIAL SUPPLY</span><b>01 / 2026</b></div>
      <div className="hero-image-frame" aria-hidden="true"><i /><i /><i /></div>
      <div className="hero-gold-trace" aria-hidden="true" />
      <div className="hero-image-chips" aria-label="IKINOVAC capabilities"><span><b>01</b><small>GLOBAL<br />SUPPLY</small></span><span><b>02</b><small>QUALITY<br />FOCUSED</small></span><span><b>03</b><small>PROJECT<br />SUPPORT</small></span></div>
      <p className="hero-image-title" aria-hidden="true">INDUSTRIAL<br />SOLUTIONS</p>
      <div className="home-hero-copy"><p className="eyebrow hero-reveal">IKINOVAC GLOBAL / INDUSTRIAL ENGINEERING PARTNER</p><h1><span className="hero-line">ENGINEERING</span><span className="hero-line"><em>THAT MOVES</em></span><span className="hero-line">INDUSTRY.</span></h1><p className="hero-reveal hero-copy-delay">Engineering-led industrial supply, sourcing and project support for critical operations across global industries.</p><div className="hero-buttons hero-reveal hero-copy-delay-2"><Link className="button button-dark" href="/products">Explore products <span>→</span></Link><Link className="button button-outline" href="/contact">Request a quote <span>→</span></Link></div></div>
      <div className="hero-kinetic-visual" aria-hidden="true"><i className="hero-kinetic-ring" /><div className="hero-kinetic-object" style={{ backgroundImage: `url(${assetUrl('/assets/hero/ikinovac-kinetic-valve-hero.png')})`, '--hero-x': `${heroOffset.x}px`, '--hero-y': `${heroOffset.y}px` }} /><span>PRECISION / IN MOTION</span></div>
      <div className="hero-editorial-row"><span><b>01</b> GLOBAL ENGINEERING <i>→</i></span><span><b>02</b> PROCUREMENT <i>→</i></span><span><b>03</b> TECHNICAL SOURCING <i>→</i></span></div>
      <div className="hero-coordinate"><span>SCROLL TO DISCOVER ↓</span></div>
    </section>

    <section className="capability-marquee" aria-label="Core capabilities"><p className="sr-only">Core capabilities: {capability.join(', ')}.</p><div className="capability-marquee-track" aria-hidden="true">{[...capability, ...capability, ...capability].map((item, index) => <span key={`${item}-${index}`}>{item} <i>✦</i></span>)}</div></section>

    <BusinessVerticals />

    <section className="global-network-section" data-reveal>
      <div className="network-copy reveal-up"><p className="eyebrow light">01 / GLOBAL SUPPLY NETWORK</p><h2>ONE PARTNER.<br /><em>GLOBAL SOLUTIONS.</em><br />ENDLESS POSSIBILITIES.</h2><p>From first enquiry through documented delivery, technical context stays connected to the supply conversation.</p><Link href="/global-presence" className="text-arrow light">Explore global capability <span>→</span></Link></div>
      <div className="network-orbit reveal-scale" aria-label="Illustrative global supply network"><div className="globe-lines" /><i className="node node-1" /><i className="node node-2" /><i className="node node-3" /><i className="node node-4" /><svg viewBox="0 0 700 500" aria-hidden="true"><path d="M95 218 C180 80 290 375 365 196 S516 65 615 282" /><path d="M78 310 C160 452 292 90 390 287 S540 402 654 185" /></svg><span className="network-label label-1">SOURCE</span><span className="network-label label-2">PROJECT DESK</span><span className="network-label label-3">DELIVERY</span></div>
    </section>

    <section className="company-intro-section" data-reveal>
      <div className="company-intro-image reveal-clip" style={{ backgroundImage: `url(${assetUrl('/assets/industry/refining.jpg')})` }}><p>ABOUT IKINOVAC<br /><span>EST. FOR COMPLEX WORK</span></p></div>
      <div className="company-intro-copy reveal-up"><p className="eyebrow">02 / IKINOVAC STORY</p><h2>Engineering expertise.<br /><em>Global capability.</em></h2><p>We connect product understanding, sourcing intelligence and project coordination in one considered workflow.</p><div className="capability-lines">{['Founded by engineers', 'Global reach', 'Quality assured', 'Customer focused'].map((item, index) => <span key={item}><b>0{index + 1}</b>{item}<i>↗</i></span>)}</div><Link href="/company" className="text-arrow">Meet IKINOVAC <span>→</span></Link></div>
    </section>

    <section className="directory-section" data-reveal><div className="directory-heading reveal-up"><div><p className="eyebrow light">03 / INDUSTRIAL PRODUCT DIRECTORY</p><h2>A WORLD OF<br /><em>ENGINEERED</em><br />POSSIBILITIES.</h2></div><p>Explore product families as a connected industrial system—built for RFQ-led discovery, not a generic storefront.</p></div><div className="directory-grid reveal-clip">{featured.map((category, index) => <Link key={category.slug} href={`/products/${category.slug}`} className={`directory-card card-${index + 1}`} style={{ backgroundImage: `linear-gradient(180deg,rgba(13,23,20,.05),rgba(13,23,20,.9)),url(${assetUrl(category.image)})` }}><p>{category.number} / {category.items.length} FAMILIES</p><h3>{category.name}</h3><span>{category.summary}</span><b>Explore range <i>→</i></b></Link>)}</div><Link className="button button-gold directory-button reveal-up" href="/products">View all {catalogueCategories.length} categories <span>→</span></Link></section>

    <HomeProductShelf products={shelfProducts} />

    <CompleteSystem />

    <section className="process-section"><div><p className="eyebrow light">05 / ENGINEERING & PROCUREMENT PROCESS</p><h2>A CLEARER ROUTE<br />FROM <em>REQUIREMENT</em><br />TO DELIVERY.</h2><p>Technical and commercial conversations become one accountable supply path.</p></div><ol>{processSteps.map((step, index) => <li key={step} className={index === activeProcess ? 'active' : ''} onMouseEnter={() => setActiveProcess(index)}><b>{String(index + 1).padStart(2, '0')}</b><span>{step}</span><i>→</i></li>)}</ol></section>

    <section className="industries-section"><div className="section-title"><p className="eyebrow">06 / INDUSTRIES</p><h2>BUILT TO OPERATE<br /><em>WHERE IT COUNTS.</em></h2><Link href="/industries" className="text-arrow">View all industries <span>→</span></Link></div><div className="industry-rows">{industries.slice(0, 6).map(industry => <Link key={industry.name} href="/industries"><b>{industry.number}</b><h3>{industry.name}</h3><p>{industry.description}</p><i>↗</i></Link>)}</div></section>

    <section className="quality-section"><div className="quality-line" /><p className="eyebrow">07 / RESPONSIBLE SUPPLY</p><h2>DETAILS THAT<br /><em>TRAVEL WITH IT.</em></h2><div><p>Technical requirements, documentation and inspection context can be considered from the first project conversation.</p><Link className="button button-dark" href="/resources">Access the resource desk <span>→</span></Link></div></section>

    <KnowledgePreview />

    <section className="home-contact-cta" style={{ backgroundImage: `linear-gradient(90deg,rgba(13,23,20,.93),rgba(13,23,20,.58)),url(${assetUrl('/assets/industry/procurement.jpg')})` }}><p className="eyebrow light">08 / START A PROJECT</p><h2>WHAT ARE YOU<br /><em>WORKING ON?</em></h2><p>Send the brief you have. A clear technical conversation is the next step.</p><Link className="button button-gold" href="/contact">Speak to the project desk <span>→</span></Link></section>
  </>;
}
