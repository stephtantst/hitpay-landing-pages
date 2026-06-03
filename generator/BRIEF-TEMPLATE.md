# Landing Page Brief Template

Fill in this file and pass it to the landing page generator.
Remove placeholder text in [brackets] and leave no fields empty.

---

## Identity

```
vertical: restaurants
# Slug used for filename — lowercase, no spaces (e.g. restaurants, beauty, wholesale)

markets:
  - SG
  - MY
  - PH
# Include all markets this page should cover

output_filename: restaurants.html
# File saved to repo root — e.g. restaurants.html
```

---

## Hero

```
hero_badge: "Restaurants & F&B"
# Short vertical label shown in the pill above the headline

hero_headline: "The payment stack built for every restaurant, hawker, and café"
# Max 12 words. No benefit verbs — describe what HitPay IS for this vertical, not what it does.

hero_subheadline: "Accept PayNow, DuitNow QR, and GCash — with no monthly fees, instant payment confirmation, and next business day payouts across Singapore, Malaysia, and the Philippines."
# 2–3 sentences. Must name one payment method per market and mention zero monthly fees.

hero_primary_cta: "Start for free"
hero_secondary_cta: "Contact sales"

hero_trust_line: "Free to sign up · No setup fees · F&B special rate: 2% + S$0.20"
# One line below the CTAs. Optional — can include pricing note or trust signal.
```

---

## Trust Bar

```
trust_label: "TRUSTED BY F&B BUSINESSES ACROSS SINGAPORE, MALAYSIA & THE PHILIPPINES"

trust_pills:
  - Hawker stalls
  - Casual dining
  - Fine dining
  - Cafés & bubble tea
  - Food courts
  - Catering
  - Ghost kitchens
  - Food trucks
# 6–8 sub-vertical types specific to this vertical

entity_definition: >
  From Tanjong Pagar hawker centres to Bangsar cafés and BGC food courts, F&B businesses
  across Southeast Asia use HitPay to accept PayNow, DuitNow QR, GCash, and card payments
  from a single dashboard — with no monthly fees and next business day payouts.
# 2–3 sentences. Name a specific local reference per market (neighbourhood, landmark, city area).
```

---

## Feature Sections (exactly 4)

### Feature 1 — Primary use case

```
feature_1_label: "INSTANT PAYMENT COLLECTION"
feature_1_headline: "Accept every payment method your customers carry — QR to card"
feature_1_intro: >
  Restaurants in Singapore, Malaysia, and the Philippines can collect payments via PayNow,
  DuitNow QR, QR Ph, GrabPay, Touch 'n Go, GCash, Visa, Mastercard, Atome, Alipay+, and
  WeChat Pay — all from one QR code or card terminal. Each payment is confirmed in real time,
  so staff never chase customers or check screenshots manually. Reconciliation runs
  automatically across all payment types at end of day, reducing closing time by up to 20 minutes.
# REQUIRED: 80–120 words. Prose only — no bullets. Name payment methods for 2+ markets.

feature_1_bullets:
  - "PayNow, DuitNow QR, and QR Ph — one QR code covers all three markets"
  - "Real-time Soundbox audio alerts confirm every PayNow transaction"
  - "Alipay+, WeChat Pay, and UPI for Chinese, Malaysian, and Indian tourist customers"
  - "No monthly terminal rental — pay per transaction only"

feature_1_mockup: "HitPay Soundbox device displaying a PayNow QR code with a live payment amount of S$43.60 and a green 'Payment received' confirmation banner"
# Describe the UI mockup shown beside this section — must be vertical-specific (no generic 'dashboard' descriptions)
```

### Feature 2 — Second use case

```
feature_2_label: "TABLE & ORDER MANAGEMENT"
feature_2_headline: "Run your full POS from iPad or Android — no extra hardware"
feature_2_intro: >
  [80–120 word prose. Name payment methods for 2+ markets. No bullets.]

feature_2_bullets:
  - "[Specific bullet 1]"
  - "[Specific bullet 2]"
  - "[Specific bullet 3]"
  - "[Specific bullet 4]"

feature_2_mockup: "[Vertical-specific mockup description]"
```

### Feature 3 — Third use case

```
feature_3_label: "[SECTION LABEL IN CAPS]"
feature_3_headline: "[Action verb + use case + benefit]"
feature_3_intro: >
  [80–120 word prose]

feature_3_bullets:
  - "[Bullet 1]"
  - "[Bullet 2]"
  - "[Bullet 3]"
  - "[Bullet 4]"

feature_3_mockup: "[Vertical-specific mockup description]"
```

### Feature 4 — Reporting / invoicing / integrations

```
feature_4_label: "[SECTION LABEL IN CAPS]"
feature_4_headline: "[Action verb + use case + benefit]"
feature_4_intro: >
  [80–120 word prose]

feature_4_bullets:
  - "[Bullet 1]"
  - "[Bullet 2]"
  - "[Bullet 3]"
  - "[Bullet 4]"

feature_4_mockup: "[Vertical-specific mockup description]"
```

---

