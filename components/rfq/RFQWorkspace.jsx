'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { createRFQPdf } from '@/lib/rfq/pdf';
import { mailtoUrl, whatsAppUrl } from '@/lib/rfq/handoff';
import { configurationStatus, displayValue } from '@/lib/rfq/reference';
import { assetUrl } from '@/lib/assets';
import { useRFQ } from '../SiteShell';
import ConfigureProduct from './ConfigureProduct';

const configurationRows = item => [['Size', item.configuration?.size], ['Material', item.configuration?.material], ['Rating', item.configuration?.pressureRating], ['Connection', item.configuration?.connection], ['Application', item.configuration?.application]].filter(([, value]) => value);

function Basket() {
  const { items, remove, duplicateItem, openConfigurator, setRFQStage, closeRFQ } = useRFQ();
  if (!items.length) return <div className="rfq-empty"><p className="eyebrow">YOUR REQUEST FOR QUOTATION</p><h2>YOUR RFQ<br />IS <em>EMPTY.</em></h2><p>Browse the catalogue and add products to prepare your requirement.</p><Link className="button button-dark" href="/products" onClick={closeRFQ}>EXPLORE PRODUCTS <span>→</span></Link></div>;
  return <><div className="rfq-workspace-heading"><p className="eyebrow">YOUR REQUEST</p><h2>FOR <em>QUOTATION.</em></h2><p>Review your selected products and technical requirements.</p></div><div className="rfq-line-list">{items.map((item, index) => <article key={item.key}><div className="rfq-line-number">{String(index + 1).padStart(2, '0')}</div><div className="rfq-line-image" role="img" aria-label={item.imageAlt || item.name} style={{ backgroundImage: item.image ? `url(${assetUrl(item.image)})` : undefined }} /><div className="rfq-line-main"><p>{item.category}</p><h3>{item.name}</h3><span>Qty {item.quantity} · {configurationStatus(item)}</span><div className="rfq-line-configuration">{configurationRows(item).length ? configurationRows(item).map(([label, value]) => <small key={label}>{label}: {value}</small>) : <small>Configuration to be confirmed by IKINOVAC</small>}</div></div><div className="rfq-line-actions"><button onClick={() => openConfigurator(item, item)}>EDIT CONFIGURATION</button><button onClick={() => duplicateItem(item.key)}>DUPLICATE</button><button className="danger" onClick={() => remove(item.key)}>REMOVE</button></div></article>)}</div><div className="rfq-drawer-actions"><Link href="/products" onClick={closeRFQ} className="text-arrow">+ ADD MORE PRODUCTS <span>→</span></Link><button className="button button-gold" onClick={() => setRFQStage('details')}>REVIEW RFQ <span>→</span></button></div></>;
}

