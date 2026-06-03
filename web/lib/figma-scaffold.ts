import { readFileSync } from 'fs'
import { join } from 'path'

// Generic hero for generated landing pages — not in code.js (which has vertical-specific heroes)
const MKHERO_GENERIC = `
/** Generic hero for generated landing pages — 560px */
function mkHeroGeneric(badge, h1Text, subText, btn1Label, btn2Label, finePrint) {
  const sec = mkFrame('Hero', 1440, 560, C.hpBlue50);

  const badgePill = mkPill(badge, C.hpBlue100, C.hpAction, 16, 8, 100);
  badgePill.x = 144; badgePill.y = 80;
  sec.appendChild(badgePill);

  const h1Node = mkH2(h1Text, 56, C.hpTextPri, 'LEFT', 560);
  h1Node.lineHeight = { value: 64, unit: 'PIXELS' };
  h1Node.x = 144; h1Node.y = 126;
  sec.appendChild(h1Node);

  const subNode = mkText(subText, 20, W.regular, C.hpTextSec, 'LEFT', 540);
  subNode.lineHeight = { value: 30, unit: 'PIXELS' };
  subNode.x = 144; subNode.y = Math.max(290, h1Node.y + h1Node.height + 24);
  sec.appendChild(subNode);

  const btnY = Math.max(390, subNode.y + subNode.height + 32);
  const b1 = mkBtn(btn1Label, C.hpAction, C.white, 24, 14, 12);
  b1.x = 144; b1.y = btnY;
  sec.appendChild(b1);

  const b2 = mkBtn(btn2Label, null, C.slate800, 24, 14, 12, true);
  b2.x = 320; b2.y = btnY;
  sec.appendChild(b2);

  if (finePrint) {
    const fine = mkText(finePrint, 14, W.regular, C.slate500);
    fine.x = 144; fine.y = btnY + 60;
    sec.appendChild(fine);
  }

  const neededH = btnY + (finePrint ? 100 : 60);
  if (neededH > 560) sec.resize(1440, neededH);

  return sec;
}
`

let _scaffold: string | null = null

export function getFigmaScaffold(): string {
  if (_scaffold) return _scaffold

  // Read code.js, extract everything up to (not including) the bespoke hero builders
  const codeJsPath = join(process.cwd(), '..', 'figma-plugin', 'code.js')
  const fullCode = readFileSync(codeJsPath, 'utf-8')

  const heroMarker = '// ── HERO BUILDERS'
  const markerIdx = fullCode.indexOf(heroMarker)
  if (markerIdx === -1) throw new Error('figma-plugin/code.js: hero builders marker not found')

  _scaffold = fullCode.slice(0, markerIdx).trimEnd() + '\n' + MKHERO_GENERIC
  return _scaffold
}

/**
 * Wraps a buildPage body with the full scaffold.
 * buildPageBody should start with the page name (e.g. "Restaurants Landing Page', 0);\n  ...")
 * and end with "figma.currentPage.appendChild(page.f);\n  figma.viewport...;\n}\nbuildPage();"
 */
export function wrapWithScaffold(buildPageBody: string): string {
  return `${getFigmaScaffold()}
async function buildPage() {
  await loadFonts();
  const page = new Page('${buildPageBody}
buildPage();`
}
