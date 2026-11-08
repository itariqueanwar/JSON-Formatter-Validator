# REDSITE Brand & Product Design System (DESIGN.md)

This document defines the official design system, brand identity, UI components, typography, color tokens, and architectural guidelines for **REDSITE** products and Micro SaaS tools (such as `json.redsite.in`, `unlock.redsite.in`, and future utilities).

Use this specification when developing new products or extending existing ones to ensure 100% aesthetic and functional consistency across the Redsite ecosystem.

---

## 1. Brand Philosophy & Identity

* **Philosophy**: "Simple by Design. Private by Default."
* **Core Value**: Clean, fast, zero-clutter developer and productivity tools with generous whitespace, instant client-side execution, and zero unnecessary server uploads or trackers.
* **Naming Convention**:
  * Product Title: `[Capability / Name] by REDSITE` (e.g. *JSON Formatter & Validator by Redsite*, *PDF Password Remover by Redsite*).
  * Domain Pattern: `https://[tool].redsite.in/` (subdomain per product).
  * Byline Attribution: `A product by REDSITE` (where `REDSITE` is bolded in Poppy Red).
* **Navigation Links**: Always include a link back to Redsite main directory (`https://redsite.in`) and all products (`https://redsite.in/products`).

---

## 2. Color Palette & Design Tokens

Redsite uses a signature high-contrast palette: **Raven Black**, **Poppy Red**, and **Powder Blue**, supported by crisp neutral slates.

### CSS Custom Properties (`:root`)

```css
:root {
  /* Brand Core Colors */
  --ink: #0a0a0a;          /* Raven Black — Headings, brand accents, dark sections */
  --ink-soft: #24272e;     /* Raven Soft — Card titles, deep borders */
  --red: #e11d48;          /* Poppy Red — Primary brand accent, primary CTA gradient, highlights */
  --red-hover: #be123c;    /* Deep Crimson — Button hover and active state */
  --blue: #b0e0e6;         /* Powder Blue — Privacy badges, dark-band highlights, symbols */
  --blue-accent: #0284c7;  /* Sky Blue — Focus rings, selection indicators, active links */

  /* Neutral Backgrounds & Surfaces */
  --paper: #ffffff;        /* Canvas Paper — Main page and card background */
  --paper-warm: #fafbfc;   /* Warm Surface — Toolbar, steps, footer backgrounds */
  --paper-panel: #f8fafc;  /* Panel Gray — Pane headers, eyebrow backgrounds */

  /* Borders & Dividers */
  --line: #e2e8f0;         /* Standard Border — Crisp 1px structure */
  --line-light: #f1f5f9;   /* Subtle Divider — Internal card borders */

  /* Typography Colors */
  --muted: #5e636e;        /* Secondary Text — Descriptions, metadata, secondary links */
  --muted-light: #8e939e;  /* Hints / Watermarks — Placeholders, shortcut hints */

  /* Semantic Feedback Tints */
  --red-soft: #fff1f2;     /* Error Banner Background */
  --red-border: #fecdd3;   /* Error Border */
  --green: #10b981;        /* Success / Active Live Dot */
  --green-soft: #ecfdf5;   /* Success Banner Background */
  --green-border: #a7f3d0; /* Success Border */

  /* Typography Families */
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, Menlo, Monaco, Consolas, monospace;

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 50px -12px rgba(10, 10, 10, 0.08);
}
```

---

## 3. Typography & Heading Hierarchy

Google Fonts to load on every page:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Font Guidelines:
1. **Plus Jakarta Sans**: Primary font for all headings, body text, buttons, and navigation.
2. **JetBrains Mono**: Used for code blocks, inputs, line numbers, badges, eyebrows, keyboard shortcuts, and metadata counts.
3. **Red Italics (`em`)**: Inside headings (`h1`, `h2`), the second clause or emphasis is wrapped in `<em>` styled with Poppy Red:
   ```css
   h1 em, h2 em {
     font-style: normal;
     color: var(--red);
   }
   ```
4. **Legibility Rule**: Minimum body font size is `14px` (`12px` for small badges/meta). Never use fonts below `11px` to maintain AAA accessibility and avoid SEO readability penalties.

---

## 4. Standard UI Components

### 4.1 Topbar Navigation
* **Height**: `72px` desktop, `64px` mobile. Sticky with `backdrop-filter: blur(10px)`.
* **Left**: 38×38 SVG logo, bold product title, byline with `REDSITE` in `#e11d48`.
* **Right**: Anchor links to sections, followed by an outline pill `.back-link` (`More tools ↗`).

```html
<header class="topbar">
  <a class="brand" href="https://redsite.in">
    <img class="product-logo" src="./favicon.svg" alt="" width="38" height="38">
    <span class="brand-copy">
      <span class="brand-title">Product Name</span>
      <span class="brand-byline">A product by <b>REDSITE</b></span>
    </span>
  </a>
  <nav>
    <a href="#tool">Tool</a>
    <a href="#features">Features</a>
    <a href="#faq">FAQ</a>
    <a class="back-link" href="https://redsite.in/products" target="_blank" rel="noopener noreferrer">More tools ↗</a>
  </nav>
</header>
```

### 4.2 Hero Section & Eyebrow
* **Eyebrow**: Pill with a pulsing green live dot:
  ```html
  <div class="eyebrow">
    <span class="live-dot" aria-hidden="true"></span>
    <span>FREE DEVELOPER TOOL · 100% PRIVATE &amp; IN-BROWSER</span>
  </div>
  ```
