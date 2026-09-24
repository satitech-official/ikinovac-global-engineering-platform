'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '@/lib/assets';
import { catalogueCategories, catalogueProducts } from '@/lib/catalogue';
import { createRFQReference } from '@/lib/rfq/reference';
import { createRFQPdf } from '@/lib/rfq/pdf';
import { trackEvent } from '@/lib/analytics';
import { useRFQ } from '../SiteShell';

const emptyForm = { name: '', company: '', email: '', phone: '', requirement: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const endpoint = process.env.NEXT_PUBLIC_IKINOVAC_RFQ_ENDPOINT || '';
const fallbackEmail = 'info@ikinovac.com';
const fallbackEndpoint = `https://formsubmit.co/ajax/${fallbackEmail}`;
const maxProducts = 20;

const makeProduct = product => ({
  id: product.id || 'catalogue-product',
  name: product.name || 'Product requirement',
  category: product.category || 'Industrial products',
  family: product.family || product.name || 'Product family',
  image: assetUrl(product.cardImage || product.images?.[0] || product.image || ''),
  imageAlt: product.imageAlt || product.name || 'Industrial product',
  description: product.description || 'Approved catalogue information is available on request.',
  url: typeof window !== 'undefined' ? `${window.location.origin}${process.env.NEXT_PUBLIC_BASE_PATH || ''}/products/${product.categorySlug || ''}#product-${product.slug || ''}` : ''
});

const toBase64 = async blob => {
  const bytes = new Uint8Array(await blob.arrayBuffer()); let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); }); return window.btoa(binary);
};

const download = (blob, filename) => {
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
};

const productSummary = items => items.map((item, index) =>
  `${String(index + 1).padStart(2, '0')}. ${item.product.name} | Qty: ${item.quantity || 'Not specified'}`
).join('\n');

const submitFallback = async (rfq, pdf, filename) => {
  const data = new FormData();
  data.append('_subject', `New RFQ | ${rfq.items.length} product${rfq.items.length === 1 ? '' : 's'} | ${rfq.customer.company} | ${rfq.reference}`);
  data.append('_template', 'table');
  data.append('_captcha', 'false');
  data.append('_replyto', rfq.customer.email);
  data.append('RFQ Reference', rfq.reference);
  data.append('Customer Name', rfq.customer.name);
  data.append('Company', rfq.customer.company);
  data.append('Email', rfq.customer.email);
  data.append('Phone / WhatsApp', rfq.customer.phone || 'Not specified');
  data.append('Requested Products', productSummary(rfq.items));
  rfq.items.forEach((item, index) => {
    const prefix = `Item ${String(index + 1).padStart(2, '0')}`;
    data.append(`${prefix} Product`, item.product.name);
    data.append(`${prefix} Quantity`, item.quantity || 'Not specified');
  });
  data.append('Additional Notes', rfq.requirement || 'Not specified');
  data.append('attachment', new File([pdf], filename, { type: 'application/pdf' }));

  const response = await fetch(fallbackEndpoint, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: data
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.success === false) throw new Error(payload?.message || 'The RFQ email service could not accept this request.');
  const note = String(payload?.message || '').toLowerCase();
  return { activationRequired: note.includes('activate') || note.includes('confirm'), payload };
};

