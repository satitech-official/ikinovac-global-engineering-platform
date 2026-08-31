import { configurationStatus, displayValue } from './reference';

const pageSize = [595.28, 841.89];
const margin = 42;

const wrap = (text, font, size, width) => {
  const words = String(text || '').split(/\s+/).filter(Boolean);
  const lines = []; let line = '';
  words.forEach(word => {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > width && line) { lines.push(line); line = word; } else line = candidate;
  });
  if (line) lines.push(line);
  return lines.length ? lines : [''];
};

const drawLines = (page, text, x, y, width, font, size, color, leading = size * 1.4) => {
  const lines = wrap(text, font, size, width);
  lines.forEach((line, index) => page.drawText(line, { x, y: y - index * leading, size, font, color }));
  return y - lines.length * leading;
};

const imageAsJpeg = async source => {
  if (!source || typeof window === 'undefined') return null;
  try {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = new URL(source, window.location.origin).href;
    await new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; });
    const canvas = document.createElement('canvas');
    const scale = Math.min(1, 720 / Math.max(image.naturalWidth, image.naturalHeight));
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .76));
    return blob ? new Uint8Array(await blob.arrayBuffer()) : null;
  } catch { return null; }
};

export async function createRFQPdf(rfq) {
  // Load only in response to the PDF action: the catalogue remains static- and SSR-safe.
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  // These print-safe values map the active editorial-refresh CSS tokens.
  const palette = {
    ink: rgb(0.008, 0.008, 0.008), panel: rgb(0.94, 0.937, 0.937), paper: rgb(0.985, 0.98, 0.965),
    blue: rgb(0.078, 0.431, 0.961), yellow: rgb(0.992, 0.902, 0.541), muted: rgb(0.35, 0.35, 0.35), rule: rgb(0.78, 0.78, 0.76), white: rgb(1, 1, 1)
  };
  const pdf = await PDFDocument.create();
  pdf.setTitle(`IKINOVAC RFQ ${rfq.reference}`);
  pdf.setAuthor('IKINOVAC GLOBAL');
  pdf.setSubject('Request for quotation / technical requirement summary');
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const imageCache = new Map();
  let page; let y;

  const addPage = () => { page = pdf.addPage(pageSize); y = pageSize[1] - margin; return page; };
  const need = height => { if (y - height < 74) addPage(); };
  const rule = (at = y) => page.drawLine({ start: { x: margin, y: at }, end: { x: pageSize[0] - margin, y: at }, thickness: .65, color: palette.rule });
  const label = (value, x, at) => page.drawText(value.toUpperCase(), { x, y: at, size: 7.2, font: bold, color: palette.blue, characterSpacing: 1.1 });
  const field = (name, value, x, at, width) => { label(name, x, at); return drawLines(page, displayValue(value), x, at - 12, width, regular, 8.3, palette.ink, 11.2); };

  addPage();
  page.drawRectangle({ x: 0, y: pageSize[1] - 154, width: pageSize[0], height: 154, color: palette.ink });
  page.drawRectangle({ x: margin, y: pageSize[1] - 148, width: 72, height: 3, color: palette.yellow });
  page.drawText('IKINOVAC GLOBAL', { x: margin, y: pageSize[1] - 72, size: 22, font: bold, color: palette.white });
  page.drawText('ENGINEERING SOLUTIONS. GLOBAL IMPACT.', { x: margin, y: pageSize[1] - 90, size: 7.5, font: bold, color: palette.yellow, characterSpacing: .85 });
  page.drawText('REQUEST FOR QUOTATION', { x: margin, y: pageSize[1] - 125, size: 16, font: bold, color: palette.white });
  page.drawText('/ TECHNICAL REQUIREMENT SUMMARY', { x: margin + 209, y: pageSize[1] - 125, size: 8, font: regular, color: palette.yellow });
  page.drawText(rfq.reference, { x: pageSize[0] - margin - bold.widthOfTextAtSize(rfq.reference, 9), y: pageSize[1] - 71, size: 9, font: bold, color: palette.yellow });
  page.drawText(new Date(rfq.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), { x: pageSize[0] - margin - 103, y: pageSize[1] - 90, size: 7.5, font: regular, color: palette.white });
  y = pageSize[1] - 182;

  label('Customer / company details', margin, y); y -= 19;
  const customer = rfq.customer || {};
  const half = (pageSize[0] - 2 * margin - 18) / 2;
  const firstY = y;
  const leftY = field('Company', customer.company, margin, firstY, half);
  const rightY = field('Contact person', customer.contactPerson, margin + half + 18, firstY, half);
  y = Math.min(leftY, rightY) - 7;
  const leftSecond = field('Email', customer.email, margin, y, half);
  const rightSecond = field('Phone', customer.phone, margin + half + 18, y, half);
  y = Math.min(leftSecond, rightSecond) - 7;
  const leftThird = field('Country', customer.country, margin, y, half);
  const rightThird = field('Delivery location', customer.deliveryLocation, margin + half + 18, y, half);
  y = Math.min(leftThird, rightThird) - 9;
  const leftFourth = field('Project name', customer.projectName, margin, y, half);
  const rightFourth = field('Project reference', customer.projectReference, margin + half + 18, y, half);
  y = Math.min(leftFourth, rightFourth) - 16;
  rule(); y -= 18;
  y = drawLines(page, "This document records the customer's requested products and technical requirements for review by IKINOVAC Global.", margin, y, pageSize[0] - 2 * margin, regular, 8.7, palette.muted) - 13;

  need(115); label('RFQ summary', margin, y); y -= 19;
  const columns = [margin, margin + 31, margin + 210, margin + 383, pageSize[0] - margin - 90];
  const headers = ['Item', 'Product', 'Category', 'Qty', 'Configuration status'];
  page.drawRectangle({ x: margin, y: y - 18, width: pageSize[0] - 2 * margin, height: 22, color: palette.ink });
  headers.forEach((header, index) => page.drawText(header.toUpperCase(), { x: columns[index] + 5, y: y - 10, size: 6.4, font: bold, color: palette.white }));
  y -= 25;
  rfq.items.forEach((item, index) => {
    need(27);
    page.drawRectangle({ x: margin, y: y - 19, width: pageSize[0] - 2 * margin, height: 23, color: index % 2 ? palette.paper : palette.panel });
    const row = [String(index + 1).padStart(2, '0'), item.name, item.category, String(item.quantity), configurationStatus(item)];
    row.forEach((value, column) => page.drawText(String(value).slice(0, column === 1 ? 34 : 28), { x: columns[column] + 5, y: y - 10, size: 7.1, font: column === 1 ? bold : regular, color: palette.ink }));
    y -= 23;
  });
  y -= 13;

  for (let index = 0; index < rfq.items.length; index += 1) {
    const item = rfq.items[index];
    need(245);
    rule(); y -= 18;
    label(`Item ${String(index + 1).padStart(2, '0')}`, margin, y); y -= 20;
    let embedded;
    if (item.image) {
      if (!imageCache.has(item.image)) imageCache.set(item.image, imageAsJpeg(item.image));
      const bytes = await imageCache.get(item.image);
      if (bytes) { try { embedded = await pdf.embedJpg(bytes); } catch { embedded = null; } }
    }
    const imageBox = { x: margin, y: y - 85, width: 112, height: 84 };
    page.drawRectangle({ ...imageBox, color: palette.panel, borderColor: palette.rule, borderWidth: .5 });
    if (embedded) {
      const ratio = Math.min((imageBox.width - 8) / embedded.width, (imageBox.height - 8) / embedded.height);
      const width = embedded.width * ratio; const height = embedded.height * ratio;
      page.drawImage(embedded, { x: imageBox.x + (imageBox.width - width) / 2, y: imageBox.y + (imageBox.height - height) / 2, width, height });
    } else page.drawText('PRODUCT IMAGE', { x: imageBox.x + 20, y: imageBox.y + 38, size: 7, font: bold, color: palette.muted });
    const copyX = margin + 130;
    page.drawText(item.name.toUpperCase(), { x: copyX, y: y - 3, size: 15, font: bold, color: palette.ink });
    page.drawText(`Category: ${item.category}`, { x: copyX, y: y - 20, size: 8, font: regular, color: palette.muted });
    page.drawText(`Product family: ${item.family || item.name}`, { x: copyX, y: y - 33, size: 8, font: regular, color: palette.muted });
    page.drawText(`Requested quantity: ${item.quantity}`, { x: copyX, y: y - 46, size: 8, font: bold, color: palette.blue });
    y = drawLines(page, item.description || 'Approved catalogue description is available on request.', copyX, y - 61, pageSize[0] - margin - copyX, regular, 7.6, palette.muted, 10.3) - 9;
    y = Math.min(y, imageBox.y - 13);
    label('Technical requirement', margin, y); y -= 18;
    const config = item.configuration || {};
    const requested = [
      ['Size', config.size], ['Material', config.material], ['Pressure / rating', config.pressureRating], ['Standard', config.standard],
      ['End connection', config.connection], ['Operation / actuation', config.operation], ['Application', config.application], ['Project / service', config.projectService],
      ['Delivery location', config.deliveryLocation], ['Required date', config.requiredDate]
    ].filter(([, value]) => value);
    if (!requested.length) {
      y = drawLines(page, 'Technical configuration: To be confirmed by IKINOVAC.', margin, y, pageSize[0] - 2 * margin, regular, 8.3, palette.muted) - 7;
    } else {
      for (let row = 0; row < requested.length; row += 2) {
        need(31); const left = requested[row]; const right = requested[row + 1];
        const leftEnd = field(left[0], left[1], margin, y, half);
        const rightEnd = right ? field(right[0], right[1], margin + half + 18, y, half) : leftEnd;
        y = Math.min(leftEnd, rightEnd) - 5;
      }
    }
    if (config.notes) { need(34); y = field('Additional technical notes', config.notes, margin, y, pageSize[0] - 2 * margin) - 9; }
    y -= 8;
  }

  need(130); rule(); y -= 18; label('Commercial information', margin, y); y -= 19;
  [['Price', 'To be quoted'], ['Lead time', 'To be confirmed'], ['Availability', 'On request'], ['Freight', 'To be confirmed'], ['Taxes', 'As applicable / to be confirmed'], ['Payment terms', 'To be provided in commercial quotation']].forEach(([name, value], index) => {
    const x = index % 2 ? margin + half + 18 : margin;
    if (index && index % 2 === 0) y -= 30;
    field(name, value, x, y, half);
  });
  y -= 50;
  need(70); page.drawRectangle({ x: margin, y: y - 45, width: pageSize[0] - 2 * margin, height: 49, color: palette.panel });
  drawLines(page, 'This RFQ summary records the customer\'s stated requirement and does not constitute a commercial offer, technical approval, availability confirmation or final quotation. Final specifications, pricing and delivery terms are subject to review and confirmation by IKINOVAC Global.', margin + 12, y - 12, pageSize[0] - 2 * margin - 24, regular, 7.2, palette.muted, 9.6);

  const pages = pdf.getPages();
  pages.forEach((current, index) => {
    current.drawLine({ start: { x: margin, y: 29 }, end: { x: pageSize[0] - margin, y: 29 }, thickness: .6, color: palette.yellow });
    current.drawText('IKINOVAC GLOBAL  /  www.ikinovac.com  /  info@ikinovac.com', { x: margin, y: 17, size: 6.6, font: regular, color: palette.muted });
    const footer = `${rfq.reference}  •  Page ${index + 1} of ${pages.length}`;
    current.drawText(footer, { x: pageSize[0] - margin - regular.widthOfTextAtSize(footer, 6.6), y: 17, size: 6.6, font: regular, color: palette.muted });
  });
  return new Blob([await pdf.save()], { type: 'application/pdf' });
}
