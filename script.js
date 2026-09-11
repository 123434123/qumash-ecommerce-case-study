/* =========================================================
   QUMASH ADMIN — APPLICATION LOGIC
   Vanilla JS, no frameworks or libraries.
   Sections:
   1. Constants & state
   2. Storage (load / save / seed demo data)
   3. Utility helpers (format, dom, debounce)
   4. Canvas chart drawing
   5. Render: dashboard / products / orders / customers / analytics / settings
   6. Modals (product add-edit, customer view, confirm)
   7. Search, filters, notifications, popovers
   8. Navigation & init
   ========================================================= */

/* ---------------------------------------------------------
   1. CONSTANTS & STATE
   --------------------------------------------------------- */
const STORAGE_KEYS = {
  products: 'qumash_products',
  orders: 'qumash_orders',
  customers: 'qumash_customers',
  sessions: 'qumash_sessions',
  settings: 'qumash_settings'
};

const CATEGORIES = ['Dresses', 'Outerwear', 'Knitwear', 'Bottoms', 'Tops', 'Accessories', 'Footwear'];
const ORDER_STATUSES = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const state = {
  products: [],
  orders: [],
  customers: [],
  sessions: [],
  settings: {}
};

let currentChartRange = '7d';
let confirmCallback = null;

/* ---------------------------------------------------------
   2. STORAGE — LOAD, SAVE, SEED
   --------------------------------------------------------- */
function loadState() {
  const savedProducts = localStorage.getItem(STORAGE_KEYS.products);

  if (!savedProducts) {
    seedDemoData();
  } else {
    state.products = JSON.parse(savedProducts);
    state.orders = JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
    state.customers = JSON.parse(localStorage.getItem(STORAGE_KEYS.customers) || '[]');
    state.sessions = JSON.parse(localStorage.getItem(STORAGE_KEYS.sessions) || '[]');
    state.settings = JSON.parse(localStorage.getItem(STORAGE_KEYS.settings) || '{}');
  }

  // Fill in any missing settings defaults (covers first run and future upgrades)
  state.settings = Object.assign({
    storeName: 'Qumash',
    email: 'hello@qumash.store',
    currency: 'EGP',
    lowStockThreshold: 8,
    address: 'Zamalek, Cairo, Egypt'
  }, state.settings);
}

function saveProducts() { localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(state.products)); }
function saveOrders() { localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(state.orders)); }
function saveCustomers() { localStorage.setItem(STORAGE_KEYS.customers, JSON.stringify(state.customers)); }
function saveSessions() { localStorage.setItem(STORAGE_KEYS.sessions, JSON.stringify(state.sessions)); }
function saveSettings() { localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings)); }

