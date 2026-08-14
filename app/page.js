'use client';

import { useEffect, useMemo, useState } from 'react';
import { industries, productSystems } from '@/lib/site-data';

const workflow = [
  { id: '01', label: 'Define', title: 'Start with the real requirement.', copy: 'Products, project conditions and delivery constraints become one clear working brief.', metric: '01 / Discovery' },
  { id: '02', label: 'Engineer', title: 'Turn details into direction.', copy: 'Technical inputs, materials and supporting documents are coordinated around the application.', metric: '02 / Technical desk' },
  { id: '03', label: 'Source', title: 'Bring the right supply route into view.', copy: 'We align product intelligence with sourcing options, quality requirements and commercial priorities.', metric: '03 / Supply network' },
  { id: '04', label: 'Deliver', title: 'Keep every handoff accountable.', copy: 'Inspection, packing and delivery context stay connected from order through final destination.', metric: '04 / Execution' }
];

const proof = [
  ['Engineering-first', 'A technical conversation before a commercial one.'],
  ['Global coordination', 'Sourcing intelligence built around the end destination.'],
  ['Project-ready', 'Documentation, quality and logistics in one workflow.']
];

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const assetUrl = path => `${basePath}${path}`;

function Arrow() { return <span aria-hidden="true">→</span>; }

function Logo({ light = false }) {
  return <a className={`brand ${light ? 'brand-light' : ''}`} href="#home" aria-label="IKINOVAC GLOBAL home">
    <span className="brand-icon"><img src={assetUrl('/assets/ikinovac-logo.jpeg')} alt="IKINOVAC GLOBAL" /></span>
    <span className="brand-name"><b>IKINOVAC</b><small>GLOBAL</small></span>
  </a>;
}

