import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Github,
  Compass,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenGitHubModal: () => void;
  onOpenAccount: () => void;
  activeView: 'shop' | 'account' | 'checkout' | 'auth';
  setActiveView: (view: 'shop' | 'account' | 'checkout' | 'auth') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenGitHubModal,
  onOpenAccount,
  activeView,
  setActiveView
}) => {
  const { user, isAuthenticated, openAuthModal, logout } = useAuth();
  const { itemCount, openCart, wishlist } = useCart();

  const categories = [
    { id: 'all', label: 'All Catalog' },
    { id: 'crafts', label: 'Himalayan Crafts' },
    { id: 'organic', label: 'Tea & Organic' },
    { id: 'gear', label: 'Mountain & Living' },
    { id: 'clothing', label: 'Apparel' },
    { id: 'tech', label: 'Tech Essentials' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FBF6E8]/95 backdrop-blur-md border-b border-[#3B4A1F]/15 shadow-sm">
      {/* Top Banner with Himalayan Notice & GitHub prompt */}
      <div className="bg-[#3B4A1F] text-[#F5EEDC] text-xs py-1.5 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-2 h-2 rounded-full bg-[#B8F235] animate-ping" />
          <span className="font-medium text-[11px] sm:text-xs">
            Free Express Delivery across Nepal on orders over Rs. 4,000 | Authentic GI Certified Crafts
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]">
          <button
            onClick={onOpenGitHubModal}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#556B2F] hover:bg-[#B8F235] hover:text-[#232D0F] transition-all font-semibold"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Push to GitHub</span>
          </button>
          <span className="text-[#B8F235] font-mono">NPR (Rs.)</span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div
            onClick={() => setActiveView('shop')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B4A1F] to-[#232D0F] flex items-center justify-center text-[#B8F235] font-serif font-black text-2xl shadow-md group-hover:scale-105 transition-transform">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-extrabold text-xl sm:text-2xl tracking-tight text-[#232D0F]">
                  NEXUS
                </span>
                <span className="font-serif font-light text-xl sm:text-2xl tracking-wider text-[#556B2F]">
                  NEPAL
                </span>
              </div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-[#3B4A1F]/70 font-semibold -mt-1 hidden sm:block">
                Himalayan Marketplace
              </p>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-lg hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pashmina, Ilam Tea, Singing Bowls, Trekking Gear..."
                className="w-full bg-white/90 border border-[#3B4A1F]/20 rounded-full py-2 pl-10 pr-4 text-sm text-[#14161A] placeholder:text-[#5C6678]/70 focus:outline-none focus:border-[#3B4A1F] focus:ring-2 focus:ring-[#B8F235]/40 transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#5C6678]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#5C6678] hover:text-black font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* GitHub Quick Button (Mobile) */}
            <button
              onClick={onOpenGitHubModal}
              className="sm:hidden p-2 rounded-xl bg-[#3B4A1F]/10 text-[#232D0F] hover:bg-[#3B4A1F]/20"
              title="Push to GitHub"
            >
              <Github className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActiveView('shop')}
              className="relative p-2 rounded-xl hover:bg-[#3B4A1F]/10 text-[#232D0F] transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#B3341F] text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#3B4A1F] text-[#F5EEDC] hover:bg-[#232D0F] transition-all shadow-sm group"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-[#B8F235] group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#D6FF6A] text-[#232D0F] text-[10px] font-extrabold flex items-center justify-center shadow-sm">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
            </button>

            {/* User Account / Login Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-[#3B4A1F]/20">
                <button
                  onClick={onOpenAccount}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-all ${
                    activeView === 'account'
                      ? 'bg-[#3B4A1F] text-[#F5EEDC]'
                      : 'hover:bg-[#3B4A1F]/10 text-[#232D0F]'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-[#B8F235] text-[#232D0F] font-bold text-xs flex items-center justify-center shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left hidden lg:block">
                    <span className="block text-xs font-bold leading-tight truncate max-w-[100px]">
                      {user.name}
                    </span>
                    <span className="block text-[10px] text-[#556B2F]">
                      {user.rewardPoints} pts
                    </span>
                  </div>
                </button>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-lg text-[#5C6678] hover:text-[#B3341F] hover:bg-[#B3341F]/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveView('auth')}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#B8F235] to-[#D6FF6A] text-[#232D0F] font-bold text-xs shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Join</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="mt-3 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products across Nepal..."
              className="w-full bg-white/90 border border-[#3B4A1F]/20 rounded-full py-2 pl-10 pr-4 text-xs text-[#14161A]"
            />
            <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-[#5C6678]" />
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (activeView !== 'shop') setActiveView('shop');
              }}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id && activeView === 'shop'
                  ? 'bg-[#3B4A1F] text-[#F5EEDC] shadow-sm font-semibold'
                  : 'bg-white/60 text-[#3B4A1F] hover:bg-white hover:text-black border border-[#3B4A1F]/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