/** Builds realistic demo data the first time the dashboard is opened. */
function seedDemoData() {
  const productSeed = [
    ['Linen Wrap Dress', 'Dresses', 1450, 18, 'A relaxed silhouette in washed linen, cut to fall softly and tie at the waist.', ['XS','S','M','L','XL']],
    ['Silk Georgette Blouse', 'Tops', 980, 24, 'Fluid silk georgette with a covered button placket and dropped shoulder.', ['XS','S','M','L']],
    ['Wool Blend Coat', 'Outerwear', 3600, 7, 'A structured double-face wool coat built for transitional weather.', ['S','M','L','XL']],
    ['Tailored Wide-Leg Trousers', 'Bottoms', 1290, 15, 'High-rise trousers with a clean front crease and a fluid drape.', ['XS','S','M','L','XL']],
    ['Cotton Poplin Shirt', 'Tops', 750, 30, 'Crisp poplin shirt with mother-of-pearl buttons and a relaxed collar.', ['XS','S','M','L','XL','XXL']],
    ['Cashmere Knit Sweater', 'Knitwear', 2100, 9, 'Two-ply cashmere knit in a slightly oversized fit.', ['S','M','L']],
    ['Pleated Midi Skirt', 'Bottoms', 1150, 3, 'Sunray pleats in a fluid satin-back crepe that move with every step.', ['XS','S','M','L']],
    ['Structured Blazer', 'Outerwear', 2450, 11, 'A sharply tailored blazer with a nipped waist and covered seams.', ['XS','S','M','L','XL']],
    ['Leather Ankle Boots', 'Footwear', 2800, 6, 'Hand-finished leather boots on a low block heel.', ['S','M','L']],
    ['Woven Straw Tote', 'Accessories', 890, 20, 'A hand-woven straw tote lined in natural cotton canvas.', ['S','M']],
    ['Gold-Tone Hoop Earrings', 'Accessories', 420, 0, 'Lightweight brass hoops finished in 18k gold plating.', ['S']],
    ['Silk Scarf', 'Accessories', 650, 26, 'Hand-rolled silk twill scarf in a hand-painted print.', ['S']],
    ['Denim Jacket', 'Outerwear', 1680, 14, 'A washed denim jacket with a slightly cropped, boxy fit.', ['XS','S','M','L','XL']],
    ['Ribbed Turtleneck', 'Knitwear', 950, 22, 'Fine-gauge ribbed knit in a close, second-skin fit.', ['XS','S','M','L','XL']],
    ['Satin Slip Dress', 'Dresses', 1780, 8, 'Bias-cut satin slip dress with delicate adjustable straps.', ['XS','S','M','L']],
    ['Suede Loafers', 'Footwear', 2200, 12, 'Classic penny loafers in brushed Italian suede.', ['S','M','L','XL']]
  ];

  state.products = productSeed.map((p, i) => ({
    id: 'p_' + i,
    name: p[0],
    category: p[1],
    price: p[2],
    stock: p[3],
    description: p[4],
    sizes: p[5],
    image: '',
    dateAdded: isoDaysAgo(20 + i * 21 + Math.floor(Math.random() * 12))
  }));

  const customerSeed = [
    ['Nourhan Adel', 'nourhan.adel@example.com'],
    ['Youssef Hassan', 'youssef.hassan@example.com'],
    ['Mariam Fathy', 'mariam.fathy@example.com'],
    ['Omar El-Sayed', 'omar.elsayed@example.com'],
    ['Layla Ibrahim', 'layla.ibrahim@example.com'],
    ['Ahmed Zaki', 'ahmed.zaki@example.com'],
    ['Salma Tarek', 'salma.tarek@example.com'],
    ['Karim Mostafa', 'karim.mostafa@example.com'],
    ['Hana Mahmoud', 'hana.mahmoud@example.com'],
    ['Ziad Rady', 'ziad.rady@example.com'],
    ['Farida Nabil', 'farida.nabil@example.com'],
    ['Mohamed Ashraf', 'mohamed.ashraf@example.com']
  ];

  state.customers = customerSeed.map((c, i) => ({
    id: 'c_' + i,
    name: c[0],
    email: c[1],
    registeredDate: isoDaysAgo(40 + i * 28 + Math.floor(Math.random() * 20)),
    orders: 0,
    totalSpent: 0,
    status: 'Active'
  }));

  // ---- Generate ~1 year of orders across the seeded products & customers ----
  let counter = 1000;
  const orders = [];
  for (let daysAgo = 364; daysAgo >= 0; daysAgo--) {
    const count = weightedDailyOrderCount();
    for (let i = 0; i < count; i++) {
      const product = state.products[Math.floor(Math.random() * state.products.length)];
      const customer = state.customers[Math.floor(Math.random() * state.customers.length)];
      const qty = Math.random() < 0.78 ? 1 : 2;
      counter += 1;
      orders.push({
        id: 'QM-' + counter,
        customer: customer.name,
        customerEmail: customer.email,
        product: product.name,
        category: product.category,
        qty: qty,
        amount: product.price * qty,
        date: isoDaysAgo(daysAgo),
        status: pickOrderStatus(daysAgo)
      });
    }
  }
  state.orders = orders;

  // ---- Roll orders up into each customer's stats ----
  state.customers.forEach(cust => {
    const own = state.orders.filter(o => o.customer === cust.name);
    cust.orders = own.length;
    cust.totalSpent = sum(own.filter(o => o.status !== 'Cancelled').map(o => o.amount));
    const mostRecent = own.reduce((max, o) => (o.date > max ? o.date : max), '0000-00-00');
    cust.status = mostRecent >= isoDaysAgo(90) ? 'Active' : 'Inactive';
  });

  // ---- Synthesize daily site sessions (for conversion-rate analytics) ----
  const ordersByDate = {};
  state.orders.forEach(o => { ordersByDate[o.date] = (ordersByDate[o.date] || 0) + 1; });
  const sessions = [];
  for (let daysAgo = 364; daysAgo >= 0; daysAgo--) {
    const dateStr = isoDaysAgo(daysAgo);
    const orderCount = ordersByDate[dateStr] || 0;
    const baseline = 15 + Math.floor(Math.random() * 45);
    const fromOrders = orderCount * (18 + Math.floor(Math.random() * 16));
    sessions.push({ date: dateStr, sessions: baseline + fromOrders });
  }
  state.sessions = sessions;

  saveProducts(); saveOrders(); saveCustomers(); saveSessions(); saveSettings();
}

function weightedDailyOrderCount() {
  const r = Math.random();
  if (r < 0.45) return 0;
  if (r < 0.80) return 1;
  if (r < 0.95) return 2;
  return 3;
}

function pickOrderStatus(daysAgo) {
  const r = Math.random();
  if (daysAgo < 2) {
    if (r < 0.55) return 'Pending';
    if (r < 0.90) return 'Processing';
    return 'Cancelled';
  }
  if (daysAgo < 6) {
    if (r < 0.15) return 'Pending';
    if (r < 0.55) return 'Processing';
    if (r < 0.90) return 'Shipped';
    return 'Cancelled';
  }
  if (r < 0.80) return 'Delivered';
  if (r < 0.90) return 'Shipped';
  if (r < 0.96) return 'Processing';
  return 'Cancelled';
}

/* ---------------------------------------------------------
   3. UTILITY HELPERS
   --------------------------------------------------------- */
function isoDaysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function sum(arr) { return arr.reduce((a, b) => a + b, 0); }

function formatCurrency(amount) {
  const currency = state.settings.currency || 'EGP';
  return currency + ' ' + Math.round(amount).toLocaleString('en-US');
}

function formatCurrencyCompact(amount) {
  const currency = state.settings.currency || 'EGP';
  return currency + ' ' + compactNumber(amount);
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function compactNumber(v) {
  if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
  if (v >= 1000) {
    const k = v / 1000;
    return (Number.isInteger(k) ? k.toFixed(0) : k.toFixed(1)) + 'k';
  }
  return Math.round(v).toString();
}

function initials(name) {
  return name.split(' ').filter(Boolean).map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function truncateLabel(str, max) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str;
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

function getCss(varName) {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

function statusBadgeClass(status) { return 'badge-' + status.toLowerCase(); }

/** Compares a current total against the same metric "as of" 30 days ago. */
function statWithChange(items, dateField, valueFn) {
  const cutoff = isoDaysAgo(30);
  const total = valueFn(items);
  const past = valueFn(items.filter(i => i[dateField] <= cutoff));
  let pct;
  if (past === 0) pct = total > 0 ? 100 : 0;
  else pct = ((total - past) / past) * 100;
  return { value: total, pct };
}

function arrowIcon(up) {
  return up
    ? '<svg viewBox="0 0 12 12" fill="none"><path d="M6 9.5V2.5M6 2.5 2.5 6M6 2.5 9.5 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '<svg viewBox="0 0 12 12" fill="none"><path d="M6 2.5v7M6 9.5 2.5 6M6 9.5 9.5 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}

function changeBadgeHtml(pct) {
  const up = pct >= 0;
  return `<span class="stat-change ${up ? 'up' : 'down'}">${arrowIcon(up)} ${Math.abs(pct).toFixed(1)}% vs 30d ago</span>`;
}

/* ---------------------------------------------------------
   4. CANVAS CHARTS
   --------------------------------------------------------- */
function setupCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();
  const width = Math.max(rect.width, 10);
  const height = Math.max(rect.height, 10);
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width, height };
}

function niceCeiling(v) {
  if (v <= 0) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(v)));
  const residual = v / magnitude;
  let niceResidual;
  if (residual <= 1) niceResidual = 1;
  else if (residual <= 2) niceResidual = 2;
  else if (residual <= 5) niceResidual = 5;
  else niceResidual = 10;
  return niceResidual * magnitude;
}

