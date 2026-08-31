'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { cleanConfiguration, normaliseQuantity } from '@/lib/rfq/reference';
import { assetUrl } from '@/lib/assets';
import { useRFQ } from '../SiteShell';

const fields = [
  ['size', 'Required size', 'Enter required size'], ['material', 'Material', 'Enter material requirement'], ['pressureRating', 'Pressure / rating', 'Enter rating requirement'],
  ['standard', 'Standard', 'Enter standard requirement'], ['connection', 'End connection', 'Enter end connection'], ['operation', 'Operation / actuation', 'Enter operation requirement']
];

export default function ConfigureProduct({ target }) {
  const { closeConfigurator, add, updateItem, openRFQ } = useRFQ();
  const [form, setForm] = useState(() => ({ ...cleanConfiguration(target.item?.configuration), quantity: target.item?.quantity || 1 }));
  const [notice, setNotice] = useState('');
  const [duplicate, setDuplicate] = useState(false);
  const closeRef = useRef(null);
  const { product, item } = target;
  useEffect(() => { closeRef.current?.focus(); }, []);
  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const configuration = () => cleanConfiguration(form);
  const addToRFQ = strategy => {
    if (!Number(form.quantity) || Number(form.quantity) < 1) { setNotice('Please enter a quantity greater than zero.'); return; }
    if (item) { updateItem(item.key, { quantity: normaliseQuantity(form.quantity), configuration: configuration() }); setNotice(`${product.name.toUpperCase()} UPDATED IN RFQ`); return; }
    const result = add(product, configuration(), normaliseQuantity(form.quantity), strategy);
    if (result?.duplicate) { setDuplicate(true); setNotice('This product already has the same configuration in your RFQ.'); return; }
    setDuplicate(false); setNotice(`${product.name.toUpperCase()} ADDED TO RFQ`);
  };
  return <div className="rfq-modal-backdrop" role="presentation" onMouseDown={event => event.target === event.currentTarget && closeConfigurator()}>
    <section className="rfq-configurator" role="dialog" aria-modal="true" aria-labelledby="rfq-config-title" onKeyDown={event => event.key === 'Escape' && closeConfigurator()}>
      <header><div><p className="eyebrow">01 / PRODUCT</p><h2 id="rfq-config-title">Configure your<br /><em>requirement.</em></h2></div><button ref={closeRef} onClick={closeConfigurator} aria-label="Close product configuration">×</button></header>
      <div className="rfq-config-grid"><aside><div className="rfq-config-image" role="img" aria-label={product.imageAlt} style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.5)),url(${assetUrl(product.images?.[0] || product.image)})` }} /><dl><div><dt>PRODUCT</dt><dd>{product.name}</dd></div><div><dt>CATEGORY</dt><dd>{product.category}</dd></div><div><dt>PRODUCT FAMILY</dt><dd>{product.family || product.name}</dd></div></dl><p>Catalogue technical options are confirmed only when approved source data is available. Add your requirement in your own words below.</p></aside>
        <form onSubmit={event => { event.preventDefault(); addToRFQ('prompt'); }}><div className="rfq-section-heading"><span>02</span><div><b>CONFIGURATION</b><small>Available on request / to be confirmed by IKINOVAC</small></div></div><div className="rfq-input-grid">{fields.map(([name, label, placeholder]) => <label key={name}>{label}<input name={name} value={form[name] || ''} onChange={update} placeholder={placeholder} /></label>)}</div><div className="rfq-section-heading"><span>03</span><div><b>QUANTITY</b></div></div><label className="rfq-quantity">Quantity *<input required name="quantity" type="number" min="1" inputMode="numeric" value={form.quantity} onChange={update} /></label><div className="rfq-section-heading"><span>04</span><div><b>PROJECT DETAILS</b></div></div><div className="rfq-input-grid"><label>Application<input name="application" value={form.application || ''} onChange={update} placeholder="How will this be used?" /></label><label>Project / service<input name="projectService" value={form.projectService || ''} onChange={update} placeholder="Project or service context" /></label><label>Delivery location<input name="deliveryLocation" value={form.deliveryLocation || ''} onChange={update} placeholder="Destination, if known" /></label><label>Required date<input name="requiredDate" type="date" value={form.requiredDate || ''} onChange={update} /></label><label className="full">Additional technical notes<textarea name="notes" value={form.notes || ''} onChange={update} placeholder="Add drawing reference, technical notes or anything that helps the project desk." /></label></div><p className="rfq-attachment-note">BOQ, drawings, specifications and datasheets can be sent with your final email or WhatsApp enquiry. No file has been uploaded from this website.</p>{duplicate && <div className="rfq-duplicate-choice"><b>Same configuration already in RFQ</b><button type="button" onClick={() => addToRFQ('merge')}>UPDATE QUANTITY</button><button type="button" onClick={() => addToRFQ('separate')}>ADD AS SEPARATE LINE</button></div>}<button className="button button-gold rfq-primary-action" type="submit">{item ? 'UPDATE RFQ ITEM' : 'ADD TO RFQ'} <span>→</span></button>{notice && <div className="rfq-notice" role="status"><b>{notice}</b><div><button type="button" onClick={() => { closeConfigurator(); openRFQ('basket'); }}>VIEW RFQ</button><Link href="/products" onClick={closeConfigurator}>ADD MORE PRODUCTS</Link><button type="button" onClick={() => setNotice('')}>CONTINUE BROWSING</button></div></div>}</form></div>
    </section>
  </div>;
}

