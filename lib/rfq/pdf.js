const pageSize = [595.28, 841.89];
const margin = 42;
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const companyLogoPath = `${basePath}/assets/ikinovac-logo.jpeg`;

const wrap = (text, font, size, width) => {
  const words = String(text || '').trim().split(/\s+/).filter(Boolean);
  const lines = []; let line = '';
  words.forEach(word => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(candidate, size) > width) { lines.push(line); line = word; }
    else line = candidate;
  });
  if (line) lines.push(line);
  return lines.length ? lines : [''];
};

const imageBytes = async source => {
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
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', .8));
    return blob ? new Uint8Array(await blob.arrayBuffer()) : null;
  } catch { return null; }
};

export async function createRFQPdf(rfq) {
  const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
  const palette = {
    forest: rgb(.012, .105, .075),
    ink: rgb(.04, .055, .05),
    paper: rgb(.985, .974, .95),
    panel: rgb(.94, .925, .88),
    gold: rgb(.69, .52, .22),
    muted: rgb(.35, .35, .32),
    rule: rgb(.78, .73, .64),
    white: rgb(1, 1, 1)
  };

  const pdf = await PDFDocument.create();
  pdf.setTitle(`IKINOVAC RFQ ${rfq.reference}`);
  pdf.setAuthor('IKINOVAC GLOBAL');
  pdf.setSubject('Multi-product request for quotation / requirement summary');

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let companyLogo = null;
  const companyLogoBytes = await imageBytes(companyLogoPath);
  if (companyLogoBytes) {
    try { companyLogo = await pdf.embedJpg(companyLogoBytes); } catch { companyLogo = null; }
  }

  const items = Array.isArray(rfq.items) && rfq.items.length
    ? rfq.items
    : (rfq.product ? [{ product: rfq.product, quantity: rfq.quantity || null, notes: null }] : []);

  let page = pdf.addPage(pageSize);
  let y = pageSize[1] - margin;

  const line = (at = y) => page.drawLine({
    start: { x: margin, y: at },
    end: { x: pageSize[0] - margin, y: at },
    thickness: .65,
    color: palette.rule
  });

  const label = (text, x, at) => page.drawText(text.toUpperCase(), {
    x, y: at, size: 7, font: bold, color: palette.gold, characterSpacing: 1
  });

  const copy = (text, x, at, width, size = 8.2, color = palette.muted, leading = size * 1.42, useFont = regular) => {
    const lines = wrap(text, useFont, size, width);
    lines.forEach((value, index) => page.drawText(value, {
      x, y: at - index * leading, size, font: useFont, color
    }));
    return at - lines.length * leading;
  };

  const addPage = (continuation = '') => {
    page = pdf.addPage(pageSize);
    y = pageSize[1] - 58;
    if (continuation) {
      label(continuation, margin, y);
      page.drawLine({
        start: { x: margin, y: y - 12 },
        end: { x: pageSize[0] - margin, y: y - 12 },
        thickness: .6,
        color: palette.gold
      });
      y -= 34;
    }
    return page;
  };

  const ensure = (height, continuation = '') => {
    if (y - height < 62) addPage(continuation);
  };

  const footer = () => {
    const pages = pdf.getPages();
    pages.forEach((current, index) => {
      current.drawLine({
        start: { x: margin, y: 29 },
        end: { x: pageSize[0] - margin, y: 29 },
        thickness: .6,
        color: palette.gold
      });
      current.drawText('IKINOVAC GLOBAL  /  www.ikinovac.com  /  info@ikinovac.com', {
        x: margin, y: 17, size: 6.5, font: regular, color: palette.muted
      });
      const text = `${rfq.reference}  •  Page ${index + 1} of ${pages.length}`;
      current.drawText(text, {
        x: pageSize[0] - margin - regular.widthOfTextAtSize(text, 6.5),
        y: 17,
        size: 6.5,
        font: regular,
        color: palette.muted
      });
    });
  };

  page.drawRectangle({ x: 0, y: pageSize[1] - 157, width: pageSize[0], height: 157, color: palette.forest });

  const brandX = margin + 82;
  if (companyLogo) {
    const logoBox = { x: margin, y: pageSize[1] - 107, width: 64, height: 64 };
    const logoRatio = Math.min(logoBox.width / companyLogo.width, logoBox.height / companyLogo.height);
    const logoWidth = companyLogo.width * logoRatio;
    const logoHeight = companyLogo.height * logoRatio;
    page.drawRectangle({
      x: logoBox.x - 3, y: logoBox.y - 3,
      width: logoBox.width + 6, height: logoBox.height + 6,
      color: palette.white
    });
    page.drawImage(companyLogo, {
      x: logoBox.x + (logoBox.width - logoWidth) / 2,
      y: logoBox.y + (logoBox.height - logoHeight) / 2,
      width: logoWidth,
      height: logoHeight
    });
  }

  page.drawRectangle({ x: brandX, y: pageSize[1] - 147, width: 74, height: 3, color: palette.gold });
  page.drawText('IKINOVAC GLOBAL', { x: brandX, y: pageSize[1] - 73, size: 22, font: bold, color: palette.white });
  page.drawText('ENGINEERING SOLUTIONS. GLOBAL IMPACT.', { x: brandX, y: pageSize[1] - 91, size: 7.4, font: bold, color: palette.gold, characterSpacing: .8 });
  page.drawText('REQUEST FOR QUOTATION', { x: margin, y: pageSize[1] - 126, size: 15.5, font: bold, color: palette.white });
  page.drawText(`/ ${items.length} PRODUCT${items.length === 1 ? '' : 'S'} / REQUIREMENT SUMMARY`, { x: margin + 207, y: pageSize[1] - 126, size: 7.5, font: regular, color: palette.gold });
  page.drawText(rfq.reference, { x: pageSize[0] - margin - bold.widthOfTextAtSize(rfq.reference, 8.5), y: pageSize[1] - 72, size: 8.5, font: bold, color: palette.gold });

  const date = new Date(rfq.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  page.drawText(date, {
    x: pageSize[0] - margin - regular.widthOfTextAtSize(date, 7.5),
    y: pageSize[1] - 91,
    size: 7.5,
    font: regular,
    color: palette.white
  });
  y = pageSize[1] - 184;

  label('Customer details', margin, y);
  y -= 19;
  const half = (pageSize[0] - margin * 2 - 20) / 2;
  const fields = [
    ['Name', rfq.customer.name],
    ['Company', rfq.customer.company],
    ['Email', rfq.customer.email],
    ['Phone / WhatsApp', rfq.customer.phone || 'Not specified']
  ];

  for (let index = 0; index < fields.length; index += 2) {
    const row = fields.slice(index, index + 2);
    row.forEach(([name, value], col) => {
      const x = margin + col * (half + 20);
      label(name, x, y);
      page.drawText(String(value || 'Not specified').slice(0, 63), {
        x, y: y - 13, size: 8.6, font: regular, color: palette.ink
      });
    });
    y -= 34;
  }

  line();
  y -= 20;
  label(`Requested products / ${items.length}`, margin, y);
  y -= 19;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const product = item.product || {};
    const notes = item.notes || '';
    const notesLines = notes ? wrap(notes, regular, 7.4, 330) : [];
    const nameLines = wrap(product.name || 'Product requirement', bold, 12.2, 330);
    const cardHeight = Math.max(104, 75 + Math.max(0, nameLines.length - 1) * 12 + notesLines.length * 9);

    ensure(cardHeight + 18, 'Requested products / continued');

    const top = y;
    page.drawRectangle({
      x: margin,
      y: top - cardHeight,
      width: pageSize[0] - margin * 2,
      height: cardHeight,
      color: index % 2 === 0 ? palette.paper : palette.panel,
      borderColor: palette.rule,
      borderWidth: .45
    });

    const imageBox = { x: margin + 10, y: top - 82, width: 92, height: 70 };
    page.drawRectangle({ ...imageBox, color: palette.white, borderColor: palette.rule, borderWidth: .45 });

    let image = null;
    const bytes = await imageBytes(product.image);
    if (bytes) {
      try { image = await pdf.embedJpg(bytes); } catch { image = null; }
    }

    if (image) {
      const ratio = Math.min((imageBox.width - 6) / image.width, (imageBox.height - 6) / image.height);
      const width = image.width * ratio;
      const height = image.height * ratio;
      page.drawImage(image, {
        x: imageBox.x + (imageBox.width - width) / 2,
        y: imageBox.y + (imageBox.height - height) / 2,
        width,
        height
      });
    } else {
      page.drawText('PRODUCT', { x: imageBox.x + 25, y: imageBox.y + 31, size: 6.4, font: bold, color: palette.muted });
    }

    const textX = margin + 116;
    label(`${String(index + 1).padStart(2, '0')} / ${product.category || 'Industrial product'}`, textX, top - 15);

    let nameY = top - 34;
    nameLines.forEach((value, lineIndex) => page.drawText(value, {
      x: textX,
      y: nameY - lineIndex * 13,
      size: 12.2,
      font: bold,
      color: palette.ink
    }));
    nameY -= nameLines.length * 13 + 3;

    page.drawText(`Family: ${String(product.family || 'Product family').slice(0, 80)}`, {
      x: textX, y: nameY, size: 7.7, font: regular, color: palette.muted
    });
    page.drawText(`Quantity: ${item.quantity || 'Not specified'}`, {
      x: textX, y: nameY - 14, size: 8, font: bold, color: palette.gold
    });

    if (notes) {
      label('Product notes / specification', textX, nameY - 31);
      copy(notes, textX, nameY - 44, pageSize[0] - margin - textX - 10, 7.4, palette.muted, 9);
    }

    y = top - cardHeight - 12;
  }

  if (String(rfq.requirement || '').trim()) {
    ensure(100, 'Additional notes');
    line();
    y -= 20;
    label('Additional notes', margin, y);
    y -= 18;

    const requiredLines = wrap(rfq.requirement, regular, 8.5, pageSize[0] - 2 * margin - 24);
    const requiredHeight = Math.max(58, requiredLines.length * 12.5 + 24);
    if (y - requiredHeight < 76) {
      addPage('Additional notes / continued');
    }

    page.drawRectangle({
      x: margin,
      y: y - requiredHeight + 8,
      width: pageSize[0] - 2 * margin,
      height: requiredHeight,
      color: palette.paper,
      borderColor: palette.rule,
      borderWidth: .5
    });

    y = copy(rfq.requirement, margin + 12, y - 12, pageSize[0] - 2 * margin - 24, 8.5, palette.ink, 12.5) - 15;
  }

  ensure(110, 'Commercial information');
  line();
  y -= 20;
  label('Commercial information', margin, y);
  y -= 19;

  [['Price', 'To Be Quoted'], ['Availability', 'On Request'], ['Lead Time', 'To Be Confirmed']].forEach(([name, value], index) => {
    const x = margin + index * ((pageSize[0] - margin * 2) / 3);
    label(name, x, y);
    page.drawText(value, { x, y: y - 13, size: 8, font: regular, color: palette.ink });
  });

  y -= 39;
  line();
  y -= 17;
  copy(
    'This requirement summary records the customer\'s enquiry and does not constitute a final commercial offer. Pricing, availability, specifications and delivery terms are subject to review and confirmation by IKINOVAC Global.',
    margin,
    y,
    pageSize[0] - 2 * margin,
    7.2,
    palette.muted,
    9.6
  );

  footer();
  return new Blob([await pdf.save()], { type: 'application/pdf' });
}