function drawLineChart(canvas, labels, values, opts = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);

  const padL = 44, padR = 10, padT = 14, padB = 26;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;
  const n = values.length;
  const niceMax = niceCeiling(Math.max(...values, 1));
  const steps = 4;

  // Horizontal grid lines + y-axis labels
  ctx.font = '11px Inter, sans-serif';
  ctx.textBaseline = 'middle';
  for (let i = 0; i <= steps; i++) {
    const y = padT + chartH - (chartH / steps) * i;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(width - padR, y);
    ctx.strokeStyle = 'rgba(28,27,25,0.07)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = getCss('--ink-500');
    ctx.textAlign = 'right';
    ctx.fillText(compactNumber((niceMax / steps) * i), padL - 8, y);
  }

  // X-axis labels (first/last anchored inward so they never clip off-canvas)
  ctx.textBaseline = 'top';
  const labelEvery = opts.labelEvery || 1;
  labels.forEach((lab, i) => {
    if (i % labelEvery !== 0 && i !== n - 1) return;
    const x = padL + (chartW / (n - 1 || 1)) * i;
    ctx.fillStyle = getCss('--ink-500');
    if (i === 0) ctx.textAlign = 'left';
    else if (i === n - 1) ctx.textAlign = 'right';
    else ctx.textAlign = 'center';
    ctx.fillText(lab, x, height - padB + 8);
  });

  const points = values.map((v, i) => ({
    x: padL + (chartW / (n - 1 || 1)) * i,
    y: padT + chartH - (v / niceMax) * chartH
  }));

  // Gradient area fill
  const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  grad.addColorStop(0, 'rgba(169,131,79,0.28)');
  grad.addColorStop(1, 'rgba(169,131,79,0.02)');
  ctx.beginPath();
  ctx.moveTo(points[0].x, padT + chartH);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, padT + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line stroke
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.strokeStyle = getCss('--brass-600');
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.stroke();

  // Last-point marker
  const last = points[points.length - 1];
  ctx.beginPath();
  ctx.arc(last.x, last.y, 7, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(140,107,62,0.35)';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = getCss('--brass-600');
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function drawHBarChart(canvas, labels, values, opts = {}) {
  const { ctx, width, height } = setupCanvas(canvas);
  ctx.clearRect(0, 0, width, height);

  const n = labels.length;
  const padL = 96, padR = 68, padT = 6;
  const rowH = Math.min(32, (height - padT * 2) / n);
  const maxVal = Math.max(...values, 1);
  const barMaxW = width - padL - padR;
  const colors = [
    getCss('--brass-600'), getCss('--sky-600'), getCss('--moss-600'),
    getCss('--plum-600'), getCss('--rust-600'), getCss('--amber-600'), getCss('--ink-700')
  ];

  labels.forEach((lab, i) => {
    const y = padT + rowH * i + rowH / 2;
    const w = Math.max((values[i] / maxVal) * barMaxW, 3);

    ctx.font = '12px Inter, sans-serif';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = getCss('--ink-700');
    ctx.textAlign = 'right';
    ctx.fillText(truncateLabel(lab, 14), padL - 10, y);

    ctx.fillStyle = 'rgba(28,27,25,0.06)';
    roundRect(ctx, padL, y - 8, barMaxW, 16, 8);
    ctx.fill();

    ctx.fillStyle = colors[i % colors.length];
    roundRect(ctx, padL, y - 8, w, 16, 8);
    ctx.fill();

    ctx.fillStyle = getCss('--ink-900');
    ctx.font = '600 11.5px Inter, sans-serif';
    ctx.textAlign = 'left';
    const label = opts.valueFormatter ? opts.valueFormatter(values[i]) : String(values[i]);
    ctx.fillText(label, padL + barMaxW + 10, y);
  });
}

/** Aggregates non-cancelled order revenue into a labeled series for the given range. */
function getSalesSeries(range) {
  const revByDate = {};
  state.orders.forEach(o => {
    if (o.status === 'Cancelled') return;
    revByDate[o.date] = (revByDate[o.date] || 0) + o.amount;
  });

  if (range === '7d' || range === '30d') {
    const days = range === '7d' ? 7 : 30;
    const labels = [], values = [];
    for (let i = days - 1; i >= 0; i--) {
      const key = isoDaysAgo(i);
      const d = new Date(key + 'T00:00:00');
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      values.push(revByDate[key] || 0);
    }
    return { labels, values, labelEvery: range === '30d' ? 5 : 1 };
  }

  // 12 months
  const labels = [], values = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    labels.push(d.toLocaleDateString('en-US', { month: 'short' }));
    let total = 0;
    Object.keys(revByDate).forEach(key => {
      const kd = new Date(key + 'T00:00:00');
      if (kd.getFullYear() === d.getFullYear() && kd.getMonth() === d.getMonth()) total += revByDate[key];
    });
    values.push(total);
  }
  return { labels, values, labelEvery: 1 };
}

function drawSalesChart() {
  const canvas = document.getElementById('salesChart');
  if (!canvas || !document.getElementById('view-dashboard').classList.contains('active')) return;
  const { labels, values, labelEvery } = getSalesSeries(currentChartRange);
  drawLineChart(canvas, labels, values, { labelEvery });
}

