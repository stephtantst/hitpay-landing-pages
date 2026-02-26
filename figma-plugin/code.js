// ═══════════════════════════════════════════════════════════
// HitPay Landing Pages — Figma Plugin
// Generates E-commerce, Retail, and Nonprofits pages
// as editable Figma frames at 1440px width.
// ═══════════════════════════════════════════════════════════

// ── TAILWIND COLOR MAP (RGB fractions) ──────────────────────
const C = {
  white:      { r: 1,     g: 1,     b: 1     },
  slate50:    { r: 0.973, g: 0.980, b: 0.988 },
  slate100:   { r: 0.945, g: 0.961, b: 0.976 },
  slate200:   { r: 0.886, g: 0.910, b: 0.941 },
  slate300:   { r: 0.796, g: 0.835, b: 0.882 },
  slate400:   { r: 0.580, g: 0.639, b: 0.722 },
  slate500:   { r: 0.392, g: 0.455, b: 0.545 },
  slate600:   { r: 0.278, g: 0.333, b: 0.412 },
  slate700:   { r: 0.200, g: 0.255, b: 0.333 },
  slate800:   { r: 0.118, g: 0.161, b: 0.231 },
  slate900:   { r: 0.059, g: 0.090, b: 0.165 },
  // indigo
  indigo50:   { r: 0.933, g: 0.945, b: 1.000 },
  indigo100:  { r: 0.875, g: 0.898, b: 0.996 },
  indigo200:  { r: 0.769, g: 0.808, b: 0.988 },
  indigo600:  { r: 0.310, g: 0.275, b: 0.898 },
  indigo700:  { r: 0.263, g: 0.220, b: 0.792 },
  indigo900:  { r: 0.192, g: 0.180, b: 0.506 },
  // emerald
  emerald50:  { r: 0.925, g: 0.992, b: 0.965 },
  emerald100: { r: 0.843, g: 0.980, b: 0.941 },
  emerald500: { r: 0.063, g: 0.725, b: 0.506 },
  emerald600: { r: 0.020, g: 0.588, b: 0.412 },
  emerald700: { r: 0.016, g: 0.478, b: 0.337 },
  emerald800: { r: 0.008, g: 0.369, b: 0.263 },
  emerald300: { r: 0.463, g: 0.906, b: 0.769 },
  emerald900: { r: 0.024, g: 0.373, b: 0.275 },
  // violet
  violet50:   { r: 0.961, g: 0.933, b: 1.000 },
  violet100:  { r: 0.925, g: 0.890, b: 0.996 },
  violet200:  { r: 0.859, g: 0.800, b: 0.988 },
  violet500:  { r: 0.553, g: 0.271, b: 0.898 },
  violet600:  { r: 0.486, g: 0.227, b: 0.929 },
  violet700:  { r: 0.427, g: 0.157, b: 0.851 },
  // utility
  green100:   { r: 0.863, g: 0.988, b: 0.910 },
  green600:   { r: 0.087, g: 0.647, b: 0.290 },
  blue100:    { r: 0.851, g: 0.918, b: 0.996 },
  blue500:    { r: 0.235, g: 0.510, b: 0.965 },
  blue600:    { r: 0.149, g: 0.451, b: 0.918 },
  purple100:  { r: 0.933, g: 0.886, b: 0.996 },
  purple600:  { r: 0.580, g: 0.196, b: 0.929 },
  yellow100:  { r: 0.996, g: 0.957, b: 0.824 },
  yellow600:  { r: 0.804, g: 0.600, b: 0.020 },
  red100:     { r: 0.996, g: 0.902, b: 0.902 },
  red600:     { r: 0.859, g: 0.149, b: 0.149 },
  amber100:   { r: 0.996, g: 0.953, b: 0.824 },
  amber700:   { r: 0.757, g: 0.502, b: 0.012 },
  orange100:  { r: 1.000, g: 0.933, b: 0.878 },
  orange600:  { r: 0.914, g: 0.412, b: 0.051 },
  pink100:    { r: 1.000, g: 0.878, b: 0.933 },
};

// ── FONT WEIGHTS ────────────────────────────────────────────
const W = {
  regular:   'Regular',
  medium:    'Medium',
  semibold:  'Semi Bold',
  bold:      'Bold',
  extrabold: 'Extra Bold',
};

// ── FONT LOADER ─────────────────────────────────────────────
async function loadFonts() {
  for (const style of Object.values(W)) {
    await figma.loadFontAsync({ family: 'Inter', style });
  }
}

// ── PRIMITIVE BUILDERS ──────────────────────────────────────

/** Returns a Figma SOLID fill array */
function rgb(c) {
  return [{ type: 'SOLID', color: c }];
}

/** Creates a Rectangle node */
function mkRect(w, h, fill, radius = 0) {
  const r = figma.createRectangle();
  r.resize(w, h);
  r.fills = fill ? rgb(fill) : [];
  if (radius) r.cornerRadius = radius;
  return r;
}

/** Creates a Text node */
function mkText(content, size, weight, color, align = 'LEFT', maxW = 0) {
  const t = figma.createText();
  t.fontName = { family: 'Inter', style: weight };
  t.fontSize = size;
  t.characters = String(content);
  t.fills = color ? rgb(color) : [];
  t.textAlignHorizontal = align;
  if (maxW > 0) {
    t.textAutoResize = 'HEIGHT';
    t.resize(maxW, 50);
  } else {
    t.textAutoResize = 'WIDTH_AND_HEIGHT';
  }
  return t;
}

/** Creates a Frame — no auto-layout, absolute child positioning */
function mkFrame(name, w, h, fill = null, radius = 0) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(w, h);
  f.fills = fill ? rgb(fill) : [];
  if (radius) f.cornerRadius = radius;
  f.clipsContent = false;
  return f;
}

/** Creates an auto-layout HORIZONTAL frame */
function mkH(name, gap = 0, padH = 0, padV = 0, fill = null, radius = 0) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'HORIZONTAL';
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.itemSpacing = gap;
  f.paddingLeft = padH;
  f.paddingRight = padH;
  f.paddingTop = padV;
  f.paddingBottom = padV;
  f.fills = fill ? rgb(fill) : [];
  if (radius) f.cornerRadius = radius;
  f.clipsContent = false;
  return f;
}

/** Creates an auto-layout VERTICAL frame */
function mkV(name, gap = 0, padH = 0, padV = 0, fill = null, radius = 0) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = 'VERTICAL';
  f.primaryAxisSizingMode = 'AUTO';
  f.counterAxisSizingMode = 'AUTO';
  f.itemSpacing = gap;
  f.paddingLeft = padH;
  f.paddingRight = padH;
  f.paddingTop = padV;
  f.paddingBottom = padV;
  f.fills = fill ? rgb(fill) : [];
  if (radius) f.cornerRadius = radius;
  f.clipsContent = false;
  return f;
}

/** Creates a pill/badge */
function mkPill(label, bg, textColor, padH = 16, padV = 8, radius = 100) {
  const pill = mkH('Pill', 0, padH, padV, bg, radius);
  pill.counterAxisAlignItems = 'CENTER';
  pill.appendChild(mkText(label, 14, W.medium, textColor));
  return pill;
}

/** Creates a button */
function mkBtn(label, bg, textColor, padH = 24, padV = 14, radius = 12, outline = false) {
  const btn = mkH('Button', 0, padH, padV, bg, radius);
  btn.counterAxisAlignItems = 'CENTER';
  if (outline) {
    btn.fills = rgb(C.white);
    btn.strokes = [{ type: 'SOLID', color: C.slate300 }];
    btn.strokeWeight = 1;
    btn.strokeAlign = 'INSIDE';
  }
  btn.appendChild(mkText(label, 16, W.semibold, textColor));
  return btn;
}

/** Creates a check-bullet row */
function mkBullet(label, accentBg) {
  const row = mkH('Bullet', 12, 0, 0);
  row.counterAxisAlignItems = 'MIN';

  const dot = mkFrame('BulletDot', 20, 20, accentBg, 10);
  const check = mkRect(8, 6, C.white, 1);
  check.x = 6; check.y = 7;
  dot.appendChild(check);

  const t = mkText(label, 15, W.regular, C.slate700, 'LEFT', 440);
  t.lineHeight = { value: 22, unit: 'PIXELS' };

  row.appendChild(dot);
  row.appendChild(t);
  return row;
}

/** Creates an icon box (colored square + icon label) */
function mkIconBox(label, bg, textColor, emoji = null) {
  const box = mkV('IconBox', 4, 0, 0);
  box.counterAxisAlignItems = 'CENTER';
  const icon = mkRect(40, 40, bg, 12);
  icon.name = emoji ? emoji : 'Icon';
  box.appendChild(icon);
  if (label) box.appendChild(mkText(label, 13, W.semibold, textColor));
  return box;
}

// ── PAGE TRACKER ────────────────────────────────────────────

class Page {
  constructor(name, xOffset = 0) {
    this.f = mkFrame(name, 1440, 100, C.white);
    this.f.x = xOffset;
    this.y = 0;
  }

  /** Appends a section at the current y, then advances y. */
  add(section, height) {
    const h = height || section.height;
    section.x = 0;
    section.y = this.y;
    section.resize(1440, h);
    this.f.appendChild(section);
    this.y += h;
    this.f.resize(1440, this.y);
    return section;
  }
}

// ── SHARED SECTION BUILDERS ─────────────────────────────────

