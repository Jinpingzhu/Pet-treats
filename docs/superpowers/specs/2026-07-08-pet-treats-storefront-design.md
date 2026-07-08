# Pet Treats Storefront Design

## Goal

Create a Chinese single-page static storefront for premium natural pet treats. The site must run by opening `index.html` directly in a browser, with no backend, login, real payment, inventory, or build step.

## Experience

The first screen presents a high-end natural brand with a hero image, core selling points, a curated product entry, and a cart entry. The visual style uses clean white space, deep ink text, sage green, warm white, and soft berry accents. The page should feel premium and natural, not cartoonish or overly beige.

## Features

- Product data lives in JavaScript and uses RMB prices.
- Product fields include name, category, price, spec, selling points, ingredients, suitable pets, and image.
- Category filters include all products, chicken, freeze-dried, dental care, and training rewards.
- Product cards open a details dialog with ingredients, suitability, spec, and add-to-cart controls.
- The cart supports adding products, repeated additions, quantity increase/decrease, item removal, empty state, and total calculation.
- Checkout is simulated on the frontend. A successful order dialog appears and the cart is cleared.
- The layout uses a single-column product flow on mobile and a multi-column grid on desktop.

## Files

- `index.html`: Static page structure and accessible dialog containers.
- `styles.css`: Responsive premium storefront styling.
- `shop.js`: Testable data helpers and cart functions.
- `script.js`: Browser event wiring and rendering.
- `assets/hero-pet-treats.png`: Generated hero image.
- `assets/product-treats-collage.png`: Generated product image source used across product cards.
- `tests/shop.test.mjs`: Node test coverage for filtering, cart math, and checkout behavior.

## Verification

Run `node --test tests/shop.test.mjs` for behavior checks. Run `node --check shop.js` and `node --check script.js` for syntax checks. Open `index.html` directly in a browser and verify desktop/mobile layout, filtering, product details, cart quantity controls, deletion, empty cart, repeated add, and simulated checkout.