function Details() {
  const { customer, updateCustomer, items, setRFQStage } = useRFQ();
  const [error, setError] = useState('');
  const update = event => updateCustomer({ [event.target.name]: event.target.value });
  const submit = event => { event.preventDefault(); if (!items.length) { setError('Add at least one product requirement before continuing.'); return; } if (!customer.contactPerson || !customer.company || !customer.country || !/^\S+@\S+\.\S+$/.test(customer.email)) { setError('Please complete contact person, company, a valid email and country.'); return; } setError(''); setRFQStage('review'); };
  return <form className="rfq-detail-form" onSubmit={submit}><div className="rfq-workspace-heading"><p className="eyebrow">CUSTOMER DETAILS</p><h2>THE PROJECT<br /><em>CONTEXT.</em></h2><p>Required fields are marked with an asterisk. Your selections remain saved while you complete this step.</p></div><div className="rfq-detail-grid"><label>Contact person *<input required name="contactPerson" value={customer.contactPerson} onChange={update} /></label><label>Company *<input required name="company" value={customer.company} onChange={update} /></label><label>Email *<input required type="email" name="email" value={customer.email} onChange={update} /></label><label>Phone<input name="phone" value={customer.phone} onChange={update} /></label><label>Country *<input required name="country" value={customer.country} onChange={update} /></label><label>Delivery location<input name="deliveryLocation" value={customer.deliveryLocation} onChange={update} /></label><label>Project name<input name="projectName" value={customer.projectName} onChange={update} /></label><label>Project reference<input name="projectReference" value={customer.projectReference} onChange={update} /></label><label>Required delivery date<input type="date" name="requiredDeliveryDate" value={customer.requiredDeliveryDate} onChange={update} /></label><label>Preferred contact method<select name="preferredContact" value={customer.preferredContact} onChange={update}><option>Email</option><option>WhatsApp</option><option>Either</option></select></label><label className="full">General requirement / notes<textarea name="notes" value={customer.notes} onChange={update} placeholder="Add the project, delivery or general requirement context." /></label></div><div className="rfq-attachment-panel"><b>ATTACHMENTS</b><span>BOQ, drawings, specifications, datasheets and technical documents can be sent with your final email or WhatsApp enquiry. Upload storage is not configured, so no attachment is claimed as received.</span></div>{error && <p className="rfq-error" role="alert">{error}</p>}<div className="rfq-step-actions"><button type="button" className="text-arrow" onClick={() => setRFQStage('basket')}>EDIT PRODUCTS <span>←</span></button><button className="button button-gold" type="submit">CONTINUE TO REVIEW <span>→</span></button></div></form>;
}

function Review() {
  const { rfq, customer, setRFQStage, setPDF, pdfUrl } = useRFQ();
  const [state, setState] = useState({ loading: false, error: '' });
  const generate = async () => { setState({ loading: true, error: '' }); try { const blob = await createRFQPdf({ ...rfq, customer }); const url = URL.createObjectURL(blob); setPDF({ blob, url }); setState({ loading: false, error: '' }); setRFQStage('ready'); } catch { setState({ loading: false, error: "We couldn't generate the PDF. Your RFQ has been preserved. Please try again." }); } };
  return <section className="rfq-review"><div className="rfq-workspace-heading"><p className="eyebrow">REVIEW YOUR RFQ</p><h2>READY FOR<br /><em>REVIEW.</em></h2><p>Reference <b>{rfq.reference}</b> · {new Date(rfq.createdAt).toLocaleDateString('en-GB')}</p></div><div className="rfq-review-customer"><p className="eyebrow">CUSTOMER / COMPANY DETAILS</p><dl><div><dt>Company</dt><dd>{customer.company}</dd></div><div><dt>Contact</dt><dd>{customer.contactPerson}</dd></div><div><dt>Email</dt><dd>{customer.email}</dd></div><div><dt>Country</dt><dd>{customer.country}</dd></div>{customer.projectReference && <div><dt>Project reference</dt><dd>{customer.projectReference}</dd></div>}</dl></div><div className="rfq-review-table"><div className="rfq-review-row head"><span>ITEM</span><span>PRODUCT</span><span>QTY</span><span>CONFIGURATION</span></div>{rfq.items.map((item, index) => <div className="rfq-review-row" key={item.key}><span>{String(index + 1).padStart(2, '0')}</span><b>{item.name}<small>{item.category}</small></b><span>{item.quantity}</span><span>{configurationStatus(item)}</span></div>)}</div><div className="rfq-commercial-note"><b>COMMERCIAL INFORMATION</b><p>Price: To be quoted · Lead time: To be confirmed · Availability: On request. This document is a technical requirement summary, not a commercial quotation.</p></div>{state.error && <p className="rfq-error" role="alert">{state.error}</p>}<div className="rfq-step-actions"><button type="button" className="text-arrow" onClick={() => setRFQStage('details')}>EDIT DETAILS <span>←</span></button><button className="button button-gold" onClick={generate} disabled={state.loading || Boolean(pdfUrl)}>{state.loading ? 'GENERATING…' : 'GENERATE RFQ PDF'} <span>→</span></button></div></section>;
}