export default function HomePage() {
  const [navOpen, setNavOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(workflow[0]);
  const [selectedSystem, setSelectedSystem] = useState(productSystems[0]);
  const [basket, setBasket] = useState([]);
  const [basketOpen, setBasketOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const [quote, setQuote] = useState({ company: '', email: '', requirement: '' });
  const [quickOpen, setQuickOpen] = useState(false);

  useEffect(() => {
    setBasket(JSON.parse(localStorage.getItem('ikinovac-rfq-basket') || '[]'));
    const onKeyDown = event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setQuickOpen(true); }
      if (event.key === 'Escape') { setQuickOpen(false); setBasketOpen(false); setNavOpen(false); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => localStorage.setItem('ikinovac-rfq-basket', JSON.stringify(basket)), [basket]);
  useEffect(() => {
    if (!notice) return undefined;
    const timer = setTimeout(() => setNotice(''), 2600);
    return () => clearTimeout(timer);
  }, [notice]);

  const quickItems = useMemo(() => [...productSystems, ...industries], []);
  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); setNavOpen(false); setQuickOpen(false); };
  const addSystem = system => {
    if (basket.some(item => item.id === system.id)) { setNotice(`${system.name} is already on your RFQ.`); return; }
    setBasket(current => [...current, system]);
    setNotice(`${system.name} added to your RFQ.`);
  };
  const removeSystem = id => setBasket(current => current.filter(item => item.id !== id));
  const submitQuote = event => {
    event.preventDefault();
    if (!quote.company || !quote.email || !quote.requirement) { setNotice('Please add your company, email and requirement.'); return; }
    const ref = `IKG-${String(Date.now()).slice(-7)}`;
    const records = JSON.parse(localStorage.getItem('ikinovac-rfqs') || '[]');
    records.unshift({ ...quote, products: basket, ref, status: 'New', createdAt: new Date().toISOString() });
    localStorage.setItem('ikinovac-rfqs', JSON.stringify(records));
    setQuote({ company: '', email: '', requirement: '' });
    setBasket([]);
    setNotice(`Request logged — reference ${ref}.`);
  };

  return <main id="home">
    <div className="site-frame">
      <header className="topbar">
        <Logo />
        <nav className={navOpen ? 'main-nav is-open' : 'main-nav'}>
          <a href="#approach" onClick={() => setNavOpen(false)}>How we work</a>
          <a href="#systems" onClick={() => setNavOpen(false)}>Product systems</a>
          <a href="#sectors" onClick={() => setNavOpen(false)}>Sectors</a>
          <a href="#network" onClick={() => setNavOpen(false)}>Network</a>
          <a href="#contact" onClick={() => setNavOpen(false)}>Contact</a>
        </nav>
        <div className="topbar-tools">
          <button className="quick-key" onClick={() => setQuickOpen(true)} aria-label="Open quick navigation">⌘K</button>
          <button className="header-cta" onClick={() => scrollTo('contact')}>Start a project <Arrow /></button>
          <button className="nav-toggle" onClick={() => setNavOpen(!navOpen)} aria-label="Toggle navigation"><i /><i /></button>
        </div>
      </header>

      <section className="hero-v2">
        <div className="hero-copy">
          <p className="kicker"><i /> GLOBAL INDUSTRIAL PARTNER <span>EST. FOR COMPLEX WORK</span></p>
          <h1>MAKE THE<br /><em>COMPLEX</em><br />MOVE.</h1>
          <p className="hero-intro">Engineering products, global procurement and technical coordination for the moments where the details matter most.</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => scrollTo('contact')}>Discuss a requirement <Arrow /></button>
            <button className="text-link" onClick={() => scrollTo('systems')}>Explore product systems <Arrow /></button>
          </div>
        </div>
        <div className="hero-visual" aria-label="Industrial refinery at dusk">
          <div className="hero-image" style={{ backgroundImage: `url(${assetUrl('/assets/hero-refinery.png')})` }} />
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
          <article className="hero-note note-top"><span>PROJECT DESK</span><b>Technical clarity<br />starts here.</b><i>01</i></article>
          <article className="hero-note note-bottom"><span>NETWORK STATUS</span><b>Supply intelligence<br />in motion.</b><i className="status-dot" /></article>
          <div className="hero-number">01<span>/ 04</span></div>
        </div>
        <div className="hero-bottom-line"><span>ENGINEERING SUPPORT</span><span>PRODUCT SYSTEMS</span><span>GLOBAL SOURCING</span><span>QUALITY & DELIVERY</span></div>
      </section>

      <section className="proof-strip">
        {proof.map(([title, text], index) => <article key={title}><b>0{index + 1}</b><div><h3>{title}</h3><p>{text}</p></div></article>)}
        <a href="#contact" onClick={() => scrollTo('contact')}>Send an RFQ <Arrow /></a>
      </section>

      <section className="split-intro" id="approach">
        <p className="section-index">01 / OUR APPROACH</p>
        <div><h2>INDUSTRIAL WORK<br />DOESN&apos;T NEED<br /><span>MORE NOISE.</span></h2></div>
        <div className="intro-aside"><p>It needs a partner that understands the flow between specification, supply, documentation and destination.</p><button className="round-button" onClick={() => scrollTo('workflow')} aria-label="See our workflow">↓</button></div>
      </section>

      <section className="editorial-grid">
        <article className="editorial-image image-tall"><div style={{ backgroundImage: `linear-gradient(0deg,rgba(7,33,42,.45),transparent),url(${assetUrl('/assets/industry/refining.jpg')})` }} /><span>FIELD NOTE / 01</span></article>
        <article className="editorial-copy"><p className="kicker dark"><i /> ENGINEERING-LED THINKING</p><h3>THE RIGHT PART IS ONLY ONE PART OF THE ANSWER.</h3><p>A focused technical brief creates a better path through sourcing, inspection, documentation and delivery.</p><button onClick={() => scrollTo('contact')}>Bring us your brief <Arrow /></button></article>
        <article className="editorial-image image-wide"><div style={{ backgroundImage: `linear-gradient(0deg,rgba(7,33,42,.38),transparent),url(${assetUrl('/assets/industry/instrumentation.jpg')})` }} /><span>FIELD NOTE / 02</span></article>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="workflow-title"><p className="section-index">02 / PROJECT FLOW</p><h2>ONE CLEAR PATH.<br /><span>NO LOST HANDOFFS.</span></h2></div>
        <div className="workflow-board">
          <div className="workflow-tabs" role="tablist">
            {workflow.map(step => <button key={step.id} role="tab" aria-selected={activeStep.id === step.id} className={activeStep.id === step.id ? 'active' : ''} onClick={() => setActiveStep(step)}><b>{step.id}</b><span>{step.label}</span><i /></button>)}
          </div>
          <article className="workflow-detail" role="tabpanel">
            <p>{activeStep.metric}</p><h3>{activeStep.title}</h3><span>{activeStep.copy}</span><button onClick={() => scrollTo('contact')}>Move this forward <Arrow /></button><b className="detail-number">{activeStep.id}</b>
          </article>
        </div>
      </section>

      <section className="systems-section" id="systems">
        <div className="section-heading-row"><div><p className="section-index">03 / PRODUCT SYSTEMS</p><h2>THE BUILDING BLOCKS<br /><span>OF CRITICAL WORK.</span></h2></div><p>Product intelligence with the application, material and project context still attached.</p></div>
        <div className="systems-layout">
          <div className="system-list">
            {productSystems.map(system => <button key={system.id} className={selectedSystem.id === system.id ? 'active' : ''} onClick={() => setSelectedSystem(system)}><b>{system.number}</b><span>{system.name}</span><i>+</i></button>)}
          </div>
          <article className="system-feature">
            <div className="system-photo" style={{ backgroundImage: `url(${assetUrl(selectedSystem.image)})` }}><span>{selectedSystem.number}</span></div>
            <div className="system-info"><p>PRODUCT SYSTEM / {selectedSystem.number}</p><h3>{selectedSystem.title}</h3><span>{selectedSystem.description}</span><ul>{selectedSystem.types.map(type => <li key={type}>{type}</li>)}</ul><button className="primary-button" onClick={() => addSystem(selectedSystem)}>Add to RFQ <Arrow /></button></div>
          </article>
        </div>
      </section>

      <section className="sectors-section" id="sectors">
        <div className="sectors-heading"><p className="section-index">04 / INDUSTRIES</p><h2>BUILT TO OPERATE<br /><span>WHERE IT COUNTS.</span></h2><p>Every industry has its own pace, standards and pressures. We start by understanding that context.</p></div>
        <div className="sector-grid">{industries.map(industry => <article key={industry.name} style={{ backgroundImage: `linear-gradient(180deg,rgba(8,32,39,.04),rgba(8,32,39,.86)), url(${assetUrl(industry.image)})` }}><p>{industry.number}</p><h3>{industry.name}</h3><span>{industry.detail}</span><button onClick={() => { setQuote({ ...quote, requirement: `${industry.name} requirement: ` }); scrollTo('contact'); }}>Start a sector brief <Arrow /></button></article>)}</div>
      </section>

      <section className="network-section" id="network">
        <div className="network-word">CONNECTED</div>
        <div className="network-layout"><div><p className="section-index light">05 / GLOBAL DELIVERY</p><h2>THE WORLD ISN&apos;T<br /><span>THE HARD PART.</span></h2><p>When information moves cleanly between the people who specify, source and receive, global supply becomes more predictable.</p><button className="light-link" onClick={() => scrollTo('contact')}>Plan a global requirement <Arrow /></button></div><div className="route-card"><div className="route-map"><i className="pin pin-a" /><i className="pin pin-b" /><i className="pin pin-c" /><i className="pin pin-d" /><svg viewBox="0 0 440 240" aria-hidden="true"><path d="M55 65 C120 18, 198 168, 270 106 S377 36, 415 157" /></svg></div><div><span>LIVE OPERATING MODEL</span><b>Engineering knowledge flows with the shipment.</b></div></div></div>
      </section>

      <section className="insights-section">
        <div className="insight-heading"><p className="section-index">06 / THE DETAIL DESK</p><h2>LESS FRICTION.<br /><span>MORE FORWARD.</span></h2><button className="text-link" onClick={() => setQuickOpen(true)}>Open quick navigator <Arrow /></button></div>
        <div className="insight-list"><article><b>01</b><h3>Documentation-led</h3><p>Coordinate requests with drawings, data sheets, material details and inspection needs in view.</p></article><article><b>02</b><h3>Responsive by design</h3><p>A focussed path for requirements that need movement, not unnecessary layers.</p></article><article><b>03</b><h3>Human expertise</h3><p>Technology supports the process. Engineering judgement leads it.</p></article></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy"><p className="section-index light">07 / START HERE</p><h2>WHAT ARE YOU<br /><span>WORKING ON?</span></h2><p>Send the brief you have. A clear technical conversation is the next step.</p><div className="contact-basket"><b>RFQ SELECTIONS</b><span>{basket.length} SYSTEM{basket.length !== 1 ? 'S' : ''} ADDED</span>{basket.length ? <div>{basket.map(item => <button key={item.id} onClick={() => removeSystem(item.id)}>{item.name} <i>×</i></button>)}</div> : <small>Add product systems above or describe your requirement below.</small>}</div></div>
        <form className="quote-form" onSubmit={submitQuote}><label>Company / organisation<input value={quote.company} onChange={event => setQuote({ ...quote, company: event.target.value })} placeholder="Your company" /></label><label>Work email<input type="email" value={quote.email} onChange={event => setQuote({ ...quote, email: event.target.value })} placeholder="name@company.com" /></label><label className="full">Requirement<textarea value={quote.requirement} onChange={event => setQuote({ ...quote, requirement: event.target.value })} placeholder="Tell us about product, application, specification, quantity or destination." /></label><button className="submit-button" type="submit">Send to project desk <Arrow /></button><small>For this preview, submitted enquiries appear in the local operations console.</small></form>
      </section>

      <footer className="site-footer"><div><Logo light /><p>ENGINEERING PRODUCTS.<br />GLOBAL PROCUREMENT.<br />TECHNICAL CLARITY.</p></div><div><a href={`${basePath}/admin/`}>Open operations workspace <Arrow /></a><button onClick={() => scrollTo('home')}>Back to top ↑</button></div><small>© {new Date().getFullYear()} IKINOVAC GLOBAL — Engineering solutions. Global impact.</small></footer>
    </div>

    <button className="rfq-pill" onClick={() => setBasketOpen(!basketOpen)}>RFQ <b>{basket.length}</b><Arrow /></button>
    {basketOpen && <aside className="rfq-drawer"><div><span>YOUR SHORTLIST</span><button onClick={() => setBasketOpen(false)}>×</button></div>{basket.length ? basket.map(item => <article key={item.id}><b>{item.name}</b><button onClick={() => removeSystem(item.id)}>Remove</button></article>) : <p>Your shortlist is empty. Choose a product system to begin.</p>}<button className="primary-button" onClick={() => { setBasketOpen(false); scrollTo('contact'); }}>Continue to RFQ <Arrow /></button></aside>}
    {quickOpen && <div className="quick-overlay" role="dialog" aria-modal="true"><div className="quick-panel"><button className="modal-close" onClick={() => setQuickOpen(false)}>×</button><p>QUICK NAVIGATOR</p><h2>Where should we go?</h2><div>{[['Start a project', 'contact'], ['How we work', 'approach'], ['Product systems', 'systems'], ['Global delivery', 'network']].map(([label, id], index) => <button key={id} onClick={() => scrollTo(id)}><b>0{index + 1}</b>{label}<Arrow /></button>)}</div><small>Or select a system to add it to your RFQ.</small><div className="quick-systems">{quickItems.slice(0, 5).map(item => <button key={item.id || item.name} onClick={() => item.id ? addSystem(item) : scrollTo('sectors')}>{item.name}<Arrow /></button>)}</div></div></div>}
    {notice && <div className="notice" role="status">{notice}</div>}
  </main>;
}
