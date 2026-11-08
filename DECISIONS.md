# Design decisions

- Followed the Redsite design brief in the parent `DESIGN.md`: Plus Jakarta Sans, JetBrains Mono, Raven Black, Powder Blue, Poppy Red, generous whitespace, and a black-to-red primary action.
- Configured Vite multi-page Rollup input so `privacy/index.html` is properly compiled and bundled into `dist/privacy/index.html` alongside the root application.
- Kept the formatter 100% dependency-free and client-side using native browser JSON parsing primitives, guaranteeing zero server requests, zero data storage, and complete offline capability.
- Implemented dual view modes: side-by-side **Split View** on desktop screens and a clean **Stacked View** on smaller screens, toggleable by the user.
- Added smart **Auto-Fix** capabilities to repair the most frequent real-world malformed JSON issues: single quotes, unquoted property keys, trailing commas, comments, and Python literals (`True`/`False`/`None`).
- Added precision syntax error diagnostics that parse line number and column coordinates across V8, WebKit, and Gecko, with a "Jump to error" selection helper.
- Added essential developer usability features: drag-and-drop file upload, file picker, clipboard paste, download as `.json`, copy with visual checkmark feedback, payload statistics (line count, byte size, minification ratio), and keyboard shortcuts (`Ctrl+Enter`, `Ctrl+Shift+M`, `Ctrl+Shift+C`).
- Enhanced SEO with comprehensive structured data (`WebApplication`, `FAQPage`, `HowTo`, `BreadcrumbList`), full Open Graph and Twitter Card metadata including a custom 1200x630 social preview image (`og-image.png`), keyword-rich developer guidance on common JSON syntax mistakes, and updated `sitemap.xml` with last-modified timestamps.
- Chose `https://json.redsite.in/` as the canonical production URL to align with the existing `unlock.redsite.in` product subdomain convention.
