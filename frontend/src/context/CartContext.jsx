import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("hr_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("hr_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem("hr_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("hr_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const addToCart = (product, selectedSize = "EU 42", quantity = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id && i.selectedSize === selectedSize);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          condition: product.condition,
          selectedSize,
          quantity
        }];
      }
    });
    showToast(`Added "${product.name}" (${selectedSize}) to Cart`, "success");
  };

  const updateQuantity = (id, selectedSize, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id, selectedSize);
    } else {
      setCart(prev => prev.map(item => 
        (item.id === id && item.selectedSize === selectedSize) ? { ...item, quantity: newQty } : item
      ));
    }
  };

  const removeFromCart = (id, selectedSize) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedSize === selectedSize)));
    showToast("Item removed from cart", "info");
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      if (prev.includes(productId)) {
        showToast("Removed from Wishlist", "info");
        return prev.filter(id => id !== productId);
      } else {
        showToast("Saved to Wishlist", "success");
        return [...prev, productId];
      }
    });
  };

  const cartSubtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const deliveryFee = cartSubtotal >= 15000 || cartSubtotal === 0 ? 0 : 250;
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart, wishlist, addToCart, updateQuantity, removeFromCart, clearCart,
      toggleWishlist, isInWishlist: (id) => wishlist.includes(id),
      cartSubtotal, deliveryFee, cartCount, toast, showToast
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
