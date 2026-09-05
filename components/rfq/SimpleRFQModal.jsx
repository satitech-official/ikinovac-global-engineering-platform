'use client';

import { useEffect, useRef, useState } from 'react';
import { assetUrl } from '@/lib/assets';
import { createRFQReference } from '@/lib/rfq/reference';
import { createRFQPdf } from '@/lib/rfq/pdf';
import { useRFQ } from '../SiteShell';

const emptyForm = { name: '', company: '', email: '', phone: '', quantity: '', requirement: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const endpoint = process.env.NEXT_PUBLIC_IKINOVAC_RFQ_ENDPOINT || '';

const makeProduct = product => product ? {
  id: product.id || 'catalogue-product',
  name: product.name || 'Product requirement',
  category: product.category || 'Industrial products',
  family: product.family || product.name || 'Product family',
  image: assetUrl(product.cardImage || product.images?.[0] || product.image || ''),
  imageAlt: product.imageAlt || product.name || 'Industrial product',
  description: product.description || 'Approved catalogue information is available on request.',
  url: typeof window !== 'undefined' ? window.location.href : ''
} : {
  id: 'general-requirement', name: 'Product / Requirement', category: 'General enquiry', family: 'To be specified by customer', image: '', imageAlt: '',
  description: 'General industrial product or project requirement submitted through the IKINOVAC project desk.', url: typeof window !== 'undefined' ? window.location.href : ''
};

const toBase64 = async blob => {
  const bytes = new Uint8Array(await blob.arrayBuffer()); let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); }); return window.btoa(binary);
};
const download = (blob, filename) => { const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); window.setTimeout(() => URL.revokeObjectURL(url), 1200); };

