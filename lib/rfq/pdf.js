const pageSize = [595.28, 841.89];
const margin = 42;

const wrap = (text, font, size, width) => {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean); const lines = []; let line = '';
  words.forEach(word => { const candidate = line ? `${line} ${word}` : word; if (line && font.widthOfTextAtSize(candidate, size) > width) { lines.push(line); line = word; } else line = candidate; });
  if (line) lines.push(line); return lines.length ? lines : [''];
};

const imageBytes = async source => {
  if (!source || typeof window === 'undefined') return null;
  try {
    const image = new Image(); image.crossOrigin = 'anonymous'; image.src = new URL(source, window.location.origin).href;
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
    const canvas = document.createElement('canvas'); const scale = Math.min(1, 640 / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .78)); return blob ? new Uint8Array(await blob.arrayBuffer()) : null;
  } catch { return null; }
};

export async function createRFQPdf(rfq) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const palette = { forest: rgb(.012, .105, .075), ink: rgb(.04, .055, .05), paper: rgb(.985, .974, .95), panel: rgb(.94, .925, .88), gold: rgb(.69, .52, .22), muted: rgb(.35, .35, .32), rule: rgb(.78, .73, .64), white: rgb(1, 1, 1) };
  const pdf = await PDFDocument.create(); pdf.setTitle(`IKINOVAC RFQ ${rfq.reference}`); pdf.setAuthor('IKINOVAC GLOBAL'); pdf.setSubject('Request for quotation / requirement summary');
  const regular = await pdf.embedFont(StandardFonts.Helvetica); const bold = await pdf.embedFont(StandardFonts.HelveticaBold); let page = pdf.addPage(pageSize); let y = pageSize[1] - margin;
  const line = (at = y) => page.drawLine({ start: { x: margin, y: at }, end: { x: pageSize[0] - margin, y: at }, thickness: .65, color: palette.rule });
  const label = (text, x, at) => page.drawText(text.toUpperCase(), { x, y: at, size: 7, font: bold, color: palette.gold, characterSpacing: 1 });
  const copy = (text, x, at, width, size = 8.2, color = palette.muted, leading = size * 1.42) => { const lines = wrap(text, regular, size, width); lines.forEach((value, index) => page.drawText(value, { x, y: at - index * leading, size, font: regular, color })); return at - lines.length * leading; };
  const addPage = () => { page = pdf.addPage(pageSize); y = pageSize[1] - margin; return page; };
  const ensure = height => { if (y - height < 76) addPage(); };
  const footer = () => { const pages = pdf.getPages(); pages.forEach((current, index) => { current.drawLine({ start: { x: margin, y: 29 }, end: { x: pageSize[0] - margin, y: 29 }, thickness: .6, color: palette.gold }); current.drawText('IKINOVAC GLOBAL  /  www.ikinovac.com  /  info@ikinovac.com', { x: margin, y: 17, size: 6.5, font: regular, color: palette.muted }); const text = `${rfq.reference}  •  Page ${index + 1} of ${pages.length}`; current.drawText(text, { x: pageSize[0] - margin - regular.widthOfTextAtSize(text, 6.5), y: 17, size: 6.5, font: regular, color: palette.muted }); }); };

  page.drawRectangle({ x: 0, y: pageSize[1] - 157, width: pageSize[0], height: 157, color: palette.forest });
  page.drawRectangle({ x: margin, y: pageSize[1] - 147, width: 74, height: 3, color: palette.gold });
  page.drawText('IKINOVAC GLOBAL', { x: margin, y: pageSize[1] - 73, size: 22, font: bold, color: palette.white });
  page.drawText('ENGINEERING SOLUTIONS. GLOBAL IMPACT.', { x: margin, y: pageSize[1] - 91, size: 7.4, font: bold, color: palette.gold, characterSpacing: .8 });
  page.drawText('REQUEST FOR QUOTATION', { x: margin, y: pageSize[1] - 126, size: 15.5, font: bold, color: palette.white });
  page.drawText('/ REQUIREMENT SUMMARY', { x: margin + 207, y: pageSize[1] - 126, size: 7.8, font: regular, color: palette.gold });
  page.drawText(rfq.reference, { x: pageSize[0] - margin - bold.widthOfTextAtSize(rfq.reference, 8.5), y: pageSize[1] - 72, size: 8.5, font: bold, color: palette.gold });
  const date = new Date(rfq.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); page.drawText(date, { x: pageSize[0] - margin - regular.widthOfTextAtSize(date, 7.5), y: pageSize[1] - 91, size: 7.5, font: regular, color: palette.white }); y = pageSize[1] - 184;

  label('Customer details', margin, y); y -= 19; const half = (pageSize[0] - margin * 2 - 20) / 2; const fields = [['Name', rfq.customer.name], ['Company', rfq.customer.company], ['Email', rfq.customer.email], ['Phone / WhatsApp', rfq.customer.phone || 'Not specified']];
  for (let index = 0; index < fields.length; index += 2) { const row = fields.slice(index, index + 2); row.forEach(([name, value], col) => { const x = margin + col * (half + 20); label(name, x, y); page.drawText(String(value || 'Not specified').slice(0, 63), { x, y: y - 13, size: 8.6, font: regular, color: palette.ink }); }); y -= 34; }
  line(); y -= 20; label('Product requirement', margin, y); y -= 18;
  let image = null; const bytes = await imageBytes(rfq.product.image); if (bytes) { try { image = await pdf.embedJpg(bytes); } catch { image = null; } }
  const box = { x: margin, y: y - 93, width: 128, height: 93 }; page.drawRectangle({ ...box, color: palette.panel, borderColor: palette.rule, borderWidth: .6 });
  if (image) { const ratio = Math.min((box.width - 8) / image.width, (box.height - 8) / image.height); const width = image.width * ratio; const height = image.height * ratio; page.drawImage(image, { x: box.x + (box.width - width) / 2, y: box.y + (box.height - height) / 2, width, height }); } else page.drawText('PRODUCT IMAGE', { x: box.x + 25, y: box.y + 42, size: 6.8, font: bold, color: palette.muted });
  const textX = margin + 146; page.drawText(rfq.product.name.toUpperCase(), { x: textX, y: y - 2, size: 14.5, font: bold, color: palette.ink }); page.drawText(`Category: ${rfq.product.category}`, { x: textX, y: y - 20, size: 8, font: regular, color: palette.muted }); page.drawText(`Product family: ${rfq.product.family}`, { x: textX, y: y - 33, size: 8, font: regular, color: palette.muted }); page.drawText(`Quantity: ${rfq.quantity || 'Not specified'}`, { x: textX, y: y - 46, size: 8, font: bold, color: palette.gold }); copy(rfq.product.description, textX, y - 61, pageSize[0] - margin - textX, 7.4, palette.muted, 10); y = box.y - 20;
  ensure(120); line(); y -= 20; label('Customer requirement', margin, y); y -= 18; const requiredLines = wrap(rfq.requirement, regular, 8.5, pageSize[0] - 2 * margin - 24); const requiredHeight = Math.max(76, requiredLines.length * 12.5 + 24); if (y - requiredHeight < 145) { addPage(); label('Customer requirement', margin, y); y -= 18; }
  page.drawRectangle({ x: margin, y: y - requiredHeight + 8, width: pageSize[0] - 2 * margin, height: requiredHeight, color: palette.paper, borderColor: palette.rule, borderWidth: .5 }); y = copy(rfq.requirement, margin + 12, y - 12, pageSize[0] - 2 * margin - 24, 8.5, palette.ink, 12.5) - 15;
  ensure(110); line(); y -= 20; label('Commercial information', margin, y); y -= 19; [['Price', 'To Be Quoted'], ['Availability', 'On Request'], ['Lead Time', 'To Be Confirmed']].forEach(([name, value], index) => { const x = margin + index * ((pageSize[0] - margin * 2) / 3); label(name, x, y); page.drawText(value, { x, y: y - 13, size: 8, font: regular, color: palette.ink }); }); y -= 39; line(); y -= 17; copy('This requirement summary records the customer\'s enquiry and does not constitute a final commercial offer. Pricing, availability, specifications and delivery terms are subject to review and confirmation by IKINOVAC Global.', margin, y, pageSize[0] - 2 * margin, 7.2, palette.muted, 9.6);
  footer(); return new Blob([await pdf.save()], { type: 'application/pdf' });
}
