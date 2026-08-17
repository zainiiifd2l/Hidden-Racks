/**
 * Hidden_Rack - Cart & Wishlist Management Engine
 */

class CartStore {
  static getCart() {
    const data = localStorage.getItem("hr_cart");
    return data ? JSON.parse(data) : [];
  }

  static saveCart(cart) {
    localStorage.setItem("hr_cart", JSON.stringify(cart));
    this.updateBadges();
  }

  static addItem(productId, size = "EU 42", quantity = 1) {
    const product = window.ProductStore.getProductById(productId);
    if (!product) return false;

    let cart = this.getCart();
    const existingIndex = cart.findIndex(item => item.id === productId && item.selectedSize === size);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0],
        condition: product.condition,
        selectedSize: size,
        quantity: quantity
      });
    }

    this.saveCart(cart);
    window.showToast?.(`Added "${product.name}" (${size}) to your Cart`, "success");
    return true;
  }

  static updateQuantity(productId, size, newQty) {
    let cart = this.getCart();
    if (newQty <= 0) {
      cart = cart.filter(item => !(item.id === productId && item.selectedSize === size));
    } else {
      const item = cart.find(item => item.id === productId && item.selectedSize === size);
      if (item) item.quantity = newQty;
    }
    this.saveCart(cart);
  }

  static removeItem(productId, size) {
    let cart = this.getCart();
    cart = cart.filter(item => !(item.id === productId && item.selectedSize === size));
    this.saveCart(cart);
    window.showToast?.("Item removed from cart", "info");
  }

  static clearCart() {
    localStorage.removeItem("hr_cart");
    this.updateBadges();
  }

  static getSubtotal() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  static getAppliedCoupon() {
    const data = localStorage.getItem("hr_coupon");
    return data ? JSON.parse(data) : null;
  }

  static applyCoupon(code) {
    const c = (code || "").trim().toUpperCase();
    const VALID_COUPONS = {
      "HIDDEN10": { code: "HIDDEN10", discountPercent: 10, description: "10% Off Your Order" },
      "THRIFT20": { code: "THRIFT20", discountPercent: 20, description: "20% Off Thrift Deal" },
      "FREESHIP": { code: "FREESHIP", freeShipping: true, description: "Free Delivery Across Pakistan" }
    };

    if (VALID_COUPONS[c]) {
      localStorage.setItem("hr_coupon", JSON.stringify(VALID_COUPONS[c]));
      window.showToast?.(`Coupon "${c}" applied successfully!`, "success");
      return { success: true, coupon: VALID_COUPONS[c] };
    } else {
      window.showToast?.("Invalid or expired coupon code.", "error");
      return { success: false, message: "Invalid coupon code" };
    }
  }

  static removeCoupon() {
    localStorage.removeItem("hr_coupon");
    window.showToast?.("Coupon removed", "info");
  }

  static getDiscountAmount(subtotal) {
    const coupon = this.getAppliedCoupon();
    if (!coupon || !coupon.discountPercent) return 0;
    return Math.round((subtotal * coupon.discountPercent) / 100);
  }

  static getDeliveryFee(subtotal) {
    if (subtotal === 0) return 0;
    const coupon = this.getAppliedCoupon();
    if (coupon && coupon.freeShipping) return 0;
    // Free delivery over PKR 15,000
    return subtotal >= 15000 ? 0 : 250;
  }

  static getWishlist() {
    const data = localStorage.getItem("hr_wishlist");
    return data ? JSON.parse(data) : [];
  }

  static saveWishlist(wishlist) {
    localStorage.setItem("hr_wishlist", JSON.stringify(wishlist));
    this.updateBadges();
  }

  static toggleWishlist(productId) {
    let wishlist = this.getWishlist();
    const index = wishlist.indexOf(productId);
    let added = false;
    if (index > -1) {
      wishlist.splice(index, 1);
      window.showToast?.("Removed from Wishlist", "info");
    } else {
      wishlist.push(productId);
      added = true;
      const product = window.ProductStore.getProductById(productId);
      window.showToast?.(`Saved "${product ? product.name : 'Item'}" to Wishlist`, "success");
    }
    this.saveWishlist(wishlist);
    return added;
  }

  static isInWishlist(productId) {
    const wishlist = this.getWishlist();
    return wishlist.includes(productId);
  }

  static updateBadges() {
    const cart = this.getCart();
    const wishlist = this.getWishlist();

    const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalWishlistCount = wishlist.length;

    document.querySelectorAll(".cart-count-badge").forEach(el => {
      el.textContent = totalCartCount;
      el.style.display = totalCartCount > 0 ? "inline-flex" : "none";
    });

    document.querySelectorAll(".wishlist-count-badge").forEach(el => {
      el.textContent = totalWishlistCount;
      el.style.display = totalWishlistCount > 0 ? "inline-flex" : "none";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  CartStore.updateBadges();
});

window.CartStore = CartStore;