/** Navbar — 64px */
function mkNavbar(accent) {
  const nav = mkFrame('Navbar', 1440, 64, C.white);
  nav.strokes = [{ type: 'SOLID', color: C.slate200 }];
  nav.strokeWeight = 1;
  nav.strokeAlign = 'INSIDE';

  // Logo mark
  const mark = mkFrame('LogoMark', 32, 32, accent, 8);
  const markTxt = mkText('H', 14, W.bold, C.white, 'CENTER');
  markTxt.x = 10; markTxt.y = 6;
  mark.appendChild(markTxt);
  mark.x = 144; mark.y = 16;
  nav.appendChild(mark);

  // Logo text
  const logoTxt = mkText('HitPay', 18, W.bold, C.slate900);
  logoTxt.x = 184; logoTxt.y = 20;
  nav.appendChild(logoTxt);

  // Nav links
  const links = ['Products', 'Solutions', 'Pricing', 'Developers', 'Resources'];
  let lx = 296;
  links.forEach(lbl => {
    const t = mkText(lbl, 14, W.medium, C.slate600);
    t.x = lx; t.y = 22;
    nav.appendChild(t);
    lx += 90;
  });

  // Sign in
  const si = mkText('Sign in', 14, W.medium, C.slate600);
  si.x = 1192; si.y = 22;
  nav.appendChild(si);

  // CTA button
  const ctaBtn = mkBtn('Get started', accent, C.white, 16, 8, 8);
  ctaBtn.x = 1256; ctaBtn.y = 16;
  nav.appendChild(ctaBtn);

  return nav;
}

/** Trust / logo bar — 120px */
function mkTrustBar(label, items) {
  const sec = mkFrame('TrustBar', 1440, 120, C.white);
  sec.strokes = [{ type: 'SOLID', color: C.slate100 }];
  sec.strokeWeight = 1;
  sec.strokeAlign = 'INSIDE';

  const lbl = mkText(label, 12, W.medium, C.slate500, 'CENTER', 1152);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 24;
  sec.appendChild(lbl);

  let ix = 144;
  const gap = Math.floor(1152 / items.length);
  items.forEach(item => {
    const t = mkText(item, 18, W.semibold, C.slate400);
    t.x = ix + (gap / 2) - 40; t.y = 62;
    sec.appendChild(t);
    ix += gap;
  });

  return sec;
}

/** Centered intro section — 240px */
function mkIntro(h2text, ptext) {
  const sec = mkFrame('Intro', 1440, 240, C.white);

  const h2 = mkText(h2text, 36, W.bold, C.slate900, 'CENTER', 800);
  h2.lineHeight = { value: 44, unit: 'PIXELS' };
  h2.x = 320; h2.y = 60;
  sec.appendChild(h2);

  const p = mkText(ptext, 20, W.regular, C.slate600, 'CENTER', 760);
  p.lineHeight = { value: 30, unit: 'PIXELS' };
  p.x = 340; p.y = 120;
  sec.appendChild(p);

  return sec;
}

/**
 * 2-column feature section — 480px
 * opts: { label, h2, p, bullets, mockUI, bg, textSide: 'left'|'right', accent }
 */
function mkFeature(opts) {
  const { label, h2, p, bullets, mockUI, bg, textSide = 'left', accent } = opts;
  const sec = mkFrame('Feature/' + label, 1440, 480, bg);

  // Text column (x depends on side)
  const textX = textSide === 'left' ? 144 : 144 + 576 + 64;
  const mockX = textSide === 'left' ? 144 + 540 + 72 : 144;

  // Label
  const lbl = mkText(label.toUpperCase(), 12, W.semibold, accent, 'LEFT');
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = textX; lbl.y = 60;
  sec.appendChild(lbl);

  // H2
  const heading = mkText(h2, 36, W.bold, C.slate900, 'LEFT', 520);
  heading.lineHeight = { value: 44, unit: 'PIXELS' };
  heading.x = textX; heading.y = 84;
  sec.appendChild(heading);

  // Body
  const body = mkText(p, 17, W.regular, C.slate600, 'LEFT', 510);
  body.lineHeight = { value: 26, unit: 'PIXELS' };
  body.x = textX; body.y = 200;
  sec.appendChild(body);

  // Bullets
  const accentBg = accent;
  let by = 290;
  bullets.forEach(b => {
    const brow = mkBullet(b, accentBg);
    brow.x = textX; brow.y = by;
    sec.appendChild(brow);
    by += 32;
  });

  // "Learn more" link
  const link = mkText('Learn more →', 14, W.semibold, accent);
  link.x = textX; link.y = by + 8;
  sec.appendChild(link);

  // Mock UI
  if (mockUI) {
    // Centre mock UI in its column
    const mw = mockUI.width || 300;
    const mh = mockUI.height || 300;
    mockUI.x = mockX + (520 - mw) / 2;
    mockUI.y = (480 - mh) / 2;
    sec.appendChild(mockUI);
  }

  return sec;
}

/** Stats bar — 192px */
function mkStats(stats, bg, textColor, subColor) {
  const sec = mkFrame('Stats', 1440, 192, bg);
  const colW = 1152 / stats.length;
  stats.forEach((s, i) => {
    const num = mkText(s.value, 40, W.extrabold, textColor, 'CENTER', colW);
    num.x = 144 + i * colW; num.y = 52;
    sec.appendChild(num);

    const sub = mkText(s.label, 14, W.regular, subColor, 'CENTER', colW);
    sub.x = 144 + i * colW; sub.y = 104;
    sec.appendChild(sub);
  });
  return sec;
}

/** Testimonial section — 380px */
function mkTestimonial(quote, name, company, accent) {
  const sec = mkFrame('Testimonial', 1440, 380, C.white);

  // Quote mark
  const qm = mkRect(40, 40, accent, 4);
  qm.opacity = 0.2;
  qm.x = 700; qm.y = 50;
  sec.appendChild(qm);

  const quoteText = mkText(`"${quote}"`, 22, W.medium, C.slate800, 'CENTER', 800);
  quoteText.lineHeight = { value: 34, unit: 'PIXELS' };
  quoteText.x = 320; quoteText.y = 104;
  sec.appendChild(quoteText);

  // Avatar
  const avatar = mkFrame('Avatar', 48, 48, accent === C.indigo600 ? C.indigo100 : accent === C.emerald600 ? C.emerald100 : C.violet100, 24);
  const initials = mkText(name.split(' ').map(n => n[0]).join(''), 16, W.bold, accent, 'CENTER');
  initials.x = 14; initials.y = 12;
  avatar.appendChild(initials);
  avatar.x = 648; avatar.y = 294;
  sec.appendChild(avatar);

  const nameT = mkText(name, 16, W.semibold, C.slate900, 'LEFT');
  nameT.x = 708; nameT.y = 298;
  sec.appendChild(nameT);

  const companyT = mkText(company, 14, W.regular, C.slate500, 'LEFT');
  companyT.x = 708; companyT.y = 318;
  sec.appendChild(companyT);

  return sec;
}

/**
 * 3-column feature grid — 660px
 * cards: [{ icon (color name), title, desc }]
 */
function mkGrid(title, subtitle, cards) {
  const sec = mkFrame('FeatureGrid', 1440, 660, C.slate50);

  const h2 = mkText(title, 30, W.bold, C.slate900, 'CENTER', 800);
  h2.x = 320; h2.y = 60;
  sec.appendChild(h2);

  const st = mkText(subtitle, 16, W.regular, C.slate600, 'CENTER', 600);
  st.x = 420; st.y = 108;
  sec.appendChild(st);

  const colW = (1152 - 64) / 3; // 3 cols with 32px gaps
  const colors = [
    { bg: C.blue100, fg: C.blue600 },
    { bg: C.green100, fg: C.green600 },
    { bg: C.purple100, fg: C.purple600 },
    { bg: C.yellow100, fg: C.yellow600 },
    { bg: C.red100, fg: C.red600 },
    { bg: C.indigo100 || C.indigo50, fg: C.indigo600 },
  ];

  cards.forEach((card, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 144 + col * (colW + 32);
    const cy = 160 + row * 220;

    const cardFrame = mkFrame(`Card/${card.title}`, colW, 180, C.white, 16);
    cardFrame.strokes = [{ type: 'SOLID', color: C.slate200 }];
    cardFrame.strokeWeight = 1;
    cardFrame.strokeAlign = 'INSIDE';
    cardFrame.x = cx; cardFrame.y = cy;

    const iconBg = mkRect(40, 40, colors[i % colors.length].bg, 12);
    iconBg.x = 24; iconBg.y = 24;
    cardFrame.appendChild(iconBg);

    const ttl = mkText(card.title, 16, W.semibold, C.slate900, 'LEFT', colW - 48);
    ttl.x = 24; ttl.y = 80;
    cardFrame.appendChild(ttl);

    const desc = mkText(card.desc, 14, W.regular, C.slate600, 'LEFT', colW - 48);
    desc.lineHeight = { value: 20, unit: 'PIXELS' };
    desc.x = 24; desc.y = 108;
    cardFrame.appendChild(desc);

    sec.appendChild(cardFrame);
  });

  return sec;
}

/** Related use cases row — 380px */
function mkRelated(sectionTitle, items, accent) {
  const sec = mkFrame('RelatedCases', 1440, 380, C.white);

  const h2 = mkText(sectionTitle, 24, W.bold, C.slate900);
  h2.x = 144; h2.y = 48;
  sec.appendChild(h2);

  const colW = (1152 - 48) / 3;
  items.forEach((item, i) => {
    const cx = 144 + i * (colW + 24);
    const card = mkFrame(`Related/${item.title}`, colW, 220, C.white, 16);
    card.strokes = [{ type: 'SOLID', color: C.slate200 }];
    card.strokeWeight = 1;
    card.strokeAlign = 'INSIDE';
    card.x = cx; card.y = 110;

    const emoji = mkText(item.emoji, 28, W.regular, C.slate900);
    emoji.x = 24; emoji.y = 20;
    card.appendChild(emoji);

    const title = mkText(item.title, 18, W.semibold, C.slate900);
    title.x = 24; title.y = 64;
    card.appendChild(title);

    const desc = mkText(item.desc, 14, W.regular, C.slate600, 'LEFT', colW - 48);
    desc.lineHeight = { value: 20, unit: 'PIXELS' };
    desc.x = 24; desc.y = 96;
    card.appendChild(desc);

    const lnk = mkText('Learn more →', 14, W.semibold, accent);
    lnk.x = 24; lnk.y = 174;
    card.appendChild(lnk);

    sec.appendChild(card);
  });

  return sec;
}

