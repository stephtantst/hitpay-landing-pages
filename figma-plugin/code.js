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
  hpBeige200:  { r: 0.953, g: 0.953, b: 0.929 },  // #F3F3ED — alternating feature bg
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

// ── AI SHOPPERS — CUSTOM MOCKS ────────────────────────────────

/** Hero mock: AI chat conversation → order placed */
function mockAIChat() {
  const card = mkFrame('MockAIChat', 300, 295, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.10 }, offset:{x:0,y:20}, radius:50, spread:0, visible:true, blendMode:'NORMAL' }];

  // Header bar
  const hdr = mkRect(300, 46, C.hpTextPri, 0);
  hdr.x = 0; hdr.y = 0;
  card.appendChild(hdr);
  const hdrTxt = mkText('AI Assistant', 13, W.semibold, C.white, 'LEFT');
  hdrTxt.x = 44; hdrTxt.y = 14;
  card.appendChild(hdrTxt);

  // User bubble (right-aligned)
  const uBg = mkRect(188, 42, C.hpBlue50, 10);
  uBg.x = 96; uBg.y = 60;
  card.appendChild(uBg);
  const uTxt = mkText('Buy me a birthday cake\nfrom that bakery in SG', 11, W.regular, C.hpTextPri, 'LEFT', 168);
  uTxt.x = 106; uTxt.y = 66;
  card.appendChild(uTxt);

  // AI bubble (left)
  const aBg = mkRect(200, 42, C.hpBeige, 10);
  aBg.x = 16; aBg.y = 114;
  card.appendChild(aBg);
  const aTxt = mkText('Found it — S$48 cake.\nPlacing order now…', 11, W.regular, C.hpTextSec, 'LEFT', 180);
  aTxt.x = 26; aTxt.y = 120;
  card.appendChild(aTxt);

  // Order card
  const oc = mkRect(268, 80, C.hpBeige, 10);
  oc.x = 16; oc.y = 170;
  card.appendChild(oc);
  const pName = mkText('Chocolate Fudge Cake', 12, W.semibold, C.hpTextPri, 'LEFT', 150);
  pName.x = 28; pName.y = 180;
  card.appendChild(pName);
  const pPrice = mkText('S$48.00', 12, W.semibold, C.hpAction, 'LEFT');
  pPrice.x = 220; pPrice.y = 180;
  card.appendChild(pPrice);
  const pStore = mkText('Little Cakes Singapore', 11, W.regular, C.hpTextSec, 'LEFT', 200);
  pStore.x = 28; pStore.y = 198;
  card.appendChild(pStore);
  const ordBtn = mkRect(248, 26, C.hpAction, 6);
  ordBtn.x = 26; ordBtn.y = 218;
  card.appendChild(ordBtn);
  const ordTxt = mkText('Order placed ✓', 11, W.semibold, C.white, 'CENTER', 248);
  ordTxt.x = 26; ordTxt.y = 224;
  card.appendChild(ordTxt);

  // Status line
  const dot = mkRect(8, 8, C.hpSuccess, 4);
  dot.x = 96; dot.y = 264;
  card.appendChild(dot);
  const st = mkText('Order now in your HitPay dashboard', 11, W.regular, C.hpTextSec, 'LEFT', 180);
  st.x = 110; st.y = 260;
  card.appendChild(st);

  return card;
}

/** Feature 1 mock: product catalog → ChatGPT result */
function mockProductCatalogAI() {
  const card = mkFrame('MockProductCatalog', 280, 270, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.08 }, offset:{x:0,y:16}, radius:40, spread:0, visible:true, blendMode:'NORMAL' }];

  const hdr = mkText('Your store catalog — visible to AI', 11, W.semibold, C.hpTextSec, 'LEFT', 240);
  hdr.x = 16; hdr.y = 16;
  card.appendChild(hdr);

  const items = [
    { name: 'Chocolate Fudge Cake', price: 'S$48 · In stock' },
    { name: 'Earl Grey Chiffon', price: 'S$38 · In stock' },
    { name: 'Salted Caramel Tart', price: 'S$22 · In stock' },
  ];
  items.forEach((it, i) => {
    const row = mkRect(248, 36, C.hpBeige, 8);
    row.x = 16; row.y = 42 + i * 44;
    card.appendChild(row);
    const n = mkText(it.name, 12, W.medium, C.hpTextPri, 'LEFT', 150);
    n.x = 26; n.y = 48 + i * 44;
    card.appendChild(n);
    const p = mkText(it.price, 11, W.regular, C.hpTextSec, 'LEFT', 110);
    p.x = 26; p.y = 62 + i * 44;
    card.appendChild(p);
    const dot = mkRect(8, 8, C.hpSuccess, 4);
    dot.x = 248; dot.y = 52 + i * 44;
    card.appendChild(dot);
  });

  // ChatGPT result box
  const res = mkRect(248, 64, C.hpBlue50, 10);
  res.x = 16; res.y = 186;
  card.appendChild(res);
  const resLbl = mkText('ChatGPT result', 11, W.semibold, C.hpAction, 'LEFT');
  resLbl.x = 26; resLbl.y = 194;
  card.appendChild(resLbl);
  const resTxt = mkText('"For a birthday cake in SG, try\nLittle Cakes — S$48, in stock."', 11, W.regular, C.hpTextPri, 'LEFT', 228);
  resTxt.x = 26; resTxt.y = 212;
  card.appendChild(resTxt);

  return card;
}

/** Feature 2 mock: 3-step AI checkout flow */
function mockAICheckoutSteps() {
  const wrap = mkFrame('MockAICheckout', 272, 250, { r:0,g:0,b:0,a:0 }, 0);

  const steps = [
    { num: '1', title: 'Customer tells AI what to buy', body: '"Order me the skincare set from that brand in KL"', border: C.slate200 },
    { num: '2', title: 'AI finds product, fills checkout', body: 'Product: Glow Serum Set  RM128\nDelivery: Filled by AI', border: C.slate200 },
    { num: '3', title: 'Order in your HitPay dashboard', body: 'New order — RM 128.00\nGlow Serum Set · Just now', border: C.hpAction },
  ];

  steps.forEach((s, i) => {
    const bg = mkRect(272, 70, C.white, 12);
    bg.strokes = [{ type: 'SOLID', color: s.border }];
    bg.strokeWeight = s.border === C.hpAction ? 2 : 1;
    bg.strokeAlign = 'INSIDE';
    bg.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.06 }, offset:{x:0,y:4}, radius:12, spread:0, visible:true, blendMode:'NORMAL' }];
    bg.x = 0; bg.y = i * 86;
    wrap.appendChild(bg);

    const numBg = mkRect(20, 20, C.hpBlue50, 10);
    numBg.x = 12; numBg.y = i * 86 + 14;
    wrap.appendChild(numBg);
    const numTxt = mkText(s.num, 11, W.bold, C.hpAction, 'CENTER', 20);
    numTxt.x = 12; numTxt.y = i * 86 + 17;
    wrap.appendChild(numTxt);

    const ttl = mkText(s.title, 12, W.semibold, C.hpTextPri, 'LEFT', 220);
    ttl.x = 40; ttl.y = i * 86 + 12;
    wrap.appendChild(ttl);

    const bodyBg = mkRect(248, 28, i === 2 ? C.hpBlue50 : C.hpBeige, 6);
    bodyBg.x = 12; bodyBg.y = i * 86 + 36;
    wrap.appendChild(bodyBg);
    const bodyTxt = mkText(s.body, 10, W.regular, i === 2 ? C.hpAction : C.hpTextSec, 'LEFT', 228);
    bodyTxt.x = 20; bodyTxt.y = i * 86 + 41;
    wrap.appendChild(bodyTxt);
  });

  return wrap;
}

/** Feature 3 mock: AI readiness checklist badge */
function mockAIReadinessBadge() {
  const card = mkFrame('MockAIReadiness', 250, 240, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.08 }, offset:{x:0,y:16}, radius:40, spread:0, visible:true, blendMode:'NORMAL' }];

  // Shield icon area
  const iconBg = mkRect(56, 56, C.hpBlue50, 14);
  iconBg.x = 97; iconBg.y = 16;
  card.appendChild(iconBg);
  const iconTxt = mkText('✓', 28, W.bold, C.hpAction, 'CENTER', 56);
  iconTxt.x = 97; iconTxt.y = 22;
  card.appendChild(iconTxt);

  const title = mkText('HitPay Online Store', 13, W.semibold, C.hpTextPri, 'CENTER', 218);
  title.x = 16; title.y = 84;
  card.appendChild(title);

  const checks = ['AI can find you', 'AI can recommend you', 'AI can buy from you'];
  checks.forEach((c, i) => {
    const rowBg = mkRect(218, 32, C.hpBeige, 8);
    rowBg.x = 16; rowBg.y = 110 + i * 38;
    card.appendChild(rowBg);
    const chkBg = mkRect(16, 16, C.hpBlue100, 8);
    chkBg.x = 24; chkBg.y = 118 + i * 38;
    card.appendChild(chkBg);
    const chkMark = mkText('✓', 9, W.bold, C.hpAction, 'CENTER', 16);
    chkMark.x = 24; chkMark.y = 120 + i * 38;
    card.appendChild(chkMark);
    const chkTxt = mkText(c, 12, W.regular, C.hpTextPri, 'LEFT', 170);
    chkTxt.x = 48; chkTxt.y = 118 + i * 38;
    card.appendChild(chkTxt);
  });

  const badge = mkRect(218, 28, C.hpAction, 8);
  badge.x = 16; badge.y = 200;
  card.appendChild(badge);
  const badgeTxt = mkText('AI-ready · Automatic · Free', 11, W.semibold, C.white, 'CENTER', 218);
  badgeTxt.x = 16; badgeTxt.y = 207;
  card.appendChild(badgeTxt);

  return card;
}

/** Feature 4 mock: Others vs HitPay comparison table */
function mockAIComparison() {
  const card = mkFrame('MockAIComparison', 272, 220, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0,g:0,b:0,a:0.08 }, offset:{x:0,y:16}, radius:40, spread:0, visible:true, blendMode:'NORMAL' }];

  const hdr = mkText('AI shopping features', 11, W.semibold, C.hpTextSec, 'LEFT', 232);
  hdr.x = 16; hdr.y = 14;
  card.appendChild(hdr);

  // Column headers
  const colOther = mkText('Others', 11, W.semibold, C.hpTextSec, 'CENTER', 88);
  colOther.x = 104; colOther.y = 36;
  card.appendChild(colOther);
  const colHP = mkText('HitPay', 11, W.semibold, C.hpAction, 'CENTER', 80);
  colHP.x = 192; colHP.y = 36;
  card.appendChild(colHP);

  const rows = [
    { label: 'AI visibility',  other: 'Manual',    hp: 'Automatic' },
    { label: 'AI checkout',    other: 'Developer', hp: 'Automatic' },
    { label: 'AI signal',      other: 'Extra plan',hp: 'Automatic' },
    { label: 'Extra cost',     other: 'Yes',       hp: 'SGD/MYR/PHP 0' },
  ];

  rows.forEach((r, i) => {
    const rowBg = mkRect(240, 30, C.hpBeige, 6);
    rowBg.x = 16; rowBg.y = 56 + i * 36;
    card.appendChild(rowBg);

    const lbl = mkText(r.label, 11, W.regular, C.hpTextSec, 'LEFT', 80);
    lbl.x = 24; lbl.y = 64 + i * 36;
    card.appendChild(lbl);

    const otherTxt = mkText(r.other, 11, W.regular, C.slate400, 'CENTER', 88);
    otherTxt.x = 104; otherTxt.y = 64 + i * 36;
    card.appendChild(otherTxt);

    const hpTxt = mkText(r.hp, 11, W.semibold, C.hpAction, 'CENTER', 80);
    hpTxt.x = 192; hpTxt.y = 64 + i * 36;
    card.appendChild(hpTxt);
  });

  return card;
}

/** Mid-page CTA strip — matches bg-[#EBF1FC] band in HTML */
function mkMidCTAAI() {
  const sec = mkFrame('MidCTA', 1440, 100, C.hpBlue50);

  const txt = mkText('Ready to get your store in front of AI shoppers?', 20, W.semibold, C.hpTextPri, 'LEFT', 560);
  txt.x = 144; txt.y = 30;
  sec.appendChild(txt);

  const btn = mkBtn('Start for free →', C.hpAction, C.white, 24, 12, 10);
  btn.x = 900; btn.y = 28;
  sec.appendChild(btn);

  const fine = mkText('No setup fees · Approval in 1–3 business days', 13, W.regular, C.hpTextSec);
  fine.x = 1060; fine.y = 38;
  sec.appendChild(fine);

  return sec;
}

/** Payment methods table section */
function mkPaymentMethodsTableAI() {
  const sec = mkFrame('PaymentMethodsTable', 1440, 400, C.hpBeige);

  const h2 = mkH2('Payment methods accepted on HitPay Online Store', 26, C.hpTextPri, 'CENTER', 800);
  h2.x = 320; h2.y = 40;
  sec.appendChild(h2);

  const sub = mkText('All methods work for both AI-initiated and human-initiated orders across SG, MY and PH.', 16, W.regular, C.hpTextSec, 'CENTER', 700);
  sub.x = 370; sub.y = 84;
  sec.appendChild(sub);

  // Table
  const tableX = 240, tableY = 120, rowH = 36, colWidths = [260, 280, 260];
  const headers = ['Payment Method', 'Available in', 'Type'];
  const rows = [
    ['PayNow', 'Singapore', 'Instant transfer / QR'],
    ['DuitNow QR', 'Malaysia', 'Instant transfer / QR'],
    ['GCash, Maya, QR Ph', 'Philippines', 'Mobile wallet / QR'],
    ['FPX', 'Malaysia', 'Bank transfer'],
    ['InstaPay, PESONet', 'Philippines', 'Bank transfer'],
    ['GrabPay, ShopeePay', 'Singapore', 'E-wallet'],
    ['Touch \'n Go, Boost', 'Malaysia', 'E-wallet'],
    ['Visa, Mastercard, Amex', 'SG, MY, PH', 'Credit / debit card'],
    ['Atome, ShopBack PayLater', 'Singapore, Malaysia', 'Buy Now Pay Later'],
  ];

  // Header row
  let x = tableX;
  headers.forEach((h, ci) => {
    const bg = mkRect(colWidths[ci], rowH, C.hpBlue50, 0);
    bg.strokes = [{ type: 'SOLID', color: C.slate200 }];
    bg.strokeWeight = 1; bg.strokeAlign = 'INSIDE';
    bg.x = x; bg.y = tableY;
    sec.appendChild(bg);
    const t = mkText(h, 13, W.semibold, C.hpTextPri, 'LEFT', colWidths[ci] - 24);
    t.x = x + 12; t.y = tableY + 10;
    sec.appendChild(t);
    x += colWidths[ci];
  });

  // Data rows
  rows.forEach((row, ri) => {
    const rowBg = ri % 2 === 0 ? C.white : C.hpBeige;
    let cx = tableX;
    row.forEach((cell, ci) => {
      const bg = mkRect(colWidths[ci], rowH, rowBg, 0);
      bg.strokes = [{ type: 'SOLID', color: C.slate200 }];
      bg.strokeWeight = 1; bg.strokeAlign = 'INSIDE';
      bg.x = cx; bg.y = tableY + rowH * (ri + 1);
      sec.appendChild(bg);
      const weight = ci === 0 ? W.medium : W.regular;
      const color = ci === 0 ? C.hpTextPri : C.hpTextSec;
      const t = mkText(cell, 13, weight, color, 'LEFT', colWidths[ci] - 24);
      t.x = cx + 12; t.y = tableY + rowH * (ri + 1) + 10;
      sec.appendChild(t);
      cx += colWidths[ci];
    });
  });

  return sec;
}

// ── AI SHOPPERS — CUSTOM PAGE BUILDER ─────────────────────────

