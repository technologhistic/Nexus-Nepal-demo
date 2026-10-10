import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order } from '../types';
import { useAuth } from './AuthContext';

interface CartContextType {
  items: CartItem[];
  wishlist: string[];
  isCartOpen: boolean;
  couponCode: string;
  discountAmount: number;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  applyCoupon: (code: string) => { success: boolean; message: string };
  subtotal: number;
  shippingFee: number;
  total: number;
  itemCount: number;
  placeOrder: (shippingAddress: Order['shippingAddress'], paymentMethod: Order['paymentMethod']) => Order;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  useEffect(() => {
    localStorage.setItem('nexus_cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('nexus_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const addToCart = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setDiscountAmount(0);
    setCouponCode('');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NEPAL10') {
      const disc = Math.round(subtotal * 0.1);
      setDiscountAmount(disc);
      setCouponCode(clean);
      return { success: true, message: 'Namaste! 10% Nepal store discount applied.' };
    }
    if (clean === 'NEXUS500' && subtotal >= 3000) {
      setDiscountAmount(500);
      setCouponCode(clean);
      return { success: true, message: 'Rs. 500 gift voucher applied!' };
    }
    return { success: false, message: 'Invalid promo code. Try NEPAL10' };
  };

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 4000 || subtotal === 0 ? 0 : 120; // Free delivery over NPR 4000 in Nepal
  const total = Math.max(0, subtotal - discountAmount + shippingFee);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const placeOrder = (
    shippingAddress: Order['shippingAddress'],
    paymentMethod: Order['paymentMethod']
  ): Order => {
    const newOrder: Order = {
      id: `NX-NP-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      items: [...items],
      subtotal,
      shipping: shippingFee,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'Processing',
      shippingAddress
    };

    if (user) {
      user.orders = [newOrder, ...(user.orders || [])];
      localStorage.setItem('nexus_user', JSON.stringify(user));
    }

    clearCart();
    return newOrder;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        wishlist,
        isCartOpen,
        couponCode,
        discountAmount,
        openCart,
        closeCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        subtotal,
        shippingFee,
        total,
        itemCount,
        placeOrder
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