/** CTA Banner — 300px with gradient simulation */
function mkCTA(h2text, ptext, btn1label, btn2label, accent, darkAccent) {
  const sec = mkFrame('CTABanner', 1440, 300, accent);

  const h2 = mkText(h2text, 40, W.extrabold, C.white, 'CENTER', 800);
  h2.lineHeight = { value: 48, unit: 'PIXELS' };
  h2.x = 320; h2.y = 48;
  sec.appendChild(h2);

  const p = mkText(ptext, 20, W.regular, C.white, 'CENTER', 720);
  p.lineHeight = { value: 30, unit: 'PIXELS' };
  p.opacity = 0.85;
  p.x = 360; p.y = 112;
  sec.appendChild(p);

  const b1 = mkBtn(btn1label, C.white, accent, 32, 16, 12);
  b1.x = 512; b1.y = 210;
  sec.appendChild(b1);

  const b2 = mkBtn(btn2label, null, C.white, 32, 16, 12);
  b2.fills = [];
  b2.strokes = [{ type: 'SOLID', color: C.white }];
  b2.strokeWeight = 1;
  b2.strokeAlign = 'INSIDE';
  b2.opacity = 0.7;
  b2.x = 700; b2.y = 210;
  sec.appendChild(b2);

  return sec;
}

/** Footer — 280px */
function mkFooter(accent, footerProducts, footerSolutions) {
  const sec = mkFrame('Footer', 1440, 280, C.slate900);

  // Logo
  const mark = mkFrame('LogoMark', 28, 28, accent, 8);
  const mt = mkText('H', 12, W.bold, C.white, 'CENTER');
  mt.x = 9; mt.y = 6;
  mark.appendChild(mt);
  mark.x = 144; mark.y = 40;
  sec.appendChild(mark);

  const logoTxt = mkText('HitPay', 16, W.bold, C.white);
  logoTxt.x = 180; logoTxt.y = 44;
  sec.appendChild(logoTxt);

  const tagline = mkText('All-in-one payment platform for growing\nbusinesses in Southeast Asia and beyond.', 14, W.regular, C.slate500, 'LEFT', 260);
  tagline.lineHeight = { value: 22, unit: 'PIXELS' };
  tagline.x = 144; tagline.y = 80;
  sec.appendChild(tagline);

  // Products column
  const pTitle = mkText('Products', 14, W.semibold, C.slate300);
  pTitle.x = 520; pTitle.y = 40;
  sec.appendChild(pTitle);

  footerProducts.forEach((item, i) => {
    const t = mkText(item, 14, W.regular, C.slate500);
    t.x = 520; t.y = 68 + i * 26;
    sec.appendChild(t);
  });

  // Solutions column
  const sTitle = mkText('Solutions', 14, W.semibold, C.slate300);
  sTitle.x = 720; sTitle.y = 40;
  sec.appendChild(sTitle);

  footerSolutions.forEach((item, i) => {
    const t = mkText(item, 14, W.regular, C.slate500);
    t.x = 720; t.y = 68 + i * 26;
    sec.appendChild(t);
  });

  // Company column
  const cTitle = mkText('Company', 14, W.semibold, C.slate300);
  cTitle.x = 920; cTitle.y = 40;
  sec.appendChild(cTitle);

  ['About', 'Blog', 'Pricing', 'Contact'].forEach((item, i) => {
    const t = mkText(item, 14, W.regular, C.slate500);
    t.x = 920; t.y = 68 + i * 26;
    sec.appendChild(t);
  });

  // Divider
  const div = mkRect(1152, 1, C.slate800);
  div.x = 144; div.y = 234;
  sec.appendChild(div);

  const copy = mkText('© 2025 HitPay Payment Solutions Pte. Ltd. All rights reserved.', 13, W.regular, C.slate600);
  copy.x = 144; copy.y = 250;
  sec.appendChild(copy);

  const links = mkText('Privacy   Terms   Security', 13, W.regular, C.slate600, 'RIGHT', 280);
  links.x = 1016; links.y = 250;
  sec.appendChild(links);

  return sec;
}

// ── MOCK UI BUILDERS ─────────────────────────────────────────

/** Mock checkout card (e-commerce hero) */
function mockCheckout() {
  const card = mkFrame('MockCheckout', 300, 280, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.10 },
    offset: { x: 0, y: 20 },
    radius: 50,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];

  const orderLabel = mkText('Your order total', 13, W.regular, C.slate500);
  orderLabel.x = 20; orderLabel.y = 20;
  card.appendChild(orderLabel);

  const secure = mkRect(100, 22, C.green100, 4);
  secure.x = 180; secure.y = 18;
  card.appendChild(secure);
  const secureT = mkText('Secure checkout', 11, W.medium, C.green600);
  secureT.x = 187; secureT.y = 22;
  card.appendChild(secureT);

  const amount = mkText('S$248.00', 32, W.bold, C.slate900);
  amount.x = 20; amount.y = 48;
  card.appendChild(amount);

  const items = mkText('Sneakers + 2 items', 13, W.regular, C.slate500);
  items.x = 20; items.y = 88;
  card.appendChild(items);

  const cardField = mkRect(260, 42, C.slate50, 8);
  cardField.strokes = [{ type: 'SOLID', color: C.slate200 }];
  cardField.strokeWeight = 1.5;
  cardField.strokeAlign = 'INSIDE';
  cardField.x = 20; cardField.y = 116;
  card.appendChild(cardField);
  const cardNum = mkText('•••• •••• •••• 4242', 14, W.regular, C.slate400);
  cardNum.x = 34; cardNum.y = 128;
  card.appendChild(cardNum);

  const expField = mkRect(124, 38, C.slate50, 8);
  expField.x = 20; expField.y = 166;
  card.appendChild(expField);
  const expT = mkText('12 / 27', 13, W.regular, C.slate400);
  expT.x = 34; expT.y = 178;
  card.appendChild(expT);

  const cvvField = mkRect(124, 38, C.slate50, 8);
  cvvField.x = 156; cvvField.y = 166;
  card.appendChild(cvvField);
  const cvvT = mkText('•••', 13, W.regular, C.slate400);
  cvvT.x = 210; cvvT.y = 178;
  card.appendChild(cvvT);

  const payBtn = mkRect(260, 44, C.indigo600, 8);
  payBtn.x = 20; payBtn.y = 214;
  card.appendChild(payBtn);
  const payT = mkText('Pay S$248.00', 15, W.semibold, C.white, 'CENTER', 260);
  payT.x = 20; payT.y = 224;
  card.appendChild(payT);

  const badges = ['PayNow', 'GrabPay', 'Atome'];
  badges.forEach((b, i) => {
    const bg = mkRect(66, 24, C.white, 6);
    bg.strokes = [{ type: 'SOLID', color: C.slate200 }];
    bg.strokeWeight = 1;
    bg.strokeAlign = 'INSIDE';
    bg.x = 20 + i * 80; bg.y = 268;
    card.appendChild(bg);
    const bt = mkText(b, 11, W.medium, C.slate700);
    bt.x = 27 + i * 80; bt.y = 272;
    card.appendChild(bt);
  });

  card.resize(300, 300);
  return card;
}

/** Mock integration grid */
function mockIntegrations() {
  const card = mkFrame('MockIntegrations', 300, 280, null);

  const platforms = [
    { name: 'Shopify', emoji: '🛍️', status: '● Connected', statusColor: C.green600 },
    { name: 'WooCommerce', emoji: '🔷', status: 'Click to add', statusColor: C.slate400 },
    { name: 'Wix', emoji: '🌐', status: 'Click to add', statusColor: C.slate400 },
    { name: 'API', emoji: '⚡', status: 'Custom build', statusColor: C.slate400 },
  ];

  platforms.forEach((pl, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const px = col * 144;
    const py = row * 144;

    const pCard = mkFrame(`Platform/${pl.name}`, 132, 130, C.white, 16);
    pCard.strokes = [{ type: 'SOLID', color: C.slate200 }];
    pCard.strokeWeight = 1;
    pCard.strokeAlign = 'INSIDE';
    pCard.x = px; pCard.y = py;

    const em = mkText(pl.emoji, 24, W.regular, C.slate900, 'CENTER', 132);
    em.x = 0; em.y = 22;
    pCard.appendChild(em);

    const nm = mkText(pl.name, 13, W.semibold, C.slate900, 'CENTER', 132);
    nm.x = 0; nm.y = 58;
    pCard.appendChild(nm);

    const st = mkText(pl.status, 12, W.medium, pl.statusColor, 'CENTER', 132);
    st.x = 0; st.y = 80;
    pCard.appendChild(st);

    card.appendChild(pCard);
  });

  card.resize(290, 290);
  return card;
}

/** Mock payment link card */
function mockPaymentLink() {
  const card = mkFrame('MockPaymentLink', 270, 320, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.10 },
    offset: { x: 0, y: 16 },
    radius: 40,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  card.clipsContent = true;

  const header = mkRect(270, 70, C.indigo600);
  header.x = 0; header.y = 0;
  card.appendChild(header);

  const url = mkText('hitpay.me/yourstore', 11, W.medium, C.white);
  url.opacity = 0.7;
  url.x = 16; url.y = 12;
  card.appendChild(url);

  const prodName = mkText('Lemongrass Tote Bag', 18, W.bold, C.white, 'LEFT', 238);
  prodName.x = 16; prodName.y = 30;
  card.appendChild(prodName);

  const imgBg = mkRect(238, 100, C.slate100, 12);
  imgBg.x = 16; imgBg.y = 84;
  card.appendChild(imgBg);

  const imgEmoji = mkText('👜', 32, W.regular, C.slate900, 'CENTER', 238);
  imgEmoji.x = 16; imgEmoji.y = 110;
  card.appendChild(imgEmoji);

  const descT = mkText('Handwoven from sustainable materials.\nShips in 3–5 business days.', 13, W.regular, C.slate600, 'LEFT', 238);
  descT.lineHeight = { value: 20, unit: 'PIXELS' };
  descT.x = 16; descT.y = 196;
  card.appendChild(descT);

  const buyBtn = mkRect(238, 40, C.indigo600, 8);
  buyBtn.x = 16; buyBtn.y = 248;
  card.appendChild(buyBtn);
  const buyT = mkText('Buy now — S$65.00', 14, W.semibold, C.white, 'CENTER', 238);
  buyT.x = 16; buyT.y = 258;
  card.appendChild(buyT);

  return card;
}