function drawAnalyticsCharts() {
  if (!document.getElementById('view-analytics').classList.contains('active')) return;

  const revCanvas = document.getElementById('analyticsRevenueChart');
  const { labels, values } = getSalesSeries('12m');
  drawLineChart(revCanvas, labels, values, { labelEvery: 1 });

  const catCanvas = document.getElementById('categoryChart');
  const revByCategory = {};
  state.orders.forEach(o => {
    if (o.status === 'Cancelled') return;
    revByCategory[o.category] = (revByCategory[o.category] || 0) + o.amount;
  });
  const entries = Object.entries(revByCategory).sort((a, b) => b[1] - a[1]);
  drawHBarChart(catCanvas, entries.map(e => e[0]), entries.map(e => e[1]), {
    valueFormatter: v => formatCurrencyCompact(v)
  });
}

/* ---------------------------------------------------------
   5. RENDER — DASHBOARD
   --------------------------------------------------------- */
function renderDashboard() {
  renderDashboardStats();
  renderBestSellers('bestSellers', 5);
  renderRecentOrders();
}

function renderDashboardStats() {
  const nonCancelled = state.orders.filter(o => o.status !== 'Cancelled');
  const revenue = statWithChange(nonCancelled, 'date', arr => sum(arr.map(o => o.amount)));
  const orders = statWithChange(state.orders, 'date', arr => arr.length);
  const customers = statWithChange(state.customers, 'registeredDate', arr => arr.length);
  const products = statWithChange(state.products, 'dateAdded', arr => arr.length);

  const cards = [
    { label: 'Total Revenue', value: formatCurrency(revenue.value), pct: revenue.pct },
    { label: 'Total Orders', value: orders.value.toLocaleString('en-US'), pct: orders.pct },
    { label: 'Total Customers', value: customers.value.toLocaleString('en-US'), pct: customers.pct },
    { label: 'Total Products', value: products.value.toLocaleString('en-US'), pct: products.pct }
  ];

  document.getElementById('statGrid').innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      ${changeBadgeHtml(c.pct)}
    </div>
  `).join('');
}

function aggregateBestSellers() {
  const byProduct = {};
  state.orders.forEach(o => {
    if (o.status === 'Cancelled') return;
    if (!byProduct[o.product]) byProduct[o.product] = { name: o.product, category: o.category, units: 0, revenue: 0 };
    byProduct[o.product].units += o.qty;
    byProduct[o.product].revenue += o.amount;
  });
  return Object.values(byProduct).sort((a, b) => b.units - a.units);
}

function renderBestSellers(targetId, limit) {
  const items = aggregateBestSellers().slice(0, limit);
  document.getElementById(targetId).innerHTML = items.map((p, i) => `
    <div class="bs-row">
      <span class="bs-rank">${i + 1}</span>
      <span class="bs-thumb">${escapeHtml(initials(p.name))}</span>
      <span class="bs-info">
        <strong>${escapeHtml(p.name)}</strong>
        <span>${escapeHtml(p.category)}</span>
      </span>
      <span class="bs-units">${p.units} sold</span>
    </div>
  `).join('') || '<p class="empty-state">No sales yet.</p>';
}

function renderRecentOrders() {
  const recent = [...state.orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);
  document.querySelector('#recentOrdersTable tbody').innerHTML = recent.map(orderRowHtml).join('');
}

function orderRowHtml(o) {
  return `
    <tr>
      <td class="cell-primary">${escapeHtml(o.id)}</td>
      <td>${escapeHtml(o.customer)}</td>
      <td class="cell-muted">${escapeHtml(o.product)}</td>
      <td>${formatCurrency(o.amount)}</td>
      <td class="cell-muted">${formatDate(o.date)}</td>
      <td><span class="badge ${statusBadgeClass(o.status)}">${o.status}</span></td>
    </tr>
  `;
}

/* ---------------------------------------------------------
   5b. RENDER — PRODUCTS
   --------------------------------------------------------- */
function productStockStatus(p) {
  if (p.stock === 0) return { text: 'Out of Stock', cls: 'badge-out' };
  if (p.stock <= (state.settings.lowStockThreshold || 8)) return { text: 'Low Stock', cls: 'badge-low' };
  return { text: 'In Stock', cls: 'badge-in' };
}

function getFilteredProducts() {
  const search = document.getElementById('productSearch').value.trim().toLowerCase();
  const category = document.getElementById('categoryFilter').value;
  const stockFilter = document.getElementById('stockFilter').value;

  return state.products.filter(p => {
    if (search && !p.name.toLowerCase().includes(search) && !p.category.toLowerCase().includes(search)) return false;
    if (category !== 'all' && p.category !== category) return false;
    if (stockFilter !== 'all') {
      const status = productStockStatus(p);
      if (stockFilter === 'in' && status.cls !== 'badge-in') return false;
      if (stockFilter === 'low' && status.cls !== 'badge-low') return false;
      if (stockFilter === 'out' && status.cls !== 'badge-out') return false;
    }
    return true;
  });
}

function renderProducts() {
  document.getElementById('productCountLabel').textContent = state.products.length;
  const list = getFilteredProducts();
  const tbody = document.querySelector('#productsTable tbody');

  tbody.innerHTML = list.map(p => {
    const status = productStockStatus(p);
    const thumb = p.image
      ? `<img src="${escapeHtml(p.image)}" alt="" onerror="this.parentElement.textContent='${escapeHtml(initials(p.name))}'">`
      : escapeHtml(initials(p.name));
    return `
      <tr data-id="${p.id}">
        <td><div class="prod-thumb">${thumb}</div></td>
        <td class="cell-primary">${escapeHtml(p.name)}</td>
        <td class="cell-muted">${escapeHtml(p.category)}</td>
        <td>${formatCurrency(p.price)}</td>
        <td>${p.stock}</td>
        <td><span class="badge ${status.cls}">${status.text}</span></td>
        <td>
          <div class="row-actions">
            <button type="button" data-action="edit" title="Edit product">
              <svg viewBox="0 0 16 16" fill="none"><path d="M11.3 2.3a1.6 1.6 0 0 1 2.3 2.3L5.5 12.7 2.5 13.5l.8-3L11.3 2.3Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>
            </button>
            <button type="button" data-action="delete" class="danger" title="Delete product">
              <svg viewBox="0 0 16 16" fill="none"><path d="M3 4.5h10M6.5 4.5V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1.5M4.5 4.5 5 13a1 1 0 0 0 1 .9h4a1 1 0 0 0 1-.9l.5-8.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  document.getElementById('productsEmpty').hidden = list.length !== 0;
}