## Stats Bar (exactly 4)

```
stats:
  - value: "SGD/MYR/PHP 0"
    label: "Monthly fees in any market"
  - value: "2%"
    label: "F&B card rate for qualifying merchants"
  - value: "Next business day"
    label: "Payouts in SG, MY & PH"
  - value: "700+"
    label: "Wallets accepted globally"
# First stat MUST be SGD/MYR/PHP 0 | Monthly fees. Third stat MUST be Next business day payouts.
```

---

## Testimonial

```
testimonial_quote: "[Real merchant quote — do not fabricate]"
testimonial_name: "[Merchant name]"
testimonial_business: "[Business name, City]"

# If no real quote available, leave blank and the generator will use the stat bridge format:
# "[Vertical] businesses using HitPay report [specific outcome] — with [feature] handling
#  [pain point] automatically across Singapore, Malaysia, and the Philippines."
```

---

## Feature Grid ("Everything your [vertical] business needs")

```
feature_grid:
  - title: "Next business day payouts"
    description: "Restaurant revenue settles to your bank in Singapore, Malaysia, or the Philippines the next business day — not 3–5 days later."
  - title: "50+ payment methods"
    description: "PayNow, DuitNow QR, GCash, GrabPay, Atome, Alipay+, cards, and more — one integration covers every customer."
  - title: "No monthly fees"
    description: "Zero subscription, zero setup cost. Pay only when a customer pays you."
  - title: "Real-time reconciliation"
    description: "Every PayNow, card, and wallet transaction appears in your dashboard instantly — end-of-day closeout takes minutes."
  - title: "Soundbox payment alerts"
    description: "Loud audio confirmation for every PayNow QR transaction — no fake screenshot risk for hawker stalls or busy counters."
  - title: "Multi-outlet management"
    description: "Manage payment data across all your restaurant branches from one login — Singapore HQ, Kuala Lumpur outlet, or Manila franchise."
# 6–8 cards. Each must have a title + 1–2 sentence description. Name a market or payment method per card where possible.
```

---

## Related Pages (exactly 3)

```
related_pages:
  - slug: retail
    title: "Retail & Shops"
    description: "Accept PayNow, DuitNow, and GCash in-store with Tap to Pay and card terminals."
  - slug: events
    title: "Events & Ticketing"
    description: "Sell tickets and collect sponsorships via payment links and QR codes."
  - slug: wholesale
    title: "Wholesale & B2B"
    description: "Invoice corporate clients and collect recurring B2B payments automatically."
# 3 pages from the existing page set. Each description must name a payment method or market.
```

---

## FAQ (minimum 12 questions)

```
faq:
  - q: "What payment methods can F&B businesses in Singapore, Malaysia, and the Philippines accept via HitPay?"
    a: "[40–80 word answer. Name PayNow for SG, DuitNow QR for MY, GCash/QR Ph for PH. Third person.]"

  - q: "How does HitPay handle tourist payments at Singapore restaurants?"
    a: "[SG-specific. Name Alipay+, WeChat Pay, tourist wallet context.]"

  - q: "Can a Singapore hawker stall use HitPay without Wi-Fi?"
    a: "[SG-specific. Reference Soundbox SIM card.]"

  - q: "What payment methods do Malaysian F&B businesses accept with HitPay?"
    a: "[MY-specific. MUST name DuitNow or Touch 'n Go or FPX.]"

  - q: "How do Malaysian café owners reconcile DuitNow and card payments in one report?"
    a: "[MY-specific. MUST name DuitNow or FPX or Touch 'n Go.]"

  - q: "What QR payment options do Philippine restaurants accept through HitPay?"
    a: "[PH-specific. MUST name GCash or Maya or QR Ph.]"

  - q: "Can food courts in the Philippines collect payments from multiple stalls with HitPay?"
    a: "[PH-specific. MUST name GCash or Maya or QR Ph.]"

  - q: "How much does HitPay charge F&B businesses per transaction?"
    a: "[Pricing question. Link to hitpayapp.com/pricing. NEVER state a specific card rate.]"

  - q: "What documents does a restaurant need to sign up for HitPay?"
    a: "[Signup docs for all 3 markets: ACRA/NRIC (SG), SSM/MyKad (MY), DTI or SEC/valid ID (PH).]"

  - q: "How quickly can a restaurant start accepting payments after signing up?"
    a: "[Payout speed + onboarding. Next business day. Approval 1–3 business days.]"

  - q: "Does HitPay integrate with restaurant POS systems like Square or Oracle MICROS?"
    a: "[Integration question — vertical-specific.]"

  - q: "Can a restaurant accept PayNow, GrabPay, and Atome from the same QR code?"
    a: "[Multi-method QR question. Relevant for SG/MY markets.]"

# Add more questions as needed. All answers: 40–80 words. All questions: third person.
```

---

## Figma

```
figma_file_url: "https://www.figma.com/design/cVRNqc3ziVFvu7tzYCmGDQ/Payment-Features"
# Default: Payment-Features file. Frame goes on the "Landing Pages" page inside this file.
```
