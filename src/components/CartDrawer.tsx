import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, Tag, Truck, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onProceedToCheckout }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    discountAmount,
    total,
    applyCoupon,
    couponCode
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; error?: boolean } | null>(null);

  if (!isCartOpen) return null;

  const handleCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback({ msg: res.message, error: !res.success });
  };

  const freeShippingThreshold = 4000;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-md bg-[#FBF6E8] h-full shadow-2xl flex flex-col border-l border-[#3B4A1F]/20 animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 bg-[#3B4A1F] text-[#F5EEDC] flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#B8F235]" />
            <h2 className="font-serif font-bold text-lg">Your Cart</h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-[#556B2F] font-bold text-[#D6FF6A]">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-md hover:bg-white/10 text-[#F5EEDC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="px-5 py-3 bg-white/70 border-b border-[#3B4A1F]/10">
          <div className="flex items-center justify-between text-xs text-[#232D0F] font-medium mb-1.5">
            <div className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#556B2F]" />
              <span>
                {remainingForFree === 0
                  ? 'Free express delivery qualified across Nepal.'
                  : `Add Rs. ${remainingForFree.toLocaleString()} more for free delivery`}
              </span>
            </div>
            <span className="font-bold text-[#556B2F]">
              {Math.round(freeShippingProgress)}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#3B4A1F]/10 rounded-sm overflow-hidden">
            <div
              className="h-full bg-[#556B2F] transition-all duration-300"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#5C6678]">
              <div className="w-14 h-14 rounded-md bg-[#3B4A1F]/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-[#556B2F]" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#232D0F]">Your cart is empty</h3>
              <p className="text-xs mt-1 max-w-[240px]">
                Explore authentic artisan crafts, organic Ilam teas, and mountain gear.
              </p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl p-3 border border-[#3B4A1F]/15 flex gap-3 shadow-xs"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-20 h-20 rounded-xl object-cover bg-[#F5EEDC] shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-[#14161A] line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-[#556B2F] font-medium">
                      {product.origin}
                    </p>
                    <div className="text-xs font-extrabold text-[#232D0F] mt-1">
                      Rs. {(product.price * quantity).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center border border-[#3B4A1F]/20 rounded-lg bg-gray-50 p-0.5">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1 hover:bg-white rounded text-black transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1 hover:bg-white rounded text-black transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1 text-[#5C6678] hover:text-[#B3341F] transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with totals & action */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 bg-white border-t border-[#3B4A1F]/15 space-y-3">
            {/* Promo Code input */}
            <form onSubmit={handleCouponSubmit} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputCoupon}
                  onChange={(e) => setInputCoupon(e.target.value)}
                  placeholder="Promo code (e.g. NEPAL10)"
                  className="w-full text-xs uppercase bg-[#FBF6E8] border border-[#3B4A1F]/20 rounded-xl py-2 pl-8 pr-3 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                />
                <Tag className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#5C6678]" />
              </div>
              <button
                type="submit"
                className="px-3 py-2 bg-[#556B2F] hover:bg-[#3B4A1F] text-[#F5EEDC] text-xs font-bold rounded-xl transition-colors"
              >
                Apply
              </button>
            </form>

            {couponFeedback && (
              <p
                className={`text-[11px] font-medium ${
                  couponFeedback.error ? 'text-[#B3341F]' : 'text-emerald-700'
                }`}
              >
                {couponFeedback.msg}
              </p>
            )}

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-[#5C6678] pt-1 border-t border-[#3B4A1F]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-[#14161A]">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({couponCode})</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping within Nepal</span>
                <span className="font-medium text-[#14161A]">
                  {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#232D0F] pt-2 border-t border-[#3B4A1F]/10">
                <span>Total Amount</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                closeCart();
                onProceedToCheckout();
              }}
              className="w-full h-11 rounded-md bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] font-semibold text-sm flex items-center justify-between px-5 shadow-xs transition-colors active:scale-[0.99]"
            >
              <span>Proceed to Checkout</span>
              <div className="flex items-center gap-2">
                <span className="text-[#B8F235]">Rs. {total.toLocaleString()}</span>
                <ArrowRight className="w-4 h-4 text-[#B8F235]" />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