/* ---------------------------------------------------------
   5c. RENDER — ORDERS
   --------------------------------------------------------- */
function getFilteredOrders() {
  const search = document.getElementById('orderSearch').value.trim().toLowerCase();
  const status = document.getElementById('orderStatusFilter').value;

  return state.orders.filter(o => {
    if (search && !o.id.toLowerCase().includes(search) && !o.customer.toLowerCase().includes(search)) return false;
    if (status !== 'all' && o.status !== status) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));
}

function renderOrders() {
  document.getElementById('orderCountLabel').textContent = state.orders.length;
  const list = getFilteredOrders();
  document.querySelector('#ordersTable tbody').innerHTML = list.map(orderRowHtml).join('');
  document.getElementById('ordersEmpty').hidden = list.length !== 0;
}

/* ---------------------------------------------------------
   5d. RENDER — CUSTOMERS
   --------------------------------------------------------- */
function getFilteredCustomers() {
  const search = document.getElementById('customerSearch').value.trim().toLowerCase();
  const status = document.getElementById('customerStatusFilter').value;

  return state.customers.filter(c => {
    if (search && !c.name.toLowerCase().includes(search) && !c.email.toLowerCase().includes(search)) return false;
    if (status !== 'all' && c.status !== status) return false;
    return true;
  }).sort((a, b) => b.totalSpent - a.totalSpent);
}