/** Mock subscription cards */
function mockSubscriptions() {
  const card = mkFrame('MockSubscriptions', 290, 300, null);

  const subs = [
    { title: 'Monthly Subscription', sub: 'Coffee Bean Club', amount: 'S$28/mo', status: '● Active', statusColor: C.green600, border: C.slate200 },
    { title: 'Annual Plan', sub: 'Skincare Ritual Box', amount: 'S$199/yr', status: '● Active', statusColor: C.green600, border: C.slate200 },
    { title: 'New subscriber', sub: 'Just signed up · @weiming', amount: 'S$28/mo', status: '● Just now', statusColor: C.indigo600, border: C.indigo200 },
  ];

  subs.forEach((s, i) => {
    const row = mkFrame(`Sub/${s.title}`, 290, 68, C.white, 12);
    row.strokes = [{ type: 'SOLID', color: s.border }];
    row.strokeWeight = s.border === C.indigo200 ? 2 : 1;
    row.strokeAlign = 'INSIDE';
    row.x = 0; row.y = i * 76;

    const ttl = mkText(s.title, 14, W.semibold, s.border === C.indigo200 ? C.indigo700 : C.slate900, 'LEFT', 160);
    ttl.x = 16; ttl.y = 10;
    row.appendChild(ttl);

    const sub = mkText(s.sub, 12, W.regular, C.slate500, 'LEFT', 160);
    sub.x = 16; sub.y = 32;
    row.appendChild(sub);

    const amt = mkText(s.amount, 14, W.bold, C.slate900, 'RIGHT', 100);
    amt.x = 174; amt.y = 10;
    row.appendChild(amt);

    const st = mkText(s.status, 12, W.medium, s.statusColor, 'RIGHT', 100);
    st.x = 174; st.y = 32;
    row.appendChild(st);

    card.appendChild(row);
  });

  // MRR
  const mrrBg = mkRect(290, 72, C.slate50, 12);
  mrrBg.x = 0; mrrBg.y = 232;
  card.appendChild(mrrBg);

  const mrrLabel = mkText('Monthly Recurring Revenue', 12, W.regular, C.slate500);
  mrrLabel.x = 16; mrrLabel.y = 244;
  card.appendChild(mrrLabel);

  const mrrAmt = mkText('S$12,840', 24, W.bold, C.slate900);
  mrrAmt.x = 16; mrrAmt.y = 264;
  card.appendChild(mrrAmt);

  const mrrUp = mkText('↑ 14% this month', 12, W.medium, C.green600);
  mrrUp.x = 148; mrrUp.y = 272;
  card.appendChild(mrrUp);

  return card;
}

/** Mock POS terminal (retail hero) */
function mockPOS() {
  const card = mkFrame('MockPOS', 290, 280, C.slate900, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.25 },
    offset: { x: 0, y: 20 },
    radius: 50,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];

  const posTitle = mkText('HitPay POS', 14, W.semibold, C.white);
  posTitle.x = 20; posTitle.y = 20;
  card.appendChild(posTitle);

  const online = mkText('● Online', 12, W.medium, C.emerald500);
  online.x = 210; online.y = 22;
  card.appendChild(online);

  const items = [
    { name: 'Linen Tote Bag', price: 'S$45.00', dim: false },
    { name: 'Soy Candle — Cedar', price: 'S$28.00', dim: false },
    { name: 'Washi Tape Set × 2', price: 'S$18.00', dim: true },
  ];

  items.forEach((item, i) => {
    const row = mkRect(250, 36, C.slate800, 8);
    row.x = 20; row.y = 52 + i * 44;
    card.appendChild(row);

    const nt = mkText(item.name, 13, W.regular, item.dim ? C.slate400 : C.white, 'LEFT', 130);
    nt.x = 32; nt.y = 62 + i * 44;
    card.appendChild(nt);

    const pt = mkText(item.price, 13, W.medium, item.dim ? C.slate400 : C.white, 'RIGHT', 80);
    pt.x = 186; pt.y = 62 + i * 44;
    card.appendChild(pt);
  });

  const divider = mkRect(250, 1, C.slate700);
  divider.x = 20; divider.y = 186;
  card.appendChild(divider);

  const totalL = mkText('Total', 13, W.regular, C.slate400);
  totalL.x = 20; totalL.y = 196;
  card.appendChild(totalL);

  const totalA = mkText('S$91.00', 22, W.bold, C.white, 'RIGHT', 120);
  totalA.x = 150; totalA.y = 192;
  card.appendChild(totalA);

  const payBtn = mkRect(250, 40, C.emerald500, 12);
  payBtn.x = 20; payBtn.y = 226;
  card.appendChild(payBtn);
  const payT = mkText('Charge S$91.00', 14, W.semibold, C.white, 'CENTER', 250);
  payT.x = 20; payT.y = 237;
  card.appendChild(payT);

  return card;
}

/** Mock POS daily dashboard */
function mockPOSDashboard() {
  const card = mkFrame('MockPOSDashboard', 300, 290, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 12 },
    radius: 30,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  card.clipsContent = true;

  const headerBg = mkRect(300, 90, C.emerald600);
  headerBg.x = 0; headerBg.y = 0;
  card.appendChild(headerBg);

  const headerTitle = mkText('Today\'s Sales', 14, W.semibold, C.white);
  headerTitle.x = 20; headerTitle.y = 14;
  card.appendChild(headerTitle);

  const date = mkText('Tue 24 Feb', 12, W.regular, C.emerald200);
  date.x = 220; date.y = 16;
  card.appendChild(date);

  const total = mkText('S$3,241.50', 28, W.bold, C.white);
  total.x = 20; total.y = 40;
  card.appendChild(total);

  const pct = mkText('↑ 12% vs last Tuesday', 12, W.regular, C.emerald200);
  pct.x = 20; pct.y = 72;
  card.appendChild(pct);

  const subTitle = mkText('TOP SELLERS TODAY', 11, W.semibold, C.slate500);
  subTitle.letterSpacing = { value: 1, unit: 'PIXELS' };
  subTitle.x = 20; subTitle.y = 106;
  card.appendChild(subTitle);

  const sellers = [
    { emoji: '👜', name: 'Canvas Tote', count: '14 sold', amount: 'S$630', color: C.pink100 },
    { emoji: '🕯️', name: 'Soy Candles', count: '22 sold', amount: 'S$484', color: C.yellow100 },
    { emoji: '📔', name: 'Journal Pad', count: '31 sold', amount: 'S$372', color: C.blue100 },
  ];

  sellers.forEach((s, i) => {
    const y = 130 + i * 52;

    const iconBg = mkRect(32, 32, s.color, 8);
    iconBg.x = 20; iconBg.y = y;
    card.appendChild(iconBg);

    const em = mkText(s.emoji, 14, W.regular, C.slate900);
    em.x = 27; em.y = y + 6;
    card.appendChild(em);

    const nm = mkText(s.name, 14, W.medium, C.slate900);
    nm.x = 60; nm.y = y + 2;
    card.appendChild(nm);

    const cnt = mkText(s.count, 12, W.regular, C.slate400);
    cnt.x = 60; cnt.y = y + 20;
    card.appendChild(cnt);

    const amt = mkText(s.amount, 14, W.semibold, C.slate900, 'RIGHT', 70);
    amt.x = 210; amt.y = y + 6;
    card.appendChild(amt);
  });

  return card;
}

/** Mock Tap to Pay screen */
function mockTapToPay() {
  const card = mkFrame('MockTapToPay', 250, 260, C.slate900, 24);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.20 },
    offset: { x: 0, y: 16 },
    radius: 40,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];

  const screenBg = mkRect(210, 160, C.slate800, 16);
  screenBg.x = 20; screenBg.y = 20;
  card.appendChild(screenBg);

  const hint = mkText('Hold card or device to pay', 11, W.regular, C.slate400);
  hint.x = 32; hint.y = 32;
  card.appendChild(hint);

  const amt = mkText('S$124.00', 22, W.bold, C.white);
  amt.x = 32; amt.y = 50;
  card.appendChild(amt);

  // NFC rings
  const ring1 = mkFrame('NFC', 64, 64, null, 32);
  ring1.strokes = [{ type: 'SOLID', color: C.emerald500 }];
  ring1.strokeWeight = 3;
  ring1.strokeAlign = 'INSIDE';
  ring1.x = 93; ring1.y = 88;
  card.appendChild(ring1);

  const ring2 = mkFrame('NFCInner', 40, 40, null, 20);
  ring2.strokes = [{ type: 'SOLID', color: C.emerald500 }];
  ring2.strokeWeight = 2;
  ring2.strokeAlign = 'INSIDE';
  ring2.x = 105; ring2.y = 100;
  card.appendChild(ring2);

  const ready = mkText('● Ready to accept', 13, W.medium, C.emerald500, 'CENTER', 210);
  ready.x = 20; ready.y = 196;
  card.appendChild(ready);

  // Badge
  const badgeBg = mkRect(140, 28, C.emerald500, 100);
  badgeBg.x = 55; badgeBg.y = 228;
  card.appendChild(badgeBg);
  const badgeT = mkText('No terminal needed!', 12, W.bold, C.white, 'CENTER', 140);
  badgeT.x = 55; badgeT.y = 236;
  card.appendChild(badgeT);

  return card;
}