function Ready() {
  const { rfq, customer, pdfUrl, setRFQStage, closeRFQ } = useRFQ();
  const [notice, setNotice] = useState('');
  const download = () => { if (!pdfUrl) return; const link = document.createElement('a'); link.href = pdfUrl; link.download = `IKINOVAC-RFQ-${rfq.reference}.pdf`; link.click(); setNotice('Your RFQ PDF has been downloaded. Please attach it before sending your email or WhatsApp enquiry.'); };
  const email = () => { download(); window.location.href = mailtoUrl(rfq, customer); };
  const whatsapp = () => { const url = whatsAppUrl(rfq, customer); if (!url) { setNotice('The approved IKINOVAC WhatsApp business number is not configured yet. Add NEXT_PUBLIC_IKINOVAC_WHATSAPP to enable this handoff without guessing a destination.'); return; } download(); window.open(url, '_blank', 'noopener,noreferrer'); };
  return <section className="rfq-ready"><p className="eyebrow">RFQ PREPARED</p><h2>YOUR RFQ<br />IS <em>READY.</em></h2><p>Reference <b>{rfq.reference}</b></p><div className="rfq-ready-meta"><span>Selected products <b>{rfq.items.length}</b></span><span>Status <b>Draft for IKINOVAC review</b></span></div><div className="rfq-ready-actions"><button className="button button-gold" onClick={download}>DOWNLOAD RFQ PDF <span>↓</span></button><button className="button button-dark" onClick={email}>EMAIL IKINOVAC <span>↗</span></button><button className="button button-dark" onClick={whatsapp}>CONTINUE ON WHATSAPP <span>↗</span></button></div>{notice && <p className="rfq-handoff-notice" role="status">{notice}</p>}<div className="rfq-step-actions"><button className="text-arrow" onClick={() => setRFQStage('review')}>EDIT RFQ <span>←</span></button><Link className="text-arrow" href="/products" onClick={closeRFQ}>ADD MORE PRODUCTS <span>→</span></Link></div></section>;
}

function Drawer() {
  const { closeRFQ, rfqStage, setRFQStage } = useRFQ();
  const ref = useRef(null);
  const closeRFQRef = useRef(closeRFQ);
  useEffect(() => { closeRFQRef.current = closeRFQ; }, [closeRFQ]);
  useEffect(() => {
    const previous = document.activeElement;
    const focus = () => ref.current?.querySelector('button, [href], input, select, textarea')?.focus();
    const timer = window.setTimeout(focus, 0);
    const onKey = event => {
      if (event.key === 'Escape') closeRFQRef.current();
      if (event.key === 'Tab') {
        const nodes = [...ref.current?.querySelectorAll('button:not([disabled]), [href], input, select, textarea') || []];
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', onKey);
      previous?.focus?.();
    };
  }, []);
  const view = { basket: <Basket />, details: <Details />, review: <Review />, ready: <Ready /> }[rfqStage] || <Basket />;
  return <div className="rfq-workspace-backdrop" onMouseDown={event => event.target === event.currentTarget && closeRFQ()}><aside ref={ref} className="rfq-workspace" role="dialog" aria-modal="true" aria-label="Request for quotation"><header><button className="rfq-back" onClick={() => rfqStage !== 'basket' ? setRFQStage('basket') : closeRFQ()} aria-label={rfqStage !== 'basket' ? 'Back to RFQ basket' : 'Close RFQ'}>{rfqStage !== 'basket' ? '← BACK' : 'CLOSE'}</button><button className="rfq-close" onClick={closeRFQ} aria-label="Close RFQ">×</button></header>{view}</aside></div>;
}

export default function RFQWorkspace() {
  const { rfqOpen, configurationTarget } = useRFQ();
  return <>{rfqOpen && <Drawer />}{configurationTarget && <ConfigureProduct target={configurationTarget} />}</>;
}

