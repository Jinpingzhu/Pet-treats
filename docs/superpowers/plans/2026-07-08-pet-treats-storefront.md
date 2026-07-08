# Pet Treats Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a direct-open Chinese static pet treats storefront with product browsing, details, cart management, and simulated checkout.

**Architecture:** Use plain HTML, CSS, and JavaScript. Keep product/cart behavior in `shop.js` for testing, and keep DOM rendering plus event wiring in `script.js`.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node built-in test runner.

## Global Constraints

- The site must run by opening `index.html` directly in a browser.
- Use Chinese UI text and RMB prices.
- Do not add backend, real payment, login, inventory, or build tooling.
- Use local generated images from `assets/`.

---

### Task 1: Test Cart And Product Behavior

**Files:**
- Create: `tests/shop.test.mjs`
- Create: `shop.js`

**Interfaces:**
- Produces: `ShopCore.products`, `ShopCore.filterProducts(products, category)`, `ShopCore.addToCart(cart, productId, quantity)`, `ShopCore.updateCartQuantity(cart, productId, quantity)`, `ShopCore.removeFromCart(cart, productId)`, `ShopCore.getCartItems(cart, products)`, `ShopCore.getCartTotal(cart, products)`, `ShopCore.checkout(cart)`.

- [x] **Step 1: Write failing tests for filters, repeated cart additions, quantity removal, totals, and checkout.**
- [x] **Step 2: Run `node --test tests/shop.test.mjs` and confirm it fails because `shop.js` is missing.**
- [x] **Step 3: Implement `shop.js` with product data and pure cart helpers.**
- [x] **Step 4: Run `node --test tests/shop.test.mjs` and confirm the tests pass.**

### Task 2: Build Static Page

**Files:**
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Use: `assets/hero-pet-treats.png`
- Use: `assets/product-treats-collage.png`

**Interfaces:**
- Consumes: `window.ShopCore` from `shop.js`.

- [ ] **Step 1: Create the page shell with hero, filters, product grid, cart drawer, product dialog, and success dialog.**
- [ ] **Step 2: Style the storefront for desktop and mobile with stable card, button, cart, and dialog sizing.**
- [ ] **Step 3: Wire rendering, filtering, details dialog, cart controls, and checkout in `script.js`.**
- [ ] **Step 4: Run syntax checks and browser smoke checks.**

### Task 3: Final Verification

**Files:**
- Verify: `index.html`
- Verify: `styles.css`
- Verify: `script.js`
- Verify: `shop.js`
- Verify: `tests/shop.test.mjs`

- [ ] **Step 1: Run `node --test tests/shop.test.mjs`.**
- [ ] **Step 2: Run `node --check shop.js` and `node --check script.js`.**
- [ ] **Step 3: Open the site locally and verify core interactions.**
