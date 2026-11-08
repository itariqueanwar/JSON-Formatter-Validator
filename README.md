# JSON Formatter & Validator by Redsite

Standalone static web application designed for `json.redsite.in` and deployed on Cloudflare Pages. Format, validate, repair, and minify JSON locally in the browser with 100% privacy and zero data uploads.

## Features

- **Instant Formatting & Pretty Printing**: Format JSON with 2-space, 4-space, or Tab indentation.
- **Deep Syntax Validation**: Line & column error detection with a one-click "Jump to error" locator.
- **Smart Auto-Fix**: Automatically converts single quotes, unquoted keys, trailing commas, comments, and Python literals into valid RFC 8259 JSON.
- **High-Ratio Minifier**: Strips whitespace and comments for bandwidth-optimized API payloads.
- **Dual View Layouts**: Side-by-side Split View on desktop and clean Stacked View on tablet and mobile.
- **Real-Time Payload Metrics**: Line counts, character counts, raw byte sizes, and minification savings percentages.
- **Developer Ergonomics**: Drag-and-drop file upload, clipboard paste, `.json` export download, copy with checkmark feedback, and keyboard shortcuts (`Ctrl+Enter`, `Ctrl+Shift+M`, `Ctrl+Shift+C`).
- **100% Client-Side Privacy**: Runs locally in your browser with zero remote network requests or tracking.

## Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle for Cloudflare Pages
npm run build

# Preview production build locally
npm run preview
```

Deploy the generated `dist/` directory directly to Cloudflare Pages.

## SEO & Discoverability

- Complete metadata: Title, description, keywords, canonical URLs (`https://json.redsite.in/`).
- Social sharing: 1200x630 Open Graph & Twitter large card preview banner (`og-image.png`).
- Rich Schema.org structured data: `WebApplication`, `FAQPage`, `HowTo`, and `BreadcrumbList`.
- Search crawl assets: `public/robots.txt` and `public/sitemap.xml` with `<lastmod>`.
- In-depth developer guide on common JSON syntax mistakes and fixes for organic search traffic.
