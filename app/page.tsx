"use client";

/* The app uses Vinext and remote, CMS-ready images rather than Next's image runtime.
   Modal overlays are intentionally dismissed with pointer interactions on their backdrop. */
/* eslint-disable @next/next/no-img-element, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/no-static-element-interactions, jsx-a11y/no-autofocus */

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { catalogCategories, catalogProducts, homeCatalogueProducts, type CatalogProduct } from "@/data/catalog";
import { publicAsset } from "@/lib/assets";

type Product = {
  name: string;
  code: string;
  description: string;
  group: string;
  image: string;
};

const categories = [
  { name: "Valves", mark: "◉", detail: "Flow-control solutions for demanding applications.", tone: "valve", image: "https://images.pexels.com/photos/5953723/pexels-photo-5953723.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Actuation & Automation", mark: "◌", detail: "Motion, control and valve automation systems.", tone: "actuation", image: "https://images.pexels.com/photos/5953729/pexels-photo-5953729.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Piping Products", mark: "⌇", detail: "Pipes, fittings, flanges and engineered connections.", tone: "piping", image: "https://images.pexels.com/photos/4883682/pexels-photo-4883682.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Instrumentation", mark: "⌁", detail: "Process measurement and control interfaces.", tone: "instrumentation", image: "https://images.pexels.com/photos/5953723/pexels-photo-5953723.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Industrial Equipment", mark: "◈", detail: "Rotating and static equipment for process plants.", tone: "equipment", image: "https://images.pexels.com/photos/8973132/pexels-photo-8973132.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "MRO & Consumables", mark: "⊞", detail: "Consolidated sourcing for maintenance operations.", tone: "mro", image: "https://images.unsplash.com/photo-1713859272766-76751031af78?auto=format&fit=crop&q=80&w=1200" },
  { name: "Materials & Raw Materials", mark: "▤", detail: "Specialty metals and project raw materials.", tone: "materials", image: "https://images.pexels.com/photos/10039994/pexels-photo-10039994.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Hydraulic & Pneumatic", mark: "↔", detail: "Fluid-power components for industrial performance.", tone: "hydraulic", image: "https://images.pexels.com/photos/5953729/pexels-photo-5953729.jpeg?auto=compress&cs=tinysrgb&w=1200" },
  { name: "Engineering & Procurement", mark: "⇄", detail: "Technical procurement and project supply coordination.", tone: "procurement", image: "https://images.unsplash.com/photo-1494412552100-42e4e7a74ec6?auto=format&fit=crop&q=80&w=1200" },
  { name: "Custom Solutions", mark: "✦", detail: "Configured supply solutions for project requirements.", tone: "custom", image: "https://images.pexels.com/photos/8973132/pexels-photo-8973132.jpeg?auto=compress&cs=tinysrgb&w=1200" },
];

const products: Product[] = [
  { name: "Ball Valves", code: "VAL / FLOW", description: "Reliable isolation and flow control pathways.", group: "Valves", image: "https://images.pexels.com/photos/5953723/pexels-photo-5953723.jpeg?auto=compress&cs=tinysrgb&w=1000" },
  { name: "Control Valves", code: "VAL / CONTROL", description: "Precision regulation for critical process lines.", group: "Valves", image: "https://images.pexels.com/photos/4883682/pexels-photo-4883682.jpeg?auto=compress&cs=tinysrgb&w=1000" },
  { name: "Pneumatic Actuators", code: "AUTO / ACTUATE", description: "Configured valve automation support.", group: "Actuation & Automation", image: "https://images.pexels.com/photos/5953729/pexels-photo-5953729.jpeg?auto=compress&cs=tinysrgb&w=1000" },
  { name: "Pressure Instruments", code: "INST / PRESSURE", description: "Process measurement and indication solutions.", group: "Instrumentation", image: "https://images.pexels.com/photos/10039994/pexels-photo-10039994.jpeg?auto=compress&cs=tinysrgb&w=1000" },
  { name: "Pipe Fittings & Flanges", code: "PIPE / CONNECT", description: "Engineered connection components for projects.", group: "Piping Products", image: "https://images.pexels.com/photos/8973132/pexels-photo-8973132.jpeg?auto=compress&cs=tinysrgb&w=1000" },
  { name: "Industrial Pumps", code: "EQP / ROTATE", description: "Procurement support for rotating equipment needs.", group: "Industrial Equipment", image: "https://images.unsplash.com/photo-1713859272766-76751031af78?auto=format&fit=crop&q=80&w=1000" },
];

const industries = [
  "Oil & Gas",
  "Petrochemical",
  "Refining",
  "Chemical & Process",
  "Power Generation",
  "LNG & Cryogenics",
  "Marine & Offshore",
  "Water & Wastewater",
  "Mining & Minerals",
  "Renewable Energy",
  "Hydrogen / Clean Energy",
  "Steel & Metals",
];

const serviceSteps = [
  "Requirement", "Engineering Review", "Global Sourcing", "Technical Evaluation", "Quality Verification", "Inspection", "Logistics", "Project Delivery",
];

const networkRoutes = [
  { id: "supply-route-1", d: "M178 294 C304 95 485 102 646 257 C734 342 807 362 871 277", delay: 0.5 },
  { id: "supply-route-2", d: "M128 275 C293 180 413 228 530 310 C677 413 768 348 884 249", delay: 0.8 },
  { id: "supply-route-3", d: "M226 395 C386 449 532 370 651 275 C744 201 804 196 892 255", delay: 1.1 },
  { id: "supply-route-4", d: "M286 190 C406 130 492 164 596 238 C679 297 736 295 818 229", delay: 1.35 },
];

const networkNodes = [
  { x: 178, y: 294, major: true }, { x: 286, y: 190, major: false }, { x: 530, y: 310, major: true },
  { x: 646, y: 257, major: false }, { x: 818, y: 229, major: true }, { x: 871, y: 277, major: false },
  { x: 226, y: 395, major: false }, { x: 651, y: 275, major: false }, { x: 892, y: 255, major: false },
];

const ambientParticles = [
  [8, 22, 2, 22], [15, 72, 3, -18], [24, 41, 2, 16], [33, 84, 2, -22], [43, 18, 3, 18], [56, 70, 2, -14],
  [68, 29, 2, 20], [77, 78, 3, -16], [86, 45, 2, 18], [93, 16, 2, -20], [72, 12, 2, 14], [6, 58, 2, -15],
];

const whyCapabilities = [
  { title: "Extensive Product Range", image: "https://images.pexels.com/photos/5953723/pexels-photo-5953723.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { title: "Worldwide Supply Capability", image: "https://images.pexels.com/photos/8973132/pexels-photo-8973132.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { title: "Competitive Sourcing", image: "https://images.pexels.com/photos/3862130/pexels-photo-3862130.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { title: "On-Time Delivery Focus", image: "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { title: "Engineering Expertise", image: "https://images.pexels.com/photos/3862361/pexels-photo-3862361.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { title: "Quality Coordination", image: "https://images.pexels.com/photos/3769138/pexels-photo-3769138.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { title: "Responsive Support", image: "https://images.pexels.com/photos/8867434/pexels-photo-8867434.jpeg?auto=compress&cs=tinysrgb&w=900" },
  { title: "Project Procurement", image: "https://images.pexels.com/photos/3913025/pexels-photo-3913025.jpeg?auto=compress&cs=tinysrgb&w=900" },
];

function GlobalSupplyNetwork() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { amount: 0.28, once: true });
  const shouldReduceMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateY = useSpring(pointerX, { stiffness: 56, damping: 19, mass: 0.5 });
  const rotateX = useSpring(pointerY, { stiffness: 56, damping: 19, mass: 0.5 });

  const handlePointerMove = (event: { currentTarget: HTMLElement; clientX: number; clientY: number }) => {
    if (shouldReduceMotion || window.innerWidth < 850) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 7);
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -6);
  };

  const resetParallax = () => { pointerX.set(0); pointerY.set(0); };
  const hasEntered = isInView || shouldReduceMotion;

  return (
    <section ref={sectionRef} id="possibilities" className="global-network-section" aria-labelledby="global-network-heading" onPointerMove={handlePointerMove} onPointerLeave={resetParallax}>
      <div className="network-grid" aria-hidden="true" />
      <div className="network-ambient-light" aria-hidden="true" />
      <div className="network-floating-particles" aria-hidden="true">
        {ambientParticles.map(([left, top, size, drift], index) => <motion.span key={`${left}-${top}`} style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }} animate={shouldReduceMotion ? {} : { y: [0, drift, 0], opacity: [0, 0.68, 0] }} transition={{ duration: 5 + index % 4, delay: index * 0.22, repeat: Infinity, ease: "easeInOut" }} />)}
      </div>

      <div className="supply-network-content">
        <motion.p className="network-badge" initial={{ opacity: 0, y: 14, filter: "blur(5px)" }} animate={hasEntered ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: "easeInOut" }}><span /> Global Supply Network</motion.p>
        <h2 id="global-network-heading" className="network-heading">
          {["ONE PARTNER.", "GLOBAL SOLUTIONS.", "ENDLESS POSSIBILITIES."].map((line, index) => <motion.span key={line} initial={{ opacity: 0, y: 38, filter: "blur(10px)" }} animate={hasEntered ? { opacity: 1, y: 0, filter: "blur(0px)", backgroundPosition: shouldReduceMotion ? "0% 50%" : ["0% 50%", "100% 50%", "0% 50%"] } : {}} transition={{ opacity: { duration: shouldReduceMotion ? 0 : 0.78, delay: shouldReduceMotion ? 0 : 0.15 + index * 0.15, ease: "easeInOut" }, y: { duration: shouldReduceMotion ? 0 : 0.78, delay: shouldReduceMotion ? 0 : 0.15 + index * 0.15, ease: "easeInOut" }, filter: { duration: shouldReduceMotion ? 0 : 0.78, delay: shouldReduceMotion ? 0 : 0.15 + index * 0.15, ease: "easeInOut" }, backgroundPosition: { duration: 5.5, delay: 1.4 + index * 0.15, repeat: Infinity, ease: "linear" } }}>{line}</motion.span>)}
        </h2>
      </div>

      <motion.div className="network-visual" style={shouldReduceMotion ? {} : { rotateX, rotateY }}>
        <svg viewBox="0 0 1000 510" role="img" aria-label="Animated global supply network with golden routes and connection hubs">
          <defs>
            <radialGradient id="network-glow" cx="50%" cy="50%" r="55%"><stop offset="0%" stopColor="#E7B43A" stopOpacity="0.22" /><stop offset="65%" stopColor="#E7B43A" stopOpacity="0.04" /><stop offset="100%" stopColor="#E7B43A" stopOpacity="0" /></radialGradient>
            <linearGradient id="route-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#B97800" /><stop offset="50%" stopColor="#FFD875" /><stop offset="100%" stopColor="#E7B43A" /></linearGradient>
            <filter id="network-soft-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <motion.g initial={{ opacity: 0, scale: 0.96 }} animate={hasEntered ? { opacity: 1, scale: 1 } : {}} transition={{ duration: shouldReduceMotion ? 0 : 1.1, delay: shouldReduceMotion ? 0 : 0.25, ease: "easeInOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <ellipse className="network-glow-disc" cx="510" cy="285" rx="402" ry="185" fill="url(#network-glow)" />
            <ellipse className="network-globe-outline" cx="510" cy="285" rx="402" ry="170" />
            <ellipse className="network-latitude latitude-one" cx="510" cy="252" rx="374" ry="108" /><ellipse className="network-latitude latitude-two" cx="510" cy="320" rx="374" ry="108" />
            <path className="network-longitude" d="M510 115 C350 195 350 375 510 455" /><path className="network-longitude" d="M510 115 C670 195 670 375 510 455" /><path className="network-longitude center" d="M510 115 C438 205 438 365 510 455" /><path className="network-longitude center" d="M510 115 C582 205 582 365 510 455" />
          </motion.g>

          {networkRoutes.map((route) => <motion.path key={route.id} id={route.id} className="network-route" d={route.d} initial={{ pathLength: 0, opacity: 0 }} animate={hasEntered ? { pathLength: 1, opacity: 0.95 } : {}} transition={{ pathLength: { delay: shouldReduceMotion ? 0 : route.delay, duration: shouldReduceMotion ? 0 : 2, ease: "easeInOut" }, opacity: { delay: shouldReduceMotion ? 0 : route.delay, duration: shouldReduceMotion ? 0 : 0.3 } }} />)}

          {hasEntered && !shouldReduceMotion && networkRoutes.flatMap((route, index) => [<circle key={`${route.id}-gold`} className="network-route-particle gold" r="4.5"><animateMotion dur={`${5.5 + index * 0.65}s`} begin={`${0.35 + index * 0.2}s`} repeatCount="indefinite"><mpath href={`#${route.id}`} /></animateMotion></circle>, <circle key={`${route.id}-white`} className="network-route-particle white" r="2.4"><animateMotion dur={`${7 + index * 0.6}s`} begin={`${1.15 + index * 0.2}s`} repeatCount="indefinite"><mpath href={`#${route.id}`} /></animateMotion></circle>])}

          {networkNodes.map((node, index) => <motion.g key={`${node.x}-${node.y}`} initial={{ opacity: 0, scale: 0.2 }} animate={hasEntered ? { opacity: 1, scale: 1 } : {}} transition={{ duration: shouldReduceMotion ? 0 : 0.45, delay: shouldReduceMotion ? 0 : 1.5 + index * 0.1, ease: "easeInOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {node.major && !shouldReduceMotion && <motion.circle cx={node.x} cy={node.y} r="8" className="network-pulse-ring" animate={{ scale: [1, 3.1], opacity: [0.75, 0] }} transition={{ duration: 2.35, delay: 2.1 + index * 0.1, repeat: Infinity, ease: "easeInOut" }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />}
            <motion.circle cx={node.x} cy={node.y} r={node.major ? 7 : 4.7} className={node.major ? "network-node major" : "network-node"} animate={node.major && !shouldReduceMotion ? { opacity: [1, 0.62, 1] } : {}} transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }} />
          </motion.g>)}
        </svg>
      </motion.div>
      <p className="network-caption"><span>01 / 01</span> ENGINEERING-LED COORDINATION ACROSS CRITICAL SUPPLY ROUTES</p>
    </section>
  );
}

