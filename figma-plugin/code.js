// ═══════════════════════════════════════════════════════════
// HitPay Landing Pages — Figma Plugin
// Generates 5 landing pages as editable Figma frames at 1440px:
//   E-commerce, Retail, Nonprofits, General (SEO/AEO), General v2 (Plain-inspired)
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
  // sky (travel)
  sky50:    { r: 0.941, g: 0.976, b: 1.000 },
  sky100:   { r: 0.878, g: 0.949, b: 0.996 },
  sky600:   { r: 0.012, g: 0.518, b: 0.784 },
  sky700:   { r: 0.012, g: 0.412, b: 0.631 },
  sky900:   { r: 0.047, g: 0.290, b: 0.431 },
  // rose (beauty)
  rose50:   { r: 1.000, g: 0.945, b: 0.949 },
  rose100:  { r: 1.000, g: 0.894, b: 0.902 },
  rose600:  { r: 0.882, g: 0.114, b: 0.282 },
  rose700:  { r: 0.745, g: 0.071, b: 0.235 },
  rose900:  { r: 0.533, g: 0.075, b: 0.216 },
  // amber extras (furniture)
  amber50:  { r: 1.000, g: 0.984, b: 0.922 },
  amber600: { r: 0.851, g: 0.467, b: 0.024 },
  amber900: { r: 0.471, g: 0.208, b: 0.059 },
  // orange extras (restaurants)
  orange50:  { r: 1.000, g: 0.969, b: 0.945 },
  orange900: { r: 0.490, g: 0.196, b: 0.020 },
  // blue extras (education, wholesale)
  blue50:   { r: 0.937, g: 0.957, b: 0.996 },
  blue900:  { r: 0.118, g: 0.216, b: 0.604 },
  // HitPay brand — Orchid UI design system
  hpLogoBlue:  { r: 0.055, g: 0.157, b: 0.349 },  // #0E2859
  hpDeepBlue:  { r: 0.000, g: 0.153, b: 0.443 },  // #002771
  hpAction:    { r: 0.141, g: 0.396, b: 0.871 },  // #2465DE
  hpActionHov: { r: 0.106, g: 0.310, b: 0.722 },  // #1B4FB8
  hpTextPri:   { r: 0.012, g: 0.063, b: 0.184 },  // #03102F
  hpTextSec:   { r: 0.380, g: 0.400, b: 0.486 },  // #61667C
  hpBeige:     { r: 0.976, g: 0.976, b: 0.965 },  // #F9F9F6
  hpSuccess:   { r: 0.302, g: 0.671, b: 0.502 },  // #4DAB80
  hpBlue50:    { r: 0.922, g: 0.945, b: 0.988 },  // #EBF1FC
  hpBlue100:   { r: 0.839, g: 0.890, b: 0.976 },  // #D6E3F9
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
  // IBM Plex Sans Condensed for brand headlines
  for (const style of ['Regular', 'Medium', 'SemiBold', 'Bold']) {
    try { await figma.loadFontAsync({ family: 'IBM Plex Sans Condensed', style }); } catch (_) {}
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
function mkText(content, size, weight, color, align = 'LEFT', maxW = 0, family = 'Inter') {
  const t = figma.createText();
  t.fontName = { family, style: weight };
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

/** Brand headline using IBM Plex Sans Condensed */
function mkH2(content, size, color, align = 'LEFT', maxW = 0) {
  return mkText(content, size, W.bold, color, align, maxW, 'IBM Plex Sans Condensed');
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
  const mark = mkFrame('LogoMark', 32, 32, C.hpLogoBlue, 8);
  const markTxt = mkText('H', 14, W.bold, C.white, 'CENTER');
  markTxt.x = 10; markTxt.y = 6;
  mark.appendChild(markTxt);
  mark.x = 144; mark.y = 16;
  nav.appendChild(mark);

  // Logo text
  const logoTxt = mkText('HitPay', 18, W.bold, C.hpTextPri);
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
  const heading = mkH2(h2, 36, C.hpTextPri, 'LEFT', 520);
  heading.lineHeight = { value: 44, unit: 'PIXELS' };
  heading.x = textX; heading.y = 84;
  sec.appendChild(heading);

  // Body
  const body = mkText(p, 17, W.regular, C.hpTextSec, 'LEFT', 510);
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
function mkTestimonial(quote, name, company, accent, lightBg) {
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
  const avatar = mkFrame('Avatar', 48, 48, lightBg || C.hpBlue100, 24);
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
  const sec = mkFrame('FeatureGrid', 1440, 660, C.hpBeige);

  const h2 = mkH2(title, 30, C.hpTextPri, 'CENTER', 800);
  h2.x = 320; h2.y = 60;
  sec.appendChild(h2);

  const st = mkText(subtitle, 16, W.regular, C.hpTextSec, 'CENTER', 600);
  st.x = 420; st.y = 108;
  sec.appendChild(st);

  const colW = (1152 - 64) / 3; // 3 cols with 32px gaps
  const colors = [
    { bg: C.blue100, fg: C.blue600 },
    { bg: C.green100, fg: C.green600 },
    { bg: C.purple100, fg: C.purple600 },
    { bg: C.yellow100, fg: C.yellow600 },
    { bg: C.red100, fg: C.red600 },
    { bg: C.hpBlue100, fg: C.hpAction },
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
  const sec = mkFrame('CTABanner', 1440, 300, C.hpDeepBlue);

  const h2 = mkH2(h2text, 40, C.white, 'CENTER', 800);
  h2.lineHeight = { value: 48, unit: 'PIXELS' };
  h2.x = 320; h2.y = 48;
  sec.appendChild(h2);

  const p = mkText(ptext, 20, W.regular, C.white, 'CENTER', 720);
  p.lineHeight = { value: 30, unit: 'PIXELS' };
  p.opacity = 0.85;
  p.x = 360; p.y = 112;
  sec.appendChild(p);

  const b1 = mkBtn(btn1label, C.white, C.hpDeepBlue, 32, 16, 12);
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
  const sec = mkFrame('Footer', 1440, 280, C.hpLogoBlue);

  // Logo
  const mark = mkFrame('LogoMark', 28, 28, C.hpAction, 8);
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

/** FAQ accordion section — all items expanded to show Q + A */
function mkFAQ(items, accent) {
  const itemH = 136; // question (~48px 2 lines) + gap + answer (~44px 2 lines) + padding
  const topH  = 96;
  const h = topH + items.length * itemH + 40;
  const sec = mkFrame('FAQ', 1440, h, C.white);

  const h2 = mkText('Frequently Asked Questions', 30, W.bold, C.slate900, 'CENTER', 700);
  h2.x = 370; h2.y = 36;
  sec.appendChild(h2);

  // Top rule
  const topRule = mkRect(752, 1, C.slate200);
  topRule.x = 344; topRule.y = topH;
  sec.appendChild(topRule);

  items.forEach((item, i) => {
    const y = topH + i * itemH;
    const q = typeof item === 'string' ? item : item.q;
    const a = typeof item === 'string' ? '' : item.a;

    // Question text
    const qText = mkText(q, 15, W.semibold, C.slate900, 'LEFT', 640);
    qText.x = 344; qText.y = y + 18;
    sec.appendChild(qText);

    // Collapse indicator (− = open/expanded)
    const iconBg = mkRect(28, 28, accent, 6);
    iconBg.opacity = 0.12;
    iconBg.x = 1040; iconBg.y = y + 16;
    sec.appendChild(iconBg);
    const minus = mkText('−', 18, W.bold, accent, 'CENTER', 28);
    minus.x = 1040; minus.y = y + 18;
    sec.appendChild(minus);

    // Answer text
    if (a) {
      const aText = mkText(a, 14, W.regular, C.slate500, 'LEFT', 640);
      aText.lineHeight = { value: 22, unit: 'PIXELS' };
      aText.x = 344; aText.y = y + 60;
      sec.appendChild(aText);
    }

    // Row divider
    const rule = mkRect(752, 1, C.slate100);
    rule.x = 344; rule.y = y + itemH - 1;
    sec.appendChild(rule);
  });

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

  const payBtn = mkRect(260, 44, C.hpAction, 8);
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

  const header = mkRect(270, 70, C.hpAction);
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

  const buyBtn = mkRect(238, 40, C.hpAction, 8);
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
    { title: 'New subscriber', sub: 'Just signed up · @weiming', amount: 'S$28/mo', status: '● Just now', statusColor: C.hpAction, border: C.hpBlue100 },
  ];

  subs.forEach((s, i) => {
    const row = mkFrame(`Sub/${s.title}`, 290, 68, C.white, 12);
    row.strokes = [{ type: 'SOLID', color: s.border }];
    row.strokeWeight = s.border === C.hpBlue100 ? 2 : 1;
    row.strokeAlign = 'INSIDE';
    row.x = 0; row.y = i * 76;

    const ttl = mkText(s.title, 14, W.semibold, s.border === C.hpBlue100 ? C.hpAction : C.slate900, 'LEFT', 160);
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

  const online = mkText('● Online', 12, W.medium, C.hpSuccess);
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

  const payBtn = mkRect(250, 40, C.hpAction, 12);
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

  const headerBg = mkRect(300, 90, C.hpDeepBlue);
  headerBg.x = 0; headerBg.y = 0;
  card.appendChild(headerBg);

  const headerTitle = mkText('Today\'s Sales', 14, W.semibold, C.white);
  headerTitle.x = 20; headerTitle.y = 14;
  card.appendChild(headerTitle);

  const date = mkText('Tue 24 Feb', 12, W.regular, C.hpBlue100);
  date.x = 220; date.y = 16;
  card.appendChild(date);

  const total = mkText('S$3,241.50', 28, W.bold, C.white);
  total.x = 20; total.y = 40;
  card.appendChild(total);

  const pct = mkText('↑ 12% vs last Tuesday', 12, W.regular, C.hpBlue100);
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
  ring1.strokes = [{ type: 'SOLID', color: C.hpSuccess }];
  ring1.strokeWeight = 3;
  ring1.strokeAlign = 'INSIDE';
  ring1.x = 93; ring1.y = 88;
  card.appendChild(ring1);

  const ring2 = mkFrame('NFCInner', 40, 40, null, 20);
  ring2.strokes = [{ type: 'SOLID', color: C.hpSuccess }];
  ring2.strokeWeight = 2;
  ring2.strokeAlign = 'INSIDE';
  ring2.x = 105; ring2.y = 100;
  card.appendChild(ring2);

  const ready = mkText('● Ready to accept', 13, W.medium, C.hpSuccess, 'CENTER', 210);
  ready.x = 20; ready.y = 196;
  card.appendChild(ready);

  // Badge
  const badgeBg = mkRect(140, 28, C.hpSuccess, 100);
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
    { label: '🏪 In-store', amount: 'S$28,410', pct: 0.65, barColor: C.hpSuccess },
    { label: '🌐 Online Store', amount: 'S$14,230', pct: 0.33, barColor: C.blue500 },
    { label: '🔗 Payment Links', amount: 'S$3,840', pct: 0.09, barColor: C.hpAction },
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

  const headerBg = mkRect(310, 72, C.hpAction);
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
    const btnBg = mkRect(58, 32, selected ? C.hpAction : C.white, 8);
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

  const donateBtn = mkRect(270, 44, C.hpAction, 10);
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

  const bar = mkRect(150, 6, C.hpAction, 3);
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

  const badge = mkRect(100, 24, C.hpBlue50, 8);
  badge.x = 180; badge.y = 18;
  card.appendChild(badge);
  const badgeT = mkText('February 2025', 11, W.medium, C.hpAction, 'CENTER', 100);
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

  const hitpayBtn = mkRect(210, 28, C.hpAction, 8);
  hitpayBtn.x = 20; hitpayBtn.y = 234;
  card.appendChild(hitpayBtn);
  const hpT = mkText('HitPay · hitpay.me/awss', 12, W.semibold, C.white, 'CENTER', 210);
  hpT.x = 20; hpT.y = 242;
  card.appendChild(hpT);

  // Floating badge
  const floatBg = mkRect(140, 28, C.hpAction, 100);
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

  const totalA = mkText('S$3,500.00', 16, W.bold, C.hpAction, 'RIGHT', 120);
  totalA.x = 160; totalA.y = 230;
  card.appendChild(totalA);

  return card;
}

// ── HERO BUILDERS ────────────────────────────────────────────

function mkHeroEcommerce() {
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badge = mkPill('E-commerce Payments', C.hpBlue100, C.hpAction, 16, 8, 100);
  badge.x = 144; badge.y = 80;
  sec.appendChild(badge);

  const h1 = mkH2('The payment platform\nbuilt for e-commerce', 56, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 126;
  sec.appendChild(h1);

  const sub = mkText('Accept PayNow, cards, GrabPay, and 700+ digital wallets. Integrate with Shopify, WooCommerce, and more. No monthly fees — ever.', 20, W.regular, C.hpTextSec, 'LEFT', 540);
  sub.lineHeight = { value: 30, unit: 'PIXELS' };
  sub.x = 144; sub.y = 280;
  sec.appendChild(sub);

  const b1 = mkBtn('Start for free', C.hpAction, C.white, 24, 14, 12);
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
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badge = mkPill('Retail', C.hpBlue100, C.hpAction, 16, 8, 100);
  badge.x = 144; badge.y = 80;
  sec.appendChild(badge);

  const h1 = mkH2('Modern payments for\nretail, online and in-store', 56, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 126;
  sec.appendChild(h1);

  const sub = mkText('Connect your physical store and online sales on one platform. HitPay\'s POS, card terminals, and Tap to Pay work together so your customers always get a seamless experience.', 20, W.regular, C.hpTextSec, 'LEFT', 540);
  sub.lineHeight = { value: 30, unit: 'PIXELS' };
  sub.x = 144; sub.y = 290;
  sec.appendChild(sub);

  const b1 = mkBtn('Start for free', C.hpAction, C.white, 24, 14, 12);
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
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badge = mkPill('Nonprofits & Charities', C.hpBlue100, C.hpAction, 16, 8, 100);
  badge.x = 144; badge.y = 80;
  sec.appendChild(badge);

  const h1 = mkH2('Accept donations.\nGrow your mission.', 56, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 126;
  sec.appendChild(h1);

  const sub = mkText('HitPay helps nonprofits, charities, and social enterprises accept online donations, run fundraising events, and grow recurring giving — with zero monthly fees.', 20, W.regular, C.hpTextSec, 'LEFT', 540);
  sub.lineHeight = { value: 30, unit: 'PIXELS' };
  sub.x = 144; sub.y = 278;
  sec.appendChild(sub);

  const b1 = mkBtn('Start for free', C.hpAction, C.white, 24, 14, 12);
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

/** Mock revenue dashboard (general landing hero) */
function mockDashboard() {
  const card = mkFrame('MockDashboard', 320, 300, C.white, 16);
  card.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.10 },
    offset: { x: 0, y: 16 },
    radius: 40,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  card.strokes = [{ type: 'SOLID', color: C.slate200 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';

  const headerBg = mkRect(320, 80, C.hpDeepBlue);
  headerBg.x = 0; headerBg.y = 0;
  card.appendChild(headerBg);

  const headerTitle = mkText("Today's revenue", 13, W.regular, C.white);
  headerTitle.opacity = 0.75;
  headerTitle.x = 20; headerTitle.y = 16;
  card.appendChild(headerTitle);

  const totalAmt = mkText('S$4,892.40', 28, W.bold, C.white);
  totalAmt.x = 20; totalAmt.y = 38;
  card.appendChild(totalAmt);

  const upBadge = mkText('↑ 12.4%', 12, W.semibold, C.hpBlue100);
  upBadge.x = 230; upBadge.y = 46;
  card.appendChild(upBadge);

  const methodsLabel = mkText('BY PAYMENT METHOD', 10, W.semibold, C.slate500);
  methodsLabel.letterSpacing = { value: 1, unit: 'PIXELS' };
  methodsLabel.x = 20; methodsLabel.y = 98;
  card.appendChild(methodsLabel);

  const methods = [
    { label: 'PayNow QR', amount: 'S$2,140', pct: 0.44, barColor: C.hpAction },
    { label: 'Credit/Debit Card', amount: 'S$1,890', pct: 0.39, barColor: C.hpAction },
    { label: 'GrabPay', amount: 'S$862', pct: 0.18, barColor: C.hpSuccess },
  ];

  methods.forEach((m, i) => {
    const y = 120 + i * 52;
    const lbl = mkText(m.label, 13, W.medium, C.slate700);
    lbl.x = 20; lbl.y = y;
    card.appendChild(lbl);

    const amtT = mkText(m.amount, 13, W.semibold, C.slate900, 'RIGHT', 100);
    amtT.x = 200; amtT.y = y;
    card.appendChild(amtT);

    const trackBg = mkRect(280, 8, C.slate100, 4);
    trackBg.x = 20; trackBg.y = y + 20;
    card.appendChild(trackBg);

    const fill = mkRect(Math.round(280 * m.pct), 8, m.barColor, 4);
    fill.x = 20; fill.y = y + 20;
    card.appendChild(fill);
  });

  const divider = mkRect(280, 1, C.slate100);
  divider.x = 20; divider.y = 268;
  card.appendChild(divider);

  const payoutL = mkText('Next payout', 12, W.regular, C.slate500);
  payoutL.x = 20; payoutL.y = 280;
  card.appendChild(payoutL);

  const payoutA = mkText('Tomorrow · T+1', 13, W.semibold, C.green600, 'RIGHT', 130);
  payoutA.x = 170; payoutA.y = 278;
  card.appendChild(payoutA);

  return card;
}

function mkHeroLanding() {
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badge = mkPill('MAS Licensed  ·  PCI DSS Certified  ·  SOC2 Compliant', C.hpBlue100, C.hpAction, 16, 8, 100);
  badge.x = 144; badge.y = 76;
  sec.appendChild(badge);

  const h1 = mkH2('Payments made\nfast, easy and reliable', 56, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 124;
  sec.appendChild(h1);

  const sub = mkText('Strip away the payment hassle. Focus on your growth.\nAccept PayNow, cards, QRs and international payments across your website, retail store, and social media. One unified platform, zero monthly fees.', 18, W.regular, C.hpTextSec, 'LEFT', 520);
  sub.lineHeight = { value: 28, unit: 'PIXELS' };
  sub.x = 144; sub.y = 278;
  sec.appendChild(sub);

  const b1 = mkBtn('Create free account', C.hpAction, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 378;
  sec.appendChild(b1);

  const b2 = mkBtn('See all features →', null, C.slate800, 24, 14, 12, true);
  b2.x = 358; b2.y = 378;
  sec.appendChild(b2);

  const fine = mkText('Free to sign up · No setup fees · Pay per transaction', 13, W.regular, C.slate500);
  fine.x = 144; fine.y = 432;
  sec.appendChild(fine);

  const db = mockDashboard();
  db.x = 860; db.y = 110;
  sec.appendChild(db);

  return sec;
}

function mkHeroLandingPlain() {
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badge = mkPill('New: Cross-border QR now live in 10 markets  →', C.hpBlue100, C.hpAction, 16, 8, 100);
  badge.x = 144; badge.y = 76;
  sec.appendChild(badge);

  const h1 = mkH2('Accept payments\nyour way', 56, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 124;
  sec.appendChild(h1);

  const sub = mkText('Break free from the patchwork of tools, the hidden fees, and the lock-in.\nHitPay is the all-in-one payment platform that lets growing businesses collect money the way their customers prefer — no-code or full API.', 18, W.regular, C.hpTextSec, 'LEFT', 520);
  sub.lineHeight = { value: 28, unit: 'PIXELS' };
  sub.x = 144; sub.y = 264;
  sec.appendChild(sub);

  const b1 = mkBtn('Create free account', C.hpAction, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 394;
  sec.appendChild(b1);

  const b2 = mkBtn('See how it works →', null, C.slate800, 24, 14, 12, true);
  b2.x = 358; b2.y = 394;
  sec.appendChild(b2);

  const fine = mkText('Free to sign up · No monthly fees · Pay per transaction', 13, W.regular, C.slate500);
  fine.x = 144; fine.y = 448;
  sec.appendChild(fine);

  const db = mockDashboard();
  db.x = 860; db.y = 110;
  sec.appendChild(db);

  return sec;
}

// ── PAGE BUILDERS ────────────────────────────────────────────

function buildEcommerce(xOffset = 0) {
  const page = new Page('E-commerce Landing Page', xOffset);
  const ac = C.hpAction;

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
    bg: C.hpBlue50,
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
    bg: C.hpBlue50,
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
    C.hpDeepBlue, C.white, C.hpBlue100
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

function buildRetail(xOffset = 1540) {
  const page = new Page('Retail Landing Page', xOffset);
  const ac = C.hpAction;

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
    bg: C.hpBlue50,
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
      const payBtn2 = mkRect(90, 28, C.hpAction, 8);
      payBtn2.x = 19; payBtn2.y = 156;
      terminal.appendChild(payBtn2);
      const payT2 = mkText('PAY', 12, W.bold, C.white, 'CENTER', 90);
      payT2.x = 19; payT2.y = 163;
      terminal.appendChild(payT2);
      hw.appendChild(terminal);

      const termLbl = mkText('Card Terminal', 12, W.medium, C.slate500, 'CENTER', 128);
      termLbl.x = 0; termLbl.y = 240;
      hw.appendChild(termLbl);

      const soundbox = mkFrame('Soundbox', 96, 164, C.hpDeepBlue, 16);
      soundbox.x = 160; soundbox.y = 66;
      const sbLabel = mkText('Payment\nConfirmed', 12, W.medium, C.hpBlue100, 'CENTER', 76);
      sbLabel.lineHeight = { value: 18, unit: 'PIXELS' };
      sbLabel.x = 10; sbLabel.y = 16;
      soundbox.appendChild(sbLabel);

      // Speaker grille
      [0, 10, 20, 30, 40].forEach((dy) => {
        const bar = mkRect(76, 4, C.hpAction, 2);
        bar.x = 10; bar.y = 68 + dy;
        soundbox.appendChild(bar);
      });

      const sbAmt = mkText('S$91.00', 12, W.medium, C.hpBlue100, 'CENTER', 76);
      sbAmt.x = 10; sbAmt.y = 136;
      soundbox.appendChild(sbAmt);
      hw.appendChild(soundbox);

      const sbLbl = mkText('Soundbox', 12, W.medium, C.slate500, 'CENTER', 96);
      sbLbl.x = 160; sbLbl.y = 240;
      hw.appendChild(sbLbl);

      hw.resize(280, 262);
      return hw;
    })(),
    bg: C.hpBlue50,
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
    C.hpDeepBlue, C.white, C.hpBlue100
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

function buildNonprofits(xOffset = 3080) {
  const page = new Page('Nonprofits Landing Page', xOffset);
  const ac = C.hpAction;

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
    bg: C.hpBlue50,
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
    bg: C.hpBlue50,
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
    C.hpDeepBlue, C.white, C.hpBlue100
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

function buildLanding(xOffset = 4620) {
  const page = new Page('General Landing Page (SEO/AEO)', xOffset);
  const ac = C.hpAction;

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroLanding(), 560);
  page.add(mkTrustBar(
    'TRUSTED BY 15,000+ BUSINESSES ACROSS SOUTHEAST ASIA',
    ['E-commerce', 'Retail', 'F&B', 'Nonprofits', 'Freelancers', 'Services']
  ), 120);
  page.add(mkStats(
    [
      { value: '10+', label: 'Countries supported' },
      { value: '$1B+', label: 'Payment volume' },
      { value: '700+', label: 'Payment methods' },
      { value: 'T+1', label: 'Business day payouts' },
    ],
    C.hpDeepBlue, C.white, C.hpBlue100
  ), 192);
  page.add(mkIntro(
    'One platform. Every way to get paid.',
    'Whether you sell online, run a physical store, or take orders through social media — HitPay handles the payments so you can focus on what you do best.'
  ), 240);

  page.add(mkFeature({
    label: 'Checkout & Payments',
    h2: 'Increase your checkout conversion rates',
    p: 'Accept the full range of Singapore and regional payment methods in one checkout — PayNow, GrabPay, cards, e-wallets, and BNPL. More options, fewer abandoned sales.',
    bullets: [
      'PayNow QR, GrabPay, ShopeePay, and 700+ methods',
      'Visa, Mastercard, Amex — Apple Pay & Google Pay ready',
      'Buy Now Pay Later with Atome for higher AOV',
      'Mobile-optimised, PCI DSS Level 1 secure',
    ],
    mockUI: mockCheckout(),
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 480);

  page.add(mkFeature({
    label: 'Omni-channel',
    h2: 'Run your whole business from one place.',
    p: 'In-store POS, online checkout, payment links, QR codes, and subscriptions — all from a single dashboard. No more switching between systems or reconciling separate reports.',
    bullets: [
      'Unified dashboard across all sales channels',
      'POS for retail, payment links for social selling',
      'Subscriptions and recurring billing built-in',
      'Real-time consolidated revenue reports',
    ],
    mockUI: mockOmnichannel(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  page.add(mkFeature({
    label: 'Cross-border',
    h2: 'Grow your customer base beyond Singapore',
    p: 'Accept payments from tourists, overseas customers, and regional buyers without setting up accounts in each market. HitPay supports cross-border QR and international wallets across 10+ countries.',
    bullets: [
      'Cross-border QR live in 10 markets',
      'Alipay+, WeChat Pay, DuitNow, PromptPay',
      '100+ currencies accepted',
      'Tourists pay in their home currency',
    ],
    mockUI: mockQR(),
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 480);

  page.add(mkFeature({
    label: 'Onboarding & Support',
    h2: 'Set up in minutes. Supported every day.',
    p: 'Most businesses accept their first payment within 10 minutes of signing up. Our team is available every day of the week — by chat, email, and phone — so you\'re never on your own.',
    bullets: [
      'Sign up and verify in under 10 minutes',
      'Support 7 days a week by chat and email',
      'Dedicated account managers for larger businesses',
      'Comprehensive documentation and tutorials',
    ],
    mockUI: mockPaymentLink(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  page.add(mkStats(
    [
      { value: '15,000+', label: 'Businesses trust HitPay' },
      { value: '99.99%', label: 'Uptime SLA' },
      { value: 'S$0', label: 'Monthly platform fees' },
      { value: '2016', label: 'Founded in Singapore' },
    ],
    C.hpDeepBlue, C.white, C.hpBlue100
  ), 192);

  page.add(mkTestimonial(
    'HitPay gave us a single dashboard for everything — from our Orchard Road outlet to our online store and Instagram sales. Our reconciliation time dropped by 80% in the first week.',
    'Felicia Tan',
    'Founder, The Botanical Boutique — Singapore Lifestyle Brand',
    ac
  ), 380);

  page.add(mkGrid(
    'Everything Singapore businesses need to get paid',
    'From your first PayNow QR code to a full API integration — HitPay scales with you.',
    [
      { title: 'Payment Gateway', desc: 'Hosted checkout that accepts all major payment methods. No code required.' },
      { title: 'POS System', desc: 'iPad and Android POS for retail, F&B, and service businesses. Includes inventory.' },
      { title: 'Payment Links', desc: 'Create and share payment links in seconds. Collect from WhatsApp, Instagram, or email.' },
      { title: 'Invoicing', desc: 'Send branded digital invoices with embedded payment buttons. Auto-reminders included.' },
      { title: 'Subscriptions', desc: 'Recurring billing for memberships, subscriptions, and retainer clients.' },
      { title: 'Developer API', desc: 'RESTful API, webhooks, and SDKs. Build a fully custom payment experience end to end.' },
    ]
  ), 660);

  page.add(mkRelated(
    'Explore by industry',
    [
      { emoji: '🛒', title: 'E-commerce', desc: 'Shopify, WooCommerce plugins and a powerful checkout that converts.' },
      { emoji: '🏪', title: 'Retail', desc: 'POS, Tap to Pay, and card terminals for physical stores.' },
      { emoji: '💜', title: 'Nonprofits', desc: 'Donation pages, recurring giving, and event QR codes.' },
    ],
    ac
  ), 380);

  page.add(mkCTA(
    'Start accepting payments in Singapore today',
    'Join 15,000+ businesses already growing with HitPay. Free to start — no credit card needed.',
    'Create free account',
    'Talk to sales',
    ac
  ), 300);

  page.add(mkFooter(
    ac,
    ['Payment Gateway', 'POS System', 'Payment Links', 'Invoicing', 'Subscriptions'],
    ['E-commerce', 'Retail', 'Nonprofits', 'F&B', 'Freelancers']
  ), 280);

  return page.f;
}

function buildLandingPlainInspired(xOffset = 6160) {
  const page = new Page('General Landing v2 (Plain-inspired)', xOffset);
  const ac = C.hpAction;

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroLandingPlain(), 560);
  page.add(mkTrustBar(
    'FAST-GROWING BUSINESSES TRUST HITPAY',
    ['E-commerce', 'Retail', 'F&B', 'Nonprofits', 'Freelancers', 'Services']
  ), 120);

  // Pain section (dark)
  page.add((() => {
    const sec = mkFrame('PainSection', 1440, 280, C.slate900);
    const h2 = mkText('Payment sprawl is\nslowing you down', 40, W.extrabold, C.white, 'CENTER', 760);
    h2.lineHeight = { value: 52, unit: 'PIXELS' };
    h2.x = 340; h2.y = 44;
    sec.appendChild(h2);
    const p = mkText('Your customers pay with PayNow, GrabPay at checkout, and cards online. You\'re managing multiple systems, chasing separate reports, and losing track of revenue across every channel.', 17, W.regular, C.slate400, 'CENTER', 760);
    p.lineHeight = { value: 28, unit: 'PIXELS' };
    p.x = 340; p.y = 172;
    sec.appendChild(p);
    return sec;
  })(), 280);

  page.add(mkStats(
    [
      { value: '10+', label: 'Countries supported' },
      { value: '$1B+', label: 'Payment volume' },
      { value: '700+', label: 'Payment methods' },
      { value: 'T+1', label: 'Business day payouts' },
    ],
    C.hpDeepBlue, C.white, C.hpBlue100
  ), 192);

  // Orchestration dark section
  page.add((() => {
    const sec = mkFrame('OrchestrationSection', 1440, 380, C.slate800);
    const eyebrow = mkText('THE HITPAY DIFFERENCE', 11, W.semibold, C.hpBlue100, 'CENTER', 800);
    eyebrow.letterSpacing = { value: 1.5, unit: 'PIXELS' };
    eyebrow.x = 320; eyebrow.y = 40;
    sec.appendChild(eyebrow);
    const h2 = mkText('HitPay brings every payment together', 36, W.bold, C.white, 'CENTER', 800);
    h2.lineHeight = { value: 44, unit: 'PIXELS' };
    h2.x = 320; h2.y = 68;
    sec.appendChild(h2);
    const orchCards = [
      { title: 'Accept every method', desc: 'PayNow, cards, e-wallets, BNPL — online, in-store, and via link. One account, every way.' },
      { title: 'Understand your revenue', desc: 'Unified dashboard showing sales across every channel. Real-time, consolidated, accurate.' },
      { title: 'Scale without switching', desc: 'Start with payment links. Add POS. Enable API. HitPay grows with your business.' },
    ];
    const orchColW = (1152 - 64) / 3;
    orchCards.forEach((oc, i) => {
      const cx = 144 + i * (orchColW + 32);
      const cardF = mkFrame('OCard/' + oc.title, orchColW, 160, C.slate900, 16);
      cardF.x = cx; cardF.y = 164;
      const tt = mkText(oc.title, 16, W.semibold, C.white, 'LEFT', orchColW - 48);
      tt.x = 24; tt.y = 20;
      cardF.appendChild(tt);
      const dd = mkText(oc.desc, 14, W.regular, C.slate400, 'LEFT', orchColW - 48);
      dd.lineHeight = { value: 22, unit: 'PIXELS' };
      dd.x = 24; dd.y = 52;
      cardF.appendChild(dd);
      sec.appendChild(cardF);
    });
    return sec;
  })(), 380);

  page.add(mkFeature({
    label: 'Payments',
    h2: 'Accept every way customers pay',
    p: 'Your customers pay their way — PayNow, GrabPay, cards, e-wallets, and BNPL. HitPay gives every option at checkout, in-store, and via link. No friction. No abandoned sales.',
    bullets: [
      'PayNow QR, GrabPay, ShopeePay, and 700+ methods',
      'Visa, Mastercard, Amex — Apple Pay & Google Pay ready',
      'Buy Now Pay Later with Atome',
      'Cross-border wallets for tourists and overseas buyers',
    ],
    mockUI: mockCheckout(),
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 480);

  page.add(mkFeature({
    label: 'Platform',
    h2: 'One command center. Every channel.',
    p: 'In-store POS, online checkout, payment links, QR codes — all in a single dashboard. No stitching together reports from separate systems. No reconciliation headaches. Just one clear view.',
    bullets: [
      'Unified dashboard across all sales channels',
      'POS for retail, payment links for social',
      'Real-time consolidated revenue reports',
      'Multi-location management from one account',
    ],
    mockUI: mockOmnichannel(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  page.add(mkFeature({
    label: 'Cross-border',
    h2: 'Go regional in minutes',
    p: 'Accept cross-border QR payments from 10 markets without setting up accounts in each country. Tourists pay with their home wallet. Overseas buyers pay their way. You settle in SGD.',
    bullets: [
      'Cross-border QR live in 10 markets',
      'Alipay+, WeChat Pay, DuitNow, PromptPay',
      '100+ currencies accepted',
      'Settle in SGD — no FX complexity for you',
    ],
    mockUI: mockQR(),
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 480);

  page.add(mkFeature({
    label: 'Onboarding',
    h2: 'Be live today. Backed every day.',
    p: 'Sign up and accept your first payment in under 10 minutes. No paperwork, no waiting. And when you need help, our team is there 7 days a week — because your business doesn\'t close on weekends.',
    bullets: [
      'Verify and go live in under 10 minutes',
      'Support 7 days a week by chat and email',
      'Dedicated account managers for larger businesses',
      'Comprehensive docs and video tutorials',
    ],
    mockUI: mockPaymentLink(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  // "Simple to start. Built to scale." — dark comparison section
  page.add((() => {
    const sec = mkFrame('SpeedMeetPower', 1440, 480, C.slate900);
    const h2 = mkText('Simple to start.\nBuilt to scale.', 48, W.extrabold, C.white, 'CENTER', 800);
    h2.lineHeight = { value: 58, unit: 'PIXELS' };
    h2.x = 320; h2.y = 44;
    sec.appendChild(h2);
    const sub = mkText('When comparing payment platforms, they all look the same. Here\'s what makes HitPay different.', 17, W.regular, C.slate400, 'CENTER', 720);
    sub.lineHeight = { value: 26, unit: 'PIXELS' };
    sub.x = 360; sub.y = 180;
    sec.appendChild(sub);
    const divLine = mkRect(1152, 1, C.slate800);
    divLine.x = 144; divLine.y = 234;
    sec.appendChild(divLine);
    const rows = [
      { q: 'When you need the widest payment coverage', a: '→ 700+ methods, local wallets, and cross-border QR in 10 markets.' },
      { q: 'When you want zero monthly fees', a: '→ Pay only when you get paid. No subscriptions, no setup costs.' },
      { q: 'When you need to expand regionally', a: '→ Activate cross-border payments in minutes. No new accounts.' },
      { q: 'When you demand extensibility', a: '→ Full REST API, webhooks, and SDKs for custom integrations.' },
      { q: 'When you just need it to work', a: '→ Setup in 10 minutes. Supported every day. Seriously.' },
    ];
    rows.forEach((row, i) => {
      const y = 252 + i * 42;
      const qT = mkText(row.q, 14, W.medium, C.slate300, 'LEFT', 560);
      qT.x = 144; qT.y = y;
      sec.appendChild(qT);
      const aT = mkText(row.a, 14, W.regular, C.hpBlue100, 'LEFT', 480);
      aT.x = 736; aT.y = y;
      sec.appendChild(aT);
      if (i < rows.length - 1) {
        const rowDiv = mkRect(1152, 1, C.slate800);
        rowDiv.x = 144; rowDiv.y = y + 34;
        sec.appendChild(rowDiv);
      }
    });
    return sec;
  })(), 480);

  page.add(mkTestimonial(
    'We evaluated three payment platforms before choosing HitPay. The setup was genuinely 10 minutes. The dashboard is clean. And when we had a question at 9pm on a Sunday, someone actually replied.',
    'Marcus Lim',
    'Co-founder, Ritual Coffee SG — F&B & Subscription Business',
    ac
  ), 380);

  // Time-to-value section
  page.add((() => {
    const sec = mkFrame('TimeToValue', 1440, 380, C.white);
    const eyebrow = mkText('TIME IS MONEY. MONEY IS YOURS.', 11, W.semibold, ac, 'CENTER', 800);
    eyebrow.letterSpacing = { value: 1.5, unit: 'PIXELS' };
    eyebrow.x = 320; eyebrow.y = 44;
    sec.appendChild(eyebrow);
    const h2 = mkText("Here's what you can do\nin under 10 minutes", 36, W.bold, C.slate900, 'CENTER', 800);
    h2.lineHeight = { value: 44, unit: 'PIXELS' };
    h2.x = 320; h2.y = 68;
    sec.appendChild(h2);
    const ttvCols = [
      { time: '2 minutes', items: ['Create your free account', 'Set business name and logo', 'Link your Singapore bank account'] },
      { time: '5 minutes', items: ['Complete KYC verification', 'Generate your first PayNow QR', 'Share your first payment link'] },
      { time: '10 minutes', items: ['Receive your first payment', 'See it in your dashboard', 'Know exactly when it hits your bank'] },
    ];
    const ttvColW = (1152 - 64) / 3;
    ttvCols.forEach((col, i) => {
      const cx = 144 + i * (ttvColW + 32);
      const timeLbl = mkText(col.time, 14, W.bold, ac);
      timeLbl.x = cx; timeLbl.y = 176;
      sec.appendChild(timeLbl);
      col.items.forEach((item, j) => {
        const dot = mkRect(6, 6, ac, 3);
        dot.x = cx; dot.y = 212 + j * 36 + 5;
        sec.appendChild(dot);
        const itemT = mkText(item, 14, W.regular, C.slate700, 'LEFT', ttvColW - 24);
        itemT.x = cx + 18; itemT.y = 212 + j * 36;
        sec.appendChild(itemT);
      });
    });
    return sec;
  })(), 380);

  page.add(mkGrid(
    'Engineered with enterprise-level security.\nBuilt for every business.',
    'We don\'t treat security as a set of badges. It\'s a core engineering principle.',
    [
      { title: 'MAS Licensed', desc: 'Licensed by the Monetary Authority of Singapore under the Payment Services Act.' },
      { title: 'PCI DSS Level 1', desc: 'The highest payment card industry certification. Your customers\' data is always protected.' },
      { title: 'SOC 2 Compliant', desc: 'Independently audited security, availability, and confidentiality controls.' },
      { title: 'End-to-end encryption', desc: 'All payment data encrypted in transit and at rest. Every single transaction.' },
      { title: '99.99% uptime SLA', desc: 'Built for reliability. Your checkout is always up when customers are ready to pay.' },
      { title: 'Fraud detection', desc: 'Real-time risk scoring on every transaction. Reduce chargebacks without blocking good orders.' },
    ]
  ), 660);

  page.add(mkCTA(
    'Join the businesses that trust HitPay\nto accept payments their way',
    'Free to start. No monthly fees. No lock-in. Just payments that work.',
    'Create free account',
    'Talk to sales',
    ac
  ), 300);

  page.add(mkFooter(
    ac,
    ['Payment Gateway', 'POS System', 'Payment Links', 'Invoicing', 'Subscriptions'],
    ['E-commerce', 'Retail', 'Nonprofits', 'F&B', 'Freelancers']
  ), 280);

  return page.f;
}

// ── GENERIC INDUSTRY HERO ────────────────────────────────────

function mkHeroIndustry(cfg, ac) {
  const sec = mkFrame('Hero', 1440, 560, cfg.heroBg);

  const badge = mkPill(cfg.badge, cfg.pillBg, ac, 16, 8, 100);
  badge.x = 144; badge.y = 80;
  sec.appendChild(badge);

  const h1 = mkH2(cfg.heroH1, 56, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 126;
  sec.appendChild(h1);

  const sub = mkText(cfg.heroSub, 20, W.regular, C.hpTextSec, 'LEFT', 540);
  sub.lineHeight = { value: 30, unit: 'PIXELS' };
  sub.x = 144; sub.y = 290;
  sec.appendChild(sub);

  const b1 = mkBtn('Start for free', ac, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 390;
  sec.appendChild(b1);

  const b2 = mkBtn('Contact sales', null, C.slate800, 24, 14, 12, true);
  b2.x = 296; b2.y = 390;
  sec.appendChild(b2);

  const fine = mkText('Free to sign up · No setup fees · Pay per transaction', 14, W.regular, C.slate500);
  fine.x = 144; fine.y = 444;
  sec.appendChild(fine);

  const mock = cfg.heroMockFn();
  mock.x = cfg.heroMockX !== undefined ? cfg.heroMockX : 900;
  mock.y = cfg.heroMockY !== undefined ? cfg.heroMockY : 130;
  sec.appendChild(mock);

  return sec;
}

// ── GENERIC INDUSTRY PAGE BUILDER ────────────────────────────

function buildIndustry(cfg, xOffset) {
  const page = new Page(cfg.name, xOffset);
  const ac = C.hpAction;  // Always brand action blue

  // Override per-industry hero colors with brand palette
  const brandedCfg = Object.assign({}, cfg, { heroBg: C.hpBlue50, pillBg: C.hpBlue50 });

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroIndustry(brandedCfg, ac), 560);
  page.add(mkTrustBar(cfg.trustTitle, cfg.trustItems), 120);
  page.add(mkIntro(cfg.introTitle, cfg.introSub), 240);

  cfg.features.forEach((f, i) => {
    page.add(mkFeature({
      label: f.label,
      h2: f.h2,
      p: f.p,
      bullets: f.bullets,
      mockUI: f.mockFn(),
      bg: i % 2 === 0 ? C.hpBlue50 : C.white,
      textSide: i % 2 === 0 ? 'left' : 'right',
      accent: ac,
    }), 480);
  });

  page.add(mkStats(
    cfg.stats,
    C.hpDeepBlue,
    C.white,
    C.hpBlue100
  ), 192);

  page.add(mkTestimonial(
    cfg.testimonial.quote,
    cfg.testimonial.name,
    cfg.testimonial.role,
    ac,
    C.hpBlue100
  ), 380);

  page.add(mkGrid(cfg.gridTitle, cfg.gridSub, cfg.gridItems), 660);
  page.add(mkRelated('Explore more solutions', cfg.related, ac), 380);
  if (cfg.faqItems && cfg.faqItems.length > 0) {
    page.add(mkFAQ(cfg.faqItems, ac), 96 + cfg.faqItems.length * 136 + 40);
  }
  page.add(mkCTA(cfg.ctaTitle, cfg.ctaSub, cfg.ctaBtn1, cfg.ctaBtn2, ac), 300);
  page.add(mkFooter(ac, cfg.footerProducts, cfg.footerIndustries), 280);

  return page.f;
}

// ── INDUSTRY CONFIGS ─────────────────────────────────────────

const INDUSTRY = {};

INDUSTRY.restaurants = {
  name: 'Restaurants — HitPay',
  accent: C.orange600,
  heroBg: C.orange50,
  pillBg: C.orange50,
  badge: 'Restaurants & F&B',
  heroH1: 'Payments built for\nrestaurants and F&B',
  heroSub: 'Accept PayNow, cards, and digital wallets at every table. QR ordering, tableside payments, and delivery integrations — all in one platform, zero monthly fees.',
  heroMockFn: () => mockQR(),
  heroMockX: 920, heroMockY: 150,
  trustTitle: 'TRUSTED BY F&B BUSINESSES ACROSS SINGAPORE',
  trustItems: ['Cafes', 'Full-Service Restaurants', 'Cloud Kitchens', 'Hawker Stalls', 'Bubble Tea', 'Catering'],
  introTitle: 'From dine-in to delivery, one payment platform',
  introSub: 'HitPay powers the full F&B payment stack — table QR codes, card terminals, online ordering, and delivery integration — all from one dashboard, with next-day payouts.',
  features: [
    {
      label: 'QR Ordering',
      h2: 'Let customers scan, order, and pay — no app needed',
      p: 'Place a HitPay QR code on every table. Customers scan and pay with PayNow, cards, or digital wallets — without waiting for the bill. Reduce service staff workload and turn tables faster.',
      bullets: [
        'Static QR codes — no app download required',
        'PayNow, GrabPay, cards, and more accepted',
        'QR codes print-ready for tables, counters, and walls',
        'All payments tracked in real time on your dashboard',
      ],
      mockFn: () => mockQR(),
    },
    {
      label: 'Card Payments',
      h2: 'Accept every payment method your customers carry',
      p: 'From contactless cards and PayNow to GrabPay, ShopeePay, and Apple Pay — HitPay ensures you never miss a sale. Deploy card terminals at your counter or use Tap to Pay on your phone.',
      bullets: [
        'Visa, Mastercard, Amex, and contactless NFC',
        'PayNow QR displayed on card terminal screen',
        'GrabPay, ShopeePay, FavePay, and major e-wallets',
        'PCI DSS compliant — secure for high-volume restaurants',
      ],
      mockFn: () => mockCheckout(),
    },
    {
      label: 'Delivery & Takeaway',
      h2: 'Take orders and collect payment before cooking starts',
      p: 'Send a payment link over WhatsApp or Instagram DM and collect payment before the order is prepared. Perfect for cloud kitchens, catering operators, and high-demand weekends.',
      bullets: [
        'Create a payment link in under 60 seconds',
        'Pre-payment before food preparation begins',
        'Works on mobile — no checkout friction for customers',
        'All orders tracked alongside your dine-in payments',
      ],
      mockFn: () => mockPaymentLink(),
    },
    {
      label: 'Reporting',
      h2: 'Know your best sellers and busiest hours',
      p: "HitPay's dashboard gives you a real-time view of revenue by payment method, day, and channel. Know when your peak hours are and use the data to staff and stock accordingly.",
      bullets: [
        'Daily, weekly, and monthly revenue summaries',
        'Revenue breakdown by payment type and channel',
        'Export reports to Excel for accounting',
        'Next business day payouts — reliable cash flow',
      ],
      mockFn: () => mockPOSDashboard(),
    },
  ],
  stats: [
    { value: 'S$0',  label: 'Monthly platform fees' },
    { value: '<60s', label: 'QR code setup' },
    { value: 'T+1',  label: 'Business day payouts' },
    { value: '700+', label: 'Payment methods' },
  ],
  statsBg: C.slate900, statsAccent: C.orange600,
  testimonial: {
    quote: 'We deployed HitPay QR codes on all 20 tables and customers now pay themselves. Our average table turnover time dropped by 8 minutes and our cashier queue disappeared entirely.',
    name: 'Wei Jie Tan',
    role: 'Operations Manager, SOHO Kitchen & Bar — Singapore',
    lightBg: C.orange100,
  },
  gridTitle: 'Everything your F&B business needs',
  gridSub: 'HitPay covers the full payment lifecycle for restaurants, cafes, and cloud kitchens.',
  gridItems: [
    { title: 'Fast payouts',       desc: 'Receive your revenue the next business day. Essential for F&B businesses managing daily cash flow.' },
    { title: 'Card terminals',     desc: 'Deploy HitPay card terminals at your counter. Accepts cards, PayNow, GrabPay, and contactless NFC.' },
    { title: 'Payment Soundbox',   desc: 'Audio and visual payment confirmation. Your staff always knows when a transaction goes through.' },
    { title: 'Tax receipts',       desc: 'Auto-generate GST-compliant receipts for dine-in and delivery orders. Email to customers automatically.' },
    { title: 'Tap to Pay',         desc: 'Take tableside payments on iPhone or Android — no card terminal hardware required.' },
    { title: 'Multi-outlet',       desc: 'Manage all your outlets from one HitPay account. Unified reporting, single payout stream.' },
  ],
  related: [
    { emoji: '🛒', title: 'E-commerce', desc: 'Sell vouchers, gift sets, or food products online.' },
    { emoji: '🏪', title: 'Retail',     desc: 'Unified POS and online payments for physical retail.' },
    { emoji: '🎪', title: 'Events',     desc: 'Collect payments for private dining and catering events.' },
  ],
  faqItems: [
    { q: 'Does HitPay work with food delivery platforms like GrabFood or Foodpanda?', a: "HitPay doesn't integrate directly with delivery apps, but payment links via WhatsApp let you collect pre-orders before preparation begins." },
    { q: 'Can I accept PayNow at my restaurant without a card terminal?', a: 'Yes — print a static PayNow QR from your dashboard and display it on tables or counters. No terminal hardware required.' },
    { q: 'Is there a setup fee or monthly cost to use HitPay for my F&B business?', a: 'No. HitPay has zero setup fees and no monthly subscription — you only pay a small per-transaction fee when a payment is received.' },
    { q: 'How do I set up a QR code for my restaurant tables?', a: 'Log in to your HitPay dashboard, generate a payment QR, and print it for each table. The entire process takes under 5 minutes.' },
    { q: 'Can HitPay replace my existing NETS terminal at the counter?', a: 'Yes. HitPay terminals accept NETS, Visa, Mastercard, PayNow, GrabPay, and NFC wallets — replacing multiple devices with one.' },
    { q: 'How long does it take to receive payouts from restaurant sales?', a: 'HitPay pays out the next business day (T+1). Revenue collected today arrives in your bank account the following business day.' },
    { q: 'My restaurant has multiple outlets — can I manage them under one account?', a: 'Yes. HitPay supports multi-outlet management from a single account with unified revenue reporting across all locations.' },
    { q: 'What happens if a customer disputes a payment made at my restaurant?', a: "HitPay's support team guides you through the chargeback process. All transaction records are stored in your dashboard for resolution." },
  ],
  ctaTitle: 'Ready to modernise your F&B payments?',
  ctaSub: 'Join hundreds of Singapore restaurants and cafes already using HitPay. Free to start, no credit card needed.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Request a demo',
  footerProducts: ['QR Payments', 'Card Terminals', 'Payment Links', 'Soundbox'],
  footerIndustries: ['Restaurants', 'Retail', 'E-commerce', 'Nonprofits'],
};

INDUSTRY.travel = {
  name: 'Travel & Tourism — HitPay',
  accent: C.sky600,
  heroBg: C.sky50,
  pillBg: C.sky50,
  badge: 'Travel & Tourism',
  heroH1: 'Collect tour deposits and\nbookings without the hassle',
  heroSub: 'Accept PayNow, cards, Alipay+, and cross-border payments. Send instant payment links for tour bookings and deposits — no website required.',
  heroMockFn: () => mockPaymentLink(),
  heroMockX: 900, heroMockY: 130,
  trustTitle: 'TRUSTED BY TRAVEL BUSINESSES ACROSS SOUTHEAST ASIA',
  trustItems: ['Tour Operators', 'Travel Agencies', 'Adventure Sports', 'Cultural Tours', 'Cruise Packages', 'Visa Services'],
  introTitle: 'Every booking method your customers prefer',
  introSub: 'Whether your customers book via WhatsApp, your website, or Instagram — HitPay lets you collect deposits and full payments instantly, in any currency.',
  features: [
    {
      label: 'Booking Payments',
      h2: 'Send payment links for deposits in under a minute',
      p: "No website? No problem. Create a payment link for any tour package or deposit amount and share it via WhatsApp, email, or Instagram. Customers pay instantly with PayNow, cards, or GrabPay.",
      bullets: [
        'Custom amount payment links — no coding needed',
        'Share via WhatsApp, email, or Instagram',
        'All major local and international payment methods',
        'Payment confirmation sent automatically to customer',
      ],
      mockFn: () => mockPaymentLink(),
    },
    {
      label: 'Revenue Dashboard',
      h2: 'Track bookings and revenue across all tour packages',
      p: 'See every payment, every tour, and every customer in one dashboard. Know which packages are your best sellers, monitor cash flow, and get paid the next business day.',
      bullets: [
        'Real-time dashboard by package, channel, and date',
        'Revenue trend charts — week by week',
        'All payment methods shown in one view',
        'Next business day payouts (T+1)',
      ],
      mockFn: () => mockDashboard(),
    },
    {
      label: 'Recurring Packages',
      h2: 'Sell travel packages and memberships on subscription',
      p: 'Offer tour memberships, monthly adventure packages, or corporate travel plans with automatic recurring billing. HitPay handles the charging, reminders, and retries automatically.',
      bullets: [
        'Monthly, quarterly, and annual billing',
        'Automated payment reminders before charge date',
        'Smart retries for failed payments',
        'Self-service portal for customers to manage plans',
      ],
      mockFn: () => mockSubscriptions(),
    },
    {
      label: 'Corporate Invoicing',
      h2: 'Invoice corporate clients and travel agents professionally',
      p: 'Send branded invoices with payment links embedded. Track which invoices are paid, overdue, or pending. Automated reminders do the follow-up for you.',
      bullets: [
        'Branded invoice templates with your logo',
        'Online payment link embedded in every invoice',
        'Automated reminders before and after due date',
        'Full payment history for accounting and audits',
      ],
      mockFn: () => mockInvoice(),
    },
  ],
  stats: [
    { value: '11',   label: 'Markets served' },
    { value: 'S$0',  label: 'Monthly platform fees' },
    { value: 'T+1',  label: 'Business day payouts' },
    { value: '700+', label: 'Payment methods accepted' },
  ],
  statsBg: C.slate900, statsAccent: C.sky600,
  testimonial: {
    quote: 'We used to chase clients for bank transfers for weeks. With HitPay payment links, tour deposits are paid within hours of sending. Our cash flow has never been more predictable.',
    name: 'Sarah Lim',
    role: 'Director, Discover Asia Tours — Singapore',
    lightBg: C.sky100,
  },
  gridTitle: 'Everything your travel business needs',
  gridSub: 'HitPay provides a complete payment stack for tour operators, travel agencies, and adventure companies.',
  gridItems: [
    { title: 'Cross-border payments', desc: 'Accept payments from customers across Southeast Asia, including Alipay+, WeChat Pay, and international cards.' },
    { title: 'Multi-currency',        desc: 'Display prices and accept payments in multiple currencies. HitPay handles conversion transparently.' },
    { title: 'Instant QR codes',      desc: 'Generate QR codes for on-the-spot payments at travel fairs, shows, and roadshows.' },
    { title: 'Payment links',         desc: 'Share via WhatsApp or email. No website or app required for your customers to pay.' },
    { title: 'Automated receipts',    desc: 'Every booking payment triggers an automatic receipt email to the customer.' },
    { title: 'MAS licensed',          desc: "HitPay is licensed by the Monetary Authority of Singapore — your clients' payments are safe and regulated." },
  ],
  related: [
    { emoji: '🎪', title: 'Events',    desc: 'Collect deposits and ticket payments for events and experiences.' },
    { emoji: '🏪', title: 'Retail',    desc: 'Sell travel merchandise, gear, and accessories in-store and online.' },
    { emoji: '📦', title: 'Wholesale', desc: 'Invoice travel agents and B2B clients professionally.' },
  ],
  faqItems: [
    { q: 'Does HitPay support Alipay+ and WeChat Pay for Chinese visitors?', a: 'Yes. HitPay supports Alipay+ and WeChat Pay, allowing you to accept payments from Chinese tourists and international visitors.' },
    { q: 'Can I accept payments in foreign currencies from international clients?', a: 'Yes. HitPay supports multi-currency payments across 100+ currencies. Funds are settled in SGD the next business day.' },
    { q: 'How do I collect a tour deposit without a website?', a: 'Create a payment link in your HitPay dashboard in under 60 seconds and share it via WhatsApp, email, or Instagram.' },
    { q: 'Is HitPay suitable for solo travel guides and freelance operators?', a: 'Yes. HitPay accepts sole proprietors and freelancers. You can sign up with your personal NRIC and start accepting payments immediately.' },
    { q: 'What documents do I need to sign up for HitPay as a travel agency?', a: 'You will need your ACRA business registration, director NRIC, and bank account details. Approval typically takes 1–3 business days.' },
    { q: 'Can I issue official receipts or invoices for tour payments through HitPay?', a: 'Yes. HitPay auto-generates receipts for every payment and supports branded invoices with your logo and itemised tour details.' },
    { q: 'What happens if a customer requests a refund for a cancelled tour?', a: 'You can issue full or partial refunds directly from your HitPay dashboard. Refunds are processed within 5–10 business days.' },
    { q: 'How long does it take to set up HitPay and start collecting payments?', a: 'Approval takes 1–3 business days. After that, you can generate a payment link and start collecting in under 5 minutes.' },
  ],
  ctaTitle: 'Start collecting tour payments today',
  ctaSub: 'No setup fees, no monthly subscription. HitPay is free to start — pay only per transaction.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Contact sales',
  footerProducts: ['Payment Links', 'QR Payments', 'Invoicing', 'Subscriptions'],
  footerIndustries: ['Travel', 'Events', 'Retail', 'Nonprofits'],
};

INDUSTRY.education = {
  name: 'Education — HitPay',
  accent: C.blue600,
  heroBg: C.blue50,
  pillBg: C.blue100,
  badge: 'Education & Enrichment',
  heroH1: 'Automate tuition fee\ncollection with ease',
  heroSub: 'Replace manual PayNow transfers and cash collection. Set up recurring billing for monthly tuition fees and get paid automatically — no more chasing parents.',
  heroMockFn: () => mockSubscriptions(),
  heroMockX: 880, heroMockY: 130,
  trustTitle: 'TRUSTED BY EDUCATION BUSINESSES ACROSS SINGAPORE',
  trustItems: ['Tuition Centres', 'Enrichment Schools', 'Language Schools', 'Music Academies', 'Online Tutors', 'Preschools'],
  introTitle: 'Modern payments for modern education businesses',
  introSub: 'HitPay helps tuition centres, enrichment schools, and private tutors automate fee collection, manage subscriptions, and accept every payment method parents prefer.',
  features: [
    {
      label: 'Recurring Billing',
      h2: 'Automate monthly fee collection — set it and forget it',
      p: 'Stop collecting tuition fees manually. Set up recurring billing and HitPay automatically charges parents monthly — with automatic receipts and smart retries for failed payments.',
      bullets: [
        'Monthly, weekly, and term billing cycles',
        'Automatic email receipts to parents after each charge',
        'Smart retries for failed payments — reduce lapsed accounts',
        'Parents manage their own payment details securely',
      ],
      mockFn: () => mockSubscriptions(),
    },
    {
      label: 'Payment Links',
      h2: 'Collect registration fees and materials charges instantly',
      p: 'Create a payment link in seconds for enrolment fees, exam registrations, or material charges. Share it via WhatsApp or email — parents pay in one tap.',
      bullets: [
        'Custom amount links for any one-time charge',
        'All major payment methods including PayNow and GrabPay',
        'Works on mobile — parents pay without visiting a branch',
        'Instant notification when payment is completed',
      ],
      mockFn: () => mockPaymentLink(),
    },
    {
      label: 'Cashless Events',
      h2: 'Accept cashless payments at school events and fairs',
      p: 'Run bake sales, open houses, and school fairs without handling cash. HitPay QR codes let visitors pay instantly with PayNow or any e-wallet.',
      bullets: [
        'Static QR codes to print and display at stalls',
        'No Wi-Fi required for PayNow QR payments',
        'All proceeds tracked in your dashboard in real time',
        'Tap to Pay available for card-paying guests',
      ],
      mockFn: () => mockQR(),
    },
    {
      label: 'Corporate Invoicing',
      h2: 'Invoice companies and corporate clients professionally',
      p: 'Send branded invoices to corporate training clients, schools, and government bodies. Track payment status, send automated reminders, and maintain a full audit trail.',
      bullets: [
        'Customisable invoice templates with your logo',
        'Online payment link embedded in every invoice',
        'Automated reminders before and after due date',
        'Full payment records for IRAS and audit purposes',
      ],
      mockFn: () => mockInvoice(),
    },
  ],
  stats: [
    { value: 'S$0',   label: 'Monthly platform fees' },
    { value: '100%',  label: 'Automated fee collection' },
    { value: 'T+1',   label: 'Business day payouts' },
    { value: '<5 min', label: 'Setup time' },
  ],
  statsBg: C.slate900, statsAccent: C.blue600,
  testimonial: {
    quote: "Before HitPay, I spent 3 hours every month chasing parents for payment via bank transfer. Now fees are collected automatically and I only deal with exceptions. It's been transformational.",
    name: 'Michelle Ong',
    role: 'Principal, BrightMinds Enrichment Centre — Singapore',
    lightBg: C.blue100,
  },
  gridTitle: 'Everything your education business needs',
  gridSub: 'From enrolment to recurring billing, HitPay simplifies every payment touchpoint for educators.',
  gridItems: [
    { title: 'Flexible billing',    desc: 'Bill parents monthly, weekly, by term, or per class. HitPay supports all billing frequencies.' },
    { title: 'Parent self-service', desc: 'Parents can update card details, view receipts, and manage their subscription without calling you.' },
    { title: 'PDPA compliant',      desc: "HitPay stores payment data securely so you don't have to. No more spreadsheets with sensitive card info." },
    { title: 'Integrated receipts', desc: 'Every payment triggers an automatic, GST-compliant receipt emailed directly to parents.' },
    { title: 'Promo codes',         desc: 'Offer sibling discounts, new student promotions, or loyalty rewards with built-in coupon codes.' },
    { title: 'Multi-branch',        desc: 'Run multiple locations from one account. Unified revenue view, separate location reporting.' },
  ],
  related: [
    { emoji: '💪', title: 'Fitness', desc: 'Recurring billing for gym memberships and class packs.' },
    { emoji: '💅', title: 'Beauty',  desc: 'Membership billing and booking payments for wellness businesses.' },
    { emoji: '💜', title: 'Nonprofits', desc: 'Accept donations and grants with zero platform fees.' },
  ],
  faqItems: [
    { q: 'Can parents set up automatic monthly tuition fee payments through HitPay?', a: 'Yes. HitPay subscriptions let parents set up auto-pay. You get paid on time every month without any manual follow-up.' },
    { q: 'Does HitPay support GIRO or just card payments for recurring billing?', a: 'HitPay currently supports recurring card payments (Visa, Mastercard) and PayNow for subscriptions. GIRO is not supported.' },
    { q: 'What is the cheapest way to collect monthly tuition fees in Singapore?', a: 'HitPay subscriptions via PayNow offer some of the lowest rates for recurring payments in Singapore, with no monthly platform fee.' },
    { q: 'Can I offer sibling discounts or different pricing tiers through HitPay?', a: 'Yes. HitPay supports multiple subscription plans, discount codes, and custom pricing for different student categories.' },
    { q: 'Is it safe for parents to store their card details for recurring billing?', a: 'Yes. HitPay is PCI DSS compliant. Card details are securely tokenised and never stored on HitPay servers directly.' },
    { q: 'What documents do I need to sign up for HitPay as a tuition centre?', a: 'You need your ACRA business registration, NRIC of the director, and your business bank account details for payouts.' },
    { q: 'Can I track which students have paid and which have not from the dashboard?', a: 'Yes. Your HitPay dashboard shows all subscription statuses — active, pending, and failed — with student-level detail.' },
    { q: 'Does HitPay integrate with any school management or scheduling software?', a: 'HitPay integrates via API and webhooks. Direct plugins for school management platforms are not currently available.' },
  ],
  ctaTitle: 'Automate your tuition fee collection today',
  ctaSub: 'Join Singapore educators already saving hours every month with HitPay. Free to sign up.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Request a demo',
  footerProducts: ['Subscriptions', 'Payment Links', 'QR Payments', 'Invoicing'],
  footerIndustries: ['Education', 'Fitness', 'Beauty', 'Nonprofits'],
};

INDUSTRY.computers = {
  name: 'Computers & Electronics — HitPay',
  accent: C.indigo600,
  heroBg: { r: 0.973, g: 0.969, b: 1.0 },
  pillBg: C.indigo50,
  badge: 'Computers & Electronics',
  heroH1: 'Payments for electronics\nstores, online and in-store',
  heroSub: 'Sell laptops, phones, and components online and in-store. Accept PayNow, cards, BNPL, and more — with one unified platform and next-day payouts.',
  heroMockFn: () => mockCheckout(),
  heroMockX: 900, heroMockY: 130,
  trustTitle: 'TRUSTED BY ELECTRONICS RETAILERS ACROSS SINGAPORE',
  trustItems: ['Computer Shops', 'Mobile Retailers', 'IT Resellers', 'Gaming Stores', 'Accessories', 'Component Suppliers'],
  introTitle: 'Handle high-value electronics transactions with confidence',
  introSub: 'From S$50 accessories to S$5,000 enterprise workstations, HitPay handles every transaction securely with the payment methods your customers expect.',
  features: [
    {
      label: 'Online Checkout',
      h2: 'A checkout that converts — with all local payment methods',
      p: "HitPay's checkout supports PayNow, GrabPay, Visa, Mastercard, Atome BNPL, and 700+ payment methods. Fewer abandoned carts. More completed sales.",
      bullets: [
        'PayNow, GrabPay, ShopeePay, and major e-wallets',
        'Buy Now Pay Later with Atome for big-ticket items',
        'Shopify, WooCommerce, and Wix integrations available',
        'Mobile-optimised checkout for on-the-go purchases',
      ],
      mockFn: () => mockCheckout(),
    },
    {
      label: 'In-store POS',
      h2: 'A POS system that handles high-value retail',
      p: 'Manage inventory, process payments, and issue receipts from one system. HitPay POS handles high-ticket electronics transactions reliably — with PayNow, cards, and BNPL all in one checkout.',
      bullets: [
        'Inventory management with low-stock alerts',
        'End-of-day sales reports and cash reconciliation',
        'Multiple staff logins with permission levels',
        'Works on iPad, Android tablet, or PC',
      ],
      mockFn: () => mockPOSDashboard(),
    },
    {
      label: 'Integrations',
      h2: 'Works with your existing store platform',
      p: 'Already on Shopify or WooCommerce? Add HitPay in minutes with our pre-built plugins. Or build a custom checkout experience with our developer API.',
      bullets: [
        'One-click plugin for Shopify, WooCommerce, Wix, Magento',
        'RESTful API for custom storefronts and B2B portals',
        'No coding required for platform integrations',
        'Webhooks for real-time order and payment notifications',
      ],
      mockFn: () => mockIntegrations(),
    },
    {
      label: 'B2B & Corporate',
      h2: 'Invoice IT departments and enterprise buyers',
      p: 'Corporate clients need professional invoices. HitPay lets you send branded invoices with payment links for bulk hardware orders, maintenance contracts, and software licences.',
      bullets: [
        'Branded invoice templates for professional B2B billing',
        'Online payment link embedded in every invoice',
        'PO reference numbers for corporate procurement',
        'Automated reminders reduce late payment rate',
      ],
      mockFn: () => mockInvoice(),
    },
  ],
  stats: [
    { value: 'S$0',  label: 'Monthly platform fees' },
    { value: '700+', label: 'Payment methods' },
    { value: 'T+1',  label: 'Business day payouts' },
    { value: '1 min', label: 'Plugin install time' },
  ],
  statsBg: C.slate900, statsAccent: C.indigo600,
  testimonial: {
    quote: 'Switching from Stripe to HitPay meant we could finally accept PayNow and GrabPay at checkout. Our Singapore conversion rate jumped by 22% in the first month — and we saved on fees.',
    name: 'Jason Ng',
    role: 'Founder, TechVault Electronics — Singapore',
    lightBg: C.indigo100,
  },
  gridTitle: 'Everything your electronics business needs',
  gridSub: 'HitPay gives electronics retailers a complete payment stack — online, in-store, and B2B.',
  gridItems: [
    { title: 'BNPL payments',    desc: 'Offer Atome BNPL at checkout. Drive higher average order values on laptops, phones, and accessories.' },
    { title: 'Fast payouts',     desc: 'Get paid the next business day. No holding periods — critical for high-turnover electronics retail.' },
    { title: 'Fraud protection', desc: 'Built-in risk scoring on every transaction. Reduces chargebacks without blocking legit customers.' },
    { title: 'Multi-currency',   desc: 'Sell to international customers. Accept cross-border payments with transparent conversion rates.' },
    { title: 'Hardware terminals', desc: 'Deploy card terminals at your service counter. Accepts contactless cards, PayNow, and NFC wallets.' },
    { title: 'Analytics',        desc: 'Real-time sales trends by product, channel, and location. Make smarter buying decisions.' },
  ],
  related: [
    { emoji: '🛒', title: 'E-commerce', desc: 'Powerful checkout for online electronics and accessories stores.' },
    { emoji: '🏪', title: 'Retail',     desc: 'POS and omnichannel payments for physical retail locations.' },
    { emoji: '📦', title: 'Wholesale',  desc: 'Invoice and collect from IT resellers and corporate buyers.' },
  ],
  faqItems: [
    { q: 'I am currently using Stripe — why should I switch to HitPay?', a: 'HitPay adds PayNow, GrabPay, and local Singapore wallets that Stripe does not support — boosting local conversion rates significantly.' },
    { q: 'Can HitPay handle high-value transactions above S$10,000 for enterprise orders?', a: 'Yes. HitPay supports high-value transactions. For very large orders, bank transfer via invoice is also available as an option.' },
    { q: 'Does HitPay support PayNow as a checkout option on my existing website?', a: "Yes. HitPay's Shopify and WooCommerce plugins add PayNow, GrabPay, and all major payment methods to your existing checkout." },
    { q: 'Is there a hardware cost or monthly rental fee for the HitPay card terminal?', a: 'HitPay card terminals are available for purchase outright. There is no monthly rental fee — you own the device.' },
    { q: 'Can I run multiple store locations with separate inventory and revenue reporting?', a: 'Yes. HitPay supports multi-location retail with separate inventory tracking and unified revenue reporting across all stores.' },
    { q: 'Does HitPay support Atome BNPL for big-ticket electronics purchases?', a: 'Yes. Atome BNPL is available through HitPay, letting customers pay in 3 monthly instalments for high-value electronics.' },
    { q: 'What is the transaction fee for card payments processed through HitPay?', a: "HitPay's standard card processing rate for Singapore is 2.4% + S$0.50 per transaction. PayNow rates are lower." },
    { q: 'How long does it take to integrate HitPay with my Shopify or WooCommerce store?', a: 'Installation takes under 5 minutes using our pre-built plugin. No developer is needed for standard platform integrations.' },
  ],
  ctaTitle: 'Ready to upgrade your payment stack?',
  ctaSub: 'Free to start, no monthly fees. Just sign up and start accepting payments today.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Talk to sales',
  footerProducts: ['Payment Gateway', 'POS System', 'Card Terminals', 'Invoicing'],
  footerIndustries: ['Electronics', 'E-commerce', 'Retail', 'Wholesale'],
};

INDUSTRY.beauty = {
  name: 'Beauty & Wellness — HitPay',
  accent: C.rose600,
  heroBg: C.rose50,
  pillBg: C.rose50,
  badge: 'Beauty & Wellness',
  heroH1: 'Payments for salons,\nspas, and wellness studios',
  heroSub: 'Sell memberships, collect deposits, and accept walk-in payments. HitPay makes it simple to run the financial side of your beauty or wellness business.',
  heroMockFn: () => mockSubscriptions(),
  heroMockX: 880, heroMockY: 130,
  trustTitle: 'TRUSTED BY BEAUTY & WELLNESS BUSINESSES ACROSS SINGAPORE',
  trustItems: ['Hair Salons', 'Nail Studios', 'Spas', 'Aesthetic Clinics', 'Massage Therapy', 'Yoga Studios'],
  introTitle: 'Focus on your clients, not chasing payments',
  introSub: 'From recurring memberships to one-time appointment deposits, HitPay automates your payment collection so you can focus on delivering exceptional client experiences.',
  features: [
    {
      label: 'Memberships',
      h2: 'Sell monthly packages and memberships automatically',
      p: 'Offer monthly facial packages, hair care plans, or wellness memberships with automatic recurring billing. HitPay charges clients monthly and sends receipts — no manual action needed.',
      bullets: [
        'Monthly and annual membership billing',
        'Automatic receipts sent to clients after each charge',
        'Smart retries for failed payments',
        'Clients manage their own payment details securely',
      ],
      mockFn: () => mockSubscriptions(),
    },
    {
      label: 'Deposits',
      h2: 'Collect appointment deposits to protect your calendar',
      p: 'Reduce no-shows by requiring a deposit when booking. Send a payment link via WhatsApp and collect the deposit before the appointment is confirmed.',
      bullets: [
        'Custom deposit amounts for any service',
        'Send via WhatsApp, Instagram, or email',
        'Clients pay with PayNow, cards, or GrabPay',
        'Instant notification when deposit is received',
      ],
      mockFn: () => mockPaymentLink(),
    },
    {
      label: 'Walk-in Payments',
      h2: 'Accept contactless payments at reception or chairside',
      p: "Accept cards, PayNow, and digital wallets at your reception using HitPay's card terminal, or turn any iPhone into a payment terminal with Tap to Pay.",
      bullets: [
        'Tap to Pay on iPhone or Android — no hardware needed',
        'Full card terminal for high-volume salons',
        'PayNow QR displayed at reception for instant payment',
        'All payments synced to your dashboard in real time',
      ],
      mockFn: () => mockTapToPay(),
    },
    {
      label: 'Business Reporting',
      h2: 'Understand your revenue and busiest time slots',
      p: 'See your daily and monthly revenue, top-performing services, and payment method breakdown from one dashboard. Know exactly how your business is growing.',
      bullets: [
        'Daily and monthly revenue reports',
        'Revenue by service or product category',
        'Export to CSV for your accountant',
        'Next business day payouts — reliable cash flow',
      ],
      mockFn: () => mockPOSDashboard(),
    },
  ],
  stats: [
    { value: 'S$0',  label: 'Monthly platform fees' },
    { value: '<60s', label: 'Payment link creation' },
    { value: 'T+1',  label: 'Business day payouts' },
    { value: '100%', label: 'Secure PCI DSS payments' },
  ],
  statsBg: C.slate900, statsAccent: C.rose600,
  testimonial: {
    quote: 'No-shows used to cost us 15% of our monthly revenue. With HitPay deposit links, clients pay a S$20 deposit to confirm every booking. Our no-show rate dropped to near zero.',
    name: 'Priya Nair',
    role: 'Founder, Bloom Beauty Studio — Singapore',
    lightBg: C.rose100,
  },
  gridTitle: 'Everything your beauty business needs',
  gridSub: 'HitPay covers every payment touchpoint for salons, spas, and wellness studios.',
  gridItems: [
    { title: 'Package vouchers',   desc: 'Sell treatment packages and gift vouchers online via your HitPay payment page. No website needed.' },
    { title: 'Product sales',      desc: 'Sell skincare and retail products alongside services using the HitPay online store.' },
    { title: 'QR codes',           desc: 'Print QR codes for reception desks and mirrors. Clients pay instantly with their phone.' },
    { title: 'Automated receipts', desc: 'Every payment triggers an instant receipt. Reduce admin time at reception.' },
    { title: 'Staff management',   desc: 'Create staff accounts with permission levels. Track which therapist or stylist generated each sale.' },
    { title: 'Multi-location',     desc: 'Manage multiple outlets from one HitPay account. Unified reporting across all your salons.' },
  ],
  related: [
    { emoji: '💪', title: 'Fitness',   desc: 'Recurring gym memberships and class pack billing.' },
    { emoji: '📚', title: 'Education', desc: 'Automated tuition fee collection and enrolment payments.' },
    { emoji: '🏪', title: 'Retail',    desc: 'POS and online store for beauty product retail.' },
  ],
  faqItems: [
    { q: 'Can I require clients to pay a deposit to confirm their appointment?', a: 'Yes. Create a custom-amount payment link and share it via WhatsApp. Clients pay the deposit instantly to confirm their slot.' },
    { q: 'Does HitPay integrate with booking systems like Fresha or Vagaro?', a: 'HitPay does not have a direct integration with Fresha or Vagaro, but works alongside them for payment collection.' },
    { q: 'How do I sell monthly membership packages to my salon clients?', a: 'Use HitPay Subscriptions to create a recurring monthly plan. Clients are charged automatically on their renewal date each month.' },
    { q: 'Can I accept contactless card payments at my chair without a terminal?', a: 'Yes. HitPay Tap to Pay turns your iPhone or Android into a card reader — accept cards anywhere without any extra hardware.' },
    { q: 'What is the cheapest way to collect payments from walk-in clients?', a: 'Display a PayNow QR at reception. Clients scan and pay instantly — zero hardware cost and the lowest available transaction rate.' },
    { q: 'Can I issue gift vouchers or package credits through HitPay?', a: 'Yes. Create a payment link for gift vouchers or package bundles. Clients purchase via PayNow, card, or GrabPay in seconds.' },
    { q: 'Is there a setup fee or monthly cost for using HitPay at my salon?', a: 'No. HitPay is free to set up with no monthly subscription. You only pay a per-transaction fee when payments are received.' },
    { q: 'How long does it take to set up HitPay and start accepting payments?', a: 'Account approval takes 1–3 business days. Once approved, you can accept your first payment in under 5 minutes.' },
  ],
  ctaTitle: 'Reduce no-shows and automate your billing today',
  ctaSub: 'Join Singapore beauty and wellness businesses already using HitPay. Free to start.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Request a demo',
  footerProducts: ['Subscriptions', 'Payment Links', 'Tap to Pay', 'Card Terminals'],
  footerIndustries: ['Beauty', 'Fitness', 'Education', 'Retail'],
};

INDUSTRY.furniture = {
  name: 'Furniture & Home — HitPay',
  accent: C.amber600,
  heroBg: C.amber50,
  pillBg: C.amber50,
  badge: 'Furniture & Home Living',
  heroH1: 'Sell furniture online\nand in-store with ease',
  heroSub: 'Accept BNPL for big-ticket items, invoice interior designers and corporate clients, and manage your showroom and e-commerce payments from one platform.',
  heroMockFn: () => mockCheckout(),
  heroMockX: 900, heroMockY: 130,
  trustTitle: 'TRUSTED BY FURNITURE & HOME BUSINESSES IN SINGAPORE',
  trustItems: ['Furniture Showrooms', 'Mattress Stores', 'Interior Design', 'Homeware', 'Lighting', 'Custom Furniture'],
  introTitle: 'High-value purchases need a seamless payment experience',
  introSub: 'Furniture customers spend S$1,000–S$20,000 in a single visit. HitPay ensures every payment — BNPL, card, PayNow, or B2B invoice — is handled professionally.',
  features: [
    {
      label: 'BNPL Payments',
      h2: 'Offer instalment payments and close more deals',
      p: 'Large furniture purchases are easier to close when customers can split the cost. HitPay supports Atome BNPL — letting buyers pay in 3 monthly instalments while you receive the full amount upfront.',
      bullets: [
        'Atome Buy Now Pay Later at checkout',
        'Customers pay in 3 zero-interest instalments',
        'You receive the full amount in one settlement',
        'Available online and at your showroom POS',
      ],
      mockFn: () => mockCheckout(),
    },
    {
      label: 'Showroom Payments',
      h2: 'Send payment links from your showroom in seconds',
      p: "When a customer loves a piece in your showroom but isn't ready to pay at the counter, send a payment link to their phone. They pay at home — you close the sale.",
      bullets: [
        'Send payment links via WhatsApp from the showroom floor',
        'Custom deposit amounts for custom order confirmations',
        'Customers pay with PayNow, cards, or GrabPay',
        'Instant notification when payment is received',
      ],
      mockFn: () => mockPaymentLink(),
    },
    {
      label: 'In-Store POS',
      h2: 'A POS system built for high-value retail',
      p: 'HitPay POS manages your inventory, processes payments, and issues receipts — all in one system. Works on iPad or Android tablet, no proprietary hardware required.',
      bullets: [
        'Inventory management for large SKU catalogues',
        'Accepts all payment methods at one terminal',
        'End-of-day reconciliation reports',
        'Multiple staff accounts with permission controls',
      ],
      mockFn: () => mockPOS(),
    },
    {
      label: 'Trade Invoicing',
      h2: 'Invoice interior designers and corporate buyers',
      p: 'Send professional invoices to interior designers, hotels, and corporate procurement teams. Payment links embedded in every invoice make it easy for clients to pay immediately.',
      bullets: [
        'Branded invoices with your logo and bank details',
        'Online payment link in every invoice',
        'Track paid, pending, and overdue invoices at a glance',
        'Automated payment reminders reduce late payments',
      ],
      mockFn: () => mockInvoice(),
    },
  ],
  stats: [
    { value: 'S$0',  label: 'Monthly platform fees' },
    { value: '3x',   label: 'Higher conversion with BNPL' },
    { value: 'T+1',  label: 'Business day payouts' },
    { value: '700+', label: 'Payment methods' },
  ],
  statsBg: C.slate900, statsAccent: C.amber600,
  testimonial: {
    quote: 'Adding Atome BNPL to our checkout increased our average order value by 40%. Customers who hesitated at S$3,000 for a sofa set now convert when they see they can pay in 3 instalments.',
    name: 'Daniel Chua',
    role: 'Owner, The Nook Furniture — Singapore',
    lightBg: C.amber100,
  },
  gridTitle: 'Everything your furniture business needs',
  gridSub: 'From showroom to delivery, HitPay handles every payment for furniture and home retailers.',
  gridItems: [
    { title: 'Custom deposits', desc: 'Collect custom order deposits via payment link. Secure the sale before production begins.' },
    { title: 'Fast payouts',    desc: 'Receive funds the next business day. Essential for high-ticket furniture retailers managing cash flow.' },
    { title: 'Multi-currency',  desc: 'Accept payments from international buyers and interior design clients in their currency.' },
    { title: 'Card terminals',  desc: 'Deploy card terminals at your showroom counter. Accepts cards, PayNow, and contactless NFC.' },
    { title: 'QR codes',        desc: 'Display QR codes on price tags. Let customers pay instantly without queuing at the counter.' },
    { title: 'Online store',    desc: "Sell selected pieces and accessories online with HitPay's built-in store. No monthly subscription." },
  ],
  related: [
    { emoji: '🏪', title: 'Retail',     desc: 'Omnichannel POS and online payments for physical retail stores.' },
    { emoji: '🛒', title: 'E-commerce', desc: 'Checkout with BNPL, PayNow, and 700+ methods for online stores.' },
    { emoji: '📦', title: 'Wholesale',  desc: 'Invoice interior designers and corporate clients professionally.' },
  ],
  faqItems: [
    { q: 'How do I set up Buy Now Pay Later (BNPL) at my furniture showroom?', a: 'Enable Atome BNPL in your HitPay settings. It becomes available at checkout online and at your showroom POS immediately.' },
    { q: 'Can I use HitPay to accept payments at a trade show or pop-up event?', a: 'Yes. Use Tap to Pay on your phone or print a QR code for instant payments anywhere — no Wi-Fi required for PayNow QR.' },
    { q: 'I sell to both retail and trade customers — can one HitPay account handle both?', a: 'Yes. Use payment links for trade clients and your POS for retail walk-ins. All sales are tracked in one unified dashboard.' },
    { q: 'Does HitPay support product variants like fabric colour, material, or size?', a: "HitPay's online store supports product variants. For custom showroom orders, use payment links with custom amounts and descriptions." },
    { q: 'Can customers pay a deposit online and the balance when their furniture arrives?', a: 'Yes. Create separate payment links for the deposit and the balance. Each link can have a custom amount and clear description.' },
    { q: 'How does HitPay compare to using my bank payment terminal at my showroom?', a: 'HitPay terminals accept more payment methods (PayNow, GrabPay, e-wallets) and provide unified online and in-store reporting.' },
    { q: 'Is there a transaction limit for high-value furniture purchases?', a: 'HitPay handles large transactions comfortably. For very high-value orders, invoice payments via bank transfer are also supported.' },
    { q: 'What documents do I need to sign up for HitPay as a furniture retailer?', a: 'You need your ACRA business registration, director NRIC, and a business bank account. Approval takes 1–3 business days.' },
  ],
  ctaTitle: 'Modernise your showroom payments today',
  ctaSub: 'Start accepting BNPL, PayNow, and cards with HitPay. Free to sign up, no monthly fees.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Request a demo',
  footerProducts: ['BNPL', 'POS System', 'Payment Links', 'Invoicing'],
  footerIndustries: ['Furniture', 'Retail', 'E-commerce', 'Wholesale'],
};

INDUSTRY.fitness = {
  name: 'Fitness & Gyms — HitPay',
  accent: C.emerald600,
  heroBg: C.emerald50,
  pillBg: C.emerald50,
  badge: 'Fitness & Gyms',
  heroH1: 'Automate gym membership\nbilling and class payments',
  heroSub: 'Replace manual PayNow collections with automatic recurring billing. Members pay on time, every time — while you focus on coaching, not chasing payments.',
  heroMockFn: () => mockSubscriptions(),
  heroMockX: 880, heroMockY: 130,
  trustTitle: 'TRUSTED BY FITNESS BUSINESSES ACROSS SINGAPORE',
  trustItems: ['Gyms', 'CrossFit Boxes', 'Yoga Studios', 'Pilates Studios', 'Martial Arts', 'Personal Trainers'],
  introTitle: 'Every membership type, automated',
  introSub: 'From monthly gym memberships to 10-class packs and personal training retainers — HitPay handles every billing model automatically, with zero monthly fees.',
  features: [
    {
      label: 'Memberships',
      h2: 'Automate monthly membership billing — set it and forget it',
      p: 'Stop chasing members for PayNow transfers. Set up recurring billing and HitPay automatically charges members on their renewal date — with receipts, reminders, and smart retries included.',
      bullets: [
        'Monthly, quarterly, and annual membership billing',
        'Automatic receipts emailed to members',
        'Smart retries for failed payments to reduce churn',
        'Members manage their own payment details securely',
      ],
      mockFn: () => mockSubscriptions(),
    },
    {
      label: 'Drop-ins & Check-in',
      h2: 'Accept drop-in payments at the door with Tap to Pay',
      p: 'Turn any iPhone or Android into a card reader with HitPay Tap to Pay. Accept contactless card payments at reception without any additional hardware.',
      bullets: [
        'Tap to Pay on iPhone and Android',
        'Accepts Visa, Mastercard, Apple Pay, Google Pay',
        'No hardware cost — use any smartphone you own',
        'Transactions sync instantly to your dashboard',
      ],
      mockFn: () => mockTapToPay(),
    },
    {
      label: 'Class Packs',
      h2: 'Sell class packs and PT sessions online',
      p: 'Create payment links for 10-class packs, personal training bundles, or introductory offers. Share via WhatsApp or your Instagram bio — members buy in seconds.',
      bullets: [
        'Custom price payment links for any package',
        'One-click purchase — no app required',
        'Works on mobile for all major payment methods',
        'Instant notification when a pack is purchased',
      ],
      mockFn: () => mockPaymentLink(),
    },
    {
      label: 'Performance Dashboard',
      h2: 'Track revenue, MRR, and member growth in real time',
      p: "HitPay's dashboard shows your Monthly Recurring Revenue, active members, class pack sales, and churn — so you can make better decisions about your gym's growth.",
      bullets: [
        'Monthly Recurring Revenue (MRR) overview',
        'Revenue by product: memberships, class packs, retail',
        'Churn and new member tracking',
        'Next business day payouts',
      ],
      mockFn: () => mockPOSDashboard(),
    },
  ],
  stats: [
    { value: 'S$0',   label: 'Monthly platform fees' },
    { value: '100%',  label: 'Automated billing' },
    { value: 'T+1',   label: 'Business day payouts' },
    { value: '<5 min', label: 'Member onboarding' },
  ],
  statsBg: C.slate900, statsAccent: C.emerald600,
  testimonial: {
    quote: 'We had 120 members paying manually via bank transfer every month. Half of them were always late. Since switching to HitPay recurring billing, 98% of renewals happen automatically on the due date.',
    name: 'Kelvin Loh',
    role: 'Head Coach & Owner, Forge CrossFit — Singapore',
    lightBg: C.emerald100,
  },
  gridTitle: 'Everything your gym or fitness studio needs',
  gridSub: 'HitPay covers the full billing lifecycle for gyms, yoga studios, and personal trainers.',
  gridItems: [
    { title: 'Free trial management', desc: 'Offer free or discounted trials. HitPay automatically upgrades to full billing after the trial period ends.' },
    { title: 'Supplement retail',     desc: 'Sell protein, gear, and accessories in-store using HitPay POS or your online store.' },
    { title: 'Card terminals',        desc: 'Deploy a card terminal at reception for walk-in memberships and drop-in fees.' },
    { title: 'Promo codes',           desc: 'Run new member promotions and referral discounts with built-in coupon code support.' },
    { title: 'Multi-location',        desc: 'Manage all your gym locations from one HitPay account. Unified revenue, one payout.' },
    { title: 'Automated receipts',    desc: 'Every payment triggers an instant receipt. No manual invoice generation for each member.' },
  ],
  related: [
    { emoji: '💅', title: 'Beauty',    desc: 'Membership billing and payments for beauty and wellness studios.' },
    { emoji: '📚', title: 'Education', desc: 'Recurring billing for tuition centres and enrichment schools.' },
    { emoji: '🏪', title: 'Retail',    desc: 'In-store POS for gear, supplements, and merchandise.' },
  ],
  faqItems: [
    { q: 'Can I automate monthly gym membership billing through HitPay?', a: 'Yes. HitPay Subscriptions automates monthly billing. Members are charged automatically and receive receipts without any manual action.' },
    { q: 'How do I offer a free trial period before charging the full membership fee?', a: "Set up a subscription with a trial period in HitPay. Members aren't charged until the trial ends, and you're notified automatically." },
    { q: 'Does HitPay integrate with Mindbody or Glofox gym management software?', a: 'HitPay does not have a direct plugin for Mindbody or Glofox, but can be integrated via API and webhooks for custom setups.' },
    { q: 'Can I sell personal training packages and supplements from the same account?', a: 'Yes. HitPay supports multiple product types — subscriptions for memberships and payment links for packages and retail.' },
    { q: 'How do I handle members who want to pause or cancel their membership?', a: 'Pause or cancel any subscription from your HitPay dashboard in seconds. Members can also self-manage via their billing portal.' },
    { q: 'What is the cheapest way to collect recurring membership fees in Singapore?', a: 'HitPay subscriptions via PayNow offer the lowest processing rates available for recurring payments in Singapore.' },
    { q: 'Can I accept drop-in payments without a physical card terminal?', a: 'Yes. HitPay Tap to Pay on iPhone or Android accepts contactless card payments at the door — no hardware cost required.' },
    { q: 'How long does it take to migrate existing gym members to HitPay billing?', a: 'Set up subscription plans in under 30 minutes. Invite members to enrol with a simple payment link sent via WhatsApp.' },
  ],
  ctaTitle: 'Automate your gym billing today',
  ctaSub: 'Join Singapore gyms and fitness studios already using HitPay. Free to start, no monthly fees.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Request a demo',
  footerProducts: ['Subscriptions', 'Tap to Pay', 'Payment Links', 'POS System'],
  footerIndustries: ['Fitness', 'Beauty', 'Education', 'Retail'],
};

INDUSTRY.events = {
  name: 'Events & Weddings — HitPay',
  accent: C.hpAction,
  heroBg: { r: 0.972, g: 0.957, b: 1.0 },
  pillBg: C.violet50,
  badge: 'Events & Wedding Planning',
  heroH1: 'Collect event deposits\nand ticket sales instantly',
  heroSub: 'Send payment links for deposits, sell event tickets, and invoice clients — all from one platform. No more chasing payments via bank transfer.',
  heroMockFn: () => mockPaymentLink(),
  heroMockX: 900, heroMockY: 130,
  trustTitle: 'TRUSTED BY EVENT PROFESSIONALS ACROSS SINGAPORE',
  trustItems: ['Wedding Planners', 'Event Venues', 'Photographers', 'Caterers', 'Live Entertainment', 'Corporate Events'],
  introTitle: 'Every stage of the event payment journey',
  introSub: 'From initial deposit to final balance, ticket sales to vendor payments — HitPay handles every payment touchpoint for event professionals.',
  features: [
    {
      label: 'Event Ticketing',
      h2: 'Sell event tickets and collect RSVPs with payment',
      p: 'Create a payment link for any event — conferences, workshops, dinners, or parties. Share it on social media or via email. Attendees pay instantly with any payment method they prefer.',
      bullets: [
        'Custom price links for tickets or RSVPs',
        'Supports PayNow, cards, GrabPay, and more',
        'Share on social media, email, or WhatsApp',
        'Real-time attendee and payment tracking',
      ],
      mockFn: () => mockPaymentLink(),
    },
    {
      label: 'On-the-Day Payments',
      h2: 'Accept walk-in registrations and on-site payments',
      p: 'Deploy QR codes at your event entrance for on-the-spot registration and payment. Or use Tap to Pay on your phone to accept card payments anywhere at the venue.',
      bullets: [
        'QR codes printable for entrance desks and counters',
        'Tap to Pay for contactless card acceptance',
        'All on-site payments synced to dashboard in real time',
        'No Wi-Fi required for PayNow QR collections',
      ],
      mockFn: () => mockQR(),
    },
    {
      label: 'Deposits & Milestones',
      h2: 'Collect staged payments without spreadsheets',
      p: "Wedding planners and event coordinators can collect deposits, milestone payments, and final balances with separate payment links. Track what's paid and what's outstanding in one dashboard.",
      bullets: [
        'Separate payment links for each milestone',
        'Custom amounts for deposits, mid-payments, balances',
        'Instant confirmation when each stage is paid',
        'Full payment history per event or client',
      ],
      mockFn: () => mockInvoice(),
    },
    {
      label: 'Recurring Retainers',
      h2: 'Bill monthly retainer clients automatically',
      p: 'If you manage ongoing events for corporate clients, set up automatic monthly billing with HitPay subscriptions. Get paid on time, every month, without manual invoicing.',
      bullets: [
        'Monthly and annual retainer billing',
        'Auto-invoicing with branded receipts',
        'Smart payment retries for failed charges',
        'Clients manage their own billing details',
      ],
      mockFn: () => mockSubscriptions(),
    },
  ],
  stats: [
    { value: 'S$0',  label: 'Monthly platform fees' },
    { value: '<60s', label: 'Payment link creation' },
    { value: 'T+1',  label: 'Business day payouts' },
    { value: '100%', label: 'Digital, no cash handling' },
  ],
  statsBg: C.slate900, statsAccent: C.hpAction,
  testimonial: {
    quote: 'Wedding deposits used to take 2-3 weeks via bank transfer. With HitPay payment links, couples pay the deposit within hours of our first meeting. My cash flow is completely transformed.',
    name: 'Cheryl Han',
    role: 'Founder, Cheryl Han Events — Wedding Planning, Singapore',
    lightBg: C.violet100,
  },
  gridTitle: 'Everything your events business needs',
  gridSub: 'HitPay covers every payment scenario for event planners, venues, and wedding professionals.',
  gridItems: [
    { title: 'Instant payment links', desc: 'Create custom-amount payment links in under 60 seconds. Share via WhatsApp, email, or social media.' },
    { title: 'QR at events',         desc: 'Print QR codes for entrance, merchandise, or F&B stalls at your event. No app required for guests.' },
    { title: 'Refund management',    desc: 'Issue partial or full refunds easily from your dashboard. Clear audit trail for every transaction.' },
    { title: 'GST invoicing',        desc: 'Generate GST-compliant invoices for corporate event clients. Automatic payment reminders included.' },
    { title: 'Multi-currency',       desc: 'Accept deposits from international clients in their currency. HitPay handles conversion.' },
    { title: 'MAS licensed',         desc: 'Collect large deposits with confidence. HitPay is MAS licensed and PCI DSS compliant.' },
  ],
  related: [
    { emoji: '🍽️', title: 'Restaurants', desc: 'Catering and private dining payment collection.' },
    { emoji: '💜',  title: 'Nonprofits',  desc: 'Charity galas, fundraising events, and donation collection.' },
    { emoji: '✈️',  title: 'Travel',      desc: 'Tour and experience booking deposits via payment links.' },
  ],
  faqItems: [
    { q: 'My wedding clients keep delaying deposit payments — how does HitPay help me collect faster?', a: 'Send a payment link immediately after the consultation. Clients pay the deposit in one tap — no bank details needed, no delays.' },
    { q: 'Can I issue partial or full refunds for event deposits through HitPay?', a: 'Yes. Issue full or partial refunds from your HitPay dashboard instantly. Refunds are processed within 5–10 business days to the client.' },
    { q: 'Can I accept walk-in registrations and on-the-day payments at my event?', a: 'Yes. Display a QR code at the entrance or use Tap to Pay on your phone to accept card payments on the spot.' },
    { q: 'I offer wedding packages at different price tiers — can I create separate deposit links for each?', a: 'Yes. Create a separate payment link for each package with its own custom amount and description. Share the right one per client.' },
    { q: 'Is HitPay suitable for a freelance wedding coordinator who is not a registered company?', a: 'Yes. HitPay accepts sole proprietors. You can sign up with your personal NRIC if you are not yet incorporated.' },
    { q: 'Can I collect payments from international guests in their own currency?', a: 'Yes. HitPay supports international cards and multi-currency payments, allowing overseas guests to pay in their local currency.' },
    { q: 'How do I track which event guests have paid and which have not?', a: 'Your HitPay dashboard shows all payment link activity in real time — who has paid, when, and the exact amount received.' },
    { q: 'Is there a setup fee or monthly cost to use HitPay for events?', a: 'No. HitPay has no setup fee and no monthly subscription. You only pay a per-transaction fee when a payment is received.' },
  ],
  ctaTitle: 'Ready to get deposits paid faster?',
  ctaSub: 'Join event professionals across Singapore using HitPay. Free to sign up, no monthly fees.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Contact sales',
  footerProducts: ['Payment Links', 'QR Payments', 'Subscriptions', 'Invoicing'],
  footerIndustries: ['Events', 'Restaurants', 'Travel', 'Nonprofits'],
};

INDUSTRY.wholesale = {
  name: 'Wholesale & B2B — HitPay',
  accent: C.blue600,
  heroBg: C.blue50,
  pillBg: C.blue100,
  badge: 'Wholesale & B2B',
  heroH1: 'Professional invoicing for\nwholesale and B2B businesses',
  heroSub: 'Send branded invoices with payment links, collect deposits from buyers, and track outstanding balances — all from one platform that is free to start.',
  heroMockFn: () => mockInvoice(),
  heroMockX: 900, heroMockY: 130,
  trustTitle: 'TRUSTED BY WHOLESALE AND B2B BUSINESSES IN SINGAPORE',
  trustItems: ['Importers', 'Distributors', 'Manufacturers', 'Suppliers', 'Agents', 'B2B Traders'],
  introTitle: 'Get paid faster on every wholesale invoice',
  introSub: "Wholesale buyers pay late. HitPay's invoicing with embedded payment links makes it so easy to pay that buyers often settle within 24 hours — instead of 30 or 60 days.",
  features: [
    {
      label: 'Professional Invoicing',
      h2: 'Send branded invoices with one-click payment links',
      p: 'Create professional invoices with your logo, company details, and itemised orders. Embed a payment link so buyers can pay instantly with PayNow, cards, or bank transfer — right from the invoice.',
      bullets: [
        'Customisable invoice templates with your branding',
        'Online payment link embedded in every invoice',
        'PO reference number fields for corporate buyers',
        'Automatic payment confirmation to buyer and seller',
      ],
      mockFn: () => mockInvoice(),
    },
    {
      label: 'Deposits & Partial Payments',
      h2: 'Collect deposits before shipment with payment links',
      p: 'Require a deposit before you prepare or ship an order. Send a custom-amount payment link via email or WhatsApp — buyers pay the deposit instantly.',
      bullets: [
        'Custom amount payment links for any deposit size',
        'Collect deposits before production or shipping',
        'All major payment methods: PayNow, cards, GrabPay',
        'Track paid deposits against pending orders',
      ],
      mockFn: () => mockPaymentLink(),
    },
    {
      label: 'Revenue Dashboard',
      h2: 'Track outstanding invoices and cash flow at a glance',
      p: "HitPay's dashboard shows your total outstanding, collected this month, and overdue invoices. Know which buyers consistently pay late and take action proactively.",
      bullets: [
        'Real-time view of outstanding vs collected revenue',
        'Invoice status: pending, paid, overdue at a glance',
        'Next business day payouts for collected amounts',
        'Export to CSV for your accounting software',
      ],
      mockFn: () => mockDashboard(),
    },
    {
      label: 'Multi-Channel Sales',
      h2: 'Unify revenue from all your sales channels',
      p: 'Selling via distributors, direct to retail, and online? HitPay tracks all your revenue streams in one dashboard. See which channel drives the most value.',
      bullets: [
        'Unified revenue view across all sales channels',
        'Breakdown by buyer, region, or product category',
        'Integrated with Xero and accounting tools',
        'Multi-currency support for cross-border buyers',
      ],
      mockFn: () => mockOmnichannel(),
    },
  ],
  stats: [
    { value: 'S$0',  label: 'Monthly platform fees' },
    { value: '<24h', label: 'Average invoice payment time' },
    { value: 'T+1',  label: 'Business day payouts' },
    { value: '100+', label: 'Currencies supported' },
  ],
  statsBg: C.slate900, statsAccent: C.blue600,
  testimonial: {
    quote: 'Our buyers used to take 45 days on average to pay. After switching to HitPay invoices with payment links, the average is 3 days. The difference in cash flow has been dramatic.',
    name: 'Edmund Tan',
    role: 'Director, Pacific Wholesale Trading — Singapore',
    lightBg: C.blue100,
  },
  gridTitle: 'Everything your wholesale business needs',
  gridSub: 'HitPay provides a complete B2B payment stack for wholesalers, distributors, and suppliers.',
  gridItems: [
    { title: 'Automated reminders', desc: 'HitPay sends payment reminders before and after the due date. Reduce late payments without awkward calls.' },
    { title: 'Credit terms',        desc: 'Set NET 30 or NET 60 terms on invoices. HitPay tracks the due date and reminds buyers automatically.' },
    { title: 'Multi-currency',      desc: 'Invoice international buyers in their currency. HitPay converts and settles in SGD the next business day.' },
    { title: 'Audit trail',         desc: 'Full payment history for every invoice. Export to CSV for IRAS or finance team review.' },
    { title: 'Buyer portal',        desc: 'Buyers can view all their invoices and payment history from a single link — no login required.' },
    { title: 'MAS licensed',        desc: 'Collect large B2B payments with confidence. HitPay is licensed by the Monetary Authority of Singapore.' },
  ],
  related: [
    { emoji: '🛒', title: 'E-commerce', desc: 'Sell direct-to-consumer alongside your wholesale channel.' },
    { emoji: '🏪', title: 'Retail',     desc: 'POS and omnichannel payments for retail distribution.' },
    { emoji: '💻', title: 'Electronics', desc: 'Invoice IT buyers and corporate procurement teams.' },
  ],
  faqItems: [
    { q: 'My wholesale buyers consistently pay late — what can HitPay do to improve my collection rate?', a: 'HitPay invoices include an embedded payment link, making it easy for buyers to pay in one click — cutting average payment time dramatically.' },
    { q: 'Can I offer different payment terms to different buyers — NET 30 for some, NET 60 for others?', a: 'Yes. Each invoice can have a custom due date. HitPay sends automatic reminders before and after the due date for each buyer.' },
    { q: 'Does HitPay support purchase order (PO) reference numbers on invoices for corporate buyers?', a: 'Yes. HitPay invoices include a reference number field where you can add the buyer PO number for easy reconciliation.' },
    { q: 'What is the most cost-effective way to collect SGD payments from Malaysian buyers?', a: 'For Malaysian buyers, international card payments or bank transfer via invoice are recommended. PayNow is available for Singapore residents only.' },
    { q: 'How long does it take to get set up on HitPay as a wholesale business?', a: 'Account approval takes 1–3 business days after submitting your ACRA registration, director NRIC, and bank account details.' },
    { q: 'Can I send automated payment reminders without manually chasing each buyer?', a: 'Yes. HitPay automatically sends payment reminders before and after invoice due dates. No manual follow-up required from your team.' },
    { q: 'Does HitPay integrate with accounting software like Xero or QuickBooks?', a: 'HitPay integrates with Xero. For QuickBooks, you can export transactions to CSV and import them into your accounting software.' },
    { q: 'Is HitPay suitable for a wholesale business that does not have an incorporated company?', a: 'Yes. HitPay accepts sole proprietors registered with ACRA. You can sign up with your personal NRIC if not yet incorporated.' },
  ],
  ctaTitle: 'Get paid faster on every invoice',
  ctaSub: 'Join Singapore wholesale businesses already collecting faster with HitPay. Free to start.',
  ctaBtn1: 'Start for free',
  ctaBtn2: 'Talk to sales',
  footerProducts: ['Invoicing', 'Payment Links', 'Subscriptions', 'Payment Gateway'],
  footerIndustries: ['Wholesale', 'E-commerce', 'Retail', 'Electronics'],
};

// ── INDUSTRY BUILDER WRAPPERS ─────────────────────────────────

function buildRestaurants(xOffset) { return buildIndustry(INDUSTRY.restaurants, xOffset); }
function buildTravel(xOffset)      { return buildIndustry(INDUSTRY.travel, xOffset); }
function buildEducation(xOffset)   { return buildIndustry(INDUSTRY.education, xOffset); }
function buildComputers(xOffset)   { return buildIndustry(INDUSTRY.computers, xOffset); }
function buildBeauty(xOffset)      { return buildIndustry(INDUSTRY.beauty, xOffset); }
function buildFurniture(xOffset)   { return buildIndustry(INDUSTRY.furniture, xOffset); }
function buildFitness(xOffset)     { return buildIndustry(INDUSTRY.fitness, xOffset); }
function buildEvents(xOffset)      { return buildIndustry(INDUSTRY.events, xOffset); }
function buildWholesale(xOffset)   { return buildIndustry(INDUSTRY.wholesale, xOffset); }

// ── MAIN ─────────────────────────────────────────────────────

const BUILDERS = {
  ecommerce:     (x) => buildEcommerce(x),
  retail:        (x) => buildRetail(x),
  nonprofits:    (x) => buildNonprofits(x),
  landing:       (x) => buildLanding(x),
  landing_plain: (x) => buildLandingPlainInspired(x),
  restaurants:   buildRestaurants,
  travel:        buildTravel,
  education:     buildEducation,
  computers:     buildComputers,
  beauty:        buildBeauty,
  furniture:     buildFurniture,
  fitness:       buildFitness,
  events:        buildEvents,
  wholesale:     buildWholesale,
};

async function main() {
  await loadFonts();
  figma.showUI(__html__, { width: 360, height: 510, title: 'HitPay Landing Pages' });

  figma.ui.onmessage = async (msg) => {
    if (msg.type === 'cancel') {
      figma.closePlugin();
      return;
    }
    if (msg.type !== 'generate' || !msg.pages || msg.pages.length === 0) return;

    const frames = [];
    let x = 0;
    for (const id of msg.pages) {
      if (BUILDERS[id]) {
        const frame = BUILDERS[id](x);
        figma.currentPage.appendChild(frame);
        frames.push(frame);
        x += 1540;
      }
    }

    if (frames.length > 0) {
      figma.viewport.scrollAndZoomIntoView(frames);
    }
    const n = frames.length;
    figma.closePlugin(`✅ ${n} page${n !== 1 ? 's' : ''} created at 1440px.`);
  };
}

main().catch(err => {
  console.error(err);
  const msg = err ? (err.message || String(err)) : 'unknown error';
  figma.closePlugin('❌ Error: ' + msg);
});
