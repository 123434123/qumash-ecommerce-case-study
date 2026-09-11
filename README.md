# QUMASH — Storefront

A bilingual (Arabic/English) storefront concept for QUMASH, a fictional Cairo-based clothing atelier. Built to explore product browsing, search/filtering, and full RTL/LTR internationalization without any framework.

**[Live Demo](https://123434123.github.io/qumash-ecommerce-case-study/admin/)** · **[Admin Dashboard for this project](../admin)**

## Features

- 🌍 Full Arabic/English toggle — swaps text, layout direction (RTL/LTR), fonts, and even numeral formatting live, with no page reload
- 🔍 Live search and category filtering over the product catalog
- 🖼️ Product detail modal with sizes, pricing, and description
- 📱 Fully responsive layout, down to small mobile screens
- ♿ Respects `prefers-reduced-motion` for users who need reduced animation
- 🎨 Custom design system (CSS variables) — no UI framework or CSS library used

## Tech Stack

Vanilla HTML, CSS, and JavaScript. No build step, no dependencies — open `index.html` and it runs.

- **Fonts:** Fraunces + Inter (Latin), Amiri + Almarai (Arabic)
- **i18n:** custom lightweight translation object driven by `data-i18n` attributes
- **State:** in-memory product catalog (see `script.js`)

## Running locally

```bash
git clone <repo-url>
cd E-Commerce
# just open index.html in a browser, or serve it:
python3 -m http.server 8000
```

## Part of a larger case study

This storefront is paired with a [QUMASH Admin Dashboard](../admin) that manages the same catalog of products, orders, and customers — together they demonstrate both the customer-facing and operational sides of a small e-commerce business.

## Screenshots

<!-- Add screenshots here, e.g.: -->
<!-- ![Homepage](./screenshots/home.png) -->
<!-- ![Product modal](./screenshots/modal.png) -->
<!-- ![Arabic layout](./screenshots/arabic.png) -->

## License

MIT — feel free to use this as a reference or starting point.
