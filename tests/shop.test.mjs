import assert from "node:assert/strict";
import { test } from "node:test";
import ShopCore from "../shop.js";

test("filters products by category and keeps all products available", () => {
  assert.equal(ShopCore.filterProducts(ShopCore.products, "all").length, 6);

  const chickenItems = ShopCore.filterProducts(ShopCore.products, "chicken");

  assert.equal(chickenItems.length, 2);
  assert.ok(chickenItems.every((product) => product.category === "chicken"));
});

test("adds repeated products to cart by increasing quantity", () => {
  let cart = [];

  cart = ShopCore.addToCart(cart, "chicken-strips", 1);
  cart = ShopCore.addToCart(cart, "chicken-strips", 2);

  assert.deepEqual(cart, [{ productId: "chicken-strips", quantity: 3 }]);
});

test("decreasing quantity to zero removes item from cart", () => {
  let cart = ShopCore.addToCart([], "dental-chews", 2);

  cart = ShopCore.updateCartQuantity(cart, "dental-chews", 0);

  assert.deepEqual(cart, []);
});

test("calculates cart items and total from product data", () => {
  let cart = [];
  cart = ShopCore.addToCart(cart, "chicken-strips", 2);
  cart = ShopCore.addToCart(cart, "salmon-freeze-dried", 1);

  const items = ShopCore.getCartItems(cart, ShopCore.products);

  assert.equal(items.length, 2);
  assert.equal(items[0].subtotal, 116);
  assert.equal(ShopCore.getCartTotal(cart, ShopCore.products), 205);
});

test("checkout rejects an empty cart and clears a valid cart", () => {
  assert.deepEqual(ShopCore.checkout([]), {
    ok: false,
    message: "购物车还是空的，请先选择想带回家的零食。",
    cart: [],
  });

  const cart = ShopCore.addToCart([], "training-bites", 1);
  const result = ShopCore.checkout(cart);

  assert.equal(result.ok, true);
  assert.equal(result.message, "订单已模拟提交成功，我们已为毛孩子留好这一份小确幸。");
  assert.deepEqual(result.cart, []);
});