export default function SimpleRFQModal() {
  const { quoteOpen, quoteProduct, closeQuote } = useRFQ();
  const [form, setForm] = useState(emptyForm); const [errors, setErrors] = useState({}); const [status, setStatus] = useState('form'); const [message, setMessage] = useState(''); const [success, setSuccess] = useState(null); const firstFieldRef = useRef(null); const modalRef = useRef(null);
  const product = makeProduct(quoteProduct);

  useEffect(() => {
    if (!quoteOpen) return undefined;
    setStatus('form'); setMessage(''); setErrors({}); setSuccess(null); setForm(emptyForm);
    window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    const onKey = event => { if (event.key === 'Escape' && status !== 'submitting') closeQuote(); if (event.key === 'Tab') { const focusable = [...(modalRef.current?.querySelectorAll('button:not([disabled]),a[href],input,textarea,select') || [])]; if (!focusable.length) return; const first = focusable[0]; const last = focusable[focusable.length - 1]; if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [quoteOpen, quoteProduct]);
  if (!quoteOpen) return null;

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const validate = () => { const next = {}; if (!form.name.trim()) next.name = 'Please enter your name.'; if (!form.company.trim()) next.company = 'Please enter your company.'; if (!emailPattern.test(form.email.trim())) next.email = 'Please enter a valid email address.'; if (!form.requirement.trim()) next.requirement = 'Please describe your requirement.'; if (form.quantity.trim() && (!/^\d+(?:\.\d+)?$/.test(form.quantity.trim()) || Number(form.quantity) <= 0)) next.quantity = 'Quantity must be a positive number.'; setErrors(next); return Object.keys(next).length === 0; };
  const submit = async event => {
    event.preventDefault(); if (!validate() || status === 'submitting') return;
    setStatus('submitting'); setMessage(''); const reference = createRFQReference(); const createdAt = new Date().toISOString();
    const rfq = { reference, createdAt, customer: { name: form.name.trim(), company: form.company.trim(), email: form.email.trim(), phone: form.phone.trim() }, product, quantity: form.quantity.trim() || null, requirement: form.requirement.trim() };
    try {
      const pdf = await createRFQPdf(rfq);
      if (!endpoint) throw new Error('The secure RFQ email service is not configured yet. Your information is still available in this form.');
      const filename = `IKINOVAC-RFQ-${reference}.pdf`;
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': reference }, body: JSON.stringify({ ...rfq, pdf: { filename, content: await toBase64(pdf) } }) });
      if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'The secure RFQ service could not accept this request.');
      download(pdf, filename); setSuccess({ reference, product: product.name, company: rfq.customer.company }); setStatus('success');
    } catch (error) { setMessage(error?.message || "We couldn't submit your RFQ yet. Your information has been preserved. Please try again."); setStatus('form'); }
  };
  const whatsapp = success ? `https://wa.me/?text=${encodeURIComponent(`Hello IKINOVAC Global,\n\nI have submitted RFQ ${success.reference} through your website for:\n\n${success.product}\n\nCompany:\n${success.company}\n\nI would like to discuss the requirement further.`)}` : '#';
  return <div className="simple-rfq-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && status !== 'submitting') closeQuote(); }}><section ref={modalRef} className="simple-rfq-modal" role="dialog" aria-modal="true" aria-labelledby="simple-rfq-title"><button className="simple-rfq-close" type="button" onClick={closeQuote} disabled={status === 'submitting'} aria-label="Close request for quote">×</button>{status === 'success' ? <div className="simple-rfq-success" role="status"><p className="eyebrow">RFQ / COMPLETE</p><span className="simple-rfq-success-mark">✓</span><h2 id="simple-rfq-title">RFQ SUBMITTED<br /><em>SUCCESSFULLY.</em></h2><p><b>Reference: {success.reference}</b></p><p>Your requirement has been sent to IKINOVAC Global. A PDF copy of your RFQ has also been downloaded for your records.</p><div><button className="button button-dark" type="button" onClick={closeQuote}>Close <span>→</span></button><a className="button button-ghost" href={whatsapp} target="_blank" rel="noreferrer">Continue on WhatsApp <span>→</span></a></div></div> : <form onSubmit={submit} noValidate><header className="simple-rfq-heading"><p className="eyebrow">PROJECT DESK / REQUEST FOR QUOTE</p><h2 id="simple-rfq-title">START A <em>REQUIREMENT.</em></h2><p>Send the essentials. IKINOVAC will review the technical and commercial context with you.</p></header><section className="simple-rfq-product"><div className="simple-rfq-number">01</div>{product.image ? <img src={product.image} alt={product.imageAlt} /> : <div className="simple-rfq-image-placeholder">IG</div>}<div><p>PRODUCT</p><h3>{product.name}</h3><span>{product.category} / {product.family}</span></div></section><fieldset className="simple-rfq-fields"><legend><b>02</b> YOUR DETAILS</legend><label>Name *<input ref={firstFieldRef} name="name" value={form.name} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label><label>Company *<input name="company" value={form.company} onChange={update} autoComplete="organization" aria-invalid={Boolean(errors.company)} />{errors.company && <small>{errors.company}</small>}</label><label>Email *<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <small>{errors.email}</small>}</label><label>Phone / WhatsApp<input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" /></label></fieldset><fieldset className="simple-rfq-fields simple-rfq-requirement"><legend><b>03</b> REQUIREMENT</legend><label>Quantity <input name="quantity" inputMode="decimal" value={form.quantity} onChange={update} placeholder="Optional" aria-invalid={Boolean(errors.quantity)} />{errors.quantity && <small>{errors.quantity}</small>}</label><label>Requirement / Notes *<textarea name="requirement" value={form.requirement} onChange={update} maxLength="1500" placeholder="Tell us what you need, including any technical or project context that helps." aria-invalid={Boolean(errors.requirement)} />{errors.requirement && <small>{errors.requirement}</small>}</label></fieldset>{message && <p className="simple-rfq-error" role="alert">{message}</p>}<button className="button button-gold simple-rfq-submit" disabled={status === 'submitting'} type="submit">{status === 'submitting' ? 'SUBMITTING RFQ…' : 'SUBMIT RFQ & DOWNLOAD PDF'} <span>→</span></button><p className="simple-rfq-disclaimer">Pricing, availability, specifications and delivery terms are subject to IKINOVAC Global review and confirmation.</p></form>}</section></div>;
}