* **Trust Row**: Bulleted items numbered `01`, `02`, `03` with Poppy Red digits:
  ```html
  <div class="trust-row">
    <span><b>01</b> 100% Local processing</span>
    <span><b>02</b> Zero data uploads</span>
    <span><b>03</b> Free &amp; no account</span>
  </div>
  ```

### 4.3 The Signature Action Buttons

#### Primary Action Button (Redsite Black-to-Red Gradient)
The core action on every Redsite tool uses the signature black-to-crimson gradient:
```css
.primary-btn {
  height: 38px;
  padding: 0 18px;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a080c 45%, #e11d48 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(225, 29, 72, 0.25);
  transition: all 0.15s ease;
}

.primary-btn:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(225, 29, 72, 0.35);
}
```

#### Secondary & Pill Buttons
* **Secondary**: White surface, 1px `#e2e8f0` border, dark text.
* **Accent**: Soft red tint `#fff1f2`, border `#fecdd3`, text `#e11d48`.
* **Text Pill Button**: Lightweight rounded button for utility actions (Clear, Sample, Paste, Layout).

### 4.4 The Workbench / Tool Container
* Enclosed inside a single master card (`border-radius: 16px`, `box-shadow: var(--shadow-xl)`, `border: 1px solid var(--line)`).
* **Toolbar Header**: Groups primary actions on the left, utility actions on the right.
* **Status Bar**:
  * Idle: `#fafbfc` background with muted text.
  * Valid: `#ecfdf5` background with green icon and text (`#065f46`).
  * Error: `#fff1f2` background with red alert icon and text (`#9f1239`), plus quick action buttons.

### 4.5 The Signature Privacy Band
Every Redsite product features this signature high-contrast dark band before the FAQ:
```html
<section class="privacy-band" aria-label="Privacy Guarantee">
  <div class="privacy-symbol" aria-hidden="true">◎</div>
  <div class="privacy-content">
    <div class="eyebrow">100% PRIVATE &amp; SECURE</div>
    <h2>Your data stays <em>on your device.</em></h2>
    <p>Processing happens strictly on your local machine using client-side primitives. Your data is never transmitted, tracked, or stored by Redsite.</p>
  </div>
  <span class="privacy-tag">LOCAL PROCESSING ONLY</span>
</section>
```
```css
.privacy-band {
  background: #0a0a0a;
  color: #ffffff;
  display: flex;
  align-items: center;
  gap: 28px;
  padding: 44px max(calc((100vw - 1240px) / 2), 24px);
  margin-bottom: 80px;
}
.privacy-symbol { font-size: 42px; color: #b0e0e6; }
.privacy-band h2 em { color: #b0e0e6; }
.privacy-tag {
  border: 1px solid #334155;
  padding: 8px 14px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #b0e0e6;
}
```

### 4.6 FAQ Accordion
* 2-column desktop layout (left column: sticky heading and subtitle; right column: `<details>` list).
* Clean `<details>` elements with `+` and `−` state indicators styled in Poppy Red.

---

## 5. Responsiveness Standard

1. **Fluid Containers**: Main layout uses `max-width: 1240px; margin: 0 auto; padding: 0 24px;`.
2. **Breakpoints**:
   * **Desktop (≥960px)**: Multi-column workbenches (e.g. side-by-side dual editor panes), 3-column feature grids, 2-column FAQ layout.
   * **Tablet (768px – 959px)**: 2-column feature grids, stacked workbench, static FAQ headings.
   * **Mobile (<768px)**: 1-column flow, 44px minimum tap targets, compact toolbars with flex wrap, sticky topbar with collapsed nav links.
3. **Zero Horizontal Overflow**: All textareas, tables, and code snippets use `word-break: break-word; overflow-x: auto;`.

---

## 6. SEO, Metadata & PWA Standards

Every Redsite tool must include:
1. **Title Pattern**: `[Tool Name] — [Primary Capability & Keywords] | Redsite`
2. **Canonical Link**: `<link rel="canonical" href="https://[tool].redsite.in/">`
3. **Social Sharing Banner (1200×630 PNG)**: Located at `public/og-image.png`. Dark Raven Black background, logo mark, title, subtitle, and badges.
4. **Schema.org Structured Data**:
   * `WebApplication` (pricing: 0 USD, category: DeveloperApplication or UtilityApplication, featureList).
   * `FAQPage` (matching the visible FAQ accordions).
   * `HowTo` (step-by-step instructions for Google rich results).
   * `BreadcrumbList` (Redsite > Category > Product).
5. **Crawl Assets**:
   * `public/robots.txt`
   * `public/sitemap.xml` (with `<lastmod>` date)
   * `public/site.webmanifest` (for PWA installation)

---

## 7. File Structure Blueprint for New Redsite Tools

```text
product-root/
├── public/
│   ├── favicon.svg          # 48x48 dark background with Poppy Red dot & Powder Blue mark
│   ├── og-image.png         # 1200x630 social preview card
│   ├── robots.txt           # Crawl permissions
│   ├── sitemap.xml          # Sitemap with lastmod
│   └── site.webmanifest     # PWA manifest
├── privacy/
│   └── index.html           # Dedicated privacy policy page
├── index.html               # Main tool application page
├── app.js                   # Client-side vanilla logic (zero external telemetry)
├── styles.css               # Design system stylesheet matching tokens
├── vite.config.js           # Multi-page build config (main + privacy)
├── package.json             # Minimal dependencies (Vite)
├── README.md                # Product documentation
└── DESIGN.md                # This design system reference
```