export default function SimpleRFQModal() {
  const { quoteOpen, quoteProducts, addQuoteProduct, removeQuoteProduct, clearQuoteProducts, closeQuote } = useRFQ();
  const [form, setForm] = useState(emptyForm);
  const [itemMeta, setItemMeta] = useState({});
  const [addProductId, setAddProductId] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('form');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(null);
  const firstFieldRef = useRef(null);
  const modalRef = useRef(null);

  const selectedIds = useMemo(() => new Set(quoteProducts.map(product => product.id)), [quoteProducts]);

  useEffect(() => {
    setItemMeta(current => Object.fromEntries(quoteProducts.map(product => [
      product.id,
      current[product.id] || { quantity: '' }
    ])));
  }, [quoteProducts]);

  useEffect(() => {
    if (!quoteOpen) return undefined;
    setStatus('form'); setMessage(''); setErrors({}); setSuccess(null);
    window.setTimeout(() => firstFieldRef.current?.focus(), 40);
    const onKey = event => {
      if (event.key === 'Escape' && status !== 'submitting') closeQuote();
      if (event.key === 'Tab') {
        const focusable = [...(modalRef.current?.querySelectorAll('button:not([disabled]),a[href],input,textarea,select,details>summary') || [])];
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [quoteOpen]);

  if (!quoteOpen) return null;

  const update = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  const updateItem = (id, field, value) => setItemMeta(current => ({ ...current, [id]: { ...(current[id] || { quantity: '' }), [field]: value } }));

  const addSelected = () => {
    if (!addProductId || quoteProducts.length >= maxProducts) return;
    const product = catalogueProducts.find(item => item.id === addProductId);
    if (product) addQuoteProduct(product);
    setAddProductId('');
  };

  const validate = () => {
    const next = {};
    if (!quoteProducts.length) next.products = 'Please add at least one product to the RFQ.';
    if (!form.name.trim()) next.name = 'Please enter your name.';
    if (!form.company.trim()) next.company = 'Please enter your company.';
    if (!emailPattern.test(form.email.trim())) next.email = 'Please enter a valid email address.';
    quoteProducts.forEach(product => {
      const quantity = (itemMeta[product.id]?.quantity || '').trim();
      if (quantity && (!/^\d+(?:\.\d+)?$/.test(quantity) || Number(quantity) <= 0)) next[`quantity-${product.id}`] = 'Quantity must be a positive number.';
    });
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const submit = async event => {
    event.preventDefault();
    if (!validate() || status === 'submitting') return;

    setStatus('submitting'); setMessage('');
    const reference = createRFQReference();
    const createdAt = new Date().toISOString();
    const items = quoteProducts.map(product => ({
      product: makeProduct(product),
      quantity: (itemMeta[product.id]?.quantity || '').trim() || null,
      notes: null
    }));

    const rfq = {
      reference,
      createdAt,
      customer: {
        name: form.name.trim(),
        company: form.company.trim(),
        email: form.email.trim(),
        phone: form.phone.trim()
      },
      items,
      product: items[0]?.product || null,
      quantity: items[0]?.quantity || null,
      requirement: form.requirement.trim()
    };

    try {
      const pdf = await createRFQPdf(rfq);
      const filename = `IKINOVAC-RFQ-${reference}.pdf`;

      if (endpoint) {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Idempotency-Key': reference },
          body: JSON.stringify({ ...rfq, pdf: { filename, content: await toBase64(pdf) } })
        });
        if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'The secure RFQ service could not accept this request.');
      } else {
        const fallback = await submitFallback(rfq, pdf, filename);
        if (fallback.activationRequired) {
          download(pdf, filename);
          throw new Error('RFQ email activation is required once. Please open info@ikinovac.com, confirm the FormSubmit activation email, then submit again. Your PDF has been downloaded safely.');
        }
      }

      download(pdf, filename);
      trackEvent('generate_lead', {
        lead_type: 'rfq',
        product_count: items.length,
        product_name: items.map(item => item.product.name).join(', ').slice(0, 300),
        rfq_reference: reference
      });
      setSuccess({ reference, products: items.map(item => item.product.name), company: rfq.customer.company });
      clearQuoteProducts();
      setItemMeta({});
      setForm(emptyForm);
      setStatus('success');
    } catch (error) {
      setMessage(error?.message || "We couldn't submit your RFQ yet. Your information has been preserved. Please try again.");
      setStatus('form');
    }
  };

  const whatsapp = success ? `https://wa.me/?text=${encodeURIComponent(`Hello IKINOVAC Global,\n\nI have submitted RFQ ${success.reference} through your website for:\n\n${success.products.map((name, index) => `${index + 1}. ${name}`).join('\n')}\n\nCompany:\n${success.company}\n\nI would like to discuss the requirement further.`)}` : '#';

  return <div className="simple-rfq-backdrop" role="presentation" onMouseDown={event => {
    if (event.target === event.currentTarget && status !== 'submitting') closeQuote();
  }}>
    <section ref={modalRef} className="simple-rfq-modal simple-rfq-modal-multi" role="dialog" aria-modal="true" aria-labelledby="simple-rfq-title">
      <button className="simple-rfq-close" type="button" onClick={closeQuote} disabled={status === 'submitting'} aria-label="Close request for quote">×</button>
      {status === 'success' ? <div className="simple-rfq-success" role="status">
        <p className="eyebrow">RFQ / COMPLETE</p>
        <span className="simple-rfq-success-mark">✓</span>
        <h2 id="simple-rfq-title">RFQ SUBMITTED<br /><em>SUCCESSFULLY.</em></h2>
        <p><b>Reference: {success.reference}</b></p>
        <p>{success.products.length} product{success.products.length === 1 ? '' : 's'} submitted in one RFQ. A PDF copy has also been downloaded for your records.</p>
        <div><button className="button button-dark" type="button" onClick={closeQuote}>Close <span>→</span></button><a className="button button-ghost" href={whatsapp} target="_blank" rel="noreferrer">Continue on WhatsApp <span>→</span></a></div>
      </div> : <form onSubmit={submit} noValidate>
        <header className="simple-rfq-heading">
          <p className="eyebrow">PROJECT DESK / RFQ</p>
          <h2 id="simple-rfq-title">REQUEST A <em>QUOTE.</em></h2>
          <p>Select the products you need and share your contact details.</p>
        </header>

        <fieldset className="simple-rfq-products-fieldset">
          <legend><b>01</b> PRODUCTS</legend>

          <div className="simple-rfq-product-list">
            {quoteProducts.map((rawProduct, index) => {
              const product = makeProduct(rawProduct);
              const meta = itemMeta[rawProduct.id] || { quantity: '' };
              return <article className="simple-rfq-product-item" key={rawProduct.id}>
                {product.image ? <img src={product.image} alt={product.imageAlt} /> : <div className="simple-rfq-image-placeholder">IG</div>}
                <div className="simple-rfq-item-copy">
                  <h3>{product.name}</h3>
                </div>
                <button type="button" className="simple-rfq-remove" onClick={() => removeQuoteProduct(rawProduct.id)} disabled={status === 'submitting'} aria-label={`Remove ${product.name}`}>Remove</button>
                <label className="simple-rfq-item-qty">Quantity <span>(Optional)</span>
                  <input inputMode="decimal" value={meta.quantity} onChange={event => updateItem(rawProduct.id, 'quantity', event.target.value)} placeholder="Enter quantity" aria-invalid={Boolean(errors[`quantity-${rawProduct.id}`])} />
                  {errors[`quantity-${rawProduct.id}`] && <small>{errors[`quantity-${rawProduct.id}`]}</small>}
                </label>
              </article>;
            })}
            {!quoteProducts.length && <div className="simple-rfq-empty">No product selected yet. Add the products required for this RFQ below.</div>}
          </div>

          <div className="simple-rfq-add-product">
            <label>Add another product
              <select value={addProductId} onChange={event => setAddProductId(event.target.value)} disabled={quoteProducts.length >= maxProducts || status === 'submitting'}>
                <option value="">Select product</option>
                {catalogueCategories.map(category => <optgroup label={category.name} key={category.slug}>
                  {catalogueProducts.filter(product => product.categorySlug === category.slug).map(product => <option value={product.id} key={product.id} disabled={selectedIds.has(product.id)}>{product.name}{selectedIds.has(product.id) ? ' — already added' : ''}</option>)}
                </optgroup>)}
              </select>
            </label>
            <button type="button" onClick={addSelected} disabled={!addProductId || quoteProducts.length >= maxProducts || status === 'submitting'}>+ Add product</button>
          </div>
          {errors.products && <small className="simple-rfq-products-error">{errors.products}</small>}
        </fieldset>

        <fieldset className="simple-rfq-fields">
          <legend><b>02</b> YOUR DETAILS</legend>
          <label>Name *<input ref={firstFieldRef} name="name" value={form.name} onChange={update} autoComplete="name" aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label>
          <label>Company *<input name="company" value={form.company} onChange={update} autoComplete="organization" aria-invalid={Boolean(errors.company)} />{errors.company && <small>{errors.company}</small>}</label>
          <label>Email *<input name="email" type="email" value={form.email} onChange={update} autoComplete="email" aria-invalid={Boolean(errors.email)} />{errors.email && <small>{errors.email}</small>}</label>
          <label>Phone / WhatsApp<input name="phone" type="tel" value={form.phone} onChange={update} autoComplete="tel" /></label>
        </fieldset>

        <fieldset className="simple-rfq-fields simple-rfq-project-requirement">
          <legend><b>03</b> ADDITIONAL NOTES</legend>
          <label>Any additional requirement <span>(Optional)</span><textarea name="requirement" value={form.requirement} onChange={update} maxLength="1200" placeholder="Add delivery, standard or project notes if needed." /></label>
        </fieldset>

        {message && <p className="simple-rfq-error" role="alert">{message}</p>}
        <button className="button button-gold simple-rfq-submit" disabled={status === 'submitting'} type="submit">{status === 'submitting' ? 'SUBMITTING RFQ…' : 'SUBMIT RFQ & DOWNLOAD PDF'} <span>→</span></button>
        <p className="simple-rfq-disclaimer">Pricing, availability, specifications and delivery terms are subject to IKINOVAC Global review and confirmation.</p>
      </form>}
    </section>
  </div>;
}
