import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { X, MapPin, Check, Plus, Minus, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { canBuy, openAuthModal, setPendingItemToBuy } = useAuth();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    if (!canBuy) {
      if (setPendingItemToBuy) {
        setPendingItemToBuy({ product, quantity });
      }
      onClose();
      openAuthModal(`You are viewing as a visitor. Sign in as a Buyer with Google or Email to order "${product.name}".`);
      return;
    }
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl bg-white rounded-lg overflow-hidden border border-[#14161A]/15 shadow-xl max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-md bg-white/90 hover:bg-white text-[#14161A] shadow-xs transition-colors"
          aria-label="Close details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media */}
        <div className="w-full md:w-1/2 relative bg-[#F5EEDC] min-h-[260px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-3 left-3 right-3 p-3 bg-[#14161A]/85 text-[#F5EEDC] text-xs rounded-sm">
            <div className="flex items-center gap-1.5 text-[#B8F235] font-semibold mb-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Origin: {product.origin}</span>
            </div>
            <p className="text-[11px] text-[#F5EEDC]/80">
              Sourced directly from cooperatives and producers in Nepal.
            </p>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {product.artisanTag && (
              <p className="text-xs font-semibold text-[#556B2F] tracking-wide mb-1">
                {product.artisanTag}
              </p>
            )}

            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#14161A] leading-snug">
              {product.name}
            </h2>

            {/* Price */}
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xs text-[#5C6678]">NPR</span>
              <span className="text-2xl font-bold text-[#14161A] tabular-nums">
                {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#5C6678] line-through tabular-nums ml-2">
                  NPR {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-xs md:text-sm text-[#5C6678] leading-relaxed">
              {product.description}
            </p>

            {/* Specifications Table */}
            <div className="mt-4 py-3 border-y border-[#14161A]/10 space-y-1.5 text-xs">
              {product.materials && (
                <div className="flex justify-between">
                  <span className="text-[#5C6678]">Materials</span>
                  <span className="font-medium text-[#14161A]">{product.materials}</span>
                </div>
              )}
              {product.weight && (
                <div className="flex justify-between">
                  <span className="text-[#5C6678]">Weight</span>
                  <span className="font-medium text-[#14161A]">{product.weight}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#5C6678]">Availability</span>
                <span className="font-medium text-[#14161A]">In Stock ({product.stockCount} units available)</span>
              </div>
            </div>

            {/* Features */}
            <div className="mt-4 space-y-1.5">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#14161A]">
                  <Check className="w-3.5 h-3.5 text-[#556B2F] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Commercial terms */}
            <div className="mt-6 pt-4 border-t border-[#14161A]/10 grid grid-cols-3 gap-2 text-center text-[10px] text-[#5C6678]">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#556B2F]" />
                <span>Nationwide Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#556B2F]" />
                <span>Verified Origin</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-[#556B2F]" />
                <span>7-Day Return Policy</span>
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mt-6 pt-4 border-t border-[#14161A]/10 flex items-center gap-3">
            <div className="flex items-center border border-[#14161A]/20 rounded-md bg-gray-50 p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 hover:bg-white rounded text-black transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-semibold text-[#14161A] tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1.5 hover:bg-white rounded text-black transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 h-10 rounded-md bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs md:text-sm font-semibold flex items-center justify-center gap-2 transition-colors active:scale-[0.99] cursor-pointer"
            >
              <span>{!canBuy ? 'Order Now (Sign In as Buyer)' : 'Add to Cart'}</span>
              <span className="text-[#B8F235]">
                (NPR {(product.price * quantity).toLocaleString()})
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
