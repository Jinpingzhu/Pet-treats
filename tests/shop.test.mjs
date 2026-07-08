import assert from "node:assert/strict";
import { test } from "node:test";
import ShopCore from "../shop.js";

test("filters all pets and all food to keep every product visible by default", () => {
  assert.equal(ShopCore.filterProducts(ShopCore.products, "all", "all").length, 6);
});

test("filters cat products without showing dog-only products", () => {
  const catItems = ShopCore.filterProducts(ShopCore.products, "cat", "all");

  assert.equal(catItems.length, 5);
  assert.ok(catItems.every((product) => product.petTypes.includes("cat")));
  assert.equal(catItems.some((product) => product.id === "dental-chews"), false);
});

test("filters dog products and includes every dog-edible product", () => {
  const dogItems = ShopCore.filterProducts(ShopCore.products, "dog", "all");

  assert.equal(dogItems.length, 6);
  assert.ok(dogItems.every((product) => product.petTypes.includes("dog")));
});

test("combines pet and food category filters", () => {
  const catTrainingItems = ShopCore.filterProducts(ShopCore.products, "cat", "training");

  assert.deepEqual(
    catTrainingItems.map((product) => product.id),
    ["training-bites"],
  );
});

test("shows only available food categories for the selected pet type", () => {
  assert.deepEqual(ShopCore.getAvailableFoodCategories(ShopCore.products, "cat"), [
    "all",
    "chicken",
    "freeze",
    "training",
  ]);

  assert.deepEqual(ShopCore.getAvailableFoodCategories(ShopCore.products, "dog"), [
    "all",
    "chicken",
    "freeze",
    "dental",
    "training",
  ]);
});

test("resets unavailable food category when pet type changes", () => {
  assert.equal(
    ShopCore.normalizeFoodCategory(ShopCore.products, "cat", "dental"),
    "all",
  );
  assert.equal(
    ShopCore.normalizeFoodCategory(ShopCore.products, "dog", "dental"),
    "dental",
  );
});

test("returns fixed site-wide hot products regardless of filters", () => {
  const allHotProducts = ShopCore.getHotProducts(ShopCore.products);
  const catHotProducts = ShopCore.getHotProducts(
    ShopCore.filterProducts(ShopCore.products, "cat", "all"),
  );

  assert.deepEqual(
    allHotProducts.map((product) => product.id),
    ["salmon-freeze-dried", "chicken-strips", "training-bites"],
  );
  assert.deepEqual(
    catHotProducts.map((product) => product.id),
    ["salmon-freeze-dried", "chicken-strips", "training-bites"],
  );
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