/** Mock omnichannel dashboard */
function mockOmnichannel() {
  const card = mkFrame('MockOmnichannel', 300, 270, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 12 },
    radius: 30,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  card.strokes = [{ type: 'SOLID', color: C.slate200 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';

  const title = mkText('Unified Revenue — Feb 2025', 13, W.semibold, C.slate500);
  title.x = 20; title.y = 20;
  card.appendChild(title);

  const channels = [
    { label: '🏪 In-store', amount: 'S$28,410', pct: 0.65, barColor: C.emerald500 },
    { label: '🌐 Online Store', amount: 'S$14,230', pct: 0.33, barColor: C.blue500 },
    { label: '🔗 Payment Links', amount: 'S$3,840', pct: 0.09, barColor: C.violet500 },
  ];

  channels.forEach((ch, i) => {
    const y = 50 + i * 64;

    const lbl = mkText(ch.label, 13, W.medium, C.slate700);
    lbl.x = 20; lbl.y = y;
    card.appendChild(lbl);

    const amt = mkText(ch.amount, 13, W.bold, C.slate900, 'RIGHT', 100);
    amt.x = 180; amt.y = y;
    card.appendChild(amt);

    const trackBg = mkRect(260, 10, C.slate100, 5);
    trackBg.x = 20; trackBg.y = y + 22;
    card.appendChild(trackBg);

    const fill = mkRect(Math.round(260 * ch.pct), 10, ch.barColor, 5);
    fill.x = 20; fill.y = y + 22;
    card.appendChild(fill);
  });

  const divider = mkRect(260, 1, C.slate100);
  divider.x = 20; divider.y = 232;
  card.appendChild(divider);

  const totalL = mkText('Total Revenue', 13, W.regular, C.slate500);
  totalL.x = 20; totalL.y = 244;
  card.appendChild(totalL);

  const totalA = mkText('S$46,480', 18, W.bold, C.slate900, 'RIGHT', 130);
  totalA.x = 150; totalA.y = 240;
  card.appendChild(totalA);

  return card;
}

/** Mock donation form (nonprofits hero) */
function mockDonation() {
  const card = mkFrame('MockDonation', 310, 320, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.10 },
    offset: { x: 0, y: 16 },
    radius: 40,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];

  const headerBg = mkRect(310, 72, C.violet600);
  headerBg.x = 0; headerBg.y = 0;
  card.appendChild(headerBg);

  const orgName = mkText('Animal Allies Singapore', 13, W.semibold, C.white);
  orgName.opacity = 0.8;
  orgName.x = 20; orgName.y = 14;
  card.appendChild(orgName);

  const headingT = mkText('Support our rescue mission', 16, W.bold, C.white);
  headingT.x = 20; headingT.y = 36;
  card.appendChild(headingT);

  const amtLabel = mkText('Choose an amount', 12, W.semibold, C.slate500);
  amtLabel.x = 20; amtLabel.y = 88;
  card.appendChild(amtLabel);

  const amts = ['S$10', 'S$25', 'S$50', 'S$100'];
  amts.forEach((a, i) => {
    const selected = i === 1;
    const btnBg = mkRect(58, 32, selected ? C.violet600 : C.white, 8);
    if (!selected) {
      btnBg.strokes = [{ type: 'SOLID', color: C.slate200 }];
      btnBg.strokeWeight = 1;
      btnBg.strokeAlign = 'INSIDE';
    }
    btnBg.x = 20 + i * 70; btnBg.y = 108;
    card.appendChild(btnBg);

    const at = mkText(a, 13, W.semibold, selected ? C.white : C.slate700, 'CENTER', 58);
    at.x = 20 + i * 70; at.y = 117;
    card.appendChild(at);
  });

  const msgLabel = mkText('Leave a note (optional)', 12, W.semibold, C.slate500);
  msgLabel.x = 20; msgLabel.y = 156;
  card.appendChild(msgLabel);

  const msgBg = mkRect(270, 50, C.slate50, 8);
  msgBg.strokes = [{ type: 'SOLID', color: C.slate200 }];
  msgBg.strokeWeight = 1;
  msgBg.strokeAlign = 'INSIDE';
  msgBg.x = 20; msgBg.y = 174;
  card.appendChild(msgBg);
  const msgT = mkText('Keep up the great work!', 13, W.regular, C.slate400);
  msgT.x = 32; msgT.y = 188;
  card.appendChild(msgT);

  const donateBtn = mkRect(270, 44, C.violet600, 10);
  donateBtn.x = 20; donateBtn.y = 236;
  card.appendChild(donateBtn);
  const donateT = mkText('Donate S$25.00', 15, W.semibold, C.white, 'CENTER', 270);
  donateT.x = 20; donateT.y = 248;
  card.appendChild(donateT);

  const goalBg = mkRect(270, 50, C.white, 8);
  goalBg.strokes = [{ type: 'SOLID', color: C.slate100 }];
  goalBg.strokeWeight = 1;
  goalBg.strokeAlign = 'INSIDE';
  goalBg.x = 20; goalBg.y = 292;
  card.appendChild(goalBg);

  const goalLabel = mkText('Today\'s donations', 11, W.regular, C.slate500);
  goalLabel.x = 32; goalLabel.y = 300;
  card.appendChild(goalLabel);

  const goalAmt = mkText('S$1,840', 20, W.bold, C.slate900);
  goalAmt.x = 32; goalAmt.y = 316;
  card.appendChild(goalAmt);

  const pct = mkText('↑ 34 donors', 11, W.medium, C.green600);
  pct.x = 190; pct.y = 302;
  card.appendChild(pct);

  const track = mkRect(206, 6, C.slate100, 3);
  track.x = 32; track.y = 336;
  card.appendChild(track);

  const bar = mkRect(150, 6, C.violet500, 3);
  bar.x = 32; bar.y = 336;
  card.appendChild(bar);

  card.resize(310, 350);
  return card;
}

/** Mock recurring donors list */
function mockRecurringDonors() {
  const card = mkFrame('MockRecurringDonors', 300, 290, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 12 },
    radius: 30,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  card.strokes = [{ type: 'SOLID', color: C.slate200 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';

  const title = mkText('Monthly Donors', 15, W.semibold, C.slate900);
  title.x = 20; title.y = 20;
  card.appendChild(title);

  const badge = mkRect(100, 24, C.violet50, 8);
  badge.x = 180; badge.y = 18;
  card.appendChild(badge);
  const badgeT = mkText('February 2025', 11, W.medium, C.violet600, 'CENTER', 100);
  badgeT.x = 180; badgeT.y = 24;
  card.appendChild(badgeT);

  const donors = [
    { initials: 'RK', name: 'Rahul K.', since: 'Monthly — since Jan 2024', amt: 'S$50/mo', bg: C.orange100, fg: C.orange600 },
    { initials: 'MT', name: 'Michelle T.', since: 'Monthly — since Mar 2024', amt: 'S$25/mo', bg: C.blue100, fg: C.blue600 },
    { initials: 'AL', name: 'Andrew L.', since: 'Annual — since Nov 2023', amt: 'S$200/yr', bg: C.green100, fg: C.green600 },
  ];

  donors.forEach((d, i) => {
    const y = 56 + i * 52;

    const avatar = mkFrame(`Avatar/${d.initials}`, 32, 32, d.bg, 16);
    const init = mkText(d.initials, 12, W.bold, d.fg, 'CENTER', 32);
    init.x = 0; init.y = 8;
    avatar.appendChild(init);
    avatar.x = 20; avatar.y = y;
    card.appendChild(avatar);

    const nm = mkText(d.name, 13, W.medium, C.slate900);
    nm.x = 60; nm.y = y + 2;
    card.appendChild(nm);

    const sn = mkText(d.since, 11, W.regular, C.slate500);
    sn.x = 60; sn.y = y + 18;
    card.appendChild(sn);

    const amt = mkText(d.amt, 13, W.bold, C.slate900, 'RIGHT', 80);
    amt.x = 200; amt.y = y + 6;
    card.appendChild(amt);
  });

  const mrdBg = mkRect(260, 52, C.slate50, 10);
  mrdBg.x = 20; mrdBg.y = 220;
  card.appendChild(mrdBg);

  const mrdL = mkText('Monthly Recurring Donations', 11, W.regular, C.slate500);
  mrdL.x = 32; mrdL.y = 228;
  card.appendChild(mrdL);

  const mrdA = mkText('S$4,320', 22, W.bold, C.slate900);
  mrdA.x = 32; mrdA.y = 244;
  card.appendChild(mrdA);

  const mrdUp = mkText('↑ 8 new recurring donors this month', 11, W.medium, C.green600);
  mrdUp.x = 150; mrdUp.y = 252;
  card.appendChild(mrdUp);

  return card;
}

/** Mock QR code card */
function mockQR() {
  const card = mkFrame('MockQRCode', 250, 260, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 12 },
    radius: 30,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  card.strokes = [{ type: 'SOLID', color: C.slate200 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';

  const scanT = mkText('Scan to donate', 14, W.semibold, C.slate900, 'CENTER', 210);
  scanT.x = 20; scanT.y = 20;
  card.appendChild(scanT);

  const subT = mkText('Support our year-end campaign', 12, W.regular, C.slate500, 'CENTER', 210);
  subT.x = 20; subT.y = 42;
  card.appendChild(subT);

  // QR simulation with grid of rectangles
  const qrBg = mkRect(140, 140, C.slate900, 12);
  qrBg.x = 55; qrBg.y = 64;
  card.appendChild(qrBg);

  // Corner squares
  const tl = mkRect(36, 36, C.white, 4);
  tl.x = 63; tl.y = 72;
  card.appendChild(tl);
  const tlInner = mkRect(24, 24, C.slate900, 2);
  tlInner.x = 69; tlInner.y = 78;
  card.appendChild(tlInner);

  const tr = mkRect(36, 36, C.white, 4);
  tr.x = 143; tr.y = 72;
  card.appendChild(tr);
  const trInner = mkRect(24, 24, C.slate900, 2);
  trInner.x = 149; trInner.y = 78;
  card.appendChild(trInner);

  const bl = mkRect(36, 36, C.white, 4);
  bl.x = 63; bl.y = 152;
  card.appendChild(bl);
  const blInner = mkRect(24, 24, C.slate900, 2);
  blInner.x = 69; blInner.y = 158;
  card.appendChild(blInner);

  // Data cells (simplified)
  const dataCells = [
    [108, 80], [122, 80], [108, 94], [130, 108], [108, 122],
    [122, 136], [130, 150], [143, 136], [156, 122], [156, 94],
  ];
  dataCells.forEach(([dx, dy]) => {
    const cell = mkRect(10, 10, C.white, 1);
    cell.x = dx; cell.y = dy;
    card.appendChild(cell);
  });

  const methodT = mkText('PayNow · Card · GrabPay', 11, W.regular, C.slate400, 'CENTER', 210);
  methodT.x = 20; methodT.y = 214;
  card.appendChild(methodT);

  const hitpayBtn = mkRect(210, 28, C.violet600, 8);
  hitpayBtn.x = 20; hitpayBtn.y = 234;
  card.appendChild(hitpayBtn);
  const hpT = mkText('HitPay · hitpay.me/awss', 12, W.semibold, C.white, 'CENTER', 210);
  hpT.x = 20; hpT.y = 242;
  card.appendChild(hpT);

  // Floating badge
  const floatBg = mkRect(140, 28, C.violet500, 100);
  floatBg.x = 145; floatBg.y = 250;
  card.appendChild(floatBg);
  const floatT = mkText('Print & display anywhere!', 11, W.bold, C.white, 'CENTER', 140);
  floatT.x = 145; floatT.y = 258;
  card.appendChild(floatT);

  return card;
}

/** Mock invoice card */
function mockInvoice() {
  const card = mkFrame('MockInvoice', 300, 270, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 12 },
    radius: 30,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  card.strokes = [{ type: 'SOLID', color: C.slate200 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';

  const invNum = mkText('Invoice #1042', 18, W.bold, C.slate900);
  invNum.x = 20; invNum.y = 20;
  card.appendChild(invNum);

  const issued = mkText('Issued 20 Feb 2025', 12, W.regular, C.slate500);
  issued.x = 20; issued.y = 44;
  card.appendChild(issued);

  const dueBg = mkRect(110, 26, C.amber100, 100);
  dueBg.x = 170; dueBg.y = 18;
  card.appendChild(dueBg);
  const dueT = mkText('Due in 14 days', 12, W.bold, C.amber700, 'CENTER', 110);
  dueT.x = 170; dueT.y = 24;
  card.appendChild(dueT);

  const billBg = mkRect(260, 70, null, 12);
  billBg.strokes = [{ type: 'SOLID', color: C.slate100 }];
  billBg.strokeWeight = 1;
  billBg.strokeAlign = 'INSIDE';
  billBg.fills = [];
  billBg.x = 20; billBg.y = 76;
  card.appendChild(billBg);

  const billHeader = mkRect(260, 24, C.slate50, 0);
  billHeader.x = 20; billHeader.y = 76;
  card.appendChild(billHeader);

  const billLbl = mkText('BILL TO', 10, W.semibold, C.slate500);
  billLbl.letterSpacing = { value: 1, unit: 'PIXELS' };
  billLbl.x = 32; billLbl.y = 82;
  card.appendChild(billLbl);

  const clientName = mkText('Temasek Foundation', 13, W.semibold, C.slate900);
  clientName.x = 32; clientName.y = 106;
  card.appendChild(clientName);

  const clientDesc = mkText('Sponsorship: Community Meals Programme Q1', 12, W.regular, C.slate500);
  clientDesc.x = 32; clientDesc.y = 124;
  card.appendChild(clientDesc);

  // Line items
  [
    { desc: 'Programme delivery fee', amt: 'S$3,000.00' },
    { desc: 'Volunteer coordination', amt: 'S$500.00' },
  ].forEach((li, i) => {
    const y = 160 + i * 28;
    const descT = mkText(li.desc, 13, W.regular, C.slate700, 'LEFT', 180);
    descT.x = 20; descT.y = y;
    card.appendChild(descT);
    const amtT = mkText(li.amt, 13, W.semibold, C.slate900, 'RIGHT', 100);
    amtT.x = 180; amtT.y = y;
    card.appendChild(amtT);
  });

  const divider = mkRect(260, 1, C.slate100);
  divider.x = 20; divider.y = 220;
  card.appendChild(divider);

  const totalL = mkText('Total', 14, W.semibold, C.slate900);
  totalL.x = 20; totalL.y = 232;
  card.appendChild(totalL);

  const totalA = mkText('S$3,500.00', 16, W.bold, C.violet600, 'RIGHT', 120);
  totalA.x = 160; totalA.y = 230;
  card.appendChild(totalA);

  return card;
}

// ── HERO BUILDERS ────────────────────────────────────────────

function mkHeroEcommerce() {
  const sec = mkFrame('Hero', 1440, 560, { r: 0.973, g: 0.969, b: 1.0 });

  const badge = mkPill('E-commerce Payments', C.indigo50, C.indigo600, 16, 8, 100);
  badge.x = 144; badge.y = 80;
  sec.appendChild(badge);

  const h1 = mkText('The payment platform\nbuilt for e-commerce', 56, W.extrabold, C.slate900, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 126;
  sec.appendChild(h1);

  const sub = mkText('Accept PayNow, cards, GrabPay, and 700+ digital wallets. Integrate with Shopify, WooCommerce, and more. No monthly fees — ever.', 20, W.regular, C.slate600, 'LEFT', 540);
  sub.lineHeight = { value: 30, unit: 'PIXELS' };
  sub.x = 144; sub.y = 280;
  sec.appendChild(sub);

  const b1 = mkBtn('Start for free', C.indigo600, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 374;
  sec.appendChild(b1);

  const b2 = mkBtn('Contact sales', null, C.slate800, 24, 14, 12, true);
  b2.x = 296; b2.y = 374;
  sec.appendChild(b2);

  const fine = mkText('Free to sign up · No setup fees · Pay per transaction', 14, W.regular, C.slate500);
  fine.x = 144; fine.y = 428;
  sec.appendChild(fine);

  const checkout = mockCheckout();
  checkout.x = 900; checkout.y = 130;
  sec.appendChild(checkout);

  return sec;
}

function mkHeroRetail() {
  const sec = mkFrame('Hero', 1440, 560, { r: 0.941, g: 0.992, b: 0.965 });

  const badge = mkPill('Retail', C.emerald50, C.emerald600, 16, 8, 100);
  badge.x = 144; badge.y = 80;
  sec.appendChild(badge);

  const h1 = mkText('Modern payments for\nretail, online and in-store', 56, W.extrabold, C.slate900, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 126;
  sec.appendChild(h1);

  const sub = mkText('Connect your physical store and online sales on one platform. HitPay\'s POS, card terminals, and Tap to Pay work together so your customers always get a seamless experience.', 20, W.regular, C.slate600, 'LEFT', 540);
  sub.lineHeight = { value: 30, unit: 'PIXELS' };
  sub.x = 144; sub.y = 290;
  sec.appendChild(sub);

  const b1 = mkBtn('Start for free', C.emerald600, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 392;
  sec.appendChild(b1);

  const b2 = mkBtn('Request a demo', null, C.slate800, 24, 14, 12, true);
  b2.x = 306; b2.y = 392;
  sec.appendChild(b2);

  const fine = mkText('Free to sign up · No monthly subscription · Pay per transaction', 14, W.regular, C.slate500);
  fine.x = 144; fine.y = 446;
  sec.appendChild(fine);

  const pos = mockPOS();
  pos.x = 920; pos.y = 140;
  sec.appendChild(pos);

  return sec;
}

function mkHeroNonprofits() {
  const sec = mkFrame('Hero', 1440, 560, { r: 0.992, g: 0.957, b: 1.0 });

  const badge = mkPill('Nonprofits & Charities', C.violet50, C.violet600, 16, 8, 100);
  badge.x = 144; badge.y = 80;
  sec.appendChild(badge);

  const h1 = mkText('Accept donations.\nGrow your mission.', 56, W.extrabold, C.slate900, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 126;
  sec.appendChild(h1);

  const sub = mkText('HitPay helps nonprofits, charities, and social enterprises accept online donations, run fundraising events, and grow recurring giving — with zero monthly fees.', 20, W.regular, C.slate600, 'LEFT', 540);
  sub.lineHeight = { value: 30, unit: 'PIXELS' };
  sub.x = 144; sub.y = 278;
  sec.appendChild(sub);

  const b1 = mkBtn('Start for free', C.violet600, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 390;
  sec.appendChild(b1);

  const b2 = mkBtn('See how it works', null, C.slate800, 24, 14, 12, true);
  b2.x = 306; b2.y = 390;
  sec.appendChild(b2);

  const fine = mkText('Free to sign up · No setup fees · Pay per transaction', 14, W.regular, C.slate500);
  fine.x = 144; fine.y = 444;
  sec.appendChild(fine);

  const donation = mockDonation();
  donation.x = 890; donation.y = 105;
  sec.appendChild(donation);

  return sec;
}

// ── PAGE BUILDERS ────────────────────────────────────────────

function buildEcommerce() {
  const page = new Page('E-commerce Landing Page', 0);
  const ac = C.indigo600;

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroEcommerce(), 560);
  page.add(mkTrustBar(
    'TRUSTED BY THOUSANDS OF E-COMMERCE BUSINESSES',
    ['Shopify', 'WooCommerce', 'Wix', 'Magento', 'OpenCart', 'PrestaShop']
  ), 120);
  page.add(mkIntro(
    'Everything you need to sell online',
    'HitPay handles checkout, payment methods, subscriptions, and more — so you can focus on growing your store, not managing payments.'
  ), 240);

  // Feature 1: Checkout (slate-50 bg, text left)
  page.add(mkFeature({
    label: 'Checkout',
    h2: 'Accept the payment methods your customers actually use',
    p: 'HitPay\'s checkout supports the full range of local and global payment methods — from PayNow and GrabPay in Singapore to cards and digital wallets worldwide. Fewer abandoned carts. More completed sales.',
    bullets: [
      'PayNow, GrabPay, ShopeePay, FavePay, and 700+ wallets',
      'Visa, Mastercard, Amex — Apple Pay & Google Pay ready',
      'Buy Now Pay Later with Atome for higher average order values',
      'Mobile-optimised checkout that works on any device',
    ],
    mockUI: mockCheckout(),
    bg: C.slate50,
    textSide: 'left',
    accent: ac,
  }), 480);

  // Feature 2: Integrations (white bg, text right)
  page.add(mkFeature({
    label: 'Integrations',
    h2: 'Works with the tools you already use',
    p: 'Add HitPay to your existing Shopify, WooCommerce, Wix, or Magento store in minutes with our pre-built plugins. Or build something custom with our developer-friendly APIs.',
    bullets: [
      'One-click plugin installation for all major platforms',
      'RESTful API and webhooks for custom storefronts',
      'No coding required for platform plugins',
    ],
    mockUI: mockIntegrations(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  // Feature 3: Payment Links (slate-50 bg, text left)
  page.add(mkFeature({
    label: 'Payment Links',
    h2: 'Sell on Instagram, WhatsApp, or anywhere',
    p: 'No website? No problem. Create a payment link in seconds and share it anywhere — Instagram DMs, WhatsApp, email, or your link-in-bio. Perfect for social commerce and drop-shipping.',
    bullets: [
      'Create a link in under 60 seconds',
      'Shareable QR codes for offline-to-online selling',
      'All major payment methods supported on every link',
    ],
    mockUI: mockPaymentLink(),
    bg: C.slate50,
    textSide: 'left',
    accent: ac,
  }), 480);

  // Feature 4: Subscriptions (white bg, text right)
  page.add(mkFeature({
    label: 'Subscriptions',
    h2: 'Turn one-time buyers into loyal subscribers',
    p: 'Build predictable recurring revenue with HitPay\'s subscription billing. Perfect for subscription boxes, memberships, meal kits, and digital products.',
    bullets: [
      'Weekly, monthly, and annual billing cycles',
      'Automated invoices and payment receipts',
      'Smart retries for failed payments to reduce churn',
      'Self-service portal for customers to manage plans',
    ],
    mockUI: mockSubscriptions(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  page.add(mkStats(
    [
      { value: '11', label: 'Markets served' },
      { value: '700+', label: 'Payment methods' },
      { value: '100+', label: 'Currencies supported' },
      { value: 'T+1', label: 'Business day payouts' },
    ],
    C.indigo900, C.white, C.indigo200
  ), 192);

  page.add(mkTestimonial(
    'HitPay transformed how we accept payments. We went from having only credit card support to accepting PayNow, GrabPay, and Atome — and our checkout conversions jumped by over 30% in the first month.',
    'Sheryl Lim',
    'Founder, Pastel & Thread — Singapore Fashion Boutique',
    ac
  ), 380);

  page.add(mkGrid(
    'Everything else you need',
    'HitPay comes with a full suite of tools to run your e-commerce business end to end.',
    [
      { title: 'Fraud protection', desc: 'Built-in risk scoring on every transaction. Reduce chargebacks without blocking legitimate customers.' },
      { title: 'Fast payouts', desc: 'Get your money the next business day. No holding periods, no surprise delays.' },
      { title: 'Analytics dashboard', desc: 'Real-time sales reports, revenue trends, and customer insights — all in one place.' },
      { title: 'Tax invoicing', desc: 'Auto-generate GST-compliant invoices and send them to customers automatically after purchase.' },
      { title: 'Multi-currency', desc: 'Sell to customers across 100+ countries. Accept international payments with transparent conversion rates.' },
      { title: 'Developer APIs', desc: 'Comprehensive REST API, webhooks, and SDKs. Build a fully custom checkout experience end to end.' },
    ]
  ), 660);

  page.add(mkRelated(
    'Explore more use cases',
    [
      { emoji: '🏪', title: 'Retail', desc: 'Unified POS and online payments for physical retail stores.' },
      { emoji: '💜', title: 'Nonprofits', desc: 'Accept donations, manage recurring giving, and grow your mission.' },
      { emoji: '🍽️', title: 'F&B', desc: 'QR ordering, table-side payments, and delivery integrations for restaurants.' },
    ],
    ac
  ), 380);

  page.add(mkCTA(
    'Ready to start selling?',
    'Join thousands of e-commerce businesses already growing with HitPay. Free to start — no credit card needed.',
    'Start for free',
    'Talk to sales',
    ac
  ), 300);

  page.add(mkFooter(
    ac,
    ['Payment Gateway', 'POS System', 'Payment Links', 'Subscriptions'],
    ['E-commerce', 'Retail', 'Nonprofits', 'F&B']
  ), 280);

  return page.f;
}

function buildRetail() {
  const page = new Page('Retail Landing Page', 1540);
  const ac = C.emerald600;

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroRetail(), 560);
  page.add(mkTrustBar(
    'POWERING RETAIL BUSINESSES ACROSS SOUTHEAST ASIA',
    ['Fashion Boutiques', 'Home & Living', 'Beauty & Wellness', 'Electronics', 'Bookshops', 'Gift Stores']
  ), 120);
  page.add(mkIntro(
    'One platform. Every sales channel.',
    'Whether a customer walks into your store, finds you on Instagram, or buys from your website at midnight — HitPay handles every payment from a single dashboard.'
  ), 240);

  // Feature 1: POS (slate-50, text left)
  page.add(mkFeature({
    label: 'Point of Sale',
    h2: 'A POS system your staff will actually love using',
    p: 'HitPay\'s POS is intuitive enough for a new hire to learn in 10 minutes, and powerful enough to manage a multi-location retail operation. Inventory, sales, and staff — all in one system.',
    bullets: [
      'Inventory tracking with low-stock alerts',
      'Multiple staff logins with role-based permissions',
      'End-of-day cash reconciliation reports',
      'Works on iPad, Android tablet, or PC — no proprietary hardware required',
    ],
    mockUI: mockPOSDashboard(),
    bg: C.slate50,
    textSide: 'left',
    accent: ac,
  }), 480);

  // Feature 2: Tap to Pay (white, text right)
  page.add(mkFeature({
    label: 'Tap to Pay',
    h2: 'Turn your phone into a card terminal',
    p: 'Accept contactless card payments directly on your iPhone or Android — no external hardware required. Perfect for pop-ups, markets, deliveries, and anywhere your team needs to take payment.',
    bullets: [
      'Works on iPhone and Android devices',
      'Accepts Visa, Mastercard, Apple Pay, Google Pay',
      'No hardware cost — use any smartphone you already own',
      'Transactions sync instantly to your main dashboard',
    ],
    mockUI: mockTapToPay(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  // Feature 3: Hardware (slate-50, text left)
  page.add(mkFeature({
    label: 'Hardware',
    h2: 'Card terminals and Payment Soundbox for every store',
    p: 'For high-volume retail environments, deploy HitPay\'s card terminals and Payment Soundbox across your locations. Loud audio and visual confirmation means your team never misses a successful payment.',
    bullets: [
      'Accept cards, QR codes, PayNow, and NFC wallets',
      'Audio + visual payment confirmation with Soundbox',
      'Manages multiple locations from one account',
    ],
    mockUI: (() => {
      // Simple hardware illustration
      const hw = mkFrame('Hardware', 300, 260, null);

      const terminal = mkFrame('Terminal', 128, 200, C.slate800, 16);
      terminal.x = 0; terminal.y = 30;
      const screen = mkRect(90, 60, C.slate700, 10);
      screen.x = 19; screen.y = 16;
      terminal.appendChild(screen);
      const screenT = mkText('S$91.00', 14, W.bold, C.white, 'CENTER', 90);
      screenT.x = 19; screenT.y = 30;
      terminal.appendChild(screenT);
      const tapT = mkText('Tap card', 11, W.regular, C.slate300, 'CENTER', 90);
      tapT.x = 19; tapT.y = 50;
      terminal.appendChild(tapT);
      const payBtn2 = mkRect(90, 28, C.emerald600, 8);
      payBtn2.x = 19; payBtn2.y = 156;
      terminal.appendChild(payBtn2);
      const payT2 = mkText('PAY', 12, W.bold, C.white, 'CENTER', 90);
      payT2.x = 19; payT2.y = 163;
      terminal.appendChild(payT2);
      hw.appendChild(terminal);

      const termLbl = mkText('Card Terminal', 12, W.medium, C.slate500, 'CENTER', 128);
      termLbl.x = 0; termLbl.y = 240;
      hw.appendChild(termLbl);

      const soundbox = mkFrame('Soundbox', 96, 164, C.emerald800, 16);
      soundbox.x = 160; soundbox.y = 66;
      const sbLabel = mkText('Payment\nConfirmed', 12, W.medium, C.emerald300, 'CENTER', 76);
      sbLabel.lineHeight = { value: 18, unit: 'PIXELS' };
      sbLabel.x = 10; sbLabel.y = 16;
      soundbox.appendChild(sbLabel);

      // Speaker grille
      [0, 10, 20, 30, 40].forEach((dy) => {
        const bar = mkRect(76, 4, C.emerald600, 2);
        bar.x = 10; bar.y = 68 + dy;
        soundbox.appendChild(bar);
      });

      const sbAmt = mkText('S$91.00', 12, W.medium, C.emerald300, 'CENTER', 76);
      sbAmt.x = 10; sbAmt.y = 136;
      soundbox.appendChild(sbAmt);
      hw.appendChild(soundbox);

      const sbLbl = mkText('Soundbox', 12, W.medium, C.slate500, 'CENTER', 96);
      sbLbl.x = 160; sbLbl.y = 240;
      hw.appendChild(sbLbl);

      hw.resize(280, 262);
      return hw;
    })(),
    bg: C.slate50,
    textSide: 'left',
    accent: ac,
  }), 480);

  // Feature 4: Omnichannel (white, text right)
  page.add(mkFeature({
    label: 'Omnichannel',
    h2: 'One dashboard for every channel',
    p: 'Stop stitching together reports from different systems. HitPay unifies your in-store, online, and payment-link sales into a single dashboard — so you always know exactly how your business is performing.',
    bullets: [
      'Unified inventory synced across in-store and online',
      'Real-time consolidated sales reports',
      'Multi-location management from one account',
    ],
    mockUI: mockOmnichannel(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  page.add(mkStats(
    [
      { value: '<5 min', label: 'Setup time for first transaction' },
      { value: '1', label: 'Dashboard for all channels' },
      { value: 'T+1', label: 'Business day payouts' },
      { value: 'S$0', label: 'Monthly subscription fees' },
    ],
    C.emerald900, C.white, C.emerald200
  ), 192);

  page.add(mkTestimonial(
    'We used to run separate systems for our Orchard Road store and our online shop. HitPay gave us one dashboard for everything. Our inventory is always accurate and I spend half the time I used to on end-of-day reconciliation.',
    'Janelle Wong',
    'Owner, The Linen Collective — Multi-location retail, Singapore',
    ac
  ), 380);

  page.add(mkGrid(
    'Everything your retail business needs',
    'From opening to close, HitPay handles every part of your payment operations.',
    [
      { title: 'Inventory management', desc: 'Track stock levels, get low-stock alerts, and sync inventory between your store and website automatically.' },
      { title: 'Fast payouts', desc: 'Receive your sales proceeds the next business day. No waiting. Cash flow when you need it.' },
      { title: 'Staff management', desc: 'Create staff accounts with custom permissions. Track performance by staff member, shift, or location.' },
      { title: 'Sales reporting', desc: 'Daily, weekly, and monthly reports broken down by product, channel, and location. Export to CSV or your accounting tool.' },
      { title: 'Secure transactions', desc: 'Every in-store and online payment is protected by HitPay\'s security infrastructure. PCI DSS compliant.' },
      { title: 'All payment methods', desc: 'PayNow, GrabPay, ShopeePay, Visa, Mastercard, Amex, Apple Pay, Google Pay — accept everything your customers carry.' },
    ]
  ), 660);

  page.add(mkRelated(
    'Explore more solutions',
    [
      { emoji: '🛒', title: 'E-commerce', desc: 'Sell online with a powerful checkout that converts.' },
      { emoji: '💜', title: 'Nonprofits', desc: 'Simple, affordable donation collection for charities.' },
      { emoji: '🍜', title: 'F&B', desc: 'QR ordering, table-side payments, and delivery integrations.' },
    ],
    ac
  ), 380);

  page.add(mkCTA(
    'Ready to modernise your retail payments?',
    'Get set up in minutes. No hardware required to start — just sign up and start accepting payments today.',
    'Start for free',
    'Request a demo',
    ac
  ), 300);

  page.add(mkFooter(
    ac,
    ['POS System', 'Tap to Pay', 'Card Terminals', 'Soundbox'],
    ['E-commerce', 'Retail', 'Nonprofits', 'F&B']
  ), 280);

  return page.f;
}

function buildNonprofits() {
  const page = new Page('Nonprofits Landing Page', 3080);
  const ac = C.violet600;

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroNonprofits(), 560);
  page.add(mkTrustBar(
    'TRUSTED BY NONPROFITS AND SOCIAL ENTERPRISES ACROSS SOUTHEAST ASIA',
    ['Animal Welfare', 'Youth Programs', 'Disability Services', 'Arts & Culture', 'Environmental', 'Community']
  ), 120);
  page.add(mkIntro(
    'Every donation matters. Every feature is free.',
    'HitPay charges nonprofits only the standard payment processing fee — no monthly platform costs, no setup fees, and no premium tier required to access core features.'
  ), 240);

  // Feature 1: Donation Pages (slate-50, text left)
  page.add(mkFeature({
    label: 'Donation Pages',
    h2: 'Beautiful donation pages that inspire giving',
    p: 'Create customised donation pages in minutes — no code, no designers needed. Share them on your website, social media, or email campaigns. HitPay donation pages are mobile-optimised and support all major local payment methods.',
    bullets: [
      'Custom branding with your logo and campaign message',
      'Preset donation amounts with custom option',
      'PayNow, GrabPay, Visa, Mastercard, and more',
      'Instant email receipts for every donor',
    ],
    mockUI: mockDonation(),
    bg: C.slate50,
    textSide: 'left',
    accent: ac,
  }), 480);

  // Feature 2: Recurring Giving (white, text right)
  page.add(mkFeature({
    label: 'Recurring Giving',
    h2: 'Turn one-time donors into lifetime supporters',
    p: 'Predictable recurring donations help you plan programs, hire staff, and grow sustainably. HitPay makes it easy for donors to set up monthly giving in a few taps — and just as easy for you to manage it all.',
    bullets: [
      'Monthly, quarterly, and annual giving options',
      'Automatic receipts and thank-you emails',
      'Donors can manage their own subscriptions without calling you',
      'Smart retries for failed payments to reduce lapsed donors',
    ],
    mockUI: mockRecurringDonors(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  // Feature 3: Events & QR (slate-50, text left)
  page.add(mkFeature({
    label: 'Events & In-Person',
    h2: 'Collect at galas, fundraisers, and community events',
    p: 'Whether it\'s a charity run, a gala dinner, or a bake sale — HitPay lets you accept donations on the spot with QR codes, Tap to Pay, or card terminals. No Wi-Fi? No problem. Set up static PayNow QR codes in advance.',
    bullets: [
      'Static QR codes you can print on posters, banners, and tables',
      'Tap to Pay on your smartphone — no extra hardware',
      'All donations tracked in real time in your dashboard',
      'Share payment links with guests before the event via email or WhatsApp',
    ],
    mockUI: mockQR(),
    bg: C.slate50,
    textSide: 'left',
    accent: ac,
  }), 480);

  // Feature 4: Grant Invoicing (white, text right)
  page.add(mkFeature({
    label: 'Grant Invoicing',
    h2: 'Professional invoices for grants and corporate sponsors',
    p: 'Send polished, branded invoices to government agencies, corporate sponsors, and grant bodies. Track payment status, send reminders, and reconcile all income in one place.',
    bullets: [
      'Customisable invoice templates with your logo',
      'Automated payment reminders before due date',
      'Online payment link embedded in each invoice',
      'Full payment history for audits and reporting',
    ],
    mockUI: mockInvoice(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  page.add(mkStats(
    [
      { value: 'S$0', label: 'Platform fees for nonprofits' },
      { value: '15+', label: 'Donation methods accepted' },
      { value: 'T+1', label: 'Business day payouts' },
      { value: '100%', label: 'Secure and PCI DSS compliant' },
    ],
    { r: 0.427, g: 0.157, b: 0.851 }, C.white, C.violet200
  ), 192);

  page.add(mkTestimonial(
    'HitPay made our year-end fundraising campaign so much smoother. We set up a donation page in under 20 minutes, and donors loved how easy it was to give via PayNow. We raised 40% more than the previous year.',
    'Priya Menon',
    'Executive Director, Reach Out Singapore — Social Services Nonprofit',
    ac
  ), 380);

  page.add(mkGrid(
    'Everything your nonprofit needs',
    'From first-time donors to corporate grants, HitPay handles every part of your fundraising.',
    [
      { title: 'Zero monthly fees', desc: 'No subscription, no setup cost. Pay only when a donation or payment succeeds.' },
      { title: 'Tax receipt automation', desc: 'Auto-generate tax-deductible receipts and deliver them instantly to donors by email.' },
      { title: 'Donor analytics', desc: 'Understand your donor base — who gives, how often, and what motivates them.' },
      { title: 'Fast payouts', desc: 'Funds arrive in your bank account the next business day so you can focus on your mission.' },
      { title: 'Secure payments', desc: 'Every transaction is encrypted and PCI DSS compliant. Your donors\' data is always protected.' },
      { title: 'Multi-currency', desc: 'Accept donations from overseas supporters in 100+ currencies with transparent conversion rates.' },
    ]
  ), 660);

  page.add(mkRelated(
    'Explore more solutions',
    [
      { emoji: '🛒', title: 'E-commerce', desc: 'Sell merchandise or products to fund your programmes.' },
      { emoji: '🏪', title: 'Retail', desc: 'Operate a charity shop with unified POS and online sales.' },
      { emoji: '🍜', title: 'F&B', desc: 'Run a social enterprise café with streamlined payments.' },
    ],
    ac
  ), 380);

  page.add(mkCTA(
    'Start accepting donations today',
    'Set up your first donation page in under 10 minutes. No credit card, no contract, no commitment.',
    'Start for free',
    'Talk to our team',
    ac
  ), 300);

  page.add(mkFooter(
    ac,
    ['Donation Pages', 'Recurring Giving', 'Event Payments', 'Grant Invoicing'],
    ['E-commerce', 'Retail', 'Nonprofits', 'F&B']
  ), 280);

  return page.f;
}

// ── MAIN ─────────────────────────────────────────────────────

async function main() {
  await loadFonts();

  const ecomm = buildEcommerce();
  const retail = buildRetail();
  const np = buildNonprofits();

  figma.currentPage.appendChild(ecomm);
  figma.currentPage.appendChild(retail);
  figma.currentPage.appendChild(np);

  figma.viewport.scrollAndZoomIntoView([ecomm, retail, np]);
  figma.closePlugin('✅ HitPay landing pages created! 3 frames at 1440px.');
}

main().catch(err => {
  console.error(err);
  const msg = err ? (err.message || String(err)) : 'unknown error';
  figma.closePlugin('❌ Error: ' + msg);
});