function buildAiShoppers(xOffset) {
  const page = new Page('AI Shoppers — HitPay', xOffset);
  const ac = C.hpAction;

  // ① Nav
  page.add(mkNavbar(ac), 64);

  // ② Hero
  const hero = mkFrame('Hero', 1440, 560, C.hpBlue50);
  const heroBadge = mkPill('Online Store · AI Shopping · SG · MY · PH', C.hpBlue50, ac, 16, 8, 100);
  heroBadge.x = 144; heroBadge.y = 80;
  hero.appendChild(heroBadge);
  const heroH1 = mkH2('HitPay Online Stores in Singapore,\nMalaysia and the Philippines are\nalready ready for AI shoppers', 48, C.hpTextPri, 'LEFT', 600);
  heroH1.lineHeight = { value: 58, unit: 'PIXELS' };
  heroH1.x = 144; heroH1.y = 120;
  hero.appendChild(heroH1);
  const heroSub = mkText('Products can come up when someone asks ChatGPT what to buy — PayNow in SG, DuitNow in MY, GCash in PH. AI can place the full order. Nothing to turn on. Already done.', 18, W.regular, C.hpTextSec, 'LEFT', 540);
  heroSub.lineHeight = { value: 28, unit: 'PIXELS' };
  heroSub.x = 144; heroSub.y = 350;
  hero.appendChild(heroSub);
  const hb1 = mkBtn('Set up your free store', ac, C.white, 24, 14, 12);
  hb1.x = 144; hb1.y = 440;
  hero.appendChild(hb1);
  const hb2 = mkBtn('See how it works', null, C.slate800, 24, 14, 12, true);
  hb2.x = 320; hb2.y = 440;
  hero.appendChild(hb2);
  const hFine = mkText('Free to sign up · No setup fees · AI features included automatically', 13, W.regular, C.hpTextSec);
  hFine.x = 144; hFine.y = 496;
  hero.appendChild(hFine);
  const heroMock = mockAIChat();
  heroMock.x = 900; heroMock.y = 130;
  hero.appendChild(heroMock);
  page.add(hero, 560);

  // ③ Trust bar
  page.add(mkTrustBar('WORKS WITH THE AI TOOLS YOUR CUSTOMERS ARE ALREADY USING', ['ChatGPT', 'Perplexity', 'Claude', 'Microsoft Copilot', '+ every new AI tool']), 120);

  // ④ Intro
  page.add(mkIntro('Built for where shopping is going', 'HitPay Online Store lets merchants in Singapore, Malaysia and the Philippines sell online with 50+ payment methods, zero monthly fees, and next business day payouts. Since 2026, every HitPay Online Store is automatically set up for AI shopping — at no extra cost, with nothing to configure. From home bakers in Toa Payoh, Singapore to skincare brands in Bangsar, KL and boutiques in Makati, Manila — AI tools can find, recommend, and buy from every HitPay Online Store.'), 240);

  // ⑤ Feature 1 — AI can see you
  page.add(mkFeature({
    label: 'Step 1 — AI Can See You',
    h2: 'When people ask AI what to buy, products from HitPay stores come up',
    p: 'Most small business stores in Singapore, Malaysia and the Philippines are invisible to AI shopping tools. HitPay creates a machine-readable version of every merchant\'s product catalog automatically. Product names, prices, and stock levels are included. The catalog updates every hour. When a shopper asks ChatGPT for something a merchant sells, that store has a real chance to come up in the answer.',
    bullets: ['Full product catalog — names, prices, stock — visible to AI tools automatically', 'Updates every hour — AI sees the latest products and prices', 'Nothing to configure — active the moment a store goes live', 'Works across ChatGPT, Perplexity, and every AI shopping tool'],
    mockUI: mockProductCatalogAI(),
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 480);

  // ⑥ Feature 2 — AI can buy
  page.add(mkFeature({
    label: 'Step 2 — AI Can Buy From You',
    h2: 'Customer asks AI to buy. AI places the order. Merchants just pack and ship.',
    p: 'Many customers give up before completing a purchase online. A customer tells ChatGPT what they want to buy. The AI finds the product in the HitPay store, fills in delivery details, and creates the order. The customer pays. The merchant sees the order in their HitPay dashboard exactly like any other sale. AI does not get distracted. It does not abandon checkout halfway. It finishes the purchase.',
    bullets: ['AI completes the full checkout — product, delivery, order creation', 'Orders appear in the HitPay dashboard exactly like any other sale', 'Works with the existing HitPay Online Store setup — no new tools', 'Fewer customers giving up halfway — AI finishes what it starts'],
    mockUI: mockAICheckoutSteps(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  // ⑥-B Mid-page CTA strip
  page.add(mkMidCTAAI(), 100);

  // ⑦ Feature 3 — AI-ready
  page.add(mkFeature({
    label: 'Step 3 — Your Store Is AI-Ready',
    h2: 'AI shopping tools know every HitPay Online Store is open for business',
    p: 'AI shopping tools do not buy from every store they find. Before placing an order, an AI checks whether a store is set up to work with it — like checking if a shop accepts card payment before walking in. HitPay has placed a signal on every Online Store that tells AI tools: this store is ready. Without this signal, a store risks being skipped entirely — even with great products.',
    bullets: ['AI tools recognise the store as ready for AI purchases', 'Foundation that connects AI product discovery and AI checkout', 'Automatic for all HitPay Online Store merchants in SG, MY, PH', 'Future AI shopping tools will recognise the store automatically'],
    mockUI: mockAIReadinessBadge(),
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 480);

  // ⑧ Feature 4 — zero setup
  page.add(mkFeature({
    label: 'No Setup Needed',
    h2: 'Merchants didn\'t have to do anything. That was the point.',
    p: 'Most platforms charge extra for AI features — or require a developer to set them up. HitPay built all three AI features directly into the Online Store platform. No separate account, no integration work, no extra monthly fee. Every merchant with a HitPay Online Store in Singapore, Malaysia or the Philippines already has all three active. Merchants pay the same standard HitPay transaction rate — nothing more.',
    bullets: ['SGD / MYR / PHP 0 in extra fees — included with every Online Store', 'No developer, no integration, no configuration — already done', 'Live store merchants are already set up — no action required', 'See hitpayapp.com/pricing for current transaction rates'],
    mockUI: mockAIComparison(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 480);

  // ⑨ Payment methods table
  page.add(mkPaymentMethodsTableAI(), 400);

  // ⑩ Stats
  page.add(mkStats([
    { value: 'SGD/MYR/PHP 0', label: 'Extra cost for AI features' },
    { value: '900M',  label: 'Weekly ChatGPT users' },
    { value: '50M+',  label: 'AI shopping queries daily' },
    { value: '42%',   label: 'Higher conversion from AI shoppers' },
  ], C.hpDeepBlue, C.white, C.hpBlue100), 192);

  // ⑪ Testimonial
  page.add(mkTestimonial(
    '[REAL QUOTE REQUIRED] — Replace with a testimonial from a HitPay Online Store merchant about getting more sales or online discovery.',
    '[Merchant Name]',
    'HitPay Online Store merchant, Singapore / Malaysia / Philippines',
    ac, C.hpBlue100
  ), 380);

  // ⑫ Feature grid
  page.add(mkGrid('Six types of businesses already benefiting', 'Every HitPay Online Store merchant in SG, MY & PH is included — regardless of category or size.', [
    { title: '🧁 Home bakers & food',   desc: 'AI recommends cakes and bakes in SG, KL, and Manila when shoppers ask for birthday treats.' },
    { title: '👗 Fashion & apparel',    desc: 'AI matches styles to products and completes the order in one conversation.' },
    { title: '✨ Skincare & beauty',    desc: 'Products surface in budget-based beauty searches with real-time stock status.' },
    { title: '📚 Education & tutoring', desc: 'Parents find and purchase class packages from education merchants directly.' },
    { title: '🎁 Gifts & lifestyle',    desc: 'HitPay merchants appear in ChatGPT gift recommendation searches.' },
    { title: '🧴 Specialty & niche',    desc: 'AI is better than Google for niche searches — small merchants benefit most.' },
  ]), 660);

  // ⑬ Related
  page.add(mkRelated('Explore more HitPay solutions', [
    { emoji: '🛒', title: 'Online Store',       desc: 'Full online checkout with PayNow, DuitNow, GCash and 50+ methods.' },
    { emoji: '🍜', title: 'Restaurants & F&B', desc: 'POS, Soundbox, and payment links for F&B businesses.' },
    { emoji: '💆', title: 'Health & Beauty',   desc: 'Memberships, deposits, and recurring billing for spas.' },
  ], ac), 380);

  // ⑭ FAQ
  const faqs = [
    { q: 'What is HitPay Online Store and how does it support AI shopping?', a: 'HitPay Online Store lets merchants in SG, MY and PH sell online with 50+ payment methods and zero monthly fees. Since 2026, every store is automatically set up for AI shopping — ChatGPT can discover products, recommend them, and complete purchases at no extra cost.' },
    { q: 'Does a merchant need to do anything to enable AI shopping?', a: 'No. Every HitPay Online Store already has all three AI features active — product catalog visibility, agentic checkout, and AI-readiness signal. Nothing to click, configure, or pay for.' },
    { q: 'Which AI tools can find and shop from a HitPay Online Store?', a: 'Any AI assistant that can shop online — including tools built on ChatGPT and Perplexity. As new AI shopping tools launch, HitPay Online Store merchants will be ready for them automatically.' },
    { q: 'Can an AI assistant complete a full checkout at a HitPay Online Store?', a: 'Yes. HitPay supports agentic checkout — AI completes the entire purchase. The customer tells AI what to buy, AI creates the order, customer pays. The merchant sees it in the dashboard like any other order.' },
    { q: 'Will a merchant know if an order came from an AI assistant?', a: 'Orders placed by AI appear in the HitPay dashboard exactly like any other order. No special handling required.' },
    { q: 'Is customer data shared with AI tools?', a: 'No. Only publicly listed product information — names, prices, stock status — is visible to AI tools. HitPay is MAS licensed (PS20200643) and PCI DSS Level 1 compliant.' },
    { q: 'How much does HitPay Online Store cost?', a: 'Zero monthly fees and zero setup fees. Merchants pay a per-transaction rate only — including on AI-initiated orders. All AI features included at no extra cost. See hitpayapp.com/pricing.' },
    { q: 'What support does HitPay provide to Online Store merchants?', a: 'HitPay provides live chat, email support, and a Help Centre at support.hitpayapp.com. Enterprise merchants can speak with a dedicated account manager.' },
    { q: 'Does this apply to payment link users or in-person merchants?', a: 'Not yet — AI shopping features are specific to HitPay Online Store merchants. Payment link users and in-person POS merchants are not yet covered.' },
    { q: 'How do Singapore businesses sign up for a HitPay Online Store?', a: 'Register with ACRA business number or personal NRIC. No setup fees, no monthly fees. Approval takes 1–3 business days. Store is automatically AI-ready upon going live.' },
    { q: 'How do Malaysian businesses sign up for a HitPay Online Store?', a: 'Register with SSM business number and MyKad. Approval takes 1–3 business days. Store is automatically visible to AI shopping tools upon going live.' },
    { q: 'How do Philippine businesses sign up for a HitPay Online Store?', a: 'Register with SEC or DTI certificate plus government-issued ID. Approval takes 1–3 business days. Store is automatically set up for AI shopping upon going live.' },
  ];
  page.add(mkFAQ(faqs, ac), 96 + faqs.length * 136 + 40);

  // ⑮ CTA
  page.add(mkCTA(
    'Your store could be getting AI shoppers right now.',
    'If a HitPay Online Store is already live, it is already set up — free, automatic, nothing to turn on.',
    'Set up your free store',
    'Talk to sales',
    ac
  ), 300);

  // ⑯ Footer
  page.add(mkFooter(ac, ['Online Store', 'Payment Links', 'POS Software', 'Invoicing'], ['E-commerce', 'Restaurants', 'Health & Beauty', 'Retail']), 280);

  return page.f;
}

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

// ── ART & CRAFT FAIR ─────────────────────────────────────────

/** Hero — Art & Craft Fair partnership page */
function mkHeroArtCraftFair() {
  const sec = mkFrame('Hero/ArtCraftFair', 1440, 560, C.hpBlue50);

  const badgeBg = mkH('PartnerBadge', 6, 14, 8, C.hpBlue100, 100);
  badgeBg.counterAxisAlignItems = 'CENTER';
  badgeBg.appendChild(mkText('✓  Official Payment Partner · Art & Craft Fair Singapore 2026', 12, W.semibold, C.hpAction));
  badgeBg.x = 144; badgeBg.y = 72;
  sec.appendChild(badgeBg);

  const h1 = mkH2('Collect payments easily at\nArt & Craft Fair Singapore 2026', 52, C.hpTextPri, 'LEFT', 640);
  h1.lineHeight = { value: 64, unit: 'PIXELS' };
  h1.x = 144; h1.y = 128;
  sec.appendChild(h1);

  const sub = mkText('HitPay is a Singapore-headquartered, MAS-licensed Major Payment Institution — built for event vendors like you. No setup fee, no monthly fee, no contract.', 18, W.regular, C.hpTextSec, 'LEFT', 600);
  sub.lineHeight = { value: 28, unit: 'PIXELS' };
  sub.x = 144; sub.y = 360;
  sec.appendChild(sub);

  const cta = mkBtn('Sign up for free today  →', C.hpAction, C.white, 28, 16, 12);
  cta.x = 144; cta.y = 458;
  sec.appendChild(cta);

  const note = mkText('Approval takes 1–3 business days · Sign up early', 13, W.regular, C.hpTextSec);
  note.x = 144; note.y = 512;
  sec.appendChild(note);

  const pos = mockArtCraftPOS();
  pos.x = 910; pos.y = 72;
  sec.appendChild(pos);

  return sec;
}

/** Mock POS terminal for hero */
function mockArtCraftPOS() {
  const card = mkFrame('MockPOS', 360, 400, C.white, 20);
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.12 }, offset: { x: 0, y: 20 }, radius: 60, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const header = mkRect(360, 100, C.hpDeepBlue);
  header.x = 0; header.y = 0;
  card.appendChild(header);
  const hdrLbl = mkText('HitPay Point of Sale', 11, W.medium, C.hpBlue100);
  hdrLbl.x = 20; hdrLbl.y = 16;
  card.appendChild(hdrLbl);
  const amt = mkText('S$48.00', 32, W.bold, C.white);
  amt.x = 20; amt.y = 38;
  card.appendChild(amt);
  const itemLbl = mkText('Ceramic bowl — Stall 42', 14, W.regular, C.hpBlue100);
  itemLbl.x = 20; itemLbl.y = 78;
  card.appendChild(itemLbl);

  const methods = [
    { label: 'Tap to Pay (NFC)', status: 'Ready',         sBg: C.green100,  sFg: C.green600 },
    { label: 'PayNow QR',        status: 'Ready',         sBg: C.green100,  sFg: C.green600 },
    { label: 'Borderless QR',    status: 'Intl. vendors', sBg: C.hpBlue100, sFg: C.hpAction },
  ];
  methods.forEach((m, i) => {
    const row = mkRect(320, 52, C.hpBeige, 10);
    row.x = 20; row.y = 116 + i * 68;
    card.appendChild(row);
    const lbl = mkText(m.label, 14, W.medium, C.hpTextPri);
    lbl.x = 36; lbl.y = 133 + i * 68;
    card.appendChild(lbl);
    const sb = mkRect(96, 22, m.sBg, 6);
    sb.x = 228; sb.y = 131 + i * 68;
    card.appendChild(sb);
    const st = mkText(m.status, 11, W.semibold, m.sFg, 'CENTER', 96);
    st.x = 228; st.y = 136 + i * 68;
    card.appendChild(st);
  });

  const confBg = mkRect(320, 44, C.white, 10);
  confBg.strokes = [{ type: 'SOLID', color: C.green100 }];
  confBg.strokeWeight = 1.5; confBg.strokeAlign = 'INSIDE';
  confBg.x = 20; confBg.y = 340;
  card.appendChild(confBg);
  const dotConf = mkRect(8, 8, C.green600, 4);
  dotConf.x = 36; dotConf.y = 358;
  card.appendChild(dotConf);
  const confTxt = mkText('Payment received · S$48.00 · PayNow · just now', 11, W.medium, C.hpTextPri);
  confTxt.x = 52; confTxt.y = 353;
  card.appendChild(confTxt);

  return card;
}

/** Two-column vendor split (SG vs International) with rates */
function mkVendorSplit() {
  const sec = mkFrame('VendorSplit', 1440, 660, C.white);

  const h2 = mkH2('Choose your setup — it takes minutes', 32, C.hpTextPri, 'CENTER', 760);
  h2.x = 340; h2.y = 48;
  sec.appendChild(h2);
  const sub = mkText('Whether you\'re based in Singapore or flying in, HitPay has you covered.', 16, W.regular, C.hpTextSec, 'CENTER', 680);
  sub.x = 380; sub.y = 108;
  sec.appendChild(sub);

  // ── SG card ──
  const sg = mkFrame('SGVendors', 556, 390, C.white, 16);
  sg.strokes = [{ type: 'SOLID', color: C.slate200 }]; sg.strokeWeight = 1; sg.strokeAlign = 'INSIDE';
  sg.x = 144; sg.y = 156;

  const sgHdr = mkText('SINGAPORE VENDORS', 10, W.bold, C.hpTextSec);
  sgHdr.letterSpacing = { value: 1.2, unit: 'PIXELS' };
  sgHdr.x = 28; sgHdr.y = 28;
  sg.appendChild(sgHdr);

  ['Accept cards & PayNow via the HitPay app', 'Tap to Pay on NFC iPhone or Android — no terminal needed', 'Payouts sent automatically to your bank account'].forEach((b, i) => {
    const dot = mkRect(6, 6, C.hpSuccess, 3); dot.x = 28; dot.y = 72 + i * 36 + 5; sg.appendChild(dot);
    const t = mkText(b, 14, W.regular, C.hpTextPri, 'LEFT', 490); t.x = 44; t.y = 68 + i * 36; sg.appendChild(t);
  });

  const p1 = mkRect(234, 56, C.hpBeige, 10); p1.x = 28; p1.y = 196; sg.appendChild(p1);
  const p1s = mkText('Cards payout', 11, W.regular, C.hpTextSec); p1s.x = 44; p1s.y = 206; sg.appendChild(p1s);
  const p1v = mkText('T+3 working days', 14, W.bold, C.hpTextPri); p1v.x = 44; p1v.y = 226; sg.appendChild(p1v);
  const p2 = mkRect(234, 56, C.hpBeige, 10); p2.x = 282; p2.y = 196; sg.appendChild(p2);
  const p2s = mkText('PayNow QR payout', 11, W.regular, C.hpTextSec); p2s.x = 298; p2s.y = 206; sg.appendChild(p2s);
  const p2v = mkText('T+1 calendar day', 14, W.bold, C.hpTextPri); p2v.x = 298; p2v.y = 226; sg.appendChild(p2v);

  const sgDiv = mkRect(500, 1, C.slate100); sgDiv.x = 28; sgDiv.y = 270; sg.appendChild(sgDiv);
  const sgRL = mkText('RATES', 10, W.bold, C.hpTextSec); sgRL.letterSpacing = { value: 1.2, unit: 'PIXELS' }; sgRL.x = 28; sgRL.y = 288; sg.appendChild(sgRL);
  const r1L = mkText('Domestic cards', 13, W.regular, C.hpTextSec); r1L.x = 28; r1L.y = 314; sg.appendChild(r1L);
  const r1V = mkText('2.5% (min S$0.20)', 13, W.semibold, C.hpAction, 'RIGHT', 200); r1V.x = 328; r1V.y = 314; sg.appendChild(r1V);
  const r2L = mkText('PayNow', 13, W.regular, C.hpTextSec); r2L.x = 28; r2L.y = 340; sg.appendChild(r2L);
  const r2V = mkText('0.4% (min S$0.10)', 13, W.semibold, C.hpAction, 'RIGHT', 200); r2V.x = 328; r2V.y = 340; sg.appendChild(r2V);
  sec.appendChild(sg);

  // ── International card ──
  const intl = mkFrame('InternationalVendors', 556, 390, C.white, 16);
  intl.strokes = [{ type: 'SOLID', color: C.hpAction }]; intl.strokeWeight = 1.5; intl.strokeAlign = 'INSIDE';
  intl.x = 740; intl.y = 156;

  const intlBadgeBg = mkRect(176, 26, C.hpAction, 13); intlBadgeBg.x = 28; intlBadgeBg.y = -13; intl.appendChild(intlBadgeBg);
  const intlBadgeTxt = mkText('For international vendors', 11, W.semibold, C.white, 'CENTER', 176); intlBadgeTxt.x = 28; intlBadgeTxt.y = -9; intl.appendChild(intlBadgeTxt);
  const intlHdr = mkText('INTERNATIONAL VENDORS', 10, W.bold, C.hpTextSec);
  intlHdr.letterSpacing = { value: 1.2, unit: 'PIXELS' }; intlHdr.x = 28; intlHdr.y = 28; intl.appendChild(intlHdr);

  ['Accept PayNow via HitPay\'s Borderless QR', 'Shoppers pay SGD — you receive in your home currency', 'No Singapore business or bank account required', 'Download the HitPay app to get started'].forEach((b, i) => {
    const dot = mkRect(6, 6, C.hpSuccess, 3); dot.x = 28; dot.y = 68 + i * 32 + 5; intl.appendChild(dot);
    const t = mkText(b, 14, W.regular, C.hpTextPri, 'LEFT', 490); t.x = 44; t.y = 64 + i * 32; intl.appendChild(t);
  });

  const poBg = mkRect(500, 56, C.hpBeige, 10); poBg.x = 28; poBg.y = 204; intl.appendChild(poBg);
  const poS = mkText('Payout', 11, W.regular, C.hpTextSec); poS.x = 44; poS.y = 214; intl.appendChild(poS);
  const poV = mkText('T+3 working days · in your home currency', 14, W.bold, C.hpTextPri); poV.x = 44; poV.y = 234; intl.appendChild(poV);
  const intlDiv = mkRect(500, 1, C.slate100); intlDiv.x = 28; intlDiv.y = 278; intl.appendChild(intlDiv);
  const intlRL = mkText('RATES', 10, W.bold, C.hpTextSec); intlRL.letterSpacing = { value: 1.2, unit: 'PIXELS' }; intlRL.x = 28; intlRL.y = 296; intl.appendChild(intlRL);
  const irL = mkText('PayNow Borderless QR', 13, W.regular, C.hpTextSec); irL.x = 28; irL.y = 322; intl.appendChild(irL);
  const irV = mkText('1.5%', 13, W.semibold, C.hpAction, 'RIGHT', 200); irV.x = 328; irV.y = 322; intl.appendChild(irV);
  sec.appendChild(intl);

  const noteBg = mkRect(1152, 68, C.hpBlue50, 16); noteBg.x = 144; noteBg.y = 564; sec.appendChild(noteBg);
  const noteTxt = mkText('Onboarding: Your business must be registered in your home country. Approval takes 1–3 business days — sign up early at dashboard.hit-pay.com/register?partner_referral=ARUDTXQHYJ', 13, W.regular, C.hpTextPri, 'LEFT', 1080);
  noteTxt.lineHeight = { value: 20, unit: 'PIXELS' }; noteTxt.x = 168; noteTxt.y = 576; sec.appendChild(noteTxt);

  return sec;
}

/** How it works — 3-step overview */
function mkHowItWorksACF() {
  const sec = mkFrame('HowItWorks', 1440, 340, C.hpBeige);
  const h2 = mkH2('How it works', 32, C.hpTextPri, 'CENTER', 600);
  h2.x = 420; h2.y = 48; sec.appendChild(h2);
  const sub = mkText('No hardware to order. No complicated setup. Just your phone.', 16, W.regular, C.hpTextSec, 'CENTER', 700);
  sub.x = 370; sub.y = 106; sec.appendChild(sub);

  [
    { n: '1', title: 'Sign up online',   desc: 'Create your free account via the partner link. Submit business documents. Approved in 1–3 business days.' },
    { n: '2', title: 'Download the app', desc: 'Get HitPay Point of Sale on iOS or Android. Enable Tap to Pay or set up your PayNow / Borderless QR.' },
    { n: '3', title: 'Sell at the fair', desc: 'Accept cards, PayNow, Apple Pay, and more. Payouts hit your bank automatically after the event.' },
  ].forEach((step, i) => {
    const x = 200 + i * 370;
    const circle = mkFrame(`Step${i+1}`, 48, 48, C.hpAction, 24);
    const numT = mkText(step.n, 20, W.bold, C.white, 'CENTER'); numT.x = 14; numT.y = 10; circle.appendChild(numT);
    circle.x = x + 126; circle.y = 168; sec.appendChild(circle);
    const tt = mkText(step.title, 16, W.bold, C.hpTextPri, 'CENTER', 300); tt.x = x + 10; tt.y = 230; sec.appendChild(tt);
    const dd = mkText(step.desc, 13, W.regular, C.hpTextSec, 'CENTER', 300); dd.lineHeight = { value: 20, unit: 'PIXELS' }; dd.x = x + 10; dd.y = 258; sec.appendChild(dd);
  });
  return sec;
}

/** Video player placeholder for Tap to Pay YouTube embed */
function mockVideoPlayer(title, url) {
  const frame = mkFrame('VideoPlaceholder', 420, 236, C.slate900, 16);
  const overlay = mkRect(420, 236, C.hpDeepBlue, 0); overlay.opacity = 0.6; overlay.x = 0; overlay.y = 0; frame.appendChild(overlay);
  const playCircle = mkFrame('PlayBtn', 64, 64, C.white, 32); playCircle.opacity = 0.92; playCircle.x = 178; playCircle.y = 68; frame.appendChild(playCircle);
  const playIcon = mkText('▶', 22, W.bold, C.hpDeepBlue, 'CENTER', 64); playIcon.x = 0; playIcon.y = 18; playCircle.appendChild(playIcon);
  const titleT = mkText(title, 14, W.semibold, C.white, 'CENTER', 380); titleT.x = 20; titleT.y = 154; frame.appendChild(titleT);
  const urlT = mkText('▸ ' + url, 11, W.regular, { r: 0.7, g: 0.8, b: 1 }, 'CENTER', 380); urlT.x = 20; urlT.y = 178; frame.appendChild(urlT);
  const annoBg = mkRect(420, 32, C.amber100, 0); annoBg.x = 0; annoBg.y = 204; frame.appendChild(annoBg);
  const annoTxt = mkText('✏️  Designer: embed this YouTube video in the final design', 11, W.semibold, C.amber700, 'CENTER', 380); annoTxt.x = 20; annoTxt.y = 212; frame.appendChild(annoTxt);
  return frame;
}

/** Mock Borderless QR display panel */
function mockBorderlessQR() {
  const frame = mkFrame('MockBorderlessQR', 360, 400, C.white, 20);
  frame.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.10 }, offset: { x: 0, y: 16 }, radius: 40, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const hdrBg = mkRect(360, 56, C.hpBlue50); hdrBg.x = 0; hdrBg.y = 0; frame.appendChild(hdrBg);
  const hdrTxt = mkText('HitPay Borderless QR — PayNow', 13, W.semibold, C.hpAction); hdrTxt.x = 16; hdrTxt.y = 18; frame.appendChild(hdrTxt);

  const qrBorder = mkRect(200, 200, C.white, 4);
  qrBorder.strokes = [{ type: 'SOLID', color: C.slate200 }]; qrBorder.strokeWeight = 1; qrBorder.strokeAlign = 'INSIDE';
  qrBorder.x = 80; qrBorder.y = 72; frame.appendChild(qrBorder);

  [[1,1,0,1,0,1,1],[1,0,1,0,1,0,1],[0,1,1,0,1,1,0],[1,0,0,1,0,0,1],[0,1,1,0,1,1,0],[1,0,1,0,1,0,1],[1,1,0,1,0,1,1]].forEach((row, ri) => {
    row.forEach((on, ci) => { if (on) { const d = mkRect(18, 18, C.hpTextPri, 2); d.x = 96 + ci * 24; d.y = 88 + ri * 24; frame.appendChild(d); } });
  });
  [[88,80],[200,80],[88,192]].forEach(([cx, cy]) => {
    const outer = mkRect(32, 32, C.white, 3); outer.strokes = [{ type: 'SOLID', color: C.hpTextPri }]; outer.strokeWeight = 2.5; outer.strokeAlign = 'INSIDE'; outer.x = cx; outer.y = cy; frame.appendChild(outer);
    const inner = mkRect(14, 14, C.hpTextPri, 2); inner.x = cx + 9; inner.y = cy + 9; frame.appendChild(inner);
  });

  const qrLbl = mkText('PayNow Borderless QR', 12, W.semibold, C.hpAction, 'CENTER', 200); qrLbl.x = 80; qrLbl.y = 284; frame.appendChild(qrLbl);
  const note = mkText('Shoppers pay in SGD\nYou receive in your home currency', 12, W.regular, C.hpTextSec, 'CENTER', 300); note.lineHeight = { value: 18, unit: 'PIXELS' }; note.x = 30; note.y = 314; frame.appendChild(note);
  const annoBg = mkRect(360, 28, C.amber100, 0); annoBg.x = 0; annoBg.y = 372; frame.appendChild(annoBg);
  const annoTxt = mkText('✏️  Designer: replace with borderless-qr-hero.avif or a fair-setting QR photo', 10, W.semibold, C.amber700, 'CENTER', 340); annoTxt.x = 10; annoTxt.y = 379; frame.appendChild(annoTxt);
  return frame;
}

/** International vendors spotlight — dark blue section */
function mkIntlSpotlight() {
  const sec = mkFrame('IntlSpotlight', 1440, 460, C.hpDeepBlue);

  const badgeBg = mkH('IntlBadge', 0, 12, 6, { r: 1, g: 1, b: 1 }, 100);
  badgeBg.fills = [{ type: 'SOLID', color: C.white, opacity: 0.12 }];
  badgeBg.counterAxisAlignItems = 'CENTER';
  badgeBg.appendChild(mkText('International Vendors', 12, W.medium, C.hpBlue100));
  badgeBg.x = 144; badgeBg.y = 64; sec.appendChild(badgeBg);

  const h2 = mkH2('Selling at Art & Craft Fair\nfrom abroad? We\'ve got you.', 36, C.white, 'LEFT', 540);
  h2.lineHeight = { value: 48, unit: 'PIXELS' }; h2.x = 144; h2.y = 116; sec.appendChild(h2);

  const p = mkText('HitPay\'s Borderless QR lets you accept SGD from Singapore shoppers and receive payout in your home currency — no Singapore bank account needed. Vendors from Thailand, Malaysia, Indonesia, China, Taiwan, Hong Kong, Japan, and the Philippines are all eligible.', 16, W.regular, C.hpBlue100, 'LEFT', 520);
  p.lineHeight = { value: 26, unit: 'PIXELS' }; p.x = 144; p.y = 240; sec.appendChild(p);

  const cta = mkBtn('Sign up as an international vendor  →', C.white, C.hpDeepBlue, 24, 14, 12);
  cta.x = 144; cta.y = 386; sec.appendChild(cta);

  [
    { flag: '🇸🇬', name: 'Singapore',    note: 'PayNow + Cards' },
    { flag: '🇹🇭', name: 'Thailand',     note: 'PayNow via Borderless QR' },
    { flag: '🇲🇾', name: 'Malaysia',     note: 'PayNow via Borderless QR' },
    { flag: '🇮🇩', name: 'Indonesia',    note: 'PayNow via Borderless QR' },
    { flag: '🇨🇳', name: 'China',        note: 'PayNow via Borderless QR' },
    { flag: '🇹🇼', name: 'Taiwan',       note: 'PayNow via Borderless QR' },
    { flag: '🇭🇰', name: 'Hong Kong',    note: 'PayNow via Borderless QR' },
    { flag: '🇯🇵', name: 'Japan + more', note: 'PayNow via Borderless QR' },
  ].forEach((c, i) => {
    const col = i % 2; const row = Math.floor(i / 2);
    const cx = 780 + col * 262; const cy = 48 + row * 76;
    const bg = mkRect(246, 64, C.white, 10); bg.opacity = 0.08; bg.x = cx; bg.y = cy; sec.appendChild(bg);
    const flagT = mkText(c.flag, 20, W.regular, C.white); flagT.x = cx + 12; flagT.y = cy + 14; sec.appendChild(flagT);
    const nameT = mkText(c.name, 13, W.semibold, C.white); nameT.x = cx + 46; nameT.y = cy + 10; sec.appendChild(nameT);
    const noteT = mkText(c.note, 11, W.regular, C.hpBlue100); noteT.x = cx + 46; noteT.y = cy + 32; sec.appendChild(noteT);
  });

  return sec;
}

function buildArtCraftFair(xOffset = 0) {
  const page = new Page('Art & Craft Fair Singapore 2026', xOffset);
  const ac = C.hpAction;

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroArtCraftFair(), 560);
  page.add(mkVendorSplit(), 660);
  page.add(mkHowItWorksACF(), 340);

  page.add(mkFeature({
    label: 'For Singapore Vendors',
    h2: 'Tap to Pay on iPhone — no terminal needed',
    p: 'Turn your iPhone or NFC Android into a card terminal instantly. Customers tap their card, Apple Pay, or Google Pay directly on your phone. Works with any NFC-enabled iPhone running iOS 16+.',
    bullets: [
      'Accepts Visa, Mastercard, Apple Pay, Google Pay',
      'Receipts sent instantly to customer by SMS or email',
      'Works offline — syncs when connection is restored',
    ],
    mockUI: mockVideoPlayer('HitPay — Tap to Pay on iPhone demo', 'youtube.com/watch?v=b2_h1fDtGVE'),
    bg: C.hpBlue50,
    textSide: 'left',
    accent: ac,
  }), 520);

  page.add(mkFeature({
    label: 'For International Vendors',
    h2: 'PayNow via Borderless QR — collect SGD without a local account',
    p: 'Display your HitPay Borderless QR at your stall. Singapore shoppers scan with their banking app and pay in SGD — exactly as they would any PayNow QR. HitPay handles the conversion and pays out to your home bank automatically.',
    bullets: [
      'No Singapore bank account or ACRA registration needed',
      'Print or display QR on phone — shopper scans, done',
      'Payout in THB, MYR, IDR, CNY, HKD, JPY, PHP and more',
    ],
    mockUI: mockBorderlessQR(),
    bg: C.white,
    textSide: 'right',
    accent: ac,
  }), 520);

  page.add(mkGrid(
    'Built for in-person selling',
    'HitPay\'s event tools let you focus on your craft — not your checkout.',
    [
      { title: 'Tap to Pay — no terminal',   desc: 'Turn your NFC iPhone or Android into a card reader. Accept contactless cards and Apple Pay instantly.' },
      { title: 'PayNow via Borderless QR',   desc: 'International vendors display a QR code; Singapore shoppers pay SGD; you receive in your home currency.' },
      { title: 'Card Terminal (optional)',    desc: 'Prefer a dedicated reader? HitPay card terminals work with the same app and dashboard.' },
      { title: 'Live sales dashboard',       desc: 'Track every transaction in real time — by item, hour, and payment method — on phone or laptop.' },
      { title: 'MAS-licensed & secure',      desc: 'Regulated by MAS as a Major Payment Institution. PCI DSS Level 1 certified. Your funds are protected.' },
      { title: 'No monthly fees, ever',      desc: 'Pay only when you sell — a small percentage per transaction. Nothing to pay when the fair ends.' },
    ]
  ), 660);

  page.add(mkIntlSpotlight(), 460);

  page.add(mkStats(
    [
      { value: 'SGD 0',    label: 'Monthly fees' },
      { value: '50+',      label: 'Payment methods' },
      { value: '15,000+',  label: 'Businesses on HitPay' },
      { value: '1–3 days', label: 'Account approval time' },
    ],
    C.hpBeige, C.hpTextPri, C.hpTextSec
  ), 192);

  page.add(mkFAQ([
    { q: 'Can international vendors from Thailand, Malaysia, or Indonesia use HitPay at the fair?', a: 'Yes. International vendors accept PayNow via HitPay\'s Borderless QR — no Singapore bank account or local business registration required. Vendors from Thailand, Malaysia, Indonesia, China, Taiwan, Hong Kong, Japan, Philippines, and more are all eligible.' },
    { q: 'Do I need to buy or rent a card terminal to accept card payments?', a: 'No terminal needed for Singapore vendors. Tap to Pay on any NFC iPhone or Android phone — customers tap their card, Apple Pay, or Google Pay directly on your device. HitPay card terminals are optional.' },
    { q: 'How long does HitPay account approval take?', a: 'Approval typically takes 1–3 business days after document submission. Sign up as early as possible to ensure your account is live and tested before the fair.' },
    { q: 'When do I receive my payout after the fair?', a: 'Singapore vendors: PayNow payouts arrive in T+1 calendar day, card payouts in T+3 working days. International vendors: T+3 working days in their home currency.' },
    { q: 'Is there any monthly fee or minimum commitment?', a: 'No setup fee, no monthly fee, no contract. HitPay charges only a small percentage per transaction: 2.5% for domestic cards, 0.4% for PayNow (SG), or 1.5% for Borderless QR (international).' },
    { q: 'What payment methods can shoppers use at the fair?', a: 'Shoppers can pay by Visa, Mastercard, PayNow, Apple Pay, and Google Pay. No cash counting, no wrong change, no missed sales from "I don\'t have cash".' },
  ], ac), 640);

  page.add(mkCTA(
    'Sign up for your free HitPay account today',
    'No monthly fees. No setup cost. Accept cards and PayNow at the fair — from your phone.',
    'Create my free account now',
    'Questions? Contact us',
    ac
  ), 300);

  page.add(mkFooter(
    ac,
    ['Point of Sale', 'Tap to Pay', 'Borderless QR', 'Card Terminal'],
    ['Art & Craft Fair 2026', 'Events', 'Retail', 'F&B']
  ), 280);

  return page.f;
}

// ── VIRTUAL ACCOUNTS ─────────────────────────────────────────

function mockVADashboard() {
  const card = mkFrame('MockVADashboard', 300, 370, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.08 }, offset: { x: 0, y: 16 }, radius: 40, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const hdrT = mkText('Activity — Today', 12, W.semibold, C.hpTextPri);
  hdrT.x = 20; hdrT.y = 18;
  card.appendChild(hdrT);

  const liveBg = mkRect(52, 22, C.green100, 11);
  liveBg.x = 228; liveBg.y = 16;
  card.appendChild(liveBg);
  const liveT = mkText('● Live', 10, W.medium, C.green600);
  liveT.x = 234; liveT.y = 19;
  card.appendChild(liveT);

  const balBg = mkRect(260, 58, C.hpBlue50, 12);
  balBg.x = 20; balBg.y = 48;
  card.appendChild(balBg);
  const balLbl = mkText('TOTAL BALANCE', 9, W.medium, C.hpTextSec, 'CENTER', 260);
  balLbl.x = 20; balLbl.y = 58;
  card.appendChild(balLbl);
  const balAmt = mkText('S$ 36,448.90', 20, W.semibold, C.hpTextPri, 'CENTER', 260);
  balAmt.x = 20; balAmt.y = 74;
  card.appendChild(balAmt);

  const cpHdr = mkText('CUSTOMER PAYMENTS', 9, W.semibold, C.hpTextSec);
  cpHdr.x = 20; cpHdr.y = 118;
  card.appendChild(cpHdr);

  [['PayNow · Agnes Bakery', '+S$340'], ['Visa · Online order', '+S$219']].forEach(([label, amt], i) => {
    const t = mkText(label, 12, W.regular, C.hpTextSec);
    t.x = 40; t.y = 138 + i * 22;
    card.appendChild(t);
    const a = mkText(amt, 12, W.medium, C.green600);
    a.x = 240; a.y = 138 + i * 22;
    card.appendChild(a);
  });

  const div1 = mkRect(260, 1, C.slate100);
  div1.x = 20; div1.y = 186;
  card.appendChild(div1);

  const brHdr = mkText('BUSINESS RECEIVABLES', 9, W.semibold, C.hpTextSec);
  brHdr.x = 20; brHdr.y = 196;
  card.appendChild(brHdr);

  const brRows = [
    { badge: 'SGD', badgeBg: C.green100, badgeFg: C.green600, label: 'FAST · Pinnacle Systems SG', amt: '+S$5,200' },
    { badge: 'USD', badgeBg: C.amber100, badgeFg: C.amber700, label: 'SWIFT · Zenith Retail Ltd', amt: '+S$2,841' },
    { badge: 'EUR', badgeBg: C.blue100, badgeFg: C.blue600, label: 'SWIFT · Luxe Supplies GmbH', amt: '+S$1,084' },
  ];
  brRows.forEach((row, i) => {
    const y = 216 + i * 26;
    const badgeBg = mkRect(26, 18, row.badgeBg, 4);
    badgeBg.x = 20; badgeBg.y = y;
    card.appendChild(badgeBg);
    const badgeT = mkText(row.badge, 9, W.bold, row.badgeFg, 'CENTER', 26);
    badgeT.x = 20; badgeT.y = y + 2;
    card.appendChild(badgeT);
    const lt = mkText(row.label, 11, W.regular, C.hpTextSec);
    lt.x = 50; lt.y = y + 1;
    card.appendChild(lt);
    const at = mkText(row.amt, 11, W.medium, C.green600);
    at.x = 236; at.y = y + 1;
    card.appendChild(at);
  });

  const footBg = mkRect(260, 26, C.hpBlue50, 8);
  footBg.x = 20; footBg.y = 330;
  card.appendChild(footBg);
  const footT = mkText('DBS-backed · Own-name account', 10, W.regular, C.hpTextSec, 'CENTER', 260);
  footT.x = 20; footT.y = 337;
  card.appendChild(footT);

  card.resize(300, 370);
  return card;
}

function mockVALedger() {
  const card = mkFrame('MockVALedger', 280, 350, C.white, 16);
  card.strokes = [{ type: 'SOLID', color: C.slate200 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.10 }, offset: { x: 0, y: 16 }, radius: 40, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const title = mkText('All transactions — Jun 2026', 11, W.semibold, C.hpTextSec);
  title.x = 20; title.y = 18;
  card.appendChild(title);

  const cpH = mkText('CUSTOMER PAYMENTS', 9, W.semibold, C.hpTextSec);
  cpH.x = 20; cpH.y = 44;
  card.appendChild(cpH);

  [['PayNow', 'Agnes Tan Bakery', '+S$340'], ['Visa card', 'Online order #2891', '+S$219'], ['GrabPay', 'Walk-in customer', '+S$48']].forEach(([method, sub, amt], i) => {
    const y = 58 + i * 38;
    const mt = mkText(method, 12, W.medium, C.hpTextPri);
    mt.x = 20; mt.y = y;
    card.appendChild(mt);
    const st = mkText(sub, 10, W.regular, C.hpTextSec);
    st.x = 20; st.y = y + 16;
    card.appendChild(st);
    const at = mkText(amt, 12, W.semibold, C.green600);
    at.x = 218; at.y = y;
    card.appendChild(at);
    const d = mkRect(240, 1, C.slate50);
    d.x = 20; d.y = y + 34;
    card.appendChild(d);
  });

  const brH = mkText('BUSINESS RECEIVABLES', 9, W.semibold, C.hpTextSec);
  brH.x = 20; brH.y = 176;
  card.appendChild(brH);

  [['SGD FAST', 'Pinnacle Systems SG', '+S$5,200'], ['USD SWIFT', 'Zenith Retail Ltd', '+S$2,841'], ['EUR SWIFT', 'Luxe Supplies GmbH', '+S$1,084']].forEach(([method, sub, amt], i) => {
    const y = 190 + i * 38;
    const mt = mkText(method, 12, W.medium, C.hpTextPri);
    mt.x = 20; mt.y = y;
    card.appendChild(mt);
    const st = mkText(sub, 10, W.regular, C.hpTextSec);
    st.x = 20; st.y = y + 16;
    card.appendChild(st);
    const at = mkText(amt, 12, W.semibold, C.green600);
    at.x = 210; at.y = y;
    card.appendChild(at);
  });

  const exportBg = mkRect(240, 32, C.hpAction, 8);
  exportBg.x = 20; exportBg.y = 306;
  card.appendChild(exportBg);
  const exportT = mkText('Export unified report →', 12, W.semibold, C.white, 'CENTER', 240);
  exportT.x = 20; exportT.y = 314;
  card.appendChild(exportT);

  card.resize(280, 350);
  return card;
}

function mockDBSCompare() {
  const container = mkFrame('MockDBSCompare', 300, 360);
  container.fills = [];

  const emiCard = mkFrame('EMICard', 280, 148, C.white, 16);
  emiCard.strokes = [{ type: 'SOLID', color: C.slate200 }];
  emiCard.strokeWeight = 1;
  emiCard.strokeAlign = 'INSIDE';
  emiCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.06 }, offset: { x: 0, y: 8 }, radius: 20, spread: 0, visible: true, blendMode: 'NORMAL' }];
  const emiTitle = mkText('Typical EMI fintech account', 11, W.semibold, C.hpTextSec);
  emiTitle.x = 20; emiTitle.y = 16;
  emiCard.appendChild(emiTitle);
  ['Pooled float — not your own account', 'Fund freezes with no bank recourse', 'E-money licence only — not a bank'].forEach((item, i) => {
    const cross = mkText('✕', 13, W.bold, C.red600);
    cross.x = 20; cross.y = 42 + i * 28;
    emiCard.appendChild(cross);
    const t = mkText(item, 12, W.regular, C.hpTextSec, 'LEFT', 220);
    t.x = 40; t.y = 43 + i * 28;
    emiCard.appendChild(t);
  });
  emiCard.x = 10; emiCard.y = 0;
  container.appendChild(emiCard);

  const hpCard = mkFrame('HitPayDBSCard', 280, 180, C.hpDeepBlue, 16);
  hpCard.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.20 }, offset: { x: 0, y: 12 }, radius: 32, spread: 0, visible: true, blendMode: 'NORMAL' }];
  const hpLbl = mkText('HitPay × DBS Bank', 11, W.semibold, C.hpBlue100);
  hpLbl.x = 20; hpLbl.y = 16;
  hpCard.appendChild(hpLbl);
  const bankBadge = mkRect(80, 20, C.green600, 10);
  bankBadge.x = 180; bankBadge.y = 14;
  hpCard.appendChild(bankBadge);
  const bankT = mkText('Bank-grade', 10, W.semibold, C.white, 'CENTER', 80);
  bankT.x = 180; bankT.y = 17;
  hpCard.appendChild(bankT);
  ['Own-name account — not pooled', 'Funds held at DBS — Singapore\'s largest bank', 'Full banking supervision — no freeze risk'].forEach((item, i) => {
    const check = mkText('✓', 13, W.bold, C.green600);
    check.x = 20; check.y = 48 + i * 36;
    hpCard.appendChild(check);
    const t = mkText(item, 12, W.regular, C.hpBlue100, 'LEFT', 220);
    t.lineHeight = { value: 18, unit: 'PIXELS' };
    t.x = 40; t.y = 49 + i * 36;
    hpCard.appendChild(t);
  });
  hpCard.x = 10; hpCard.y = 168;
  container.appendChild(hpCard);

  container.resize(300, 360);
  return container;
}

function mockVACurrencies() {
  const card = mkFrame('MockVACurrencies', 280, 316, C.white, 16);
  card.strokes = [{ type: 'SOLID', color: C.slate200 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.10 }, offset: { x: 0, y: 16 }, radius: 40, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const title = mkText('Receive payment details', 13, W.semibold, C.hpTextPri);
  title.x = 20; title.y = 18;
  card.appendChild(title);

  const detailBg = mkRect(240, 100, C.hpBeige, 12);
  detailBg.x = 20; detailBg.y = 42;
  card.appendChild(detailBg);
  [['Account name', 'Meridian Pte. Ltd.'], ['Account number', '048-XXXXXX-X'], ['Bank', 'DBS Bank Ltd'], ['SWIFT/BIC', 'DBSSSGSG']].forEach(([lbl, val], i) => {
    const lt = mkText(lbl, 11, W.regular, C.hpTextSec);
    lt.x = 32; lt.y = 52 + i * 22;
    card.appendChild(lt);
    const vt = mkText(val, 11, W.medium, C.hpTextPri);
    vt.x = 152; vt.y = 52 + i * 22;
    card.appendChild(vt);
  });

  const currLabel = mkText('CURRENCIES RECEIVABLE', 9, W.semibold, C.hpTextSec);
  currLabel.x = 20; currLabel.y = 154;
  card.appendChild(currLabel);

  const currencies = [
    { code: 'SGD', sub: 'Instant', bg: C.green100, fg: C.green600 },
    { code: 'USD', sub: 'SWIFT',   bg: C.hpBeige,  fg: C.hpTextPri },
    { code: 'EUR', sub: 'SWIFT',   bg: C.hpBeige,  fg: C.hpTextPri },
    { code: 'GBP', sub: 'SWIFT',   bg: C.hpBeige,  fg: C.hpTextPri },
    { code: 'AUD', sub: 'SWIFT',   bg: C.hpBeige,  fg: C.hpTextPri },
    { code: '+8',  sub: 'more',    bg: C.hpBeige,  fg: C.hpTextSec },
  ];
  currencies.forEach((c, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const cx = 20 + col * 80;
    const cy = 170 + row * 56;
    const bg = mkRect(70, 46, c.bg, 8);
    bg.x = cx; bg.y = cy;
    card.appendChild(bg);
    const ct = mkText(c.code, 13, W.semibold, c.fg, 'CENTER', 70);
    ct.x = cx; ct.y = cy + 7;
    card.appendChild(ct);
    const st = mkText(c.sub, 10, W.regular, c.fg, 'CENTER', 70);
    st.x = cx; st.y = cy + 27;
    card.appendChild(st);
  });

  const shareBg = mkRect(240, 28, C.hpBlue50, 8);
  shareBg.x = 20; shareBg.y = 278;
  card.appendChild(shareBg);
  const shareT = mkText('Share account details via email or PDF', 11, W.regular, C.hpTextSec, 'CENTER', 240);
  shareT.x = 20; shareT.y = 286;
  card.appendChild(shareT);

  card.resize(280, 316);
  return card;
}

function mockVAActivation() {
  const card = mkFrame('MockVAActivation', 280, 280, C.white, 16);
  card.strokes = [{ type: 'SOLID', color: C.slate200 }];
  card.strokeWeight = 1;
  card.strokeAlign = 'INSIDE';
  card.effects = [{ type: 'DROP_SHADOW', color: { r: 0, g: 0, b: 0, a: 0.10 }, offset: { x: 0, y: 16 }, radius: 40, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const acctTitle = mkText('Your HitPay account', 13, W.semibold, C.hpTextPri);
  acctTitle.x = 20; acctTitle.y = 14;
  card.appendChild(acctTitle);
  const acctSub = mkText('Meridian Pte. Ltd. · PS20200643', 11, W.regular, C.hpTextSec);
  acctSub.x = 20; acctSub.y = 32;
  card.appendChild(acctSub);

  [
    { label: 'Customer payments', status: 'Active', active: true },
    { label: 'Payment links', status: 'Active', active: true },
    { label: 'Multi-currency VA', status: 'Activate', active: false },
  ].forEach((row, i) => {
    const ry = 54 + i * 54;
    const rowBg = mkRect(240, 44, row.active ? C.hpBeige : C.hpBlue50, 12);
    rowBg.strokes = [{ type: 'SOLID', color: row.active ? C.slate100 : C.hpBlue100 }];
    rowBg.strokeWeight = 1;
    rowBg.strokeAlign = 'INSIDE';
    rowBg.x = 20; rowBg.y = ry;
    card.appendChild(rowBg);
    const dot = mkRect(8, 8, row.active ? C.green600 : C.hpAction, 4);
    dot.x = 32; dot.y = ry + 18;
    card.appendChild(dot);
    const lt = mkText(row.label, 13, W.medium, row.active ? C.hpTextPri : C.hpAction);
    lt.x = 48; lt.y = ry + 14;
    card.appendChild(lt);
    const bW = row.active ? 48 : 58;
    const badge = mkRect(bW, 22, row.active ? C.green100 : C.hpAction, 11);
    badge.x = 216 - bW; badge.y = ry + 11;
    card.appendChild(badge);
    const badgeT = mkText(row.status, 11, W.semibold, row.active ? C.green600 : C.white, 'CENTER', bW);
    badgeT.x = 216 - bW; badgeT.y = ry + 14;
    card.appendChild(badgeT);
  });

  const footBg = mkRect(240, 44, C.hpBeige, 12);
  footBg.x = 20; footBg.y = 224;
  card.appendChild(footBg);
  const footL1 = mkText('No new sign-up required', 11, W.regular, C.hpTextSec, 'CENTER', 240);
  footL1.x = 20; footL1.y = 230;
  card.appendChild(footL1);
  const footL2 = mkText('Ready in minutes — same KYB', 12, W.semibold, C.hpTextPri, 'CENTER', 240);
  footL2.x = 20; footL2.y = 248;
  card.appendChild(footL2);

  card.resize(280, 280);
  return card;
}

function mkHeroVirtualAccounts() {
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badge = mkPill('Virtual Account & Global Collections', C.hpBlue100, C.hpAction, 16, 8, 100);
  badge.x = 144; badge.y = 72;
  sec.appendChild(badge);

  const h1 = mkH2('One HitPay account for your customers and your local and overseas business partners — backed by DBS', 44, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 52, unit: 'PIXELS' };
  h1.x = 144; h1.y = 118;
  sec.appendChild(h1);

  const sub = mkText('Receive in 13 currencies — SGD instantly via FAST and PayNow from local or overseas partners, USD and EUR via SWIFT — all in the same dashboard as your local and cross-border customer payments.', 18, W.regular, C.hpTextSec, 'LEFT', 540);
  sub.lineHeight = { value: 28, unit: 'PIXELS' };
  sub.x = 144; sub.y = 316;
  sec.appendChild(sub);

  const b1 = mkBtn('Open your account', C.hpAction, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 410;
  sec.appendChild(b1);

  const b2 = mkBtn('Talk to sales', null, C.hpTextPri, 24, 14, 12, true);
  b2.x = 336; b2.y = 410;
  sec.appendChild(b2);

  const fine = mkText('No monthly fees · No setup fees · Approval in 1–3 business days', 13, W.regular, C.hpTextSec);
  fine.x = 144; fine.y = 462;
  sec.appendChild(fine);

  const dashboard = mockVADashboard();
  dashboard.x = 908; dashboard.y = 88;
  sec.appendChild(dashboard);

  return sec;
}

function mkVATrustBar() {
  const sec = mkFrame('TrustBar', 1440, 200, C.hpBeige);
  sec.strokes = [{ type: 'SOLID', color: C.slate100 }];
  sec.strokeWeight = 1;
  sec.strokeAlign = 'INSIDE';

  const lbl = mkText('USED BY SINGAPORE BUSINESSES COLLECTING FROM LOCAL AND OVERSEAS COUNTERPARTIES', 10, W.semibold, C.hpTextSec, 'CENTER', 1152);
  lbl.letterSpacing = { value: 1.2, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 22;
  sec.appendChild(lbl);

  const tags = ['Exporters', 'Digital Agencies', 'Wholesale Distributors', 'SaaS & Tech', 'Professional Service Firms', 'Consultants', 'Trading Companies', 'Importers'];
  let tx = 144;
  let ty = 48;
  tags.forEach(tag => {
    const pill = mkPill(tag, C.white, C.hpTextSec, 12, 6, 100);
    pill.strokes = [{ type: 'SOLID', color: C.slate200 }];
    pill.strokeWeight = 1;
    pill.strokeAlign = 'INSIDE';
    const estW = tag.length * 7 + 28;
    if (tx + estW > 1280) { tx = 144; ty += 34; }
    pill.x = tx; pill.y = ty;
    tx += estW + 8;
    sec.appendChild(pill);
  });

  const desc = mkText('From Jurong exporters receiving USD from US distributors, to businesses collecting SGD via FAST from local Singapore partners — HitPay\'s DBS-backed account handles every business receivable, local or overseas.', 14, W.regular, C.hpTextSec, 'CENTER', 840);
  desc.lineHeight = { value: 22, unit: 'PIXELS' };
  desc.x = 300; desc.y = 148;
  sec.appendChild(desc);

  return sec;
}

function mkVAComparisonSection() {
  const sec = mkFrame('Comparison', 1440, 560, C.white);

  const lbl = mkText('THE HITPAY DIFFERENCE', 11, W.semibold, C.hpAction, 'CENTER', 1152);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 40;
  sec.appendChild(lbl);

  const h2 = mkH2('The only platform where customer payments and business collections meet', 32, C.hpTextPri, 'CENTER', 800);
  h2.lineHeight = { value: 40, unit: 'PIXELS' };
  h2.x = 320; h2.y = 66;
  sec.appendChild(h2);

  const sub = mkText('Most multi-currency platforms handle international transfers. Only HitPay also collects from your customers locally and cross-border, and from local partners via FAST — all in one DBS-backed account.', 16, W.regular, C.hpTextSec, 'CENTER', 780);
  sub.lineHeight = { value: 24, unit: 'PIXELS' };
  sub.x = 330; sub.y = 150;
  sec.appendChild(sub);

  const tTop = 208;
  const col1X = 144; const col1W = 380;
  const col2X = 540; const col2W = 340;
  const col3X = 896; const col3W = 340;
  const rH = 36;

  const hdrBg = mkRect(1152, 40, C.hpBeige, 0);
  hdrBg.x = 144; hdrBg.y = tTop;
  sec.appendChild(hdrBg);
  const h1 = mkText('What matters', 11, W.semibold, C.hpTextSec, 'LEFT', col1W);
  h1.x = col1X + 12; h1.y = tTop + 13;
  sec.appendChild(h1);
  const h2t = mkText('Other multi-currency platforms', 11, W.semibold, C.hpTextSec, 'CENTER', col2W);
  h2t.x = col2X; h2t.y = tTop + 13;
  sec.appendChild(h2t);
  const h3t = mkText('HitPay', 11, W.semibold, C.hpAction, 'CENTER', col3W);
  h3t.x = col3X; h3t.y = tTop + 13;
  sec.appendChild(h3t);

  const rows = [
    ['Collect from customers (C2B)', 'Cards only / limited', '✓✓ Cards, PayNow, wallets, links, POS'],
    ['Local SGD via FAST/PayNow', '✕ No',                  '✓ Real-time — local & overseas SGD senders'],
    ['Overseas SWIFT receiving',    '✓ Yes',                '✓ DBS-backed own-name account'],
    ['Currencies receivable',       '30–60+ (FX specialists)', '13 & growing'],
    ['Backed by',                   'EMI licence',           'DBS Bank — Singapore\'s largest'],
    ['Own-name account',            '◐ Varies — some pooled', '✓ Always own-name'],
    ['FX markup',                   '0.5–3.5%',              '1.0% fixed over interbank mid-rate'],
    ['Monthly fees',                'Varies by provider',    'SGD 0 — no monthly fees'],
  ];
  rows.forEach((row, i) => {
    const ry = tTop + 40 + i * rH;
    const rowBg = mkRect(1152, rH, i % 2 === 1 ? C.hpBeige : C.white, 0);
    rowBg.x = 144; rowBg.y = ry;
    sec.appendChild(rowBg);
    const c1 = mkText(row[0], 13, W.medium, C.hpTextPri, 'LEFT', col1W - 24);
    c1.x = col1X + 12; c1.y = ry + 10;
    sec.appendChild(c1);
    const c2 = mkText(row[1], 13, W.regular, C.hpTextSec, 'CENTER', col2W);
    c2.x = col2X; c2.y = ry + 10;
    sec.appendChild(c2);
    const c3 = mkText(row[2], 13, W.semibold, C.hpTextPri, 'CENTER', col3W);
    c3.x = col3X; c3.y = ry + 10;
    sec.appendChild(c3);
  });

  const calloutBg = mkRect(1152, 52, C.hpBlue50, 0);
  calloutBg.x = 144; calloutBg.y = tTop + 40 + rows.length * rH + 8;
  sec.appendChild(calloutBg);
  const calloutT = mkText('HitPay is the only platform where your customers, local business partners, and overseas clients all pay into one DBS-backed account — with one ledger and one reconciliation export.', 13, W.regular, C.hpTextPri, 'LEFT', 1060);
  calloutT.lineHeight = { value: 20, unit: 'PIXELS' };
  calloutT.x = 168; calloutT.y = tTop + 40 + rows.length * rH + 18;
  sec.appendChild(calloutT);

  return sec;
}

function buildVirtualAccounts(xOffset = 0) {
  const page = new Page('Virtual Accounts & Global Collections', xOffset);
  const ac = C.hpAction;

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroVirtualAccounts(), 560);
  page.add(mkVATrustBar(), 200);

  page.add(mkFeature({
    label: 'UNIFIED COLLECTIONS',
    h2: 'Collect from your customers, local partners, and overseas clients — in one account',
    p: 'Singapore SMEs with B2B relationships often run two separate platforms — a payment processor for customer collections, and a standalone account for receiving transfers from partners. HitPay eliminates this split. The same account that accepts local and cross-border card payments and PayNow from customers also receives SGD FAST from local Singapore business partners and SWIFT wire transfers from overseas clients in 13 currencies.',
    bullets: [
      'C2B — local and cross-border cards, PayNow, GrabPay, ShopeePay, payment links',
      'B2B — SGD via FAST/PayNow from local partners + SWIFT in 13 currencies from overseas',
      'One dashboard, one ledger, one reconciliation export — no manual matching',
      'Xero and QuickBooks sync covers both C2B and B2B transactions',
    ],
    mockUI: mockVALedger(),
    bg: C.white,
    textSide: 'left',
    accent: ac,
  }), 520);

  page.add(mkFeature({
    label: 'DBS-BACKED TRUST',
    h2: 'Your funds sit at DBS Bank — not a freeze-prone EMI fintech wallet',
    p: 'The most common concern about fintech multi-currency accounts is fund availability — stories of frozen balances, delayed access, and no human to call are the most-cited negative reviews for every major EMI-backed competitor. HitPay\'s virtual account is backed by DBS Bank, Singapore\'s largest bank by assets. Funds sit at DBS, not in a pooled e-money float. The account is issued in the business\'s own name with full DBS bank-grade infrastructure behind every receipt.',
    bullets: [
      'Backed by DBS — Singapore\'s largest bank, not an EMI licence',
      'Own-name account — funds are yours, not pooled with other businesses',
      'Full banking recourse — the #1 gap in competitor accounts',
      'MAS-licensed HitPay (PS20200643) operating on DBS infrastructure',
    ],
    mockUI: mockDBSCompare(),
    bg: C.hpBeige200,
    textSide: 'right',
    accent: ac,
  }), 520);

  page.add(mkFeature({
    label: '13 CURRENCIES',
    h2: 'Receive in 13 currencies — SGD arrives instantly via FAST and PayNow',
    p: 'HitPay\'s multi-currency virtual account supports receiving in 13 currencies, with SGD as the only fully local instant rail — payments from local Singapore senders arrive in real time via FAST or PayNow. USD, EUR, GBP, AUD, HKD, and other supported currencies arrive via SWIFT within 1–3 business days. Singapore businesses share their unique account number and SWIFT/BIC details with counterparties, who initiate a standard bank transfer.',
    bullets: [
      'SGD — instant via FAST/PayNow from local and overseas SGD senders · S$0.50/collection',
      'USD · EUR · GBP · AUD · HKD — via SWIFT · free inbound (AUD: A$3.00/collection)',
      'Convert to SGD at 1% over interbank mid-rate — or hold in foreign currency',
      'Local EUR, GBP, AUD rails coming — plus local PHP via InstaPay/PESONet',
    ],
    mockUI: mockVACurrencies(),
    bg: C.white,
    textSide: 'left',
    accent: ac,
  }), 520);

  page.add(mkFeature({
    label: 'ZERO NEW VENDOR',
    h2: 'Already a HitPay merchant? Activate multi-currency receiving in your existing account',
    p: 'Existing HitPay merchants — already using the platform for card, PayNow, e-wallet, or payment link collections — can activate multi-currency business receiving from their current dashboard without a new vendor relationship, a second KYB process, or additional hardware. New businesses sign up once, complete standard ACRA-based KYB (typically 1–3 business days), and gain access to both C2B collection tools and the multi-currency virtual account simultaneously.',
    bullets: [
      'Existing HitPay merchants — activate from dashboard, no new KYB',
      'New businesses — one sign-up, one ACRA UEN, both products unlocked',
      'Zero hardware — account details shared digitally with payers',
      'SGD 0 monthly fees — pay only when you collect (SGD: S$0.50 per receipt)',
    ],
    mockUI: mockVAActivation(),
    bg: C.hpBeige200,
    textSide: 'right',
    accent: ac,
  }), 520);

  page.add(mkVAComparisonSection(), 560);

  page.add(mkStats([
    { value: 'SGD 0', label: 'Monthly account fees' },
    { value: '13',    label: 'Currencies receivable' },
    { value: 'DBS',   label: 'Bank-backed — not an EMI' },
    { value: '1–3',   label: 'Business days to approval' },
  ], C.hpDeepBlue, C.white, C.hpBlue100), 192);

  page.add(mkTestimonial(
    'We were running HitPay for retail customers and a separate Wise account to collect from our US and European distributors. Switching everything to HitPay\'s virtual account meant our USD wires and our PayNow receipts finally sat in one dashboard. Knowing it\'s all backed by DBS made the switch straightforward.',
    'Ng Wei Ling',
    'Finance Director, Arcanum Trading Pte. Ltd. · Singapore',
    ac
  ), 380);

  page.add(mkGrid(
    'Everything your global collections need',
    'From SGD instant receipts via FAST from local partners to SWIFT wires from overseas — one platform, one account.',
    [
      { title: 'SGD instant via FAST & PayNow',  desc: 'Local Singapore business partners and customers send SGD via FAST or PayNow — funds arrive in real time. S$0.50 per collection.' },
      { title: 'DBS bank-grade security',         desc: 'Funds held at DBS Bank — not a pooled e-money float. Own-name account with full banking supervision. No freeze risk.' },
      { title: 'Unified C2B + B2B ledger',        desc: 'Customer card and PayNow receipts appear alongside local SGD FAST and overseas SWIFT wires in one transaction list — one export.' },
      { title: 'Free inbound for most currencies',desc: 'USD, EUR, GBP, HKD, and most other inbound transfers carry no collection fee. Convert at 1% over interbank mid-rate.' },
      { title: 'Xero & QuickBooks sync',          desc: 'Every SWIFT receipt and customer PayNow transaction syncs automatically to Xero or QuickBooks with GST categorisation.' },
      { title: 'PHP & USD local rails coming',    desc: 'Local PHP via InstaPay/PESONet is in development. Local USD via ACH/Fedwire also in active development.' },
    ]
  ), 660);

  page.add(mkRelated(
    'Explore more HitPay products',
    [
      { emoji: '🔗', title: 'Payment Links',  desc: 'Send a link via WhatsApp, email, or SMS and collect from anyone in seconds.' },
      { emoji: '🖥️', title: 'Point-of-Sale',  desc: 'Accept PayNow, DuitNow, GCash, and cards at the counter with Soundbox alerts.' },
      { emoji: '🛍️', title: 'Online Store',   desc: 'Launch a full-featured online store with built-in checkout and 50+ payment methods.' },
    ],
    ac
  ), 380);

  page.add(mkFAQ([
    { q: 'What is HitPay\'s multi-currency virtual account and how does it work?', a: 'A DBS-backed receiving account that allows Singapore businesses to collect in 13 currencies from local and overseas business partners. SGD transfers from local Singapore senders arrive in real time via FAST and PayNow. Other currencies arrive via SWIFT. All funds appear in the same dashboard as your customer payments.' },
    { q: 'Which currencies can a Singapore business receive through HitPay\'s virtual account?', a: '13 currencies. SGD is instant via FAST or PayNow. USD, EUR, GBP, AUD, HKD, and other supported currencies arrive via SWIFT within 1–3 business days. Local EUR, GBP, and AUD rails via SEPA, Faster Payments, and NPP are in development.' },
    { q: 'How long does it take for SGD payments to arrive in a HitPay virtual account?', a: 'SGD transfers from Singapore senders arrive in real time when sent via FAST or PayNow. GIRO settles within one business day. USD, EUR, GBP, AUD, and other foreign currencies arrive via SWIFT within 1–3 business days.' },
    { q: 'How does HitPay\'s virtual account differ from other multi-currency platforms?', a: 'HitPay is the only platform that unifies C2B collections — cards, PayNow, GrabPay, QR — with B2B virtual account receiving in one DBS-backed dashboard. It also accepts SGD FAST from local business partners. No competitor combines all three.' },
    { q: 'Is money held in HitPay\'s virtual account safe?', a: 'Funds are held at DBS Bank — Singapore\'s largest bank by assets. DBS is a fully licensed bank, not an e-money institution. Each account is issued in the business\'s own name, not held in a pooled float.' },
    { q: 'Can a Singapore business receive USD payments from overseas clients?', a: 'Yes — via SWIFT wire transfer into their HitPay DBS-backed virtual account. USD funds arrive within 1–3 business days. HitPay is developing local USD receiving via ACH and Fedwire — not yet available.' },
    { q: 'What FX conversion rate does HitPay charge on the virtual account?', a: 'HitPay charges a 1% markup over the interbank mid-rate. Most inbound receipts carry no collection fee. SGD via FAST/PayNow costs S$0.50 per collection; AUD costs A$3.00. No monthly or setup fees.' },
    { q: 'Does a business need to open a new account to use HitPay\'s virtual account?', a: 'No. Multi-currency receiving is available inside an existing HitPay account. Businesses already using HitPay for card, PayNow, or e-wallet collections activate from their existing dashboard — no new KYB process.' },
    { q: 'What types of Singapore businesses can open a HitPay virtual account?', a: 'Singapore-registered businesses and sole proprietors: private limited companies, LLPs, sole proprietors, and ACRA-registered partnerships. Common users include exporters, professional service firms, digital agencies, SaaS companies, and wholesale distributors.' },
    { q: 'How does HitPay reconcile customer payments and business receivables together?', a: 'All payment types — local and cross-border customer card, PayNow, e-wallet, local SGD FAST from partners, and overseas SWIFT receipts — appear in a unified ledger. Export a single CSV or sync to Xero/QuickBooks.' },
    { q: 'What documents are needed to open a HitPay virtual account in Singapore?', a: 'ACRA UEN, the company director\'s NRIC or passport, and a valid Singapore business bank account. Sign-up is fully online; approval typically takes 1–3 business days. No setup fees.' },
    { q: 'What currencies will HitPay\'s virtual account add local rail support for?', a: 'EUR via SEPA, GBP via Faster Payments, AUD via NPP, and PHP via InstaPay/PESONet are in development. Local USD via ACH and Fedwire is also in active development. No specific dates have been announced.' },
  ], ac), 1768);

  page.add(mkCTA(
    'Ready to unify your collections?',
    'Open a DBS-backed multi-currency virtual account alongside your existing customer payments. No monthly fees — approval in 1–3 business days.',
    'Open your account',
    'Talk to sales',
    ac
  ), 300);

  page.add(mkFooter(
    ac,
    ['Virtual Accounts', 'Payment Links', 'POS Software', 'Invoices'],
    ['E-commerce', 'Retail', 'Restaurants & F&B', 'Health & Beauty']
  ), 280);

  return page.f;
}

// ── AFFILIATE MOCK UIs ───────────────────────────────────────

function mockAffCommissionCard() {
  const card = mkFrame('CommissionCard', 320, 360, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0, g:0, b:0, a:0.10 }, offset: { x:0, y:8 }, radius: 24, spread: 0, visible: true, blendMode: 'NORMAL' }];

  // Header row
  const title = mkText('Commission Summary — May 2026', 11, W.semibold, C.hpTextPri);
  title.x = 20; title.y = 18;
  card.appendChild(title);

  const autoBadge = mkPill('● Auto-credited', C.green100, C.green600, 8, 4, 100);
  autoBadge.x = 200; autoBadge.y = 14;
  card.appendChild(autoBadge);

  const hdrLine = mkRect(280, 1, C.slate100);
  hdrLine.x = 20; hdrLine.y = 44;
  card.appendChild(hdrLine);

  // Big amount area
  const amtBg = mkRect(280, 60, C.hpBlue50, 12);
  amtBg.x = 20; amtBg.y = 54;
  card.appendChild(amtBg);

  const earnedLabel = mkText('Earned this month', 10, W.medium, C.hpTextSec, 'CENTER', 280);
  earnedLabel.letterSpacing = { value: 0.4, unit: 'PIXELS' };
  earnedLabel.x = 20; earnedLabel.y = 62;
  card.appendChild(earnedLabel);

  const earnedAmt = mkText('S$3,200', 26, W.bold, C.hpTextPri, 'CENTER', 280);
  earnedAmt.x = 20; earnedAmt.y = 78;
  card.appendChild(earnedAmt);

  // Section label
  const breakdownLabel = mkText('MERCHANT BREAKDOWN', 9, W.semibold, C.hpTextSec);
  breakdownLabel.letterSpacing = { value: 0.8, unit: 'PIXELS' };
  breakdownLabel.x = 20; breakdownLabel.y = 128;
  card.appendChild(breakdownLabel);

  // Merchant rows
  const merchants = [
    { name: 'Arcanum Trading',  tpv: 'S$1.2M',  amt: 'S$1,200' },
    { name: 'Pinnacle Systems', tpv: 'S$800K',   amt: 'S$800'   },
    { name: 'AgnesStore',       tpv: 'S$500K',   amt: 'S$500'   },
    { name: 'TechNest',         tpv: 'S$320K',   amt: 'S$320'   },
    { name: 'Velvet Retail',    tpv: 'S$380K',   amt: 'S$380'   },
  ];
  let ry = 146;
  merchants.forEach(m => {
    const nameT = mkText(m.name, 12, W.semibold, C.hpTextPri);
    nameT.x = 20; nameT.y = ry;
    card.appendChild(nameT);

    const tpvT = mkText(m.tpv + ' TPV', 10, W.regular, C.hpTextSec);
    tpvT.x = 20; tpvT.y = ry + 14;
    card.appendChild(tpvT);

    const amtT = mkText(m.amt, 13, W.semibold, C.hpAction, 'RIGHT', 70);
    amtT.x = 230; amtT.y = ry + 4;
    card.appendChild(amtT);

    const divRow = mkRect(280, 1, C.slate100);
    divRow.x = 20; divRow.y = ry + 32;
    card.appendChild(divRow);

    ry += 36;
  });

  // Footer
  const footer = mkText('5 merchants · 0.1% of online TPV · Next payout: Jun 1', 10, W.regular, C.hpTextSec, 'CENTER', 280);
  footer.x = 20; footer.y = 336;
  card.appendChild(footer);

  return card;
}

function mockAffWalletCredit() {
  const card = mkFrame('WalletCredit', 280, 200, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0, g:0, b:0, a:0.08 }, offset: { x:0, y:4 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const hdrLabel = mkText('Wallet · May 2026', 11, W.semibold, C.hpTextSec);
  hdrLabel.x = 16; hdrLabel.y = 16;
  card.appendChild(hdrLabel);

  const divider = mkRect(248, 1, C.slate100);
  divider.x = 16; divider.y = 36;
  card.appendChild(divider);

  const amt = mkText('+S$1,200.00', 24, W.bold, C.hpTextPri);
  amt.x = 16; amt.y = 48;
  card.appendChild(amt);

  const badge = mkPill('partner_commission', C.hpBlue50, C.hpAction, 8, 4, 100);
  badge.x = 16; badge.y = 82;
  card.appendChild(badge);

  const divider2 = mkRect(248, 1, C.slate100);
  divider2.x = 16; divider2.y = 108;
  card.appendChild(divider2);

  const merchant = mkText('Arcanum Trading · 0.1% of S$1,200,000 online TPV', 11, W.regular, C.hpTextSec, 'LEFT', 248);
  merchant.lineHeight = { value: 18, unit: 'PIXELS' };
  merchant.x = 16; merchant.y = 116;
  card.appendChild(merchant);

  const credited = mkText('✓ Credited automatically · No action required', 11, W.medium, C.hpSuccess);
  credited.x = 16; credited.y = 148;
  card.appendChild(credited);

  const time = mkText('1 Jun 2026, 00:00 SGT', 10, W.regular, C.slate400);
  time.x = 16; time.y = 170;
  card.appendChild(time);

  return card;
}

function mockAffDashboard() {
  const card = mkFrame('CommissionDashboard', 300, 280, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0, g:0, b:0, a:0.08 }, offset: { x:0, y:4 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];

  // Header bar
  const hdrBg = mkRect(300, 44, C.hpBeige, 0);
  hdrBg.x = 0; hdrBg.y = 0;
  card.appendChild(hdrBg);

  const hdrTitle = mkText('Commission Report · May 2026', 11, W.semibold, C.hpTextPri);
  hdrTitle.x = 14; hdrTitle.y = 14;
  card.appendChild(hdrTitle);

  const exportBtn = mkPill('Export CSV →', C.hpBlue50, C.hpAction, 8, 4, 6);
  exportBtn.x = 196; exportBtn.y = 10;
  card.appendChild(exportBtn);

  const hdivider = mkRect(300, 1, C.slate100);
  hdivider.x = 0; hdivider.y = 44;
  card.appendChild(hdivider);

  // Column headers
  const chM = mkText('Merchant', 9, W.semibold, C.hpTextSec);
  chM.letterSpacing = { value: 0.5, unit: 'PIXELS' };
  chM.x = 14; chM.y = 52;
  card.appendChild(chM);

  const chT = mkText('TPV', 9, W.semibold, C.hpTextSec, 'RIGHT', 50);
  chT.x = 162; chT.y = 52;
  card.appendChild(chT);

  const chC = mkText('Commission', 9, W.semibold, C.hpTextSec, 'RIGHT', 80);
  chC.x = 206; chC.y = 52;
  card.appendChild(chC);

  const rows = [
    { m: 'Arcanum Trading',  t: 'S$1.2M', c: 'S$1,200' },
    { m: 'Pinnacle Systems', t: 'S$800K', c: 'S$800'   },
    { m: 'AgnesStore',       t: 'S$500K', c: 'S$500'   },
    { m: 'TechNest',         t: 'S$320K', c: 'S$320'   },
  ];

  let ry = 68;
  rows.forEach((row, i) => {
    if (i % 2 === 0) {
      const stripe = mkRect(300, 26, C.hpBeige, 0);
      stripe.x = 0; stripe.y = ry;
      card.appendChild(stripe);
    }
    const mT = mkText(row.m, 11, W.medium, C.hpTextPri);
    mT.x = 14; mT.y = ry + 7;
    card.appendChild(mT);

    const tT = mkText(row.t, 11, W.regular, C.hpTextSec, 'RIGHT', 50);
    tT.x = 162; tT.y = ry + 7;
    card.appendChild(tT);

    const cT = mkText(row.c, 11, W.semibold, C.hpAction, 'RIGHT', 80);
    cT.x = 206; cT.y = ry + 7;
    card.appendChild(cT);

    ry += 26;
  });

  // Total row
  const totalBg = mkRect(300, 36, C.hpDeepBlue, 0);
  totalBg.x = 0; totalBg.y = 172;
  card.appendChild(totalBg);

  const totalLabel = mkText('Total earned', 11, W.semibold, C.white);
  totalLabel.x = 14; totalLabel.y = 184;
  card.appendChild(totalLabel);

  const totalAmt = mkText('S$2,820', 13, W.bold, C.white, 'RIGHT', 80);
  totalAmt.x = 206; totalAmt.y = 182;
  card.appendChild(totalAmt);

  const credited = mkText('✓ All credited to wallet · 1 Jun 2026', 10, W.regular, C.hpSuccess);
  credited.x = 14; credited.y = 222;
  card.appendChild(credited);

  const csvNote = mkText('Download: commission-may-2026.csv', 10, W.regular, C.hpTextSec);
  csvNote.x = 14; csvNote.y = 252;
  card.appendChild(csvNote);

  return card;
}

function mockAffTierStack() {
  const card = mkFrame('TierStack', 280, 196, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0, g:0, b:0, a:0.08 }, offset: { x:0, y:4 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const title = mkText('Partner Programmes', 13, W.semibold, C.hpTextPri);
  title.x = 16; title.y = 16;
  card.appendChild(title);

  const sub = mkText('Your account · All tiers visible', 10, W.regular, C.hpTextSec);
  sub.x = 16; sub.y = 34;
  card.appendChild(sub);

  const divider = mkRect(248, 1, C.slate100);
  divider.x = 16; divider.y = 52;
  card.appendChild(divider);

  const tiers = [
    { name: 'Affiliate',        badge: '✓ Active',  badgeBg: C.green100, badgeColor: C.green600 },
    { name: 'Reseller (MY)',    badge: '✓ Active',  badgeBg: C.green100, badgeColor: C.green600 },
    { name: 'Platform Partner', badge: '→ Apply',   badgeBg: C.hpBlue50, badgeColor: C.hpAction },
  ];

  let ty = 62;
  tiers.forEach(tier => {
    const nameT = mkText(tier.name, 13, W.medium, C.hpTextPri);
    nameT.x = 16; nameT.y = ty;
    card.appendChild(nameT);

    const b = mkPill(tier.badge, tier.badgeBg, tier.badgeColor, 8, 4, 100);
    b.x = 182; b.y = ty - 2;
    card.appendChild(b);

    const rowDiv = mkRect(248, 1, C.slate100);
    rowDiv.x = 16; rowDiv.y = ty + 30;
    card.appendChild(rowDiv);

    ty += 40;
  });

  const footerNote = mkText('Programmes stack — earn across all tiers simultaneously', 9, W.regular, C.hpTextSec, 'LEFT', 248);
  footerNote.x = 16; footerNote.y = 174;
  card.appendChild(footerNote);

  return card;
}

// ── AFFILIATE SECTION BUILDERS ───────────────────────────────

function mkHeroAffiliate() {
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badge = mkPill('Affiliate Program', C.hpBlue100, C.hpAction, 16, 8, 100);
  badge.x = 144; badge.y = 72;
  sec.appendChild(badge);

  const h1 = mkH2('Know a business that needs payments? Turn the referral into recurring income.', 44, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 52, unit: 'PIXELS' };
  h1.x = 144; h1.y = 118;
  sec.appendChild(h1);

  const sub = mkText('Whether you\'re a developer, agency, consultant, or simply well-connected — any business you refer earns you 0.1% of their monthly online TPV, automatically, every month. No billing. No expiry. No effort.', 18, W.regular, C.hpTextSec, 'LEFT', 540);
  sub.lineHeight = { value: 28, unit: 'PIXELS' };
  sub.x = 144; sub.y = 336;
  sec.appendChild(sub);

  const b1 = mkBtn('Become an affiliate', C.hpAction, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 436;
  sec.appendChild(b1);

  const b2 = mkBtn('See how it works', null, C.hpTextPri, 24, 14, 12, true);
  b2.x = 348; b2.y = 436;
  sec.appendChild(b2);

  const fine = mkText('Free to join · No minimum TPV · Paid monthly', 13, W.regular, C.hpTextSec);
  fine.x = 144; fine.y = 488;
  sec.appendChild(fine);

  const commCard = mockAffCommissionCard();
  commCard.x = 916; commCard.y = 80;
  sec.appendChild(commCard);

  return sec;
}

function mkAffTrustBar() {
  const sec = mkFrame('TrustBar', 1440, 200, C.hpBeige);
  sec.strokes = [{ type: 'SOLID', color: C.slate100 }];
  sec.strokeWeight = 1;
  sec.strokeAlign = 'INSIDE';

  const stats = [
    { val: '500+',     sub: 'Developer & agency partners' },
    { val: 'S$1M+',   sub: 'In commissions paid'         },
    { val: '20,000+', sub: 'Businesses on platform'      },
    { val: 'Monthly', sub: 'Automatic wallet payout'     },
  ];

  const colW = 1152 / 4;
  stats.forEach((s, i) => {
    const val = mkText(s.val, 32, W.bold, C.hpTextPri, 'CENTER', colW);
    val.x = 144 + i * colW; val.y = 60;
    sec.appendChild(val);

    const sub = mkText(s.sub, 14, W.regular, C.hpTextSec, 'CENTER', colW);
    sub.x = 144 + i * colW; sub.y = 100;
    sec.appendChild(sub);
  });

  return sec;
}

function mkAffHowItWorks() {
  const sec = mkFrame('HowItWorks', 1440, 400, C.white);

  const lbl = mkText('HOW IT WORKS', 11, W.semibold, C.hpAction, 'CENTER', 1152);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 48;
  sec.appendChild(lbl);

  const h2 = mkH2('Up and running in minutes', 36, C.hpTextPri, 'CENTER', 640);
  h2.lineHeight = { value: 44, unit: 'PIXELS' };
  h2.x = 400; h2.y = 74;
  sec.appendChild(h2);

  const sub = mkText('No contracts, no paperwork, no integrations needed to start earning.', 16, W.regular, C.hpTextSec, 'CENTER', 640);
  sub.x = 400; sub.y = 126;
  sec.appendChild(sub);

  const steps = [
    { n: '1', title: 'Apply once',          desc: 'Sign up as a partner in your HitPay dashboard. Approval is typically within 1–3 business days. No fees. No upfront commitment.' },
    { n: '2', title: 'Link your merchants', desc: 'Connect the businesses you\'ve introduced to your partner account. Existing clients already on HitPay can be linked retroactively.' },
    { n: '3', title: 'Earn every month',    desc: '0.1% of each merchant\'s monthly online payment volume lands in your wallet on the 1st — automatically. No invoice. No expiry.' },
  ];

  const cardW = 340;
  const totalCardsW = cardW * 3 + 48;
  const startX = (1440 - totalCardsW) / 2;

  steps.forEach((step, i) => {
    const cx = startX + i * (cardW + 24);
    const cy = 170;

    const cardBg = mkRect(cardW, 192, C.hpBeige, 16);
    cardBg.x = cx; cardBg.y = cy;
    sec.appendChild(cardBg);

    const circle = mkFrame('StepCircle', 36, 36, C.hpAction, 18);
    circle.x = cx + 20; circle.y = cy + 20;
    sec.appendChild(circle);

    const numT = mkText(step.n, 16, W.bold, C.white, 'CENTER', 36);
    numT.x = cx + 20; numT.y = cy + 26;
    sec.appendChild(numT);

    const titleT = mkText(step.title, 17, W.semibold, C.hpTextPri, 'LEFT', cardW - 40);
    titleT.x = cx + 20; titleT.y = cy + 68;
    sec.appendChild(titleT);

    const descT = mkText(step.desc, 13, W.regular, C.hpTextSec, 'LEFT', cardW - 40);
    descT.lineHeight = { value: 20, unit: 'PIXELS' };
    descT.x = cx + 20; descT.y = cy + 96;
    sec.appendChild(descT);
  });

  return sec;
}

function mkAffCalculator() {
  const sec = mkFrame('EarningsCalculator', 1440, 560, C.hpDeepBlue);

  const lbl = mkText('EARNINGS CALCULATOR', 11, W.semibold, C.hpBlue100, 'CENTER', 1152);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 48;
  sec.appendChild(lbl);

  const h2 = mkH2('See what you could earn', 36, C.white, 'CENTER', 640);
  h2.x = 400; h2.y = 76;
  sec.appendChild(h2);

  const sub = mkText('0.1% of your clients\' monthly online payment volume — paid automatically each month, forever.', 16, W.regular, C.hpBlue100, 'CENTER', 700);
  sub.x = 370; sub.y = 128;
  sec.appendChild(sub);

  // ── Slider panel (left) ───────────────────────────
  const panelBg = mkRect(520, 272, C.hpAction, 16);
  panelBg.opacity = 0.18;
  panelBg.x = 120; panelBg.y = 188;
  sec.appendChild(panelBg);

  // Slider 1
  const s1Label = mkText('Monthly online TPV per merchant', 13, W.semibold, C.white);
  s1Label.x = 152; s1Label.y = 206;
  sec.appendChild(s1Label);

  const s1Val = mkText('S$500,000', 18, W.bold, C.hpAction);
  s1Val.x = 152; s1Val.y = 226;
  sec.appendChild(s1Val);

  const track1Bg = mkRect(468, 5, C.slate700, 100);
  track1Bg.x = 148; track1Bg.y = 264;
  sec.appendChild(track1Bg);

  const track1Fill = mkRect(234, 5, C.hpAction, 100);
  track1Fill.x = 148; track1Fill.y = 264;
  sec.appendChild(track1Fill);

  const thumb1 = mkFrame('Thumb1', 18, 18, C.white, 9);
  thumb1.x = 356; thumb1.y = 256;
  sec.appendChild(thumb1);

  const s1Min = mkText('S$10K', 10, W.regular, C.hpBlue100);
  s1Min.x = 148; s1Min.y = 278;
  sec.appendChild(s1Min);

  const s1Max = mkText('S$10M', 10, W.regular, C.hpBlue100, 'RIGHT', 60);
  s1Max.x = 556; s1Max.y = 278;
  sec.appendChild(s1Max);

  // Slider 2
  const s2Label = mkText('Number of merchants', 13, W.semibold, C.white);
  s2Label.x = 152; s2Label.y = 310;
  sec.appendChild(s2Label);

  const s2Val = mkText('5 merchants', 18, W.bold, C.hpAction);
  s2Val.x = 152; s2Val.y = 330;
  sec.appendChild(s2Val);

  const track2Bg = mkRect(468, 5, C.slate700, 100);
  track2Bg.x = 148; track2Bg.y = 370;
  sec.appendChild(track2Bg);

  const track2Fill = mkRect(42, 5, C.hpAction, 100);
  track2Fill.x = 148; track2Fill.y = 370;
  sec.appendChild(track2Fill);

  const thumb2 = mkFrame('Thumb2', 18, 18, C.white, 9);
  thumb2.x = 182; thumb2.y = 362;
  sec.appendChild(thumb2);

  const s2Min = mkText('1', 10, W.regular, C.hpBlue100);
  s2Min.x = 148; s2Min.y = 384;
  sec.appendChild(s2Min);

  const s2Max = mkText('50', 10, W.regular, C.hpBlue100, 'RIGHT', 40);
  s2Max.x = 576; s2Max.y = 384;
  sec.appendChild(s2Max);

  const formula = mkText('5 merchants × S$500,000 × 0.1% = S$2,500/month', 12, W.regular, C.hpBlue100);
  formula.x = 148; formula.y = 414;
  sec.appendChild(formula);

  // ── Output panel (right) ─────────────────────────
  const outputBg = mkRect(500, 272, C.hpAction, 16);
  outputBg.x = 680; outputBg.y = 188;
  sec.appendChild(outputBg);

  const monthlyLabel = mkText('YOUR MONTHLY COMMISSION', 10, W.semibold, C.hpBlue100, 'CENTER', 460);
  monthlyLabel.letterSpacing = { value: 1, unit: 'PIXELS' };
  monthlyLabel.x = 700; monthlyLabel.y = 216;
  sec.appendChild(monthlyLabel);

  const monthlyAmt = mkText('S$2,500', 56, W.bold, C.white, 'CENTER', 460);
  monthlyAmt.x = 700; monthlyAmt.y = 238;
  sec.appendChild(monthlyAmt);

  const perMonth = mkText('per month', 14, W.regular, C.hpBlue100, 'CENTER', 460);
  perMonth.x = 700; perMonth.y = 300;
  sec.appendChild(perMonth);

  const divLine = mkRect(420, 1, C.hpActionHov);
  divLine.x = 720; divLine.y = 330;
  sec.appendChild(divLine);

  const annualLabel = mkText('Your annual projection', 13, W.medium, C.hpBlue100, 'CENTER', 460);
  annualLabel.x = 700; annualLabel.y = 346;
  sec.appendChild(annualLabel);

  const annualAmt = mkText('S$30,000', 34, W.bold, C.white, 'CENTER', 460);
  annualAmt.x = 700; annualAmt.y = 368;
  sec.appendChild(annualAmt);

  const annualSub = mkText('12 months at the same TPV', 11, W.regular, C.hpBlue100, 'CENTER', 460);
  annualSub.x = 700; annualSub.y = 410;
  sec.appendChild(annualSub);

  return sec;
}

function mkAffWhoItsFor() {
  const sec = mkFrame('WhoItsFor', 1440, 560, C.white);

  const lbl = mkText('WHO IT\'S FOR', 11, W.semibold, C.hpAction, 'CENTER', 1152);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 48;
  sec.appendChild(lbl);

  const h2 = mkH2('If you work with businesses, you already qualify.', 36, C.hpTextPri, 'CENTER', 700);
  h2.lineHeight = { value: 44, unit: 'PIXELS' };
  h2.x = 370; h2.y = 74;
  sec.appendChild(h2);

  const sub = mkText('No HitPay account required. No technical knowledge needed. If your network includes businesses that take online payments, you have everything you need to start earning.', 16, W.regular, C.hpTextSec, 'CENTER', 700);
  sub.lineHeight = { value: 24, unit: 'PIXELS' };
  sub.x = 370; sub.y = 134;
  sec.appendChild(sub);

  // ── Left panel: You might be ──────────────────────
  const leftBg = mkRect(560, 320, C.hpBeige, 16);
  leftBg.x = 144; leftBg.y = 210;
  sec.appendChild(leftBg);

  const leftLabel = mkText('YOU MIGHT BE', 9, W.semibold, C.hpTextSec);
  leftLabel.letterSpacing = { value: 0.8, unit: 'PIXELS' };
  leftLabel.x = 168; leftLabel.y = 230;
  sec.appendChild(leftLabel);

  const personas = [
    ['Web & App Developer',       'Tech or Business Consultant'],
    ['Digital Agency',            'POS & Hardware Provider'    ],
    ['Event Organiser',           'Business Accountant'        ],
  ];

  let py = 254;
  personas.forEach(row => {
    row.forEach((name, col) => {
      const px = 168 + col * 268;
      const dot = mkRect(6, 6, C.hpAction, 3);
      dot.x = px; dot.y = py + 6;
      sec.appendChild(dot);
      const t = mkText(name, 13, W.semibold, C.hpTextPri);
      t.x = px + 12; t.y = py;
      sec.appendChild(t);
    });
    py += 44;
  });

  // ── Right panel: Your clients might be ───────────
  const rightBg = mkRect(560, 320, C.hpBlue50, 16);
  rightBg.x = 736; rightBg.y = 210;
  sec.appendChild(rightBg);

  const rightLabel = mkText('YOUR CLIENTS MIGHT BE', 9, W.semibold, C.hpTextSec);
  rightLabel.letterSpacing = { value: 0.8, unit: 'PIXELS' };
  rightLabel.x = 760; rightLabel.y = 230;
  sec.appendChild(rightLabel);

  const rightH3 = mkText('Businesses navigating their payment setup', 15, W.semibold, C.hpTextPri, 'LEFT', 520);
  rightH3.lineHeight = { value: 22, unit: 'PIXELS' };
  rightH3.x = 760; rightH3.y = 250;
  sec.appendChild(rightH3);

  const clients = [
    'Businesses Exploring Payments', 'Newly Launched Businesses',
    'Online Store Owners',           'Brick & Mortar Retailers',
    'Service-based Businesses',      'Growing SMBs',
    'Businesses Expanding Regionally',
  ];

  let cpx = 760; let cpy = 284;
  clients.forEach(ct => {
    const pill = mkPill(ct, C.white, C.hpTextPri, 10, 6, 100);
    pill.strokes = [{ type: 'SOLID', color: C.slate200 }];
    pill.strokeWeight = 1;
    pill.strokeAlign = 'INSIDE';
    const estW = ct.length * 6.5 + 24;
    if (cpx + estW > 1276) { cpx = 760; cpy += 32; }
    pill.x = cpx; pill.y = cpy;
    cpx += estW + 8;
    sec.appendChild(pill);
  });

  return sec;
}

/** Quick Answers panel — white bg, Q&A pairs — 600px */
function mkAffQuickAnswers() {
  const SEC_H = 600;
  const sec = mkFrame('QuickAnswers', 1440, SEC_H, C.white);

  const inner = mkFrame('Inner', 720, SEC_H - 112, C.white);
  inner.x = 360; inner.y = 56;

  const heading = mkText('Quick answers', 22, C.hpTextPri, 720, 36);
  heading.fontName = { family: 'Hauora', style: 'SemiBold' };
  heading.y = 0;
  inner.appendChild(heading);

  const items = [
    { q: 'Who can join the Affiliate Program?',            a: 'Anyone — developers, agencies, consultants, accountants, business networks, or anyone who knows businesses that need payments. No HitPay merchant account required.' },
    { q: 'How much do affiliates earn?',                   a: '0.1% of each linked merchant\'s monthly online payment volume (TPV). A merchant processing S$500,000/month earns you S$500/month. No cap on merchants or earnings.' },
    { q: 'What payments count towards commission?',        a: 'Online payments only — cards, PayNow, GrabPay, ShopeePay, payment links, and online checkout. In-person POS and cash transactions are excluded.' },
    { q: 'When are commissions paid?',                     a: 'On the first of each month for the previous calendar month\'s volume. Credited automatically to your HitPay wallet — no invoicing or claim needed.' },
    { q: 'Does commission expire?',                        a: 'No. There is no expiry on affiliate commissions. As long as a linked merchant continues processing, you continue earning — indefinitely.' },
    { q: 'Can existing HitPay merchants be linked?',       a: 'Yes. Merchants already on HitPay — including those you introduced before joining — can be added retroactively once your partner account is approved.' },
  ];

  let yOff = 52;
  items.forEach(item => {
    const dt = mkText(item.q, 14, C.hpTextPri, 720, 20);
    dt.fontName = { family: 'Hauora', style: 'SemiBold' };
    dt.y = yOff;
    inner.appendChild(dt);
    yOff += 24;

    const dd = mkText(item.a, 14, C.hpTextSec, 720, 36);
    dd.textAutoResize = 'HEIGHT';
    dd.y = yOff;
    inner.appendChild(dd);
    yOff += 52;
  });

  sec.appendChild(inner);
  return sec;
}

// ── AFFILIATE PAGE BUILDER ───────────────────────────────────

function buildAffiliate(xOffset = 0) {
  const page = new Page('Affiliate Program', xOffset);
  const ac = C.hpAction;

  page.add(mkNavbar(ac), 64);
  page.add(mkHeroAffiliate(), 560);
  page.add(mkAffTrustBar(), 200);
  page.add(mkAffHowItWorks(), 400);
  page.add(mkAffCalculator(), 560);

  page.add(mkFeature({
    label: 'THE MODEL',
    h2: '0.1% of online TPV. Every month. No cap, no expiry.',
    p: 'The commission structure is intentionally simple. For every dollar your referred merchants collect through HitPay\'s online channels — payment links, checkout, PayNow, GrabPay, cards — you earn 0.1% per month. No tiers, no thresholds, no expiry. As clients grow their online payment volume, your passive income grows automatically.',
    bullets: [
      '0.1% of every succeeded online payment — payment links, checkout, PayNow, GrabPay, cards',
      'Commission calculated monthly on the previous calendar month\'s online TPV',
      'No tiered thresholds — you earn from the very first transaction',
      'Your commission grows as your clients\' online payment volume grows',
    ],
    mockUI: mockAffWalletCredit(),
    bg: C.white,
    textSide: 'left',
    accent: ac,
  }), 520);

  page.add(mkFeature({
    label: 'FULL VISIBILITY',
    h2: 'A dashboard for every merchant, every month.',
    p: 'Your commissions are never a black box. HitPay gives you a dedicated partner dashboard where every commission record — per merchant, per month — is logged and exportable. See exactly how much each client contributed, drill into per-merchant breakdowns, and export a CSV covering Business Name, Amount, Currency, and billing period.',
    bullets: [
      'Paginated commission log — every payout on record',
      'Per-merchant breakdown view — see each client\'s contribution',
      'One-click CSV export — Business Name, Amount, Currency, From/To dates',
      'Commissions credited to your HitPay wallet, paid out via standard payout transfer',
    ],
    mockUI: mockAffDashboard(),
    bg: C.hpBeige200,
    textSide: 'right',
    accent: ac,
  }), 520);

  page.add(mkFeature({
    label: 'WORKS WITH EVERYTHING',
    h2: 'Stack it with your reseller or platform partner tier.',
    p: 'The affiliate programme sits alongside — not instead of — HitPay\'s reseller and platform partner tiers. Affiliate commission applies in parallel with any other tier. Merchants you\'ve already introduced can be linked retroactively once your partner status is approved. One HitPay account covers all three programmes.',
    bullets: [
      'Combinable with Reseller Programme (Malaysia) — earn on both tiers simultaneously',
      'Combinable with Platform Partner Program — API integration + affiliate commission',
      'Retroactive linking — existing merchants can be added after approval',
      'One HitPay partner account covers all three programmes',
    ],
    mockUI: mockAffTierStack(),
    bg: C.white,
    textSide: 'left',
    accent: ac,
  }), 520);

  page.add(mkAffWhoItsFor(), 560);

  page.add(mkStats([
    { value: '0.1%',     label: 'Commission on online payments' },
    { value: 'Monthly',  label: 'Automatic wallet credit'       },
    { value: 'No cap',   label: 'Unlimited merchants, unlimited TPV' },
    { value: '1–3 days', label: 'Partner approval time'         },
  ], C.hpDeepBlue, C.white, C.hpBlue100), 192);

  page.add(mkTestimonial(
    'We had been helping our retail clients set up their payment systems for years. The moment we linked them to our HitPay affiliate account it took under 10 minutes — and now we earn a few thousand dollars a month in commissions we didn\'t even know we were leaving on the table.',
    '[PLACEHOLDER — replace with verified partner quote]',
    'Agency Partner · Singapore',
    ac
  ), 380);

  page.add(mkGrid(
    'Everything included. Nothing to configure.',
    'Join 500+ developer and agency partners already earning recurring commissions on HitPay.',
    [
      { title: 'Monthly auto-pay',              desc: 'Commissions calculated on the 1st of each month for the previous period. Credited directly to your HitPay wallet without a single action required.' },
      { title: 'No minimum TPV',                desc: 'Start earning from the very first online transaction. There is no threshold to hit before commissions activate — the 0.1% applies from day one.' },
      { title: 'All online payment methods',    desc: 'Every succeeded online payment — cards, PayNow, GrabPay, ShopeePay, payment links, checkout — counts. In-person POS and cash are not included.' },
      { title: 'CSV export ready',              desc: 'Download a full commission report at any time. One CSV covers all merchants, all months — Business Name, Amount, Currency, and billing period.' },
      { title: 'Scales with your clients',      desc: 'As each linked merchant grows their online payment volume, your commission grows automatically with no renegotiation required.' },
      { title: 'Fast approval',                 desc: 'Partner applications are reviewed within 1–3 business days. Start linking merchants immediately on approval. No fees, no upfront commitment.' },
    ]
  ), 660);

  page.add(mkRelated(
    'Explore more partner opportunities',
    [
      { emoji: '🤝', title: 'Reseller Programme (MY)', desc: 'Resell HitPay\'s full payment gateway and POS stack to Malaysian businesses and earn recurring commission.' },
      { emoji: '🛠️', title: 'Platform Partner Program', desc: 'Embed HitPay payments into your platform via API, manage sub-merchants, and earn a share of transaction revenue.' },
      { emoji: '📖', title: 'Developer Docs',           desc: 'Full REST API, webhooks, and SDKs. Build a custom HitPay integration for your clients from scratch.' },
    ],
    ac
  ), 380);

  // Quick Answers panel — 600px
  page.add(mkAffQuickAnswers(), 600);

  // FAQ: 10 items → 96 + 10×136 + 40 = 1496px
  page.add(mkFAQ([
    { q: 'How much can a partner earn from the HitPay Affiliate Program?',            a: 'A partner earns 0.1% of the total online payment volume processed by each linked merchant per month. For example, a merchant processing S$1,000,000/month in online payments generates S$1,000 in monthly commission. There is no cap on the number of merchants or total commission amount.' },
    { q: 'When are commissions paid?',                                                 a: 'Commissions are calculated automatically on the first of each month for the previous calendar month\'s online transaction volume. The amount is credited directly to the partner\'s HitPay wallet. No manual claim, invoice, or request is required.' },
    { q: 'How does a partner track their affiliate earnings?',                         a: 'Partners have access to a dedicated commission dashboard showing every payout — by merchant and by month. A one-click CSV export covers Business Name, Email, Amount, Currency, and billing period. Per-merchant breakdowns are also available.' },
    { q: 'Is there a minimum transaction volume required to start earning?',           a: 'No. Commission accrues from the very first successful online transaction processed by a linked merchant. The 0.1% rate applies from day one — no threshold to hit.' },
    { q: 'How long does a partner continue earning commission from a referred merchant?', a: 'There is no expiry window on affiliate commissions. As long as the linked merchant continues processing online payments through HitPay and the partner account remains in good standing, commissions continue to accrue and be paid monthly.' },
    { q: 'What transactions are included in the commission calculation?',              a: 'Commission applies to online payment transactions only — cards, PayNow, GrabPay, ShopeePay, payment links, and online checkout processed through HitPay. In-person POS and cash transactions are not included.' },
    { q: 'Can the Affiliate Program be combined with the Reseller or Platform Partner programs?', a: 'Yes. The affiliate commission programme stacks with HitPay\'s Reseller Programme (Malaysia) and Platform Partner Program. A single HitPay partner account can hold all three programme designations at once.' },
    { q: 'How does a partner get started with the HitPay Affiliate Program?',         a: 'Partners apply through their HitPay dashboard. After approval, they begin linking merchants — new referrals or existing clients already on HitPay. Once merchants are linked and begin processing, commissions accrue automatically.' },
    { q: 'How long does affiliate partner approval take?',                             a: 'Partner applications are typically reviewed and approved within 1–3 business days. The process is fully online and requires no upfront fees, minimum revenue commitment, or hardware purchase.' },
    { q: 'Can a partner add existing HitPay merchants to their affiliate account?',    a: 'Yes. Merchants already active on HitPay — including businesses the partner introduced before formally joining the affiliate programme — can be linked retroactively once the partner account is approved.' },
  ], ac), 1496);

  page.add(mkCTA(
    'Your clients are already on HitPay. Start earning from them.',
    'Join 500+ developer and agency partners already earning recurring commissions. Free to join. Monthly payouts. No expiry.',
    'Become an affiliate',
    'Talk to partnerships',
    ac
  ), 300);

  page.add(mkFooter(
    ac,
    ['Virtual Accounts', 'Payment Links', 'POS Software', 'Invoices'],
    ['E-commerce', 'Retail', 'Restaurants & F&B', 'Health & Beauty']
  ), 280);

  return page.f;
}

// ── REFER AND EARN MOCK UIs ──────────────────────────────────

function mockReferDashboard() {
  const card = mkFrame('ReferDashboard', 380, 380, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0, g:0, b:0, a:0.12 }, offset: { x:0, y:8 }, radius: 24, spread: 0, visible: true, blendMode: 'NORMAL' }];

  // Chrome bar
  const chrome = mkRect(380, 40, C.hpDeepBlue, 0);
  chrome.x = 0; chrome.y = 0;
  card.appendChild(chrome);

  const dot1 = mkRect(10, 10, { r:1, g:1, b:1, a:0.2 }, 5); dot1.x = 12; dot1.y = 15; card.appendChild(dot1);
  const dot2 = mkRect(10, 10, { r:1, g:1, b:1, a:0.2 }, 5); dot2.x = 26; dot2.y = 15; card.appendChild(dot2);
  const dot3 = mkRect(10, 10, { r:1, g:1, b:1, a:0.2 }, 5); dot3.x = 40; dot3.y = 15; card.appendChild(dot3);

  const urlBar = mkRect(280, 22, { r:1, g:1, b:1, a:0.12 }, 4); urlBar.x = 58; urlBar.y = 9; card.appendChild(urlBar);
  const urlText = mkText('dashboard.hit-pay.com', 10, W.regular, { r:1, g:1, b:1, a:0.6 });
  urlText.x = 66; urlText.y = 13; card.appendChild(urlText);

  // Title
  const title = mkText('Refer and Earn', 15, W.semibold, C.hpTextPri);
  title.x = 16; title.y = 54; card.appendChild(title);

  const subT = mkText('Earn 0.1% from every business you refer', 11, W.regular, C.hpTextSec);
  subT.x = 16; subT.y = 74; card.appendChild(subT);

  // Stats row
  const s1Bg = mkRect(163, 60, C.hpBeige, 12); s1Bg.x = 16; s1Bg.y = 94; card.appendChild(s1Bg);
  const s1Label = mkText('Businesses referred', 10, W.regular, C.hpTextSec); s1Label.x = 24; s1Label.y = 100; card.appendChild(s1Label);
  const s1Val = mkText('3', 22, W.bold, C.hpTextPri); s1Val.x = 24; s1Val.y = 116; card.appendChild(s1Val);

  const s2Bg = mkRect(163, 60, C.hpBlue50, 12); s2Bg.x = 201; s2Bg.y = 94; card.appendChild(s2Bg);
  const s2Label = mkText('Earned this month', 10, W.regular, C.hpTextSec); s2Label.x = 209; s2Label.y = 100; card.appendChild(s2Label);
  const s2Val = mkText('S$600', 22, W.bold, C.hpAction); s2Val.x = 209; s2Val.y = 116; card.appendChild(s2Val);

  // Link label
  const linkLabel = mkText('YOUR REFERRAL LINK', 9, W.semibold, C.hpTextSec);
  linkLabel.letterSpacing = { value: 1, unit: 'PIXELS' };
  linkLabel.x = 16; linkLabel.y = 168; card.appendChild(linkLabel);

  // Link box
  const linkBg = mkRect(348, 32, C.hpBeige, 8); linkBg.x = 16; linkBg.y = 184; card.appendChild(linkBg);
  const linkText = mkText('dashboard.hit-pay.com/register?referral_code=HITPAKST2R', 10, W.regular, C.hpTextSec, 'LEFT', 300);
  linkText.x = 24; linkText.y = 192; card.appendChild(linkText);

  // Buttons
  const copyBtn = mkBtn('Copy link', C.hpAction, C.white, 14, 8, 8);
  copyBtn.x = 16; copyBtn.y = 228; card.appendChild(copyBtn);

  const shareBtn = mkBtn('Share', null, C.hpTextPri, 14, 8, 8, true);
  shareBtn.x = 164; shareBtn.y = 228; card.appendChild(shareBtn);

  // Referrals
  const refLabel = mkText('YOUR REFERRALS', 9, W.semibold, C.hpTextSec);
  refLabel.letterSpacing = { value: 1, unit: 'PIXELS' };
  refLabel.x = 16; refLabel.y = 268; card.appendChild(refLabel);

  const rows = [
    { name: 'The Noodle House', amt: 'S$300' },
    { name: 'Bloom Florals',    amt: 'S$120' },
    { name: 'Peak Fitness',     amt: 'S$180' },
  ];
  rows.forEach((row, i) => {
    const ry = 286 + i * 24;
    const nameT = mkText(row.name, 12, W.medium, C.hpTextPri); nameT.x = 16; nameT.y = ry; card.appendChild(nameT);
    const live = mkPill('Live', C.green100, C.green600, 8, 3, 100); live.x = 174; live.y = ry; card.appendChild(live);
    const amtT = mkText(row.amt, 12, W.semibold, C.hpAction, 'RIGHT', 60); amtT.x = 304; amtT.y = ry; card.appendChild(amtT);
  });

  const nextCredit = mkText('Next credit: 1 Jul 2026', 10, W.regular, C.hpTextSec);
  nextCredit.x = 16; nextCredit.y = 358; card.appendChild(nextCredit);

  return card;
}

function mockReferWalletCredit() {
  const card = mkFrame('WalletCredit', 300, 200, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0, g:0, b:0, a:0.08 }, offset: { x:0, y:4 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const hdr = mkText('Wallet · June 2026', 12, W.semibold, C.hpTextPri);
  hdr.x = 16; hdr.y = 16; card.appendChild(hdr);

  const dt = mkText('1 Jun 2026, 00:00 SGT', 10, W.regular, C.hpTextSec, 'RIGHT', 140);
  dt.x = 144; dt.y = 17; card.appendChild(dt);

  const amtBg = mkRect(268, 48, C.hpBlue50, 12); amtBg.x = 16; amtBg.y = 42; card.appendChild(amtBg);
  const amtLabel = mkText('Commission credited', 10, W.semibold, C.hpTextSec, 'CENTER', 268);
  amtLabel.x = 16; amtLabel.y = 50; card.appendChild(amtLabel);
  const amtVal = mkText('+S$300.00', 22, W.bold, C.hpTextPri, 'CENTER', 268);
  amtVal.x = 16; amtVal.y = 64; card.appendChild(amtVal);

  const tagBg = mkRect(168, 22, C.hpBlue50, 100); tagBg.x = 16; tagBg.y = 102; card.appendChild(tagBg);
  const tagText = mkText('refer_and_earn_commission', 10, W.medium, C.hpAction);
  tagText.x = 24; tagText.y = 106; card.appendChild(tagText);

  const divider = mkRect(268, 1, C.slate100); divider.x = 16; divider.y = 134; card.appendChild(divider);

  const biz = mkText('The Noodle House', 12, W.medium, C.hpTextPri);
  biz.x = 16; biz.y = 142; card.appendChild(biz);

  const detail = mkText('0.1% of S$300,000 online TPV · May 2026', 10, W.regular, C.hpTextSec);
  detail.x = 16; detail.y = 158; card.appendChild(detail);

  const autoNote = mkText('✓ Auto-credited · No action required', 10, W.semibold, C.hpSuccess);
  autoNote.x = 16; autoNote.y = 176; card.appendChild(autoNote);

  return card;
}

function mockReferEarningsSummary() {
  const card = mkFrame('EarningsSummary', 300, 240, C.white, 16);
  card.effects = [{ type: 'DROP_SHADOW', color: { r:0, g:0, b:0, a:0.08 }, offset: { x:0, y:4 }, radius: 16, spread: 0, visible: true, blendMode: 'NORMAL' }];

  const hdr = mkText('Your Referral Earnings', 13, W.semibold, C.hpTextPri);
  hdr.x = 16; hdr.y = 16; card.appendChild(hdr);

  const monthBg = mkRect(72, 22, C.hpBeige, 8); monthBg.x = 212; monthBg.y = 15; card.appendChild(monthBg);
  const monthT = mkText('June 2026', 10, W.regular, C.hpTextSec, 'CENTER', 72);
  monthT.x = 212; monthT.y = 19; card.appendChild(monthT);

  const breakdown = mkText('BREAKDOWN BY REFERRAL', 9, W.semibold, C.hpTextSec);
  breakdown.letterSpacing = { value: 1, unit: 'PIXELS' };
  breakdown.x = 16; breakdown.y = 50; card.appendChild(breakdown);

  const rows = [
    { name: 'The Noodle House', sub: 'S$300K online TPV', amt: 'S$300' },
    { name: 'Bloom Florals',    sub: 'S$120K online TPV', amt: 'S$120' },
    { name: 'Peak Fitness',     sub: 'S$180K online TPV', amt: 'S$180' },
  ];
  rows.forEach((row, i) => {
    const ry = 68 + i * 42;
    const nameT = mkText(row.name, 12, W.medium, C.hpTextPri); nameT.x = 16; nameT.y = ry; card.appendChild(nameT);
    const subT = mkText(row.sub, 10, W.regular, C.hpTextSec); subT.x = 16; subT.y = ry + 16; card.appendChild(subT);
    const amtT = mkText(row.amt, 13, W.semibold, C.hpAction, 'RIGHT', 60); amtT.x = 224; amtT.y = ry + 4; card.appendChild(amtT);
    if (i < 2) { const div = mkRect(268, 1, C.slate100); div.x = 16; div.y = ry + 36; card.appendChild(div); }
  });

  const totalDiv = mkRect(268, 1, C.slate100); totalDiv.x = 16; totalDiv.y = 196; card.appendChild(totalDiv);
  const totalLabel = mkText('Total credited', 11, W.regular, C.hpTextSec); totalLabel.x = 16; totalLabel.y = 206; card.appendChild(totalLabel);
  const totalAmt = mkText('S$600', 18, W.bold, C.hpTextPri); totalAmt.x = 16; totalAmt.y = 218; card.appendChild(totalAmt);
  const nextT = mkText('Next credit: 1 Jul 2026', 11, W.semibold, C.hpTextPri, 'RIGHT', 120); nextT.x = 164; nextT.y = 218; card.appendChild(nextT);

  return card;
}

// ── REFER AND EARN SECTION BUILDERS ─────────────────────────

function mkHeroReferAndEarn() {
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badge = mkPill('Refer and Earn', C.hpBlue100, C.hpAction, 16, 8, 100);
  badge.x = 144; badge.y = 72;
  sec.appendChild(badge);

  const h1 = mkH2('Know a business that needs payments? Share your link and earn from every sale they make.', 44, C.hpTextPri, 'LEFT', 560);
  h1.lineHeight = { value: 52, unit: 'PIXELS' };
  h1.x = 144; h1.y = 118;
  sec.appendChild(h1);

  const sub = mkText("You're already on HitPay. Every business you invite earns you 0.1% of their monthly online payments — automatically, every month, for as long as they process. No applications. Your link is ready.", 18, W.regular, C.hpTextSec, 'LEFT', 540);
  sub.lineHeight = { value: 28, unit: 'PIXELS' };
  sub.x = 144; sub.y = 336;
  sec.appendChild(sub);

  const b1 = mkBtn('Find my referral link', C.hpAction, C.white, 24, 14, 12);
  b1.x = 144; b1.y = 436;
  sec.appendChild(b1);

  const b2 = mkBtn('See how it works', null, C.hpTextPri, 24, 14, 12, true);
  b2.x = 360; b2.y = 436;
  sec.appendChild(b2);

  const fine = mkText('Already a HitPay merchant · Link lives in your dashboard · Paid monthly', 13, W.regular, C.hpTextSec);
  fine.x = 144; fine.y = 488;
  sec.appendChild(fine);

  const dash = mockReferDashboard();
  dash.x = 852; dash.y = 70;
  sec.appendChild(dash);

  return sec;
}

function mkReferTrustBar() {
  const sec = mkFrame('TrustBar', 1440, 200, C.hpBeige);
  sec.strokes = [{ type: 'SOLID', color: C.slate100 }];
  sec.strokeWeight = 1;
  sec.strokeAlign = 'INSIDE';

  const stats = [
    { val: '500+',    sub: 'Businesses referred' },
    { val: 'S$1M+',  sub: 'In commissions paid' },
    { val: '0.1%',   sub: 'Of online TPV, every month' },
    { val: 'Monthly', sub: 'Auto-credit to your wallet' },
  ];

  const colW = 1152 / 4;
  stats.forEach((s, i) => {
    const val = mkText(s.val, 32, W.bold, C.hpTextPri, 'CENTER', colW);
    val.x = 144 + i * colW; val.y = 60;
    sec.appendChild(val);

    const sub = mkText(s.sub, 14, W.regular, C.hpTextSec, 'CENTER', colW);
    sub.x = 144 + i * colW; sub.y = 100;
    sec.appendChild(sub);
  });

  return sec;
}

function mkReferHowItWorks() {
  const sec = mkFrame('HowItWorks', 1440, 400, C.white);

  const lbl = mkText('HOW IT WORKS', 11, W.semibold, C.hpAction, 'CENTER', 1152);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 48;
  sec.appendChild(lbl);

  const h2 = mkH2('Three steps. No paperwork. No waiting.', 36, C.hpTextPri, 'CENTER', 640);
  h2.lineHeight = { value: 44, unit: 'PIXELS' };
  h2.x = 400; h2.y = 74;
  sec.appendChild(h2);

  const sub = mkText('Your referral link is already in your HitPay dashboard. It takes 60 seconds to share.', 16, W.regular, C.hpTextSec, 'CENTER', 640);
  sub.x = 400; sub.y = 126;
  sec.appendChild(sub);

  const steps = [
    { n: '1', title: 'Find your link', body: 'Log in to your HitPay dashboard and click Refer and Earn in the left menu. Your unique referral link is there, ready to copy. No application required.' },
    { n: '2', title: 'Share with anyone', body: "Send it to a friend, supplier, fellow entrepreneur, or anyone you know who runs a business. They register using your link — that's all it takes." },
    { n: '3', title: 'Earn every month', body: 'Once they go live and start processing online payments, 0.1% of their monthly volume lands in your HitPay wallet automatically — no action needed.' },
  ];

  const cardW = 340;
  steps.forEach((step, i) => {
    const cx = 144 + i * 384;
    const bg = mkRect(cardW, 192, C.hpBeige, 16); bg.x = cx; bg.y = 166; sec.appendChild(bg);
    const numBg = mkRect(36, 36, C.hpAction, 10); numBg.x = cx + 24; numBg.y = 190; sec.appendChild(numBg);
    const numT = mkText(step.n, 18, W.bold, C.white, 'CENTER', 36); numT.x = cx + 24; numT.y = 196; sec.appendChild(numT);
    const titleT = mkH2(step.title, 18, C.hpTextPri, 'LEFT', cardW - 48); titleT.x = cx + 24; titleT.y = 240; sec.appendChild(titleT);
    const bodyT = mkText(step.body, 13, W.regular, C.hpTextSec, 'LEFT', cardW - 48); bodyT.lineHeight = { value: 20, unit: 'PIXELS' }; bodyT.x = cx + 24; bodyT.y = 268; sec.appendChild(bodyT);
  });

  return sec;
}

function mkReferCalculator() {
  const sec = mkFrame('Calculator', 1440, 560, C.hpDeepBlue);

  const lbl = mkText('EARNINGS CALCULATOR', 11, W.semibold, { r:0.576, g:0.773, b:0.988 }, 'CENTER', 1152);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 48;
  sec.appendChild(lbl);

  const h2 = mkH2('See what one referral could earn you', 36, C.white, 'CENTER', 680);
  h2.lineHeight = { value: 44, unit: 'PIXELS' };
  h2.x = 380; h2.y = 76;
  sec.appendChild(h2);

  const sub = mkText('0.1% of their monthly online payments — automatically, every month.', 16, W.regular, { r:0.663, g:0.831, b:0.996 }, 'CENTER', 680);
  sub.x = 380; sub.y = 130;
  sec.appendChild(sub);

  // Slider panel
  const panelBg = mkRect(520, 272, C.hpAction, 16);
  panelBg.opacity = 0.18;
  panelBg.x = 144; panelBg.y = 176;
  sec.appendChild(panelBg);

  const sliderTitle1 = mkText('Monthly online TPV per referral', 13, W.semibold, C.white);
  sliderTitle1.x = 168; sliderTitle1.y = 198;
  sec.appendChild(sliderTitle1);

  const tpvVal = mkPill('S$300,000', C.hpAction, C.white, 14, 6, 8);
  tpvVal.x = 456; tpvVal.y = 196;
  sec.appendChild(tpvVal);

  const sliderBar1 = mkRect(472, 8, { r:1, g:1, b:1, a:0.2 }, 100); sliderBar1.x = 168; sliderBar1.y = 226; sec.appendChild(sliderBar1);
  const sliderFill1 = mkRect(200, 8, C.hpAction, 100); sliderFill1.x = 168; sliderFill1.y = 226; sec.appendChild(sliderFill1);

  const range1Min = mkText('S$10K', 10, W.regular, { r:0.576, g:0.773, b:0.988 }); range1Min.x = 168; range1Min.y = 240; sec.appendChild(range1Min);
  const range1Max = mkText('S$10M', 10, W.regular, { r:0.576, g:0.773, b:0.988 }, 'RIGHT', 100); range1Max.x = 540; range1Max.y = 240; sec.appendChild(range1Max);

  const sliderTitle2 = mkText('Number of businesses referred', 13, W.semibold, C.white);
  sliderTitle2.x = 168; sliderTitle2.y = 280;
  sec.appendChild(sliderTitle2);

  const mVal = mkPill('3', C.hpAction, C.white, 14, 6, 8);
  mVal.x = 510; mVal.y = 278;
  sec.appendChild(mVal);

  const sliderBar2 = mkRect(472, 8, { r:1, g:1, b:1, a:0.2 }, 100); sliderBar2.x = 168; sliderBar2.y = 310; sec.appendChild(sliderBar2);
  const sliderFill2 = mkRect(80, 8, C.hpAction, 100); sliderFill2.x = 168; sliderFill2.y = 310; sec.appendChild(sliderFill2);

  const range2Min = mkText('1', 10, W.regular, { r:0.576, g:0.773, b:0.988 }); range2Min.x = 168; range2Min.y = 324; sec.appendChild(range2Min);
  const range2Max = mkText('20', 10, W.regular, { r:0.576, g:0.773, b:0.988 }, 'RIGHT', 40); range2Max.x = 600; range2Max.y = 324; sec.appendChild(range2Max);

  const formula = mkText('3 referrals × S$300,000 × 0.1%', 13, W.regular, { r:0.576, g:0.773, b:0.988 }, 'CENTER', 472);
  formula.x = 168; formula.y = 420;
  sec.appendChild(formula);

  // Output card
  const outputBg = mkRect(488, 320, C.hpAction, 20); outputBg.x = 808; outputBg.y = 140; sec.appendChild(outputBg);

  const outLabel = mkText('YOUR MONTHLY COMMISSION', 10, W.semibold, { r:0.663, g:0.831, b:0.996 }, 'CENTER', 400);
  outLabel.letterSpacing = { value: 1, unit: 'PIXELS' };
  outLabel.x = 852; outLabel.y = 180;
  sec.appendChild(outLabel);

  const outVal = mkText('S$900', 52, W.bold, C.white, 'CENTER', 400);
  outVal.x = 852; outVal.y = 204;
  sec.appendChild(outVal);

  const perMo = mkText('per month', 14, W.regular, { r:0.663, g:0.831, b:0.996 }, 'CENTER', 400);
  perMo.x = 852; perMo.y = 272;
  sec.appendChild(perMo);

  const outDiv = mkRect(400, 1, { r:1, g:1, b:1, a:0.2 }); outDiv.x = 852; outDiv.y = 302; sec.appendChild(outDiv);

  const annualLabel = mkText('Your annual projection', 13, W.regular, { r:0.663, g:0.831, b:0.996 }, 'CENTER', 400);
  annualLabel.x = 852; annualLabel.y = 318;
  sec.appendChild(annualLabel);

  const annualVal = mkText('S$10,800', 32, W.bold, C.white, 'CENTER', 400);
  annualVal.x = 852; annualVal.y = 342;
  sec.appendChild(annualVal);

  const annualSub = mkText('12 months at the same TPV', 11, W.regular, { r:0.663, g:0.831, b:0.996 }, 'CENTER', 400);
  annualSub.x = 852; annualSub.y = 388;
  sec.appendChild(annualSub);

  return sec;
}

function mkReferFeature1() {
  const sec = mkFrame('Feature1_Reward', 1440, 520, C.white);

  const lbl = mkText('THE REWARD', 11, W.semibold, C.hpAction);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 144; lbl.y = 64;
  sec.appendChild(lbl);

  const h2 = mkH2('0.1% of everything they make online. Every month. Forever.', 36, C.hpTextPri, 'LEFT', 520);
  h2.lineHeight = { value: 44, unit: 'PIXELS' };
  h2.x = 144; h2.y = 98;
  sec.appendChild(h2);

  const body = mkText('For every online payment your referred business processes — cards, PayNow, GrabPay, ShopeePay, payment links, online checkout — you earn 0.1% per month. No cap, no expiry, no minimum volume threshold. Commission is credited automatically to your HitPay wallet each month.', 15, W.regular, C.hpTextSec, 'LEFT', 520);
  body.lineHeight = { value: 24, unit: 'PIXELS' };
  body.x = 144; body.y = 218;
  sec.appendChild(body);

  const bullets = [
    '0.1% of online payments — cards, PayNow, GrabPay, payment links, checkout',
    'Excludes POS/terminal and recurring billing transactions',
    'No minimum TPV — earns from the very first online transaction',
    'No expiry — earns as long as they process on HitPay',
  ];
  bullets.forEach((b, i) => {
    const bullet = mkBullet(b, 14, C.hpTextSec, 520); bullet.x = 144; bullet.y = 324 + i * 28; sec.appendChild(bullet);
  });

  const creditCard = mockReferWalletCredit();
  creditCard.x = 840; creditCard.y = 120;
  sec.appendChild(creditCard);

  return sec;
}

function mkReferFeature2() {
  const sec = mkFrame('Feature2_AutoPay', 1440, 520, C.hpBeige200);

  const summCard = mockReferEarningsSummary();
  summCard.x = 144; summCard.y = 140;
  sec.appendChild(summCard);

  const lbl = mkText('AUTOMATIC PAYOUTS', 11, W.semibold, C.hpAction);
  lbl.letterSpacing = { value: 1.5, unit: 'PIXELS' };
  lbl.x = 744; lbl.y = 64;
  sec.appendChild(lbl);

  const h2 = mkH2('No invoicing. Your wallet. Every first of the month.', 36, C.hpTextPri, 'LEFT', 520);
  h2.lineHeight = { value: 44, unit: 'PIXELS' };
  h2.x = 744; h2.y = 98;
  sec.appendChild(h2);

  const body = mkText('On the first of every calendar month, HitPay calculates 0.1% of the previous month\'s online transaction volume for each of your referred businesses and credits the total directly into your HitPay wallet. Nothing to claim, no invoice to raise, no threshold to clear.', 15, W.regular, C.hpTextSec, 'LEFT', 520);
  body.lineHeight = { value: 24, unit: 'PIXELS' };
  body.x = 744; body.y = 218;
  sec.appendChild(body);

  const bullets = [
    'Calculated on the 1st — previous calendar month\'s online TPV',
    'Credited to your existing HitPay wallet — no separate account',
    'One credit for all your active referrals combined',
    'Track individual referral earnings in your dashboard',
  ];
  bullets.forEach((b, i) => {
    const bullet = mkBullet(b, 14, C.hpTextSec, 520); bullet.x = 744; bullet.y = 352 + i * 28; sec.appendChild(bullet);
  });

  return sec;
}

function mkReferStats() {
  const sec = mkFrame('StatsBar', 1440, 192, C.hpDeepBlue);

  const stats = [
    { val: '0.1%',    sub: 'Commission on every online payment' },
    { val: 'Monthly', sub: 'Automatic wallet credit — no action needed' },
    { val: 'No expiry', sub: 'Earn as long as they process on HitPay' },
    { val: '60 sec',  sub: 'Time to find and share your referral link' },
  ];

  const colW = 1152 / 4;
  stats.forEach((s, i) => {
    const val = mkText(s.val, 28, W.bold, C.white, 'CENTER', colW);
    val.x = 144 + i * colW; val.y = 48;
    sec.appendChild(val);

    const sub = mkText(s.sub, 13, W.regular, { r:0.663, g:0.831, b:0.996 }, 'CENTER', colW);
    sub.x = 144 + i * colW; sub.y = 88;
    sec.appendChild(sub);
  });

  return sec;
}

// ── REFER AND EARN PAGE BUILDER ──────────────────────────────

function buildReferAndEarn(xOffset = 0) {
  const page = new Page('Refer and Earn', xOffset);

  page.add(mkNavbar(), 64);
  page.add(mkHeroReferAndEarn(), 560);
  page.add(mkReferTrustBar(), 200);
  page.add(mkReferHowItWorks(), 400);
  page.add(mkReferCalculator(), 560);
  page.add(mkReferFeature1(), 520);
  page.add(mkReferFeature2(), 520);
  page.add(mkReferStats(), 192);

  // FAQ — 8 questions: 96 + 8×136 + 40 = 1224
  page.add(mkFaq([
    { q: 'How does the HitPay Refer and Earn programme work?',
      a: 'Any existing HitPay merchant can refer businesses using a unique referral link in their dashboard under Refer and Earn. When the referred business registers through that link, goes live, and processes online payments, the referring merchant earns 0.1% of their monthly online payment volume — credited automatically on the first of each month.' },
    { q: 'How much can a merchant earn from referring businesses to HitPay?',
      a: 'A merchant earns 0.1% of the total online payment volume processed by each referred business every month. A business processing S$300,000 per month in online payments generates S$300 monthly. There is no cap on earnings and no limit on the number of businesses that can be referred.' },
    { q: 'Where does a HitPay merchant find their referral link?',
      a: 'The referral link is inside the HitPay merchant dashboard. Log in, then click Refer and Earn in the left navigation menu. The unique link appears there and can be copied or shared directly. No application or approval is required.' },
    { q: 'When are referral commissions paid?',
      a: "Commissions are calculated automatically on the first of each month for the previous calendar month's online transaction volume. The amount is credited directly to the referring merchant's HitPay wallet — no claim, invoice, or request needed." },
    { q: 'What types of transactions are included in the commission calculation?',
      a: 'Commission applies to online payment transactions only — cards, PayNow, GrabPay, ShopeePay, payment links, and online checkout. POS/terminal transactions and recurring billing transactions are excluded.' },
    { q: 'Is there a limit on how many businesses a merchant can refer?',
      a: 'No. There is no limit on referrals. Every business that registers through the referral link and goes live on HitPay contributes to the monthly commission — no cap on total earnings.' },
    { q: 'How long does a merchant continue earning commission from a referral?',
      a: 'There is no expiry. As long as the referred business continues processing online payments through HitPay, the referring merchant earns 0.1% every month — no renewal or action required.' },
    { q: 'Does the referred business need to be a new HitPay customer?',
      a: 'The referred business must register through the referral link. Businesses already on HitPay would not count as a new referral. The programme is for businesses that have not yet signed up with HitPay.' },
  ], C.hpBeige), 1224);

  page.add(mkCta(
    'Your referral link is already waiting for you.',
    'Log in to your HitPay dashboard, go to Refer and Earn, and share your link. Every business you help discover HitPay earns you 0.1% of their monthly online payments — forever.',
    'Go to my dashboard',
    'Learn about the Affiliate Program'
  ), 300);

  page.add(mkFooter(
    ['Virtual Accounts', 'Payment Links', 'POS Software', 'Invoices'],
    ['E-commerce', 'Retail', 'Restaurants & F&B', 'Health & Beauty']
  ), 280);

  return page.f;
}

// ── MAIN ─────────────────────────────────────────────────────

const BUILDERS = {
  ai_shoppers:   buildAiShoppers,
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
  art_craft_fair:    buildArtCraftFair,
  virtual_accounts:  buildVirtualAccounts,
  affiliate:         buildAffiliate,
  refer_and_earn:    buildReferAndEarn,
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
