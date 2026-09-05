const corsHeaders = origin => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-Idempotency-Key',
  'Vary': 'Origin'
});

const text = (value, limit = 5000) => String(value || '').replace(/[\u0000-\u001f<>]/g, ' ').trim().slice(0, limit);
const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const json = (body, status, origin) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) } });

function validate(payload) {
  const customer = payload?.customer || {}; const product = payload?.product || {}; const pdf = payload?.pdf || {};
  if (!/^IG-RFQ-\d{8}-[A-Z0-9]+$/.test(text(payload?.reference, 48))) return 'Invalid RFQ reference.';
  if (!text(customer.name, 120) || !text(customer.company, 180) || !isEmail(text(customer.email, 254))) return 'A valid name, company and email are required.';
  if (!text(payload?.requirement, 5000)) return 'A requirement is required.';
  if (!text(product.name, 180)) return 'Product information is required.';
  if (payload.quantity && (!/^\d+(?:\.\d+)?$/.test(String(payload.quantity)) || Number(payload.quantity) <= 0)) return 'Quantity must be a positive number.';
  if (!/^IKINOVAC-RFQ-IG-RFQ-\d{8}-[A-Z0-9]+\.pdf$/.test(text(pdf.filename, 160))) return 'Invalid PDF filename.';
  if (!/^[A-Za-z0-9+/=]+$/.test(String(pdf.content || '')) || String(pdf.content).length > 4_300_000) return 'Invalid or oversized PDF attachment.';
  return null;
}

const messageBody = payload => {
  const { customer, product } = payload;
  return `New product requirement received through IKINOVAC Global.\n\nRFQ Reference:\n${text(payload.reference, 48)}\n\nProduct:\n${text(product.name, 180)}\n\nCategory:\n${text(product.category, 180)}\n\nProduct Family:\n${text(product.family, 180)}\n\nQuantity:\n${text(payload.quantity || 'Not Specified', 80)}\n\nCustomer:\n${text(customer.name, 120)}\n\nCompany:\n${text(customer.company, 180)}\n\nEmail:\n${text(customer.email, 254)}\n\nPhone / WhatsApp:\n${text(customer.phone || 'Not Specified', 120)}\n\nRequirement:\n${text(payload.requirement, 5000)}\n\nProduct Page:\n${text(product.url || 'Not specified', 1200)}\n\nThe customer-generated RFQ PDF is attached.`;
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
    const error = validate(payload); if (error) return json({ message: error }, 400, allowedOrigin);
    const customer = payload.customer; const product = payload.product;
    const resend = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: env.RFQ_FROM, to: [env.IKINOVAC_RFQ_TO], subject: `New RFQ | ${text(product.name, 90)} | ${text(customer.company, 90)} | ${text(payload.reference, 48)}`, text: messageBody(payload), attachments: [{ filename: text(payload.pdf.filename, 160), content: payload.pdf.content }] })
    });
    if (!resend.ok) return json({ message: 'IKINOVAC could not receive this RFQ yet. Please try again.' }, 502, allowedOrigin);
    return json({ ok: true, reference: text(payload.reference, 48) }, 200, allowedOrigin);
  }
};
