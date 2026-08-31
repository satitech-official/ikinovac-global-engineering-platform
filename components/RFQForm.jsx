'use client';

import { useState } from 'react';
import { useRFQ } from './SiteShell';

const initial = { name: '', company: '', country: '', email: '', phone: '', requirement: '', quantity: '', application: '', standard: '', deliveryRequirement: '', details: '' };

export default function RFQForm() {
  const [form, setForm] = useState(initial);
  const [attachment, setAttachment] = useState('');
  const [message, setMessage] = useState('');
  const { items, clear } = useRFQ();
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const submit = event => {
    event.preventDefault();
    if (!form.name || !form.company || !form.email || !form.requirement) { setMessage('Please add your name, company, email and product requirement.'); return; }
    const ref = `IKG-${String(Date.now()).slice(-7)}`;
    const records = JSON.parse(localStorage.getItem('ikinovac-rfqs') || '[]');
    records.unshift({ ...form, attachment: attachment || null, products: items, ref, status: 'New', createdAt: new Date().toISOString() });
    localStorage.setItem('ikinovac-rfqs', JSON.stringify(records));
    clear(); setForm(initial); setAttachment('');
    setMessage(`Local preview saved as ${ref}. This demo does not send email or upload files to a remote server.`);
  };
  return <form className="rfq-form-v2" onSubmit={submit}><div className="rfq-selection"><p className="eyebrow">YOUR SELECTION / {String(items.length).padStart(2, '0')} ITEMS</p>{items.length ? items.map(item => <span key={item.key}>{item.name} × {item.quantity}</span>) : <small>No product family selected. You can still send a project requirement.</small>}</div><div className="form-grid"><label>Name *<input name="name" value={form.name} onChange={update} placeholder="Your name" /></label><label>Company *<input name="company" value={form.company} onChange={update} placeholder="Company name" /></label><label>Country<input name="country" value={form.country} onChange={update} placeholder="Country" /></label><label>Email *<input name="email" type="email" value={form.email} onChange={update} placeholder="name@company.com" /></label><label>Phone<input name="phone" value={form.phone} onChange={update} placeholder="Phone number" /></label><label>Quantity<input name="quantity" value={form.quantity} onChange={update} placeholder="Quantity, if known" /></label><label className="full">Product / Requirement *<textarea name="requirement" value={form.requirement} onChange={update} placeholder="Product, application, product family or project requirement" /></label><label>Application<input name="application" value={form.application} onChange={update} placeholder="Application, if known" /></label><label>Required standard<input name="standard" value={form.standard} onChange={update} placeholder="Standard, if applicable" /></label><label>Delivery requirement<input name="deliveryRequirement" value={form.deliveryRequirement} onChange={update} placeholder="Required date or delivery context" /></label><label>Attachment<input type="file" onChange={event => setAttachment(event.target.files?.[0]?.name || '')} aria-describedby="attachment-note" /></label><label className="full">Additional details<textarea name="details" value={form.details} onChange={update} placeholder="Add any available technical notes, destination or drawing reference" /></label></div><p id="attachment-note" className="form-note">Preview mode: attachment names are recorded locally only; files are not uploaded or emailed.</p><button className="button button-gold" type="submit">Submit to project desk <span>→</span></button>{message && <p className="form-status" role="status">{message}</p>}</form>;
}
