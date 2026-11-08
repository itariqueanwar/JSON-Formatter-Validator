# Design decisions

- Followed the Redsite design brief in the parent `DESIGN.md`: Plus Jakarta Sans, JetBrains Mono, Raven Black, Powder Blue, Poppy Red, generous whitespace, and a black-to-red primary action.
- Used the existing PDF password remover as a product-page reference for navigation, privacy messaging, FAQ, and product attribution.
- Kept the formatter dependency-free and in-browser using the native JSON parser, so pasted content never needs a server request.
- Chose `https://json.redsite.in/` as the canonical production URL to align with the existing `unlock.redsite.in` product subdomain convention.
