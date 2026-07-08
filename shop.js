(function (root, factory) {
  const core = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = core;
  }

  root.ShopCore = core;
})(typeof globalThis !== "undefined" ? globalThis : window, function () {
  const products = [
    {
      id: "chicken-strips",
      name: "原切鸡胸肉条",
      category: "chicken",
      categoryLabel: "鸡肉",
      price: 58,
      spec: "80g / 袋",
      badge: "低脂高蛋白",
      summary: "慢烘锁鲜，肉丝纤维清晰，适合日常奖励。",
      ingredients: "鸡胸肉、少量南瓜粉、迷迭香提取物",
      suitable: "成犬、成猫；幼宠请掰小后喂食",
      petTypes: ["cat", "dog"],
      hotScore: 96,
      imagePosition: "25% 35%",
    },
    {
      id: "chicken-soft-bites",
      name: "鸡肉软粒训练赏",
      category: "chicken",
      categoryLabel: "鸡肉",
      price: 46,
      spec: "120g / 罐",
      badge: "易掰小粒",
      summary: "软糯小颗粒，训练时不掉渣，出门携带方便。",
      ingredients: "鸡肉、鸡肝、燕麦、胡萝卜粉",
      suitable: "犬猫通用；适合训练和互动奖励",
      petTypes: ["cat", "dog"],
      hotScore: 82,
      imagePosition: "72% 34%",
    },
    {
      id: "salmon-freeze-dried",
      name: "三文鱼冻干方块",
      category: "freeze",
      categoryLabel: "冻干",
      price: 89,
      spec: "60g / 袋",
      badge: "拌粮友好",
      summary: "真空冻干保留香气，可直接喂食或温水复水。",
      ingredients: "三文鱼、鳕鱼、蛋黄粉",
      suitable: "挑食猫咪、小型犬、需要增加饮水的宠物",
      petTypes: ["cat", "dog"],
      hotScore: 99,
      imagePosition: "27% 72%",
    },
    {
      id: "duck-freeze-dried",
      name: "鸭肉梨冻干小方",
      category: "freeze",
      categoryLabel: "冻干",
      price: 76,
      spec: "70g / 袋",
      badge: "清爽配方",
      summary: "鸭肉与梨粉搭配，香味温和，适合换季尝鲜。",
      ingredients: "鸭胸肉、梨粉、益生元",
      suitable: "犬猫通用；肠胃敏感宠物少量试喂",
      petTypes: ["cat", "dog"],
      hotScore: 88,
      imagePosition: "72% 72%",
    },
    {
      id: "dental-chews",
      name: "草本洁齿棒",
      category: "dental",
      categoryLabel: "洁齿",
      price: 52,
      spec: "12支 / 盒",
      badge: "饭后护理",
      summary: "韧性咀嚼纹理帮助摩擦牙面，日常口气管理更轻松。",
      ingredients: "豌豆纤维、鸡肉粉、薄荷叶粉、欧芹粉",
      suitable: "中小型犬；不建议猫咪整支喂食",
      petTypes: ["dog"],
      hotScore: 74,
      imagePosition: "48% 30%",
    },
    {
      id: "training-bites",
      name: "莓果牛肉训练粒",
      category: "training",
      categoryLabel: "训练奖励",
      price: 39,
      spec: "100g / 袋",
      badge: "高频奖励",
      summary: "小颗粒低负担，适合召回、握手、等待等训练场景。",
      ingredients: "牛肉、蓝莓粉、红薯、奇亚籽",
      suitable: "成犬；猫咪可少量尝鲜",
      petTypes: ["cat", "dog"],
      hotScore: 91,
      imagePosition: "50% 78%",
    },
  ];

  function matchesPetType(product, petType) {
    return petType === "all" || product.petTypes.includes(petType);
  }

  function matchesFoodCategory(product, foodCategory) {
    return foodCategory === "all" || product.category === foodCategory;
  }

  function filterProducts(sourceProducts, petType, foodCategory) {
    return sourceProducts.filter(
      (product) =>
        matchesPetType(product, petType) && matchesFoodCategory(product, foodCategory),
    );
  }

  function getAvailableFoodCategories(sourceProducts, petType) {
    const categories = sourceProducts
      .filter((product) => matchesPetType(product, petType))
      .map((product) => product.category);

    return ["all", ...new Set(categories)];
  }

  function normalizeFoodCategory(sourceProducts, petType, foodCategory) {
    const availableCategories = getAvailableFoodCategories(sourceProducts, petType);
    return availableCategories.includes(foodCategory) ? foodCategory : "all";
  }

  function getHotProducts(_sourceProducts, limit = 3) {
    return [...products]
      .sort((firstProduct, secondProduct) => secondProduct.hotScore - firstProduct.hotScore)
      .slice(0, limit);
  }

  function addToCart(cart, productId, quantity) {
    const amount = Math.max(1, Number(quantity) || 1);
    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem) {
      return cart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + amount }
          : item,
      );
    }

    return [...cart, { productId, quantity: amount }];
  }

  function updateCartQuantity(cart, productId, quantity) {
    const amount = Number(quantity);

    if (amount <= 0) {
      return removeFromCart(cart, productId);
    }

    return cart.map((item) =>
      item.productId === productId ? { ...item, quantity: amount } : item,
    );
  }

  function removeFromCart(cart, productId) {
    return cart.filter((item) => item.productId !== productId);
  }

  function getCartItems(cart, sourceProducts) {
    return cart
      .map((item) => {
        const product = sourceProducts.find((entry) => entry.id === item.productId);
        if (!product) return null;

        return {
          ...item,
          product,
          subtotal: product.price * item.quantity,
        };
      })
      .filter(Boolean);
  }

  function getCartTotal(cart, sourceProducts) {
    return getCartItems(cart, sourceProducts).reduce(
      (total, item) => total + item.subtotal,
      0,
    );
  }

  function checkout(cart) {
    if (!cart.length) {
      return {
        ok: false,
        message: "购物车还是空的，请先选择想带回家的零食。",
        cart,
      };
    }

    return {
      ok: true,
      message: "订单已模拟提交成功，我们已为毛孩子留好这一份小确幸。",
      cart: [],
    };
  }

  return {
    products,
    filterProducts,
    getAvailableFoodCategories,
    normalizeFoodCategory,
    getHotProducts,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    getCartItems,
    getCartTotal,
    checkout,
  };
});