const assuranceLenses = [
  { number: "01", tab: "Technical readiness", title: "Start with the operating context.", copy: "Every useful supply conversation begins with the right technical inputs: product function, material, standards, dimensions, process conditions and documentation needs.", points: ["Requirement review", "Configuration alignment", "Standards and material context"] },
  { number: "02", tab: "Quality & documentation", title: "Make verification part of the flow.", copy: "Supplier information, inspection requirements, traceability and documentation are coordinated around the project requirement rather than assumed from a catalog entry.", points: ["Supplier coordination", "Inspection alignment", "Documentation support"] },
  { number: "03", tab: "Delivery alignment", title: "Keep every handover visible.", copy: "Commercial, technical and logistics details need to stay connected from enquiry through delivery. Our process is designed around responsible follow-through.", points: ["Lead-time confirmation", "Packing and logistics coordination", "Responsive project communication"] },
];

function SupplyVerticals({ shouldReduceMotion, onStartEnquiry }: { shouldReduceMotion: boolean | null; onStartEnquiry: () => void }) {
  const verticals = catalogCategories.slice(0, 6);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = verticals[activeIndex];

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = window.setInterval(() => setActiveIndex((index) => (index + 1) % verticals.length), 6500);
    return () => window.clearInterval(timer);
  }, [shouldReduceMotion, verticals.length]);

  return <section id="supply-verticals" className="supply-verticals-section" aria-labelledby="supply-verticals-heading">
    <div className="verticals-heading section-shell"><div><p className="eyebrow dark"><span /> BUSINESS VERTICALS</p><h2 id="supply-verticals-heading">A portfolio built for<br /><em>complex industrial work.</em></h2></div><p>Explore the supply verticals that bring a broad catalogue into one engineering-led procurement experience.</p></div>
    <div className="verticals-stage section-shell">
      <div className="verticals-tabs" role="tablist" aria-label="Supply verticals">{verticals.map((vertical, index) => <button type="button" key={vertical.slug} className={index === activeIndex ? "is-active" : ""} role="tab" aria-selected={index === activeIndex} onClick={() => setActiveIndex(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{vertical.name}</strong><i /></button>)}</div>
      <motion.article className="verticals-feature" key={active.slug} initial={shouldReduceMotion ? false : { opacity: 0, y: 24, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.58, ease: "easeOut" }}>
        <div className="verticals-image"><img src={active.detailImage} alt={`${active.name} industrial supply`} loading="lazy" onError={(event) => { event.currentTarget.src = active.fallbackImage; }} /><span className="verticals-scanline" aria-hidden="true" /></div>
        <div className="verticals-copy"><p className="catalog-kicker">{active.code} / SUPPLY VERTICAL</p><h3>{active.name}</h3><p>{active.description}</p><dl><div><dt>RANGE</dt><dd>{active.size}</dd></div><div><dt>REFERENCE</dt><dd>{active.standards}</dd></div></dl><div className="verticals-tags">{active.applications.slice(0, 4).map((application) => <span key={application}>{application}</span>)}</div><div className="verticals-actions"><a className="catalog-primary" href={`/products/${active.slug}`}>EXPLORE {active.name.toUpperCase()} <span>↗</span></a><button type="button" className="catalog-text-link" onClick={onStartEnquiry}>DISCUSS A REQUIREMENT <span>→</span></button></div></div>
      </motion.article>
    </div>
  </section>;
}

function AssuranceExperience({ shouldReduceMotion, onStartEnquiry }: { shouldReduceMotion: boolean | null; onStartEnquiry: () => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = assuranceLenses[activeIndex];

  return <section id="assurance" className="assurance-section dark-section" aria-labelledby="assurance-heading"><div className="section-shell assurance-layout"><div className="assurance-intro"><p className="eyebrow"><span /> RESPONSIBLE PROJECT SUPPLY</p><h2 id="assurance-heading">Reliability is a<br /><em>working system.</em></h2><p>We do not treat quality, documentation or delivery as afterthoughts. They are connected checkpoints in a clear, project-led supply journey.</p><button className="text-button light" type="button" onClick={onStartEnquiry}>START A TECHNICAL ENQUIRY <span>→</span></button></div><div className="assurance-experience"><div className="assurance-tabs" role="tablist" aria-label="Project supply principles">{assuranceLenses.map((lens, index) => <button type="button" key={lens.tab} className={index === activeIndex ? "is-active" : ""} role="tab" aria-selected={index === activeIndex} onClick={() => setActiveIndex(index)}><span>{lens.number}</span>{lens.tab}</button>)}</div><motion.div className="assurance-panel" key={active.tab} initial={shouldReduceMotion ? false : { opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}><div className="assurance-orbit" aria-hidden="true"><i /><i /><b>{active.number}</b></div><div><p className="catalog-kicker">PROJECT PRINCIPLE / {active.number}</p><h3>{active.title}</h3><p>{active.copy}</p><ul>{active.points.map((point) => <li key={point}><span>+</span>{point}</li>)}</ul></div></motion.div></div></div></section>;
}

function goTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqItems, setRfqItems] = useState<Product[]>([]);
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [industry, setIndustry] = useState("Oil & Gas");
  const [requirement, setRequirement] = useState("Flow Control");
  const [activeCategory, setActiveCategory] = useState(categories[0].name);
  const shouldReduceMotion = useReducedMotion();

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return [];
    return [...categories.map((item) => item.name), ...products.map((item) => item.name)]
      .filter((item) => item.toLowerCase().includes(needle))
      .slice(0, 6);
  }, [query]);

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--scroll-progress", `${height > 0 ? (window.scrollY / height) * 100 : 0}%`);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  const addToRfq = (product: Product) => {
    setRfqItems((items) => items.some((item) => item.name === product.name) ? items : [...items, product]);
    setRfqOpen(true);
  };

  const addCatalogProductToRfq = (product: CatalogProduct) => {
    addToRfq({ name: product.name, code: product.code, description: product.shortDescription, group: product.category, image: product.images[0] || product.fallbackImage });
  };

  const submitRfq = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const company = String(form.get("company") || "");
    const email = String(form.get("email") || "");
    const note = String(form.get("notes") || "");
    const requested = rfqItems.length ? rfqItems.map((item) => item.name).join(", ") : "General industrial enquiry";
    const subject = encodeURIComponent(`RFQ enquiry from ${company || name || "IKINOVAC website"}`);
    const body = encodeURIComponent(`Name: ${name}\nCompany: ${company}\nEmail: ${email}\nRequirement: ${requested}\n\nNotes:\n${note}`);
    setRfqSubmitted(true);
    window.setTimeout(() => { window.location.href = `mailto:info@ikinovac.com?subject=${subject}&body=${body}`; }, 250);
  };

  const closeMobileMenu = (target?: string) => {
    setMenuOpen(false);
    if (target) window.setTimeout(() => goTo(target), 50);
  };

  return (
    <main>
      <div className="pipeline-progress" aria-hidden="true"><span /></div>
      <header className="site-header">
        <div className="utility-bar">
          <a href="mailto:info@ikinovac.com">info@ikinovac.com</a>
          <span className="utility-divider" />
          <button type="button" onClick={() => setRfqOpen(true)}>GLOBAL ENQUIRY</button>
          <span className="utility-meta">EN <span>⌄</span></span>
          <span className="utility-meta">GLOBAL <span>⌄</span></span>
          <button type="button" onClick={() => goTo("resources")}>LINE CARD ON REQUEST</button>
        </div>
        <div className="main-nav">
          <a className="brand" href="#home" aria-label="IKINOVAC Global home" onClick={() => goTo("home")}>
            <span className="brand-mark"><img src={publicAsset("brand/ikinovac-logo.jpeg")} alt="IKINOVAC Global logo" /></span>
            <span className="brand-text">IKINOVAC <b>GLOBAL</b><small>ENGINEERING SOLUTIONS</small></span>
          </a>
          <nav className="desktop-nav" aria-label="Primary navigation">
            <button onClick={() => goTo("company")}>About</button>
            <button className={megaOpen ? "is-active" : ""} onClick={() => { setMegaOpen(false); goTo("products"); }} aria-expanded={false}>Products</button>
            <button onClick={() => goTo("industries")}>Industries</button>
            <button onClick={() => goTo("services")}>Solutions</button>
            <button onClick={() => goTo("global-network")}>Global Presence</button>
            <button onClick={() => goTo("resources")}>Resources</button>
            <button onClick={() => goTo("contact")}>Contact</button>
          </nav>
          <div className="nav-actions">
            <button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label="Search products">⌕</button>
            <button className="quote-button" onClick={() => setRfqOpen(true)}>REQUEST A QUOTE <span>↗</span></button>
            <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">MENU</button>
          </div>
        </div>
        {megaOpen && <div className="mega-menu">
          <div className="mega-intro"><span className="eyebrow gold">PRODUCT ARCHITECTURE</span><h2>Specification-aware supply for critical operations.</h2><p>Explore product families or share a requirement with our engineering-led team.</p><button onClick={() => { setMegaOpen(false); setRfqOpen(true); }}>START AN ENQUIRY <span>↗</span></button></div>
          <div className="mega-categories mega-catalog-categories">{catalogCategories.map((category, index) => <a key={category.slug} href={`/products/${category.slug}`} onClick={() => setMegaOpen(false)}><span className="mega-number">{String(index + 1).padStart(2, "0")}</span><strong>{category.name}</strong><small>{category.description}</small><em>EXPLORE ↗</em></a>)}</div>
        </div>}
      </header>

      {menuOpen && <div className="mobile-menu" role="dialog" aria-label="Site navigation">
        <div className="mobile-menu-head"><span>IKINOVAC GLOBAL</span><button onClick={() => setMenuOpen(false)} aria-label="Close menu">×</button></div>
        {[['About','company'],['Products','products'],['Industries','industries'],['Solutions','services'],['Global Presence','global-network'],['Resources','resources'],['Contact','contact']].map(([label, id]) => <button key={id} onClick={() => closeMobileMenu(id)}>{label}<span>↗</span></button>)}
        <button className="mobile-quote" onClick={() => { setMenuOpen(false); setRfqOpen(true); }}>REQUEST A QUOTE</button>
      </div>}

      <section id="home" className="hero">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
        <motion.div className="hero-copy" initial={shouldReduceMotion ? false : { opacity: 0, y: 30, filter: "blur(9px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : 0.2, ease: "easeOut" }}>
          <p className="eyebrow"><span /> GLOBAL ENGINEERING. TRUSTED WORLDWIDE.</p>
          <h1>Engineering solutions <i>built for a</i> stronger world.</h1>
          <p className="hero-description">IKINOVAC Global delivers industrial products, engineering solutions, global sourcing and procurement services for critical industries around the world.</p>
          <div className="hero-ctas"><button className="primary-button" onClick={() => goTo("products")}>EXPLORE PRODUCTS <span>↗</span></button><button className="text-button" onClick={() => setRfqOpen(true)}>REQUEST A QUOTE <span>→</span></button></div>
          <button className="discover-button" onClick={() => goTo("company")}>DISCOVER IKINOVAC <span>↓</span></button>
        </motion.div>
        <div className="hero-visual">
          <div className="hero-image" role="img" aria-label="Illuminated industrial processing plant and international supply network" />
          <div className="hero-crop-line" aria-hidden="true" />
          <div className="visual-chip chip-top">GLOBAL SUPPLY <span>01</span></div><div className="visual-chip chip-right">QUALITY ASSURED <span>02</span></div><div className="visual-chip chip-bottom">PROJECT PROCUREMENT <span>03</span></div>
          <div className="visual-scale">41.11° N &nbsp; / &nbsp; 71.23° W</div>
        </div>
        <div className="hero-bottom-label">SCROLL TO EXPLORE <span>↓</span></div>
      </section>

      <section className="supply-marquee" aria-label="IKINOVAC global supply capabilities">
        <p className="marquee-sr">Engineering-led global supply, technical procurement, quality coordination and responsive delivery.</p>
        <div className="supply-marquee-viewport" aria-hidden="true">
          <div className="supply-marquee-track">
            {["ENGINEERING-LED", "GLOBAL SUPPLY", "TECHNICAL PROCUREMENT", "QUALITY COORDINATION", "RESPONSIVE DELIVERY", "ENGINEERING-LED", "GLOBAL SUPPLY", "TECHNICAL PROCUREMENT", "QUALITY COORDINATION", "RESPONSIVE DELIVERY"].map((item, index) => <span key={`${item}-${index}`}>{item}<b>✦</b></span>)}
          </div>
        </div>
      </section>

      <GlobalSupplyNetwork />

      <section className="stats-strip" aria-label="IKINOVAC capabilities">
        {[['10','PRODUCT FAMILIES','Specification-aware industrial supply'],['12','CRITICAL INDUSTRIES','Built around complex operations'],['08','DELIVERY STAGES','From requirement through logistics'],['01','FOCUSED PARTNER','Engineering-led coordination']].map(([value, title, copy], index) => <div className="stat" key={title}><span>0{index + 1} / 04</span><strong>{value}</strong><b>{title}</b><p>{copy}</p></div>)}
      </section>

      <motion.section className="approach-section" initial={shouldReduceMotion ? false : { opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.26 }} transition={{ duration: shouldReduceMotion ? 0 : 0.8, ease: "easeOut" }}>
        <div className="approach-orbit" aria-hidden="true"><i /><i /><span>IG</span></div>
        <div className="approach-copy"><p className="eyebrow dark"><span /> THE IKINOVAC APPROACH</p><h2>Progress starts with the <em>right connection.</em></h2></div>
        <div className="approach-detail"><p>Critical operations move forward when technical context, responsible sourcing and clear communication work as one. IKINOVAC brings these disciplines together for every requirement.</p><button className="outline-button" onClick={() => goTo("company")}>OUR COMPANY <span>↗</span></button></div>
      </motion.section>

      <section id="products" className="products-section section-shell">
        <div className="section-heading master-catalogue-heading"><div><p className="eyebrow dark"><span /> PRODUCT DISCOVERY</p><h2>Explore our core product <em>catalogues.</em></h2></div><div><p>One representative product from each IKINOVAC catalogue. Visit the complete range for specifications, variants and sourcing enquiries.</p><p className="home-catalogue-stat"><b>{catalogCategories.length} PRODUCT CATALOGUES</b><span>{catalogProducts.length}+ INDUSTRIAL PRODUCTS</span></p></div></div>
        <div className="home-catalogue-grid">{homeCatalogueProducts.map((product, index) => <article className="home-catalogue-card" key={product.id}>
          <a className="home-catalogue-image" href={`/products/${product.categorySlug}/${product.slug}`} aria-label={`View ${product.name} details`}><img src={product.image} alt={`${product.name} industrial product`} loading="lazy" /><span>{String(index + 1).padStart(2, "0")}</span><small>{product.category}</small></a>
          <div className="home-catalogue-body"><p>{product.code}</p><h3><a href={`/products/${product.categorySlug}/${product.slug}`}>{product.name}</a></h3><p className="home-catalogue-description">{product.shortDescription}</p><div className="home-catalogue-meta"><span>{product.material}</span><span>{product.size}</span></div><div className="home-catalogue-actions"><a href={`/catalogues/${product.categorySlug}`}>EXPLORE CATALOGUE <b>→</b></a><button type="button" onClick={() => addCatalogProductToRfq(product)}>REQUEST QUOTE <b>↗</b></button></div></div>
        </article>)}</div>
        <div className="home-catalogue-cta"><div><span>FULL PRODUCT DATABASE</span><strong>Need a specific configuration?</strong><p>Search all product families, compare requirements and request a technical quotation.</p></div><div><a className="primary-button" href="/products">VIEW ALL {catalogProducts.length}+ PRODUCTS <span>→</span></a><button className="outline-button" type="button" onClick={() => setRfqOpen(true)}>REQUEST LINE CARD <span>↗</span></button></div></div>
      </section>

      <section id="company" className="company-section section-shell dark-section">
        <div className="company-media"><div className="company-photo"><img className="company-logo-image" src={publicAsset("brand/ikinovac-logo.jpeg")} alt="IKINOVAC Global — Engineering Solutions. Global Impact." /></div><div className="media-annotation"><span>EST.</span><strong>ENGINEERING-LED</strong><p>GLOBAL / RESPONSIVE / RELIABLE</p></div><div className="corner-frame" /></div>
        <div className="company-copy"><p className="eyebrow"><span /> ABOUT IKINOVAC</p><h2>Engineering expertise.<br /><em>Global capability.</em></h2><p>IKINOVAC Global was founded by engineers who understand that serious industrial supply requires more than availability. It takes technical context, responsive coordination and a global approach to procurement.</p><p>We connect industrial requirements with a focused sourcing and supply process built for critical operations.</p><button className="text-button light" onClick={() => setRfqOpen(true)}>TALK TO AN ENGINEER <span>→</span></button></div>
        <div className="pillars">{[["01","Founded by Engineers","Technical perspective from the start."],["02","Global Reach","International sourcing and project support."],["03","Quality & Reliability","A disciplined approach to documentation and coordination."],["04","Customer Focused","Responsive technical and commercial support."]].map(([number,title,copy]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></article>)}</div>
      </section>

      <SupplyVerticals shouldReduceMotion={shouldReduceMotion} onStartEnquiry={() => setRfqOpen(true)} />

      <section className="catalog-section section-shell">
        <div className="catalog-top"><div><p className="eyebrow dark"><span /> FEATURED PRODUCT FAMILIES</p><h2>Technical procurement,<br /><em>not consumer checkout.</em></h2></div><button className="outline-button" onClick={() => setSearchOpen(true)}>SEARCH THE CATALOG <span>⌕</span></button></div>
        <div className="product-list">{products.map((product) => <article className="product-entry" key={product.name}><div className="product-photo"><img src={product.image} alt={`${product.name} industrial application`} loading="lazy" /></div><div><small>{product.code}</small><h3>{product.name}</h3><p>{product.description}</p></div><button onClick={() => addToRfq(product)}>ADD TO RFQ <span>+</span></button></article>)}</div>
        <div className="catalog-note"><span>NOTE</span><p>Technical specifications, materials, sizes, pressure classes and documentation are provided only against verified product data and the project requirement.</p></div>
      </section>

      <section id="industries" className="industries-section dark-section section-shell">
        <div className="section-heading inverse"><div><p className="eyebrow"><span /> INDUSTRIES WE SERVE</p><h2>Built around critical <em>operations.</em></h2></div><p>Industrial context matters. Explore the environments where technical procurement, traceability and responsive supply coordination are essential.</p></div>
        <div className="industry-grid">{industries.map((item, index) => <button className={`industry-card industry-${(index % 6) + 1}`} key={item} onClick={() => { setIndustry(item); goTo("solution-finder"); }}><span>0{index + 1}</span><div><small>INDUSTRY</small><h3>{item}</h3><p>EXPLORE SOLUTIONS <b>↗</b></p></div></button>)}</div>
      </section>

      <section id="solution-finder" className="finder-section section-shell">
        <div className="finder-heading"><p className="eyebrow dark"><span /> DISCOVERY ASSISTANT</p><h2>Find solutions for<br /><em>your industry.</em></h2><p>This navigator helps locate relevant product families. It is not an engineering approval or a substitute for technical review.</p></div>
        <div className="finder-panel"><div className="finder-step"><span>01</span><label htmlFor="industry-select">SELECT INDUSTRY</label><select id="industry-select" value={industry} onChange={(e) => setIndustry(e.target.value)}>{industries.map((item) => <option key={item}>{item}</option>)}</select></div><div className="finder-connector">→</div><div className="finder-step"><span>02</span><label htmlFor="requirement-select">SELECT REQUIREMENT</label><select id="requirement-select" value={requirement} onChange={(e) => setRequirement(e.target.value)}>{["Flow Control", "Process Measurement", "Project Supply", "MRO Consolidation", "Materials Sourcing"].map((item) => <option key={item}>{item}</option>)}</select></div><div className="finder-connector">→</div><div className="finder-result"><span>03 / EXPLORE</span><h3>{requirement}</h3><p>{["Ball Valves", "Control Valves", "Actuation", "Instrumentation", "Piping Products"].map((item) => <button key={item} onClick={() => { setActiveCategory(item === "Actuation" ? "Actuation & Automation" : item); goTo("products"); }}>{item} <b>↗</b></button>)}</p><button className="primary-button small" onClick={() => setRfqOpen(true)}>SPEAK TO AN ENGINEER <span>↗</span></button></div></div>
      </section>

      <section id="services" className="services-section dark-section">
        <div className="section-shell services-layout"><div className="services-copy"><p className="eyebrow"><span /> ENGINEERING & PROCUREMENT</p><h2>From requirement to<br /><em>reliable delivery.</em></h2><p>We support project and operational requirements through an engineering-led coordination process spanning technical review, sourcing, verification and logistics.</p><button className="text-button light" onClick={() => setRfqOpen(true)}>START A PROJECT ENQUIRY <span>→</span></button></div><div className="process-track">{serviceSteps.map((step, index) => <div className="process-step" key={step}><span>0{index + 1}</span><strong>{step}</strong><i /></div>)}</div></div>
      </section>

      <section id="why-ikinovac" className="why-section section-shell"><div className="section-heading"><div><p className="eyebrow dark"><span /> WHY IKINOVAC</p><h2>Capability that keeps<br /><em>projects moving.</em></h2></div><p>A focused supply partner for teams managing complex industrial requirements.</p></div><div className="why-grid">{whyCapabilities.map((item, index) => <article key={item.title}><img src={item.image} alt="" loading="lazy" /><span>0{index + 1}</span><h3>{item.title}</h3><b>↗</b></article>)}</div></section>

      <section id="global-network" className="network-section dark-section">
        <div className="network-map" aria-hidden="true"><div className="map-continent continent-a" /><div className="map-continent continent-b" /><div className="map-continent continent-c" /><i className="route route-a" /><i className="route route-b" /><i className="route route-c" /><span className="map-point point-a" /><span className="map-point point-b" /><span className="map-point point-c" /><span className="map-point point-d" /><span className="map-point point-e" /></div>
        <div className="section-shell network-content"><p className="eyebrow"><span /> GLOBAL PRESENCE</p><h2>A global presence.<br /><em>A local commitment.</em></h2><p>IKINOVAC’s network is designed to connect global sourcing with the realities of customer projects. Service reach does not imply physical offices.</p><div className="network-values">{["Global Supply Network","Competitive Sourcing","Quality Focus","International Project Support"].map((value) => <span key={value}>✦ {value}</span>)}</div><button className="primary-button" onClick={() => setRfqOpen(true)}>CONNECT WITH OUR TEAM <span>↗</span></button></div>
      </section>

      <section className="quality-section section-shell"><div><p className="eyebrow dark"><span /> QUALITY & RELIABILITY</p><h2>Confidence is built<br /><em>into the process.</em></h2><p>Supplier qualification, inspection coordination, traceability and documentation all require verified project information. We present capabilities honestly and support quality expectations through disciplined procurement coordination.</p><button className="outline-button" onClick={() => setRfqOpen(true)}>DISCUSS QUALITY REQUIREMENTS <span>↗</span></button></div><div className="quality-grid">{["Supplier Qualification","Inspection Coordination","Material Documentation","Traceability Support","Testing Coordination","Compliance Review"].map((item, index) => <article key={item}><span>Q.0{index + 1}</span><h3>{item}</h3><i /></article>)}</div></section>

      <AssuranceExperience shouldReduceMotion={shouldReduceMotion} onStartEnquiry={() => setRfqOpen(true)} />

      <section id="resources" className="resources-section dark-section"><div className="resources-intro"><p className="eyebrow"><span /> TECHNICAL RESOURCES</p><h2>Information that<br /><em>supports decisions.</em></h2><p>Company documents, technical resources and product information are issued against verified, client-approved content.</p></div><div className="resource-list">{[["01","Company Profile","AVAILABLE ON REQUEST"],["02","IKINOVAC Line Card","REQUEST FROM SALES"],["03","Product Catalogs","BY PRODUCT FAMILY"],["04","Technical Datasheets","AGAINST VERIFIED DATA"]].map(([number,title,action]) => <article key={title}><span>{number}</span><h3>{title}</h3><button onClick={() => setRfqOpen(true)}>{action} <b>↗</b></button></article>)}</div></section>

      <section className="projects-section section-shell"><div><p className="eyebrow dark"><span /> PROJECT STORIES</p><h2>Outcomes deserve<br /><em>real context.</em></h2><p>Case studies will be published only when project information and customer approval are available.</p></div><div className="empty-project"><span>CASE STUDIES / CMS-READY</span><strong>Verified project stories<br />coming soon.</strong><p>No unverified customer names, project claims or outcomes are displayed.</p></div></section>

      <section id="contact" className="contact-cta"><div className="contact-image" aria-hidden="true" /><div className="section-shell contact-copy"><p className="eyebrow"><span /> START A CONVERSATION</p><h2>Your next industrial project<br />starts with the <em>right partner.</em></h2><p>Bring us your product, project, sourcing or technical procurement requirement.</p><div><button className="primary-button" onClick={() => setRfqOpen(true)}>REQUEST A QUOTE <span>↗</span></button><a className="text-button light" href="mailto:info@ikinovac.com">EMAIL INFO@IKINOVAC.COM <span>→</span></a></div></div>
      </section>

      <footer><div className="footer-top section-shell"><div className="footer-brand"><span className="brand-mark"><img src={publicAsset("brand/ikinovac-logo.jpeg")} alt="IKINOVAC Global logo" /></span><h2>IKINOVAC <em>GLOBAL</em></h2><p>Engineering Solutions.<br />Global Impact.</p><a href="mailto:info@ikinovac.com">info@ikinovac.com</a></div><div className="footer-links"><div><h3>PRODUCTS</h3>{catalogCategories.slice(0, 5).map((item) => <a href={`/catalogues/${item.slug}`} key={item.slug}>{item.name}</a>)}</div><div><h3>INDUSTRIES</h3>{industries.slice(0, 5).map((item) => <button onClick={() => { setIndustry(item); goTo("solution-finder"); }} key={item}>{item}</button>)}</div><div><h3>COMPANY</h3>{[["About","company"],["Solutions","services"],["Global Presence","global-network"],["Resources","resources"],["Contact","contact"]].map(([item, id]) => <button onClick={() => goTo(id)} key={item}>{item}</button>)}</div></div></div><div className="footer-bottom section-shell"><span>© {new Date().getFullYear()} IKINOVAC GLOBAL</span><strong>ENGINEERING SOLUTIONS. GLOBAL IMPACT.</strong><span>PRIVACY &nbsp; / &nbsp; TERMS &nbsp; / &nbsp; COOKIES</span></div></footer>

      {searchOpen && <div className="modal-backdrop" onMouseDown={() => setSearchOpen(false)}><section className="search-modal" role="dialog" aria-modal="true" aria-label="Product search" onMouseDown={(event) => event.stopPropagation()}><div><p className="eyebrow dark"><span /> GLOBAL PRODUCT SEARCH</p><button className="modal-close" onClick={() => setSearchOpen(false)} aria-label="Close search">×</button></div><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products, categories or applications…" aria-label="Search products" /><div className="search-results">{query ? matches.length ? matches.map((item) => <button key={item} onClick={() => { setSearchOpen(false); setActiveCategory(categories.some((category) => category.name === item) ? item : products.find((product) => product.name === item)?.group || activeCategory); goTo("products"); }}><span>CATALOG MATCH</span><strong>{item}</strong><b>↗</b></button>) : <p>No catalogue match yet. <button onClick={() => { setSearchOpen(false); setRfqOpen(true); }}>Ask our team instead.</button></p> : <p>Try: <button onClick={() => setQuery("val")}>val</button>, <button onClick={() => setQuery("pressure")}>pressure</button>, or <button onClick={() => setQuery("pipe")}>pipe</button>.</p>}</div></section></div>}

      {rfqOpen && <div className="modal-backdrop" onMouseDown={() => setRfqOpen(false)}><section className="rfq-modal" role="dialog" aria-modal="true" aria-label="Request a quote" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setRfqOpen(false)} aria-label="Close request a quote">×</button>{rfqSubmitted ? <div className="rfq-success"><span>✓</span><p className="eyebrow dark">ENQUIRY PREPARED</p><h2>Your email application is ready to send the enquiry.</h2><p>We have prepared your request for <a href="mailto:info@ikinovac.com">info@ikinovac.com</a>. Please send the email from your mail application so the IKINOVAC team can receive it.</p><button className="primary-button" onClick={() => { setRfqSubmitted(false); setRfqOpen(false); }}>CLOSE <span>→</span></button></div> : <><div className="rfq-head"><p className="eyebrow dark"><span /> REQUEST A QUOTE</p><h2>Tell us what<br /><em>you need.</em></h2><p>Share enough context for an effective engineering and procurement conversation.</p></div><div className="rfq-selection"><span>RFQ LIST / {rfqItems.length}</span>{rfqItems.length ? <p>{rfqItems.map((item) => item.name).join(" · ")}</p> : <p>General enquiry — add products from the catalogue, or describe your requirement below.</p>}</div><form onSubmit={submitRfq}><label>NAME<input name="name" required placeholder="Your name" /></label><label>COMPANY<input name="company" required placeholder="Company name" /></label><label>EMAIL<input type="email" name="email" required placeholder="you@company.com" /></label><label>PROJECT / REQUIREMENT<textarea name="notes" required placeholder="Product, quantity, application, project requirement or technical notes" rows={4} /></label><p className="form-note">Submitting prepares an email to info@ikinovac.com. Attachments such as BOQs, drawings and datasheets can be added in your email application.</p><button className="primary-button" type="submit">PREPARE ENQUIRY EMAIL <span>↗</span></button></form></>}</section></div>}
    </main>
  );
}
