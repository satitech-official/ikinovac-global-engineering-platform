const productLines = items => items.map(item => `• ${item.name} — Qty ${item.quantity}`).join('\n');

export const emailSubject = (rfq, customer) => `RFQ ${rfq.reference} — ${customer.company || 'Customer enquiry'}`;

export const emailBody = (rfq, customer) => `Hello IKINOVAC Global,\n\nPlease review our RFQ ${rfq.reference}.\n\nProducts requested:\n${productLines(rfq.items)}\n\nCompany: ${customer.company || 'Not provided'}\nContact: ${customer.contactPerson || 'Not provided'}\nCountry: ${customer.country || 'Not provided'}\n\nPlease find the generated RFQ PDF attached.\n\nRegards,\n${customer.contactPerson || ''}`;

export const whatsAppMessage = (rfq, customer) => `Hello IKINOVAC Global,\n\nI have prepared RFQ ${rfq.reference}.\n\nProducts:\n${productLines(rfq.items)}\n\nCompany: ${customer.company || 'Not provided'}\n\nPlease review our requirement and provide your commercial quotation.`;

export const mailtoUrl = (rfq, customer) => `mailto:info@ikinovac.com?subject=${encodeURIComponent(emailSubject(rfq, customer))}&body=${encodeURIComponent(emailBody(rfq, customer))}`;

export const whatsAppUrl = (rfq, customer) => {
  const number = String(process.env.NEXT_PUBLIC_IKINOVAC_WHATSAPP || '').replace(/\D/g, '');
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(whatsAppMessage(rfq, customer))}` : null;
};
