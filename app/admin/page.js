'use client';

import { useEffect, useMemo, useState } from 'react';
import { productSystems } from '@/lib/site-data';

const menu = ['Overview', 'Enquiries', 'Product systems', 'Content desk', 'Settings'];
const stages = ['New', 'Reviewing', 'Technical review', 'Quotation preparing', 'Quotation sent'];

function OpsBrand() {
  return <a className="brand brand-light" href="/" aria-label="Back to IKINOVAC GLOBAL"><span className="brand-icon"><img src="/assets/ikinovac-logo.jpeg" alt="IKINOVAC GLOBAL" /></span><span className="brand-name"><b>IKINOVAC</b><small>OPERATIONS</small></span></a>;
}

export default function AdminPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [active, setActive] = useState('Overview');
  const [rfqs, setRfqs] = useState([]);
  const [products, setProducts] = useState(productSystems);
  const [productForm, setProductForm] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', title: '', description: '' });
  const [syncTime, setSyncTime] = useState('Just now');

  useEffect(() => {
    setSignedIn(sessionStorage.getItem('ikinovac-admin-session') === 'active');
    setRfqs(JSON.parse(localStorage.getItem('ikinovac-rfqs') || '[]'));
    setProducts(JSON.parse(localStorage.getItem('ikinovac-admin-products') || 'null') || productSystems);
  }, []);

  const refresh = () => {
    setRfqs(JSON.parse(localStorage.getItem('ikinovac-rfqs') || '[]'));
    setProducts(JSON.parse(localStorage.getItem('ikinovac-admin-products') || 'null') || productSystems);
    setSyncTime('Synced now');
  };
  const signIn = event => { event.preventDefault(); sessionStorage.setItem('ikinovac-admin-session', 'active'); setSignedIn(true); };
  const signOut = () => { sessionStorage.removeItem('ikinovac-admin-session'); setSignedIn(false); };
  const updateStatus = (ref, status) => {
    const next = rfqs.map(item => item.ref === ref ? { ...item, status } : item);
    setRfqs(next); localStorage.setItem('ikinovac-rfqs', JSON.stringify(next)); setSyncTime('Saved now');
  };
  const createProduct = event => {
    event.preventDefault();
    if (!newProduct.name || !newProduct.title) return;
    const next = [{ ...newProduct, id: `custom-${Date.now()}`, number: String(products.length + 1).padStart(2, '0'), types: ['Project product'], image: '/assets/industry/instrumentation.jpg' }, ...products];
    setProducts(next); localStorage.setItem('ikinovac-admin-products', JSON.stringify(next)); setNewProduct({ name: '', title: '', description: '' }); setProductForm(false); setSyncTime('Product published locally');
  };

  const totals = useMemo(() => ({ new: rfqs.filter(item => item.status === 'New').length, active: rfqs.filter(item => !['Quotation sent', 'Won', 'Lost'].includes(item.status)).length, quoted: rfqs.filter(item => item.status === 'Quotation sent').length }), [rfqs]);
  if (!signedIn) return <main className="ops-login"><section className="ops-login-card"><aside className="ops-login-aside"><OpsBrand /><h1>THE PROJECT<br /><span>DESK.</span></h1><p>A focused workspace for tracking industrial enquiries, product systems and project movement.</p></aside><section className="ops-login-form"><a href="/">← Return to website</a><p>IKINOVAC GLOBAL / SECURE AREA</p><h2>Welcome back.</h2><form onSubmit={signIn}><label>Work email<input type="email" required placeholder="admin@ikinovac.com" /></label><label>Password<input type="password" required placeholder="Enter your password" /></label><button type="submit">Enter operations workspace →</button><small>Demo mode: any valid email and password starts a private browser session. Connect secure authentication before public deployment.</small></form></section></section></main>;

  const overview = <><div className="ops-kpi-grid"><article className="ops-kpi"><span>NEW ENQUIRIES</span><b>{totals.new}</b><small>Awaiting first response</small></article><article className="ops-kpi"><span>ACTIVE WORK</span><b>{totals.active}</b><small>Moving through the desk</small></article><article className="ops-kpi"><span>QUOTATIONS</span><b>{totals.quoted}</b><small>Sent to customer</small></article><article className="ops-kpi"><span>PRODUCT SYSTEMS</span><b>{products.length}</b><small>Published product groups</small></article></div><div className="ops-work-grid"><section className="ops-panel"><header className="ops-panel-head"><div><p>ENQUIRY FLOW</p><h2>Pipeline at a glance</h2></div><button onClick={() => setActive('Enquiries')}>Open enquiries →</button></header><div className="ops-pipeline">{stages.slice(0, 4).map(stage => { const count = rfqs.filter(item => item.status === stage).length; return <article className="ops-stage" key={stage}><b>{stage.toUpperCase()}</b><span>{count} {count === 1 ? 'enquiry' : 'enquiries'}</span><small>{stage === 'New' ? 'First response needed' : 'In project flow'}</small></article>; })}</div></section><section className="ops-panel"><header className="ops-panel-head"><div><p>DESK SIGNALS</p><h2>Today&apos;s focus</h2></div><button onClick={refresh}>Refresh ↻</button></header><div className="ops-signal-list"><article><i /><b>RFQ inbox is connected</b><span>{syncTime}</span></article><article><i /><b>{products.length} product systems available</b><span>Published</span></article><article><i /><b>Website quote form operational</b><span>Live preview</span></article></div></section></div><section className="ops-panel" style={{ marginTop: '18px' }}><header className="ops-panel-head"><div><p>LATEST ACTIVITY</p><h2>Recent enquiries</h2></div><button onClick={() => setActive('Enquiries')}>View all →</button></header>{rfqs.length ? <div className="ops-table">{rfqs.slice(0, 4).map(rfq => <article key={rfq.ref}><b>{rfq.ref}</b><span>{rfq.company}</span><p>{rfq.requirement}</p><select value={rfq.status} onChange={event => updateStatus(rfq.ref, event.target.value)}>{[...stages, 'Won', 'Lost'].map(status => <option key={status}>{status}</option>)}</select></article>)}</div> : <div className="ops-empty"><b>NO PROJECT SIGNALS YET</b><p>Submit an RFQ from the public website and it will appear here automatically in this demo.</p></div>}</section></>;
  const enquiries = <section className="ops-panel"><header className="ops-panel-head"><div><p>RFQ INBOX / {rfqs.length} TOTAL</p><h2>Technical enquiries</h2></div><button onClick={refresh}>Refresh ↻</button></header>{rfqs.length ? <div className="ops-table">{rfqs.map(rfq => <article key={rfq.ref}><b>{rfq.ref}</b><span>{rfq.company}<br /><small>{rfq.email}</small></span><p>{rfq.requirement}{rfq.products?.length ? ` · ${rfq.products.map(item => item.name).join(', ')}` : ''}</p><select value={rfq.status} onChange={event => updateStatus(rfq.ref, event.target.value)}>{[...stages, 'Won', 'Lost'].map(status => <option key={status}>{status}</option>)}</select></article>)}</div> : <div className="ops-empty"><b>THE INBOX IS CLEAR</b><p>Incoming website requirements will arrive here with their RFQ reference and selected product systems.</p></div>}</section>;
  const productsView = <section className="ops-panel"><header className="ops-panel-head"><div><p>PUBLIC CATALOGUE</p><h2>Product systems</h2></div><button className="ops-small-button" onClick={() => setProductForm(!productForm)}>Add system +</button></header>{productForm && <form className="ops-product-form" onSubmit={createProduct}><input value={newProduct.name} onChange={event => setNewProduct({ ...newProduct, name: event.target.value })} placeholder="System name" /><input value={newProduct.title} onChange={event => setNewProduct({ ...newProduct, title: event.target.value })} placeholder="Headline" /><input value={newProduct.description} onChange={event => setNewProduct({ ...newProduct, description: event.target.value })} placeholder="Short description" /><button type="submit">Publish</button></form>}<div className="ops-products">{products.map(product => <article className="ops-product" key={product.id}><b>{product.number}</b><div><h3>{product.name}</h3><p>{product.title}</p></div><small>LIVE</small></article>)}</div></section>;
  const modules = <section className="ops-panel"><header className="ops-panel-head"><div><p>{active.toUpperCase()} DESK</p><h2>{active}</h2></div><button onClick={() => setSyncTime('Saved now')}>Save workspace</button></header><div className="ops-module-grid">{[['Team access','Invite team members and assign operational roles.'],['Brand controls','Manage theme assets, contact details and site messaging.'],['Content queue','Review product documents and industry content before publishing.']].map(([title, copy], index) => <article key={title}><b>0{index + 1} / READY FOR API</b><h3>{title}</h3><p>{copy}</p></article>)}</div><div className="ops-empty"><b>LOCAL PREVIEW MODE</b><p>This workspace is interactive in the browser. Use a database and secure authentication to make it a multi-user client portal.</p></div></section>;

  return <main className="ops-shell"><aside className="ops-sidebar"><OpsBrand /><nav>{menu.map(item => <button key={item} className={active === item ? 'active' : ''} onClick={() => setActive(item)}>{item}</button>)}</nav><div className="ops-sidebar-footer"><p>OPERATIONS STATUS<br /><strong>LIVE LOCAL PREVIEW</strong></p><button onClick={signOut}>Sign out →</button></div></aside><section className="ops-content"><header className="ops-header"><div><p>IKINOVAC / OPERATIONS WORKSPACE</p><h1>{active === 'Overview' ? 'Good to see you.' : active}</h1></div><div className="ops-header-actions"><button className="ops-outline" onClick={() => window.location.href = '/'}>View website ↗</button><button className="ops-create" onClick={() => { setActive('Product systems'); setProductForm(true); }}>Add product +</button></div></header>{active === 'Overview' ? overview : active === 'Enquiries' ? enquiries : active === 'Product systems' ? productsView : modules}</section></main>;
}
