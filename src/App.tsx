import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { PRODUCTS } from './data/products';
import { Product, Order } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { AccountView } from './components/AccountView';
import { AuthModal } from './components/AuthModal';
import { NexusAuthPage } from './components/NexusAuthPage';
import { GitHubModal } from './components/GitHubModal';
import {
  Sparkles,
  Mountain,
  ShieldCheck,
  Truck,
  HeartHandshake,
  ArrowRight,
  Filter,
  CheckCircle,
  Github
} from 'lucide-react';

const MainShop: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'shop' | 'account' | 'checkout' | 'auth'>('shop');
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const { openAuthModal } = useAuth();
  const { openCart } = useCart();

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FBF6E8] text-[#14161A] font-sans flex flex-col selection:bg-[#B8F235] selection:text-[#232D0F]">
      
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
        onOpenAccount={() => setActiveView('account')}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Main Content Area based on active view */}
      <main className="flex-1">
        {activeView === 'auth' ? (
          <NexusAuthPage onBackToShop={() => setActiveView('shop')} />
        ) : activeView === 'checkout' ? (
          <CheckoutView
            onBack={() => setActiveView('shop')}
            onOrderComplete={(order) => {
              setCompletedOrder(order);
              setActiveView('account');
            }}
          />
        ) : activeView === 'account' ? (
          <AccountView onBackToShop={() => setActiveView('shop')} />
        ) : (
          /* Storefront View */
          <div>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#232D0F] via-[#3B4A1F] to-[#4F6428] text-[#F5EEDC] py-12 md:py-20 px-4 sm:px-6 lg:px-8 shadow-xl">
              {/* Background mountain ridge texture */}
              <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#B8F235_1px,transparent_1px)] [background-size:24px_24px]" />
              
              <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="max-w-2xl text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B8F235]/20 border border-[#B8F235]/40 text-[#B8F235] text-xs font-bold uppercase tracking-wider mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Nepal's Premier Artisan & Mountain Marketplace</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-[1.08] text-white">
                    Rooted in the Himalayas. <br />
                    <span className="text-[#B8F235]">Delivered Across Nepal.</span>
                  </h1>

                  <p className="mt-4 sm:mt-5 text-sm sm:text-base text-[#F5EEDC]/85 leading-relaxed max-w-xl">
                    Discover handwoven Mustang Pashmina, first-flush Ilam orthodox tea, Patan 7-metal meditation bowls, and expedition-ready gear. Direct from artisan cooperatives to your doorstep.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-3.5">
                    <button
                      onClick={() => {
                        const el = document.getElementById('catalog');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D6FF6A] to-[#B8F235] text-[#232D0F] font-bold text-xs sm:text-sm shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setActiveView('auth')}
                      className="px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[#F5EEDC] font-semibold text-xs sm:text-sm backdrop-blur-md transition-all cursor-pointer"
                    >
                      Join Himalayan Club (100 Pts)
                    </button>
                  </div>
                </div>

                {/* Hero Showcase Card */}
                <div className="w-full max-w-sm bg-white/10 backdrop-blur-xl rounded-3xl p-5 border border-white/20 shadow-2xl">
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 mb-4">
                    <img
                      src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80"
                      alt="Mustang Pashmina"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-[#B8F235] text-[#232D0F] text-[10px] font-extrabold uppercase tracking-wide">
                      Artisan Spotlight
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#B8F235] font-semibold">
                      <span>Mustang, Nepal</span>
                      <span>Rs. 8,500</span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-white">
                      Pure Himalayan Pashmina Shawl
                    </h3>
                    <p className="text-xs text-[#F5EEDC]/75 line-clamp-2">
                      Hand-spun by mountain cooperatives using rare winter Changthangi cashmere fibers.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const prod = PRODUCTS.find((p) => p.id === 'nx-pashmina-01');
                      if (prod) setSelectedProduct(prod);
                    }}
                    className="mt-4 w-full py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors"
                  >
                    View Details & Provenance
                  </button>
                </div>
              </div>

              {/* Trust Badges Bar */}
              <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#F5EEDC]/80">
                <div className="flex items-center gap-2.5">
                  <Mountain className="w-5 h-5 text-[#B8F235] shrink-0" />
                  <span>100% Authentic Nepali Origin</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Truck className="w-5 h-5 text-[#B8F235] shrink-0" />
                  <span>Fast Delivery across 77 Districts</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#B8F235] shrink-0" />
                  <span>eSewa, Khalti & COD Accepted</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <HeartHandshake className="w-5 h-5 text-[#B8F235] shrink-0" />
                  <span>Fair Trade Artisan Direct Cooperatives</span>
                </div>
              </div>
            </section>

            {/* Catalog Grid Section */}
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Filter and sorting bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#3B4A1F]/15">
                <div>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#232D0F]">
                    {selectedCategory === 'all'
                      ? 'Curated Himalayan Catalog'
                      : PRODUCTS.find((p) => p.category === selectedCategory)?.categoryLabel || 'Catalog'}
                  </h2>
                  <p className="text-xs text-[#5C6678] mt-1">
                    Showing {filteredProducts.length} verified products with nationwide dispatch
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#3B4A1F]/20 text-xs text-[#232D0F]">
                    <Filter className="w-3.5 h-3.5 text-[#556B2F]" />
                    <span className="font-medium text-[#5C6678]">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-bold focus:outline-none cursor-pointer"
                    >
                      <option value="featured">Featured / Artisan</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-[#3B4A1F]/15 p-8">
                  <p className="text-base font-bold text-[#232D0F]">No products match your search</p>
                  <p className="text-xs text-[#5C6678] mt-1 mb-4">
                    Try searching for "Tea", "Pashmina", "Topi", or "Bowl"
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 bg-[#3B4A1F] text-[#F5EEDC] rounded-xl text-xs font-semibold"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#232D0F] text-[#F5EEDC] border-t border-[#3B4A1F] mt-16 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#B8F235] text-[#232D0F] font-serif font-black text-lg flex items-center justify-center">
                N
              </div>
              <span className="font-serif font-bold text-xl text-white">NEXUS NEPAL</span>
            </div>
            <p className="text-xs text-[#F5EEDC]/70 leading-relaxed">
              Bridging authentic Himalayan artisans, organic tea growers, and mountain craftspeople with modern buyers across Nepal and worldwide.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#B8F235] hover:text-[#232D0F] text-xs font-semibold transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </button>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8F235] mb-3">
              Himalayan Regions
            </h4>
            <ul className="text-xs space-y-2 text-[#F5EEDC]/80">
              <li>Mustang & Manang (Cashmere & Apples)</li>
              <li>Ilam, Koshi (Organic Orthodox Tea)</li>
              <li>Palpa, Lumbini (Handwoven Dhaka Fabrics)</li>
              <li>Patan & Bhaktapur (Bronze & Metalcrafts)</li>
              <li>Boudhanath, Kathmandu (Sacred Thangka Art)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8F235] mb-3">
              Customer Support (Nepal)
            </h4>
            <ul className="text-xs space-y-2 text-[#F5EEDC]/80">
              <li>Track Order Status</li>
              <li>eSewa & Khalti Payment Help</li>
              <li>7-Day Easy Returns</li>
              <li>Grievance Officer: support@nexusnepal.com</li>
              <li>Hotline: +977 1-4412345 (9 AM - 6 PM NPT)</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#B8F235] mb-3">
              Certified Compliances
            </h4>
            <p className="text-xs text-[#F5EEDC]/75 mb-3 leading-relaxed">
              Registered under Nepal eCommerce Act 2080. All transactions settled in Nepali Rupees (NPR).
            </p>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded bg-[#60BB46] text-white text-[10px] font-bold">
                eSewa Verified
              </span>
              <span className="px-2 py-1 rounded bg-[#5C2D91] text-white text-[10px] font-bold">
                Khalti
              </span>
              <span className="px-2 py-1 rounded bg-[#3B4A1F] border border-[#B8F235]/40 text-[#D6FF6A] text-[10px] font-bold">
                COD Nepal
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5EEDC]/60 gap-4">
          <p>© 2026 Nexus Nepal Inc. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#terms" onClick={(e) => { e.preventDefault(); alert('Terms of Service: All crafts conform to Nepali GI and Fair Trade guidelines.'); }} className="hover:underline">Terms</a>
            <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: Customer data is secure and never sold.'); }} className="hover:underline">Privacy</a>
            <a href="#refund" onClick={(e) => { e.preventDefault(); alert('Refund Policy: 7-day doorstep replacement across Nepal.'); }} className="hover:underline">Refunds</a>
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setActiveView('checkout');
        }}
      />

      {/* Dual-Panel Animated Auth Modal */}
      <AuthModal />

      {/* GitHub Repository Push Modal */}
      <GitHubModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainShop />
      </CartProvider>
    </AuthProvider>
  );
}
