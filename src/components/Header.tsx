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
  Globe,
  FileText,
  Shield
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenGitHubModal: () => void;
  onOpenDomainModal: () => void;
  onOpenAccount: () => void;
  activeView: 'shop' | 'account' | 'checkout' | 'auth' | 'privacy' | 'terms';
  setActiveView: (view: 'shop' | 'account' | 'checkout' | 'auth' | 'privacy' | 'terms') => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onOpenGitHubModal,
  onOpenDomainModal,
  onOpenAccount,
  activeView,
  setActiveView
}) => {
  const { user, isAuthenticated, logout } = useAuth();
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
    <header className="sticky top-0 z-40 bg-[#FBF6E8] border-b border-[#14161A]/10">
      {/* Top Banner with Himalayan logistics and Custom Domain verification */}
      <div className="bg-[#232D0F] text-[#F5EEDC] text-xs py-2 px-4 flex items-center justify-between border-b border-[#3B4A1F]">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="inline-block w-1.5 h-1.5 rounded-xs bg-[#B8F235]" />
          <span className="font-normal text-[11px] sm:text-xs text-[#F5EEDC]/90">
            Express delivery across all 7 provinces in Nepal. Guaranteed authentic regional origin.
          </span>
        </div>
        
        <div className="hidden sm:flex items-center gap-3 text-[11px]">
          <button
            onClick={onOpenDomainModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-[#3B4A1F] hover:bg-[#556B2F] text-[#F5EEDC] transition-colors font-medium cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#B8F235]" />
            <span>Custom Domain</span>
          </button>
          
          <button
            onClick={() => setActiveView('privacy')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Privacy
          </button>
          <button
            onClick={() => setActiveView('terms')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Terms
          </button>

          <button
            onClick={onOpenGitHubModal}
            className="flex items-center gap-1 px-2 py-1 rounded-xs bg-[#14161A] hover:bg-black text-[#F5EEDC] transition-colors font-medium cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </button>

          <span className="text-[#B8F235] font-mono tabular-nums">NPR (Rs.)</span>
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
            <div className="w-9 h-9 rounded-md bg-[#232D0F] flex items-center justify-center text-[#B8F235] font-serif font-black text-xl shadow-xs">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-[#14161A]">
                  NEXUS
                </span>
                <span className="font-serif font-normal text-xl sm:text-2xl tracking-wide text-[#556B2F]">
                  NEPAL
                </span>
              </div>
              <p className="text-[10px] tracking-[0.18em] uppercase text-[#5C6678] font-medium -mt-1 hidden sm:block">
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
                placeholder="Search by product name, materials, or district..."
                className="w-full bg-white border border-[#14161A]/15 rounded-md py-2 pl-9 pr-4 text-xs text-[#14161A] placeholder:text-[#5C6678] focus:outline-none focus:border-[#3B4A1F] transition-colors"
              />
              <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#5C6678]" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-[#5C6678] hover:text-black font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Custom Domain Quick Mobile Access */}
            <button
              onClick={onOpenDomainModal}
              className="sm:hidden p-2 rounded-md border border-[#14161A]/10 text-[#14161A] hover:bg-white"
              title="Custom Domain"
            >
              <Globe className="w-4 h-4" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setActiveView('shop')}
              className="relative p-2 rounded-md hover:bg-white text-[#14161A] border border-transparent hover:border-[#14161A]/10 transition-colors"
              title="Saved items"
            >
              <Heart className="w-4 h-4" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-xs bg-[#B3341F] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#3B4A1F] text-[#F5EEDC] hover:bg-[#232D0F] transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-[#B8F235]" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-3.5 h-3.5 rounded-xs bg-[#B8F235] text-[#232D0F] text-[9px] font-bold flex items-center justify-center tabular-nums">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-medium">Cart</span>
            </button>

            {/* User Account / Login Button */}
            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-[#14161A]/10">
                <button
                  onClick={onOpenAccount}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-colors ${
                    activeView === 'account'
                      ? 'bg-[#3B4A1F] text-[#F5EEDC]'
                      : 'hover:bg-white text-[#14161A]'
                  }`}
                >
                  <div className="w-6 h-6 rounded-xs bg-[#3B4A1F] text-[#B8F235] font-bold text-xs flex items-center justify-center">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-medium truncate max-w-[100px] hidden lg:block">
                    {user.name}
                  </span>
                </button>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-md text-[#5C6678] hover:text-[#B3341F] hover:bg-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveView('auth')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-semibold transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Account</span>
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
              className="w-full bg-white border border-[#14161A]/15 rounded-md py-2 pl-9 pr-3 text-xs text-[#14161A]"
            />
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#5C6678]" />
          </div>
        </div>

        {/* Category Navigation (Zero Pill Discipline - Clean Segmented Tabs) */}
        <nav className="flex items-center gap-1 overflow-x-auto pt-3 pb-1 border-t border-[#14161A]/5 mt-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                if (activeView !== 'shop') setActiveView('shop');
              }}
              className={`px-3 py-1.5 text-xs font-medium whitespace-nowrap rounded-md transition-colors ${
                selectedCategory === cat.id && activeView === 'shop'
                  ? 'bg-[#3B4A1F] text-[#F5EEDC] font-semibold'
                  : 'text-[#14161A] hover:bg-white/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};