function renderCustomers() {
  document.getElementById('customerCountLabel').textContent = state.customers.length;
  const list = getFilteredCustomers();

  document.querySelector('#customersTable tbody').innerHTML = list.map(c => `
    <tr data-id="${c.id}">
      <td class="cell-primary">${escapeHtml(c.name)}</td>
      <td class="cell-muted">${escapeHtml(c.email)}</td>
      <td>${c.orders}</td>
      <td>${formatCurrency(c.totalSpent)}</td>
      <td class="cell-muted">${formatDate(c.registeredDate)}</td>
      <td><span class="badge badge-${c.status.toLowerCase()}">${c.status}</span></td>
      <td>
        <div class="row-actions">
          <button type="button" data-action="view" title="View customer">
            <svg viewBox="0 0 16 16" fill="none"><path d="M1.5 8s2.2-4.5 6.5-4.5S14.5 8 14.5 8s-2.2 4.5-6.5 4.5S1.5 8 1.5 8Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><circle cx="8" cy="8" r="1.8" stroke="currentColor" stroke-width="1.3"/></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  document.getElementById('customersEmpty').hidden = list.length !== 0;
}

/* ---------------------------------------------------------
   5e. RENDER — ANALYTICS
   --------------------------------------------------------- */
function sessionsInLast(days) {
  const cutoff = isoDaysAgo(days);
  return sum(state.sessions.filter(s => s.date > cutoff).map(s => s.sessions));
}
function ordersInLast(days) {
  const cutoff = isoDaysAgo(days);
  return state.orders.filter(o => o.date > cutoff);
}

function renderAnalytics() {
  const nonCancelled = state.orders.filter(o => o.status !== 'Cancelled');
  const revenue = statWithChange(nonCancelled, 'date', arr => sum(arr.map(o => o.amount)));
  const orderStat = statWithChange(state.orders, 'date', arr => arr.length);

  const aov = revenue.value / (orderStat.value || 1);
  const ordersLast30 = ordersInLast(30).filter(o => o.status !== 'Cancelled');
  const ordersPrev30 = state.orders.filter(o => o.date > isoDaysAgo(60) && o.date <= isoDaysAgo(30) && o.status !== 'Cancelled');
  const aovLast30 = sum(ordersLast30.map(o => o.amount)) / (ordersLast30.length || 1);
  const aovPrev30 = sum(ordersPrev30.map(o => o.amount)) / (ordersPrev30.length || 1);
  const aovPct = aovPrev30 === 0 ? 0 : ((aovLast30 - aovPrev30) / aovPrev30) * 100;

  const sessionsLast30 = sessionsInLast(30);
  const sessionsPrev30 = sum(state.sessions.filter(s => s.date > isoDaysAgo(60) && s.date <= isoDaysAgo(30)).map(s => s.sessions));
  const convLast30 = sessionsLast30 ? (ordersInLast(30).length / sessionsLast30) * 100 : 0;
  const convPrev30Orders = state.orders.filter(o => o.date > isoDaysAgo(60) && o.date <= isoDaysAgo(30)).length;
  const convPrev30 = sessionsPrev30 ? (convPrev30Orders / sessionsPrev30) * 100 : 0;
  const convPct = convPrev30 === 0 ? 0 : ((convLast30 - convPrev30) / convPrev30) * 100;

  const cards = [
    { label: 'Revenue', value: formatCurrency(revenue.value), pct: revenue.pct },
    { label: 'Orders', value: orderStat.value.toLocaleString('en-US'), pct: orderStat.pct },
    { label: 'Avg. Order Value', value: formatCurrency(aov), pct: aovPct },
    { label: 'Conversion Rate', value: convLast30.toFixed(1) + '%', pct: convPct }
  ];

  document.getElementById('analyticsStatGrid').innerHTML = cards.map(c => `
    <div class="stat-card">
      <div class="stat-label">${c.label}</div>
      <div class="stat-value">${c.value}</div>
      ${changeBadgeHtml(c.pct)}
    </div>
  `).join('');

  const bestSellers = aggregateBestSellers().slice(0, 8);
  document.querySelector('#bestSellersTable tbody').innerHTML = bestSellers.map((p, i) => `
    <tr>
      <td class="cell-muted">${i + 1}</td>
      <td class="cell-primary">${escapeHtml(p.name)}</td>
      <td class="cell-muted">${escapeHtml(p.category)}</td>
      <td>${p.units}</td>
      <td>${formatCurrency(p.revenue)}</td>
    </tr>
  `).join('');
}

/* ---------------------------------------------------------
   5f. RENDER — SETTINGS
   --------------------------------------------------------- */
function renderSettings() {
  document.getElementById('setStoreName').value = state.settings.storeName;
  document.getElementById('setEmail').value = state.settings.email;
  document.getElementById('setCurrency').value = state.settings.currency;
  document.getElementById('setLowStock').value = state.settings.lowStockThreshold;
  document.getElementById('setAddress').value = state.settings.address;
}

/* ---------------------------------------------------------
   6. MODALS
   --------------------------------------------------------- */
function showOverlay(id) { document.getElementById(id).classList.add('show'); }
function hideOverlay(id) { document.getElementById(id).classList.remove('show'); }

function openProductModal(mode, productId) {
  const form = document.getElementById('productForm');
  form.reset();
  document.querySelectorAll('#sizePicker input').forEach(cb => (cb.checked = false));

  if (mode === 'edit') {
    const p = state.products.find(x => x.id === productId);
    if (!p) return;
    document.getElementById('productModalTitle').textContent = 'Edit product';
    document.getElementById('productFormSubmit').textContent = 'Save changes';
    document.getElementById('productId').value = p.id;
    document.getElementById('pfName').value = p.name;
    document.getElementById('pfCategory').value = p.category;
    document.getElementById('pfPrice').value = p.price;
    document.getElementById('pfStock').value = p.stock;
    document.getElementById('pfImage').value = p.image || '';
    document.getElementById('pfDescription').value = p.description || '';
    document.querySelectorAll('#sizePicker input').forEach(cb => {
      cb.checked = p.sizes.includes(cb.value);
    });
  } else {
    document.getElementById('productModalTitle').textContent = 'Add product';
    document.getElementById('productFormSubmit').textContent = 'Add product';
    document.getElementById('productId').value = '';
  }
  showOverlay('productModalOverlay');
  document.getElementById('pfName').focus();
}

function closeProductModal() { hideOverlay('productModalOverlay'); }

function handleProductFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('productId').value;
  const sizes = Array.from(document.querySelectorAll('#sizePicker input:checked')).map(cb => cb.value);

  const data = {
    name: document.getElementById('pfName').value.trim(),
    category: document.getElementById('pfCategory').value,
    price: parseFloat(document.getElementById('pfPrice').value) || 0,
    stock: parseInt(document.getElementById('pfStock').value, 10) || 0,
    image: document.getElementById('pfImage').value.trim(),
    description: document.getElementById('pfDescription').value.trim(),
    sizes: sizes
  };

  if (!data.name) { toast('Please give the product a name.', 'error'); return; }

  if (id) {
    const product = state.products.find(p => p.id === id);
    Object.assign(product, data);
    toast('Product updated.');
  } else {
    state.products.push(Object.assign({ id: 'p_' + Date.now().toString(36), dateAdded: isoDaysAgo(0) }, data));
    toast('Product added.');
  }

  saveProducts();
  closeProductModal();
  renderProducts();
  if (document.getElementById('view-dashboard').classList.contains('active')) renderDashboardStats();
}

function deleteProduct(id) {
  const p = state.products.find(x => x.id === id);
  if (!p) return;
  openConfirm(`Delete "${p.name}" from the catalogue? This can't be undone.`, () => {
    state.products = state.products.filter(x => x.id !== id);
    saveProducts();
    renderProducts();
    if (document.getElementById('view-dashboard').classList.contains('active')) renderDashboardStats();
    toast('Product deleted.');
  }, { title: 'Delete product' });
}

function openCustomerModal(id) {
  const c = state.customers.find(x => x.id === id);
  if (!c) return;
  const recentOrders = state.orders.filter(o => o.customer === c.name).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  document.getElementById('customerModalBody').innerHTML = `
    <div class="cust-detail-head">
      <span class="avatar">${escapeHtml(initials(c.name))}</span>
      <div>
        <h3>${escapeHtml(c.name)}</h3>
        <p>${escapeHtml(c.email)}</p>
      </div>
    </div>
    <div class="cust-stats">
      <div><strong>${c.orders}</strong><span>Orders</span></div>
      <div><strong>${formatCurrency(c.totalSpent)}</strong><span>Total spent</span></div>
      <div><strong>${c.status}</strong><span>Status</span></div>
    </div>
    <h3>Recent orders</h3>
    <div class="table-wrap">
      <table class="data-table">
        <thead><tr><th>Order</th><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          ${recentOrders.map(o => `
            <tr>
              <td class="cell-primary">${escapeHtml(o.id)}</td>
              <td class="cell-muted">${escapeHtml(o.product)}</td>
              <td>${formatCurrency(o.amount)}</td>
              <td><span class="badge ${statusBadgeClass(o.status)}">${o.status}</span></td>
            </tr>
          `).join('') || '<tr><td colspan="4" class="cell-muted">No orders yet.</td></tr>'}
        </tbody>
      </table>
    </div>
  `;
  showOverlay('customerModalOverlay');
}

