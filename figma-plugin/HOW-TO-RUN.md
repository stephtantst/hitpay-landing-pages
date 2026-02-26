# How to run the HitPay Landing Pages plugin in Figma

## Steps

1. **Open Figma** and create a new file (or open an existing one).

2. **Import the plugin:**
   - Go to the menu → **Plugins → Development → Import plugin from manifest...**
   - Navigate to this folder and select `manifest.json`

3. **Run the plugin:**
   - Go to **Plugins → Development → HitPay Landing Pages Generator**
   - Click **Run**

4. **Done.** Three frames will appear on the canvas:
   - `E-commerce Landing Page` (indigo)
   - `Retail Landing Page` (emerald)
   - `Nonprofits Landing Page` (violet)

Each frame is **1440px wide** and fully editable — all text, colors, shapes, and layout are native Figma nodes.

## What gets created

- **Navbar** with logo, nav links, and CTA button
- **Hero section** with headline, body, CTAs, and a mock UI card
- **Trust bar** with brand names
- **Section intro** (centered heading + body)
- **4 feature sections** per page (2-column layout, alternating sides)
- **Stats band** (4 key metrics)
- **Testimonial** (quote + attribution)
- **Feature grid** (3×2 card grid)
- **Related use cases** (3 cards)
- **CTA banner**
- **Footer**

## Notes

- The plugin uses the **Inter** font (same as the HTML). Make sure Inter is available in your Figma account.
- If Inter is not available, Figma will fall back to its default font. You can swap fonts in `code.js` by changing `'Inter'` to another font name.
- The plugin runs once and creates static frames — it does not poll or connect to anything.
