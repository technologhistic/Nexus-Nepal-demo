import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { MapPin, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (p: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart } = useCart();

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <article className="group relative bg-white rounded-lg overflow-hidden border border-[#14161A]/10 hover:border-[#14161A]/30 transition-colors flex flex-col">
      {/* Product Image Area */}
      <div
        onClick={() => onSelect(product)}
        className="relative w-full pt-[75%] bg-[#F5EEDC] cursor-pointer overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-102"
          loading="lazy"
        />

        {/* Discount Tag */}
        {discountPercent > 0 && (
          <span className="absolute top-3 left-3 px-2 py-0.5 bg-[#B3341F] text-white text-[10px] font-medium tracking-wide rounded-xs">
            {discountPercent}% off
          </span>
        )}

        {/* Origin Metadata */}
        <div className="absolute bottom-2.5 left-2.5 px-2 py-1 bg-[#14161A]/80 text-[#F5EEDC] text-[11px] font-medium flex items-center gap-1 rounded-xs">
          <MapPin className="w-3 h-3 text-[#B8F235]" />
          <span>{product.origin}</span>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Provenance text kicker */}
          {product.artisanTag && (
            <p className="text-[11px] font-semibold text-[#556B2F] tracking-wide mb-1">
              {product.artisanTag}
            </p>
          )}

          <h3
            onClick={() => onSelect(product)}
            className="font-medium text-sm text-[#14161A] hover:text-[#3B4A1F] transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {product.name}
          </h3>

          {/* Genuine Technical Specifications */}
          <div className="flex items-center gap-2 mt-2 text-xs text-[#5C6678]">
            {product.weight && <span>{product.weight}</span>}
            {product.weight && product.materials && <span aria-hidden="true">·</span>}
            {product.materials && <span className="truncate">{product.materials}</span>}
          </div>
        </div>

        {/* Price and Cart Action */}
        <div className="mt-4 pt-3 border-t border-[#14161A]/10 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-[#5C6678]">NPR</span>
              <span className="text-base font-bold text-[#14161A] tabular-nums">
                {product.price.toLocaleString()}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] text-[#5C6678] line-through tabular-nums">
                NPR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </article>
  );
};
