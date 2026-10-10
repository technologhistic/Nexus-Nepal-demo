import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { X, Star, MapPin, Check, Plus, Minus, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAdd = () => {
    addToCart(product, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#3B4A1F]/20 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-black shadow-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Media */}
        <div className="w-full md:w-1/2 relative bg-[#F5EEDC] min-h-[280px] md:min-h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md text-[#F5EEDC] text-xs">
            <div className="flex items-center gap-1.5 text-[#B8F235] font-bold mb-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Provenance: {product.origin}</span>
            </div>
            <p className="text-[11px] text-white/80">
              Guaranteed Authentic Heritage Product from Nepal
            </p>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            {product.artisanTag && (
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#556B2F] bg-[#B8F235]/30 px-2.5 py-1 rounded-md mb-2">
                {product.artisanTag}
              </span>
            )}

            <h2 className="text-xl md:text-2xl font-serif font-bold text-[#232D0F] leading-snug">
              {product.name}
            </h2>

            {/* Rating & Stock */}
            <div className="flex items-center gap-3 mt-2.5">
              <div className="flex items-center text-amber-500 gap-1 text-xs font-bold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating}</span>
                <span className="text-[#5C6678] font-normal">({product.reviewCount} reviews)</span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium">
                In Stock ({product.stockCount} left)
              </span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-2xl font-extrabold text-[#232D0F]">
                Rs. {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-[#5C6678] line-through">
                  Rs. {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="mt-4 text-xs md:text-sm text-[#5C6678] leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mt-4 space-y-1.5">
              {product.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-[#232D0F]">
                  <Check className="w-3.5 h-3.5 text-[#556B2F] shrink-0" />
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Badges */}
            <div className="mt-6 pt-4 border-t border-[#3B4A1F]/10 grid grid-cols-3 gap-2 text-center text-[10px] text-[#5C6678]">
              <div className="flex flex-col items-center gap-1 p-1">
                <Truck className="w-4 h-4 text-[#556B2F]" />
                <span>Nepal Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1">
                <ShieldCheck className="w-4 h-4 text-[#556B2F]" />
                <span>100% Genuine</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-1">
                <RefreshCw className="w-4 h-4 text-[#556B2F]" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="mt-6 pt-4 border-t border-[#3B4A1F]/10 flex items-center gap-4">
            <div className="flex items-center border border-[#3B4A1F]/20 rounded-xl bg-gray-50 p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-1.5 hover:bg-white rounded-lg text-black transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-[#14161A]">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-1.5 hover:bg-white rounded-lg text-black transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="flex-1 h-11 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#3B4A1F]/20 active:scale-[0.99] transition-all"
            >
              <span>Add to Cart</span>
              <span className="text-[#B8F235]">
                • Rs. {(product.price * quantity).toLocaleString()}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