function openConfirm(message, onAccept, opts = {}) {
  document.getElementById('confirmTitle').textContent = opts.title || 'Are you sure?';
  document.getElementById('confirmMessage').textContent = message;
  confirmCallback = onAccept;
  showOverlay('confirmModalOverlay');
}

/* ---------------------------------------------------------
   7. SEARCH, FILTERS, NOTIFICATIONS, POPOVERS
   --------------------------------------------------------- */
function toast(message, type = 'success') {
  const el = document.createElement('div');
  el.className = 'toast' + (type === 'error' ? ' error' : '');
  const icon = type === 'error'
    ? '<svg class="toast-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M10 6v5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="10" cy="13.5" r="0.9" fill="currentColor"/></svg>'
    : '<svg class="toast-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M6.5 10.2 8.8 12.5 13.5 7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  el.innerHTML = icon + `<span>${escapeHtml(message)}</span>`;
  document.getElementById('toastStack').appendChild(el);
  setTimeout(() => {
    el.style.transition = 'opacity .25s ease, transform .25s ease';
    el.style.opacity = '0';
    el.style.transform = 'translateX(16px)';
    setTimeout(() => el.remove(), 260);
  }, 3200);
}

function renderNotifications() {
  const items = [];
  state.products
    .filter(p => p.stock > 0 && p.stock <= (state.settings.lowStockThreshold || 8))
    .slice(0, 2)
    .forEach(p => items.push({ title: `${p.name} is low on stock`, sub: `${p.stock} units remaining` }));

  const outOfStock = state.products.filter(p => p.stock === 0).length;
  if (outOfStock > 0) items.push({ title: `${outOfStock} product${outOfStock > 1 ? 's are' : ' is'} out of stock`, sub: 'Restock to keep selling' });

  const pending = state.orders.filter(o => o.status === 'Pending').length;
  if (pending > 0) items.push({ title: `${pending} order${pending > 1 ? 's' : ''} awaiting confirmation`, sub: 'Review pending orders' });

  const newest = [...state.customers].sort((a, b) => b.registeredDate.localeCompare(a.registeredDate))[0];
  if (newest) items.push({ title: `${newest.name} joined Qumash`, sub: formatDate(newest.registeredDate) });

  const list = items.slice(0, 5);
  document.getElementById('notifList').innerHTML = list.length
    ? list.map(n => `
        <div class="notif-item">
          <span class="notif-dot"></span>
          <div class="notif-text"><strong>${escapeHtml(n.title)}</strong><span>${escapeHtml(n.sub)}</span></div>
        </div>
      `).join('')
    : '<div class="notif-item"><div class="notif-text"><strong>You\u2019re all caught up</strong><span>No new notifications</span></div></div>';

  const countEl = document.getElementById('notifCount');
  countEl.textContent = list.length ? String(list.length) : '';
  countEl.dataset.zero = list.length ? 'false' : 'true';
}

function runGlobalSearch(query) {
  const q = query.trim().toLowerCase();
  const box = document.getElementById('searchResults');
  if (!q) { box.classList.remove('show'); box.innerHTML = ''; return; }

  const results = [];
  state.products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 3).forEach(p =>
    results.push({ type: 'Product', title: p.name, sub: p.category, view: 'products', term: p.name }));
  state.orders.filter(o => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)).slice(0, 3).forEach(o =>
    results.push({ type: 'Order', title: o.id, sub: o.customer, view: 'orders', term: o.id }));
  state.customers.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)).slice(0, 3).forEach(c =>
    results.push({ type: 'Customer', title: c.name, sub: c.email, view: 'customers', term: c.name }));

  box.innerHTML = results.length
    ? results.slice(0, 7).map(r => `
        <div class="sr-item" data-view="${r.view}" data-term="${escapeHtml(r.term)}">
          <span class="sr-tag">${r.type}</span>
          <span><span class="sr-title">${escapeHtml(r.title)}</span><br><span class="sr-sub">${escapeHtml(r.sub)}</span></span>
        </div>
      `).join('')
    : '<div class="sr-empty">No matches found.</div>';
  box.classList.add('show');
}

function closeAllPopovers() {
  document.querySelectorAll('.popover.show').forEach(p => p.classList.remove('show'));
  document.getElementById('searchResults').classList.remove('show');
}

/* ---------------------------------------------------------
   8. NAVIGATION & INIT
   --------------------------------------------------------- */
function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const target = document.getElementById('view-' + view);
  if (!target) return;
  target.classList.add('active');
  document.querySelectorAll('.nav-link[data-view]').forEach(l => l.classList.toggle('active', l.dataset.view === view));
  closeMobileSidebar();
  closeAllPopovers();

  if (view === 'dashboard') { renderDashboard(); requestAnimationFrame(drawSalesChart); }
  if (view === 'products') renderProducts();
  if (view === 'orders') renderOrders();
  if (view === 'customers') renderCustomers();
  if (view === 'analytics') { renderAnalytics(); requestAnimationFrame(drawAnalyticsCharts); }
  if (view === 'settings') renderSettings();

  window.scrollTo(0, 0);
}

function openMobileSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarScrim').classList.add('show');
}
function closeMobileSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarScrim').classList.remove('show');
}

function populateSelects() {
  const categoryFilter = document.getElementById('categoryFilter');
  const pfCategory = document.getElementById('pfCategory');
  CATEGORIES.forEach(cat => {
    categoryFilter.insertAdjacentHTML('beforeend', `<option value="${cat}">${cat}</option>`);
    pfCategory.insertAdjacentHTML('beforeend', `<option value="${cat}">${cat}</option>`);
  });
}

function setTodayDate() {
  document.getElementById('todayDate').textContent = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'short', day: 'numeric', year: 'numeric'
  });
}

