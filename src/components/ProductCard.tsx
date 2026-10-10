import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { Star, MapPin, Plus, Heart, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const isWishlisted = isInWishlist(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-[#3B4A1F]/15 hover:border-[#3B4A1F]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Product Image Area */}
      <div
        onClick={() => onSelect(product)}
        className="relative w-full pt-[75%] bg-[#F5EEDC] cursor-pointer overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-[#B3341F] text-white text-[10px] font-extrabold tracking-wider shadow-sm">
            {discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-[#B3341F] text-white'
              : 'bg-white/80 text-[#3B4A1F] hover:bg-white hover:text-[#B3341F]'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Artisan Origin Tag */}
        <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[#F5EEDC] text-[10px] font-medium flex items-center gap-1">
          <MapPin className="w-3 h-3 text-[#B8F235]" />
          <span>{product.origin}</span>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Artisan badge */}
          {product.artisanTag && (
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#556B2F] bg-[#B8F235]/25 px-2 py-0.5 rounded mb-1.5">
              {product.artisanTag}
            </span>
          )}

          <h3
            onClick={() => onSelect(product)}
            className="font-semibold text-sm text-[#14161A] group-hover:text-[#3B4A1F] transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-xs font-bold text-[#14161A]">{product.rating}</span>
            <span className="text-[11px] text-[#5C6678]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#3B4A1F]/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-semibold text-[#556B2F]">Rs.</span>
              <span className="text-lg font-extrabold text-[#232D0F]">
                {product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] text-[#5C6678] line-through">
                Rs. {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-semibold shadow-sm active:scale-95 transition-all group/btn"
          >
            <Plus className="w-3.5 h-3.5 text-[#B8F235] group-hover/btn:rotate-90 transition-transform" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
