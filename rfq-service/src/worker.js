const corsHeaders = origin => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
  'Vary': 'Origin'
});

const text = (value, limit = 5000) => String(value || '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, limit);
const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const json = (body, status, origin) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) }
});

const normalizedItems = payload => {
  if (Array.isArray(payload?.items) && payload.items.length) return payload.items.slice(0, 20);
  if (payload?.product) return [{ product: payload.product, quantity: payload.quantity || null, notes: null }];
  return [];
};

function validate(payload) {
  const customer = payload?.customer || {};
  const pdf = payload?.pdf || {};
  const items = normalizedItems(payload);

  if (!/^IG-RFQ-\d{8}-[A-Z0-9]+$/.test(text(payload?.reference, 48))) return 'Invalid RFQ reference.';
  if (!text(customer.name, 120) || !text(customer.company, 180) || !isEmail(text(customer.email, 254))) return 'A valid name, company and email are required.';
  if (!text(payload?.requirement, 5000)) return 'A requirement is required.';
  if (!items.length) return 'At least one product is required.';
  if (items.length > 20) return 'A maximum of 20 products can be submitted in one RFQ.';

  for (const item of items) {
    const product = item?.product || {};
    if (!text(product.name, 180)) return 'Every RFQ item must include valid product information.';
    if (item.quantity && (!/^\d+(?:\.\d+)?$/.test(String(item.quantity)) || Number(item.quantity) <= 0)) return 'Each quantity must be a positive number.';
    if (text(item.notes, 700).length > 500) return 'Product notes are too long.';
  }

  if (!/^IKINOVAC-RFQ-IG-RFQ-\d{8}-[A-Z0-9]+\.pdf$/.test(text(pdf.filename, 160))) return 'Invalid PDF filename.';
  if (!/^[A-Za-z0-9+/=]+$/.test(String(pdf.content || '')) || String(pdf.content).length > 8_500_000) return 'Invalid or oversized PDF attachment.';
  return null;
}

const itemsBody = items => items.map((item, index) => {
  const product = item.product || {};
  return [
    `${String(index + 1).padStart(2, '0')}. ${text(product.name, 180)}`,
    `Category: ${text(product.category, 180)}`,
    `Product Family: ${text(product.family, 180)}`,
    `Quantity: ${text(item.quantity || 'Not Specified', 80)}`,
    `Product Notes: ${text(item.notes || 'Not Specified', 700)}`,
    `Product Page: ${text(product.url || 'Not specified', 1200)}`
  ].join('\n');
}).join('\n\n');

const messageBody = payload => {
  const customer = payload.customer || {};
  const items = normalizedItems(payload);
  return `New multi-product requirement received through IKINOVAC Global.

RFQ Reference:
${text(payload.reference, 48)}

Requested Products (${items.length}):
${itemsBody(items)}

Customer:
${text(customer.name, 120)}

Company:
${text(customer.company, 180)}

Email:
${text(customer.email, 254)}

Phone / WhatsApp:
${text(customer.phone || 'Not Specified', 120)}

Overall Project Requirement:
${text(payload.requirement, 5000)}

The customer-generated multi-product RFQ PDF is attached.`;
};

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || 'https://satitech-official.github.io';

    if (origin && origin !== allowedOrigin) return json({ message: 'Origin is not allowed.' }, 403, allowedOrigin);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(allowedOrigin) });
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/api/rfq') return json({ message: 'Not found.' }, 404, allowedOrigin);
    if (!env.RESEND_API_KEY || !env.IKINOVAC_RFQ_TO || !env.RFQ_FROM) return json({ message: 'RFQ mail service is not configured.' }, 503, allowedOrigin);

    let payload;
    try { payload = await request.json(); } catch { return json({ message: 'Invalid request body.' }, 400, allowedOrigin); }

    const error = validate(payload);
    if (error) return json({ message: error }, 400, allowedOrigin);

    const customer = payload.customer;
    const items = normalizedItems(payload);
    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: env.RFQ_FROM,
        to: [env.IKINOVAC_RFQ_TO],
        subject: `New RFQ | ${items.length} product${items.length === 1 ? '' : 's'} | ${text(customer.company, 90)} | ${text(payload.reference, 48)}`,
        text: messageBody(payload),
        attachments: [{
          filename: text(payload.pdf.filename, 160),
          content: payload.pdf.content
        }]
      })
    });

    if (!resend.ok) return json({ message: 'IKINOVAC could not receive this RFQ yet. Please try again.' }, 502, allowedOrigin);

    return json({
      ok: true,
      reference: text(payload.reference, 48),
      productCount: items.length
    }, 200, allowedOrigin);
  }
};