function attachEventListeners() {
  // Sidebar navigation (works for sidebar links, "view all" links, popover items)
  document.body.addEventListener('click', e => {
    const navEl = e.target.closest('[data-view]');
    if (navEl) {
      e.preventDefault();
      switchView(navEl.dataset.view);
    }
  });

  document.getElementById('menuBtn').addEventListener('click', openMobileSidebar);
  document.getElementById('sidebarClose').addEventListener('click', closeMobileSidebar);
  document.getElementById('sidebarScrim').addEventListener('click', closeMobileSidebar);

  // Logout
  function handleLogout(e) {
    e.preventDefault();
    openConfirm('You will be signed out of the Qumash admin panel.', () => {
      toast('You have been logged out.');
      setTimeout(() => window.location.reload(), 900);
    }, { title: 'Log out?' });
  }
  document.getElementById('logoutLink').addEventListener('click', handleLogout);
  document.getElementById('logoutLink2').addEventListener('click', handleLogout);

  // Popovers
  document.getElementById('notifBtn').addEventListener('click', e => {
    e.stopPropagation();
    const panel = document.getElementById('notifPanel');
    const willShow = !panel.classList.contains('show');
    closeAllPopovers();
    if (willShow) panel.classList.add('show');
  });
  document.getElementById('profileBtn').addEventListener('click', e => {
    e.stopPropagation();
    const panel = document.getElementById('profilePanel');
    const willShow = !panel.classList.contains('show');
    closeAllPopovers();
    if (willShow) panel.classList.add('show');
  });
  document.addEventListener('click', closeAllPopovers);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAllPopovers(); closeAllModals(); } });

  // Global search
  const searchInput = document.getElementById('globalSearch');
  searchInput.addEventListener('input', debounce(e => runGlobalSearch(e.target.value), 150));
  searchInput.addEventListener('click', e => e.stopPropagation());
  document.getElementById('searchResults').addEventListener('click', e => {
    const item = e.target.closest('.sr-item');
    if (!item) return;
    switchView(item.dataset.view);
    const fieldMap = { products: 'productSearch', orders: 'orderSearch', customers: 'customerSearch' };
    const field = document.getElementById(fieldMap[item.dataset.view]);
    if (field) { field.value = item.dataset.term; field.dispatchEvent(new Event('input')); }
    searchInput.value = '';
    closeAllPopovers();
  });

  // Sales chart range toggle
  document.getElementById('chartRange').addEventListener('click', e => {
    const btn = e.target.closest('.seg-btn');
    if (!btn) return;
    document.querySelectorAll('#chartRange .seg-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentChartRange = btn.dataset.range;
    drawSalesChart();
  });

  // Products: toolbar + add + table actions
  document.getElementById('productSearch').addEventListener('input', debounce(renderProducts, 150));
  document.getElementById('categoryFilter').addEventListener('change', renderProducts);
  document.getElementById('stockFilter').addEventListener('change', renderProducts);
  document.getElementById('addProductBtn').addEventListener('click', () => openProductModal('add'));
  document.querySelector('#productsTable tbody').addEventListener('click', e => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;
    const id = btn.closest('tr').dataset.id;
    if (btn.dataset.action === 'edit') openProductModal('edit', id);
    if (btn.dataset.action === 'delete') deleteProduct(id);
  });

  // Orders toolbar
  document.getElementById('orderSearch').addEventListener('input', debounce(renderOrders, 150));
  document.getElementById('orderStatusFilter').addEventListener('change', renderOrders);

  // Customers toolbar + table actions
  document.getElementById('customerSearch').addEventListener('input', debounce(renderCustomers, 150));
  document.getElementById('customerStatusFilter').addEventListener('change', renderCustomers);
  document.querySelector('#customersTable tbody').addEventListener('click', e => {
    const btn = e.target.closest('button[data-action="view"]');
    if (!btn) return;
    openCustomerModal(btn.closest('tr').dataset.id);
  });

  // Product modal
  document.getElementById('productForm').addEventListener('submit', handleProductFormSubmit);
  document.getElementById('productModalClose').addEventListener('click', closeProductModal);
  document.getElementById('productModalCancel').addEventListener('click', closeProductModal);
  document.getElementById('productModalOverlay').addEventListener('click', e => {
    if (e.target.id === 'productModalOverlay') closeProductModal();
  });

  // Customer modal
  document.getElementById('customerModalClose').addEventListener('click', () => hideOverlay('customerModalOverlay'));
  document.getElementById('customerModalOverlay').addEventListener('click', e => {
    if (e.target.id === 'customerModalOverlay') hideOverlay('customerModalOverlay');
  });

  // Confirm modal
  document.getElementById('confirmAccept').addEventListener('click', () => {
    if (confirmCallback) confirmCallback();
    confirmCallback = null;
    hideOverlay('confirmModalOverlay');
  });
  document.getElementById('confirmCancel').addEventListener('click', () => {
    confirmCallback = null;
    hideOverlay('confirmModalOverlay');
  });
  document.getElementById('confirmModalOverlay').addEventListener('click', e => {
    if (e.target.id === 'confirmModalOverlay') { confirmCallback = null; hideOverlay('confirmModalOverlay'); }
  });

  // Settings form
  document.getElementById('settingsForm').addEventListener('submit', e => {
    e.preventDefault();
    state.settings.storeName = document.getElementById('setStoreName').value.trim();
    state.settings.email = document.getElementById('setEmail').value.trim();
    state.settings.currency = document.getElementById('setCurrency').value;
    state.settings.lowStockThreshold = parseInt(document.getElementById('setLowStock').value, 10) || 8;
    state.settings.address = document.getElementById('setAddress').value.trim();
    saveSettings();
    toast('Settings saved.');
    renderProducts();
  });

  // Responsive chart redraw
  window.addEventListener('resize', debounce(() => { drawSalesChart(); drawAnalyticsCharts(); }, 150));
}

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
}

function init() {
  loadState();
  populateSelects();
  setTodayDate();
  renderNotifications();
  attachEventListeners();
  switchView('dashboard');
}

document.addEventListener('DOMContentLoaded', init);
