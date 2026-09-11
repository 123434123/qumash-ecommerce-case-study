# QUMASH — Admin Dashboard

A full admin dashboard for managing a small e-commerce store: products, orders, customers, and sales analytics — built in vanilla JavaScript with no frameworks and no backend.

**[Live Demo](#)** · **[Customer Storefront for this project](../E-Commerce)**

## Features

- 📊 **Dashboard** — key stats, a hand-drawn `<canvas>` sales chart (7d / 30d / 12m ranges), best sellers, recent orders
- 📦 **Products** — full CRUD (add, edit, delete) with categories, sizes, stock, and pricing
- 🧾 **Orders** — order list with status management (Pending → Processing → Shipped → Delivered / Cancelled)
- 👥 **Customers** — customer records with order history in a detail modal
- 📈 **Analytics** — best-sellers breakdown by revenue and units sold
- ⚙️ **Settings** — store profile, currency, low-stock threshold
- 🔎 Global search across products, orders, and customers
- 🔔 Notifications panel and profile popover
- 💾 Persists all data to `localStorage`, seeded with realistic demo data on first load
- 📱 Responsive collapsible sidebar for smaller screens

## Tech Stack

Vanilla HTML, CSS, and JavaScript — no frameworks, no libraries, no build step.

- **Charts:** hand-rolled rendering on `<canvas>` (no chart.js or similar)
- **Persistence:** `localStorage`, structured as a small local "database" with load/save/seed helpers
- **UI:** custom design system — modals, toasts, popovers, and a segmented control, all built from scratch

## Running locally

```bash
git clone <repo-url>
cd admin
# just open index.html in a browser, or serve it:
python3 -m http.server 8000
```

## Note

This is a **frontend-only demo** — there's no real server or database behind it; all data lives in the browser's `localStorage`. It's meant to showcase UI/UX, state management, and vanilla-JS architecture rather than a production backend.

## Part of a larger case study

This dashboard manages the same product catalog shown on the [QUMASH storefront](../E-Commerce) — together they demonstrate both the customer-facing and operational sides of a small e-commerce business.

## Screenshots

<!-- Add screenshots here, e.g.: -->
<!-- ![Dashboard overview](./screenshots/dashboard.png) -->
<!-- ![Products table](./screenshots/products.png) -->
<!-- ![Sales chart](./screenshots/analytics.png) -->

## License

MIT — feel free to use this as a reference or starting point.
