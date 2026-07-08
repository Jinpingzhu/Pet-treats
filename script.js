(function () {
  const {
    products,
    filterProducts,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartItems,
    getCartTotal,
    checkout,
  } = window.ShopCore;

  const productGrid = document.querySelector("[data-product-grid]");
  const cartPanel = document.querySelector("[data-cart-panel]");
  const overlay = document.querySelector("[data-overlay]");
  const cartItemsNode = document.querySelector("[data-cart-items]");
  const cartTotalNode = document.querySelector("[data-cart-total]");
  const cartCountNodes = document.querySelectorAll("[data-cart-count]");
  const productDialog = document.querySelector("[data-product-dialog]");
  const productDialogContent = document.querySelector("[data-product-dialog-content]");
  const successDialog = document.querySelector("[data-success-dialog]");
  const successMessage = document.querySelector("[data-success-message]");

  let activeCategory = "all";
  let cart = [];

  function formatPrice(value) {
    return `¥${value}`;
  }

  function renderProducts() {
    const visibleProducts = filterProducts(products, activeCategory);

    productGrid.innerHTML = visibleProducts
      .map(
        (product) => `
          <article class="product-card">
            <div class="product-image" style="background-position: ${product.imagePosition}" role="img" aria-label="${product.name} 商品图"></div>
            <div class="product-body">
              <div class="product-topline">
                <span class="badge">${product.categoryLabel}</span>
                <span class="price">${formatPrice(product.price)}</span>
              </div>
              <h3>${product.name}</h3>
              <p>${product.summary}</p>
              <div class="product-actions">
                <button class="tiny-button" type="button" data-detail="${product.id}">详情</button>
                <button class="tiny-button dark" type="button" data-add="${product.id}">加入购物车</button>
              </div>
            </div>
          </article>
        `,
      )
      .join("");
  }

  function renderCart() {
    const items = getCartItems(cart, products);
    const total = getCartTotal(cart, products);
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountNodes.forEach((node) => {
      node.textContent = count;
    });
    cartTotalNode.textContent = formatPrice(total);

    if (!items.length) {
      cartItemsNode.innerHTML = '<div class="cart-empty">购物车空空的，先去挑一包今天的小奖励吧。</div>';
      return;
    }

    cartItemsNode.innerHTML = items
      .map(
        (item) => `
          <div class="cart-item">
            <div class="cart-item-main">
              <div>
                <h3>${item.product.name}</h3>
                <span>${item.product.spec}</span>
              </div>
              <strong>${formatPrice(item.subtotal)}</strong>
            </div>
            <div class="cart-line">
              <div class="quantity-control" aria-label="${item.product.name} 数量">
                <button type="button" data-decrease="${item.productId}" aria-label="减少数量">−</button>
                <span>${item.quantity}</span>
                <button type="button" data-increase="${item.productId}" aria-label="增加数量">+</button>
              </div>
              <button class="tiny-button" type="button" data-remove="${item.productId}">删除</button>
            </div>
          </div>
        `,
      )
      .join("");
  }

  function openCart() {
    cartPanel.classList.add("is-open");
    overlay.classList.add("is-open");
    document.body.classList.add("is-locked");
    cartPanel.setAttribute("aria-hidden", "false");
  }

  function closeCart() {
    cartPanel.classList.remove("is-open");
    overlay.classList.remove("is-open");
    document.body.classList.remove("is-locked");
    cartPanel.setAttribute("aria-hidden", "true");
  }

  function openProductDialog(productId) {
    const product = products.find((entry) => entry.id === productId);
    if (!product) return;

    productDialogContent.innerHTML = `
      <div class="dialog-layout">
        <div class="dialog-image" style="background-position: ${product.imagePosition}" role="img" aria-label="${product.name} 商品图"></div>
        <div class="dialog-copy">
          <span class="badge">${product.badge}</span>
          <h2>${product.name}</h2>
          <p>${product.summary}</p>
          <div class="dialog-meta">
            <div><strong>规格</strong>${product.spec}</div>
            <div><strong>成分</strong>${product.ingredients}</div>
            <div><strong>适合宠物</strong>${product.suitable}</div>
          </div>
          <button class="primary-button full-width" type="button" data-dialog-add="${product.id}">${formatPrice(product.price)} 加入购物车</button>
        </div>
      </div>
    `;
    productDialog.showModal();
  }

  function showSuccess(message) {
    successMessage.textContent = message;
    successDialog.showModal();
  }

  function handleAdd(productId) {
    cart = addToCart(cart, productId, 1);
    renderCart();
    openCart();
  }

  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.category;
      document
        .querySelectorAll(".filter-button")
        .forEach((entry) => entry.classList.toggle("is-active", entry === button));
      renderProducts();
    });
  });

  document.querySelectorAll(".cart-toggle").forEach((button) => {
    button.addEventListener("click", openCart);
  });

  document.querySelector(".cart-close").addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  productGrid.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-detail]");
    const addButton = event.target.closest("[data-add]");

    if (detailButton) openProductDialog(detailButton.dataset.detail);
    if (addButton) handleAdd(addButton.dataset.add);
  });

  productDialog.addEventListener("click", (event) => {
    const closeButton = event.target.closest(".dialog-close");
    const addButton = event.target.closest("[data-dialog-add]");

    if (closeButton) productDialog.close();
    if (addButton) {
      productDialog.close();
      handleAdd(addButton.dataset.dialogAdd);
    }
  });

  successDialog.addEventListener("click", (event) => {
    if (event.target.closest(".dialog-close") || event.target.closest("[data-success-ok]")) {
      successDialog.close();
    }
  });

  cartItemsNode.addEventListener("click", (event) => {
    const increase = event.target.closest("[data-increase]");
    const decrease = event.target.closest("[data-decrease]");
    const remove = event.target.closest("[data-remove]");

    if (increase) {
      const item = cart.find((entry) => entry.productId === increase.dataset.increase);
      cart = updateCartQuantity(cart, increase.dataset.increase, item.quantity + 1);
    }

    if (decrease) {
      const item = cart.find((entry) => entry.productId === decrease.dataset.decrease);
      cart = updateCartQuantity(cart, decrease.dataset.decrease, item.quantity - 1);
    }

    if (remove) {
      cart = removeFromCart(cart, remove.dataset.remove);
    }

    renderCart();
  });

  document.querySelector("[data-checkout]").addEventListener("click", () => {
    const result = checkout(cart);
    cart = result.cart;
    renderCart();

    if (result.ok) {
      closeCart();
      showSuccess(result.message);
    } else {
      showSuccess(result.message);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCart();
  });

  renderProducts();
  renderCart();
})();
