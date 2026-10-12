import React, { useState, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { PRODUCTS } from './data/products';
import { Product, Order, StoreSettings } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { AccountView } from './components/AccountView';
import { NexusAuthPage } from './components/NexusAuthPage';
import { AdminPanel } from './components/AdminPanel';
import { SignInModal } from './components/SignInModal';
import { PrivacyPolicyView } from './components/PrivacyPolicyView';
import { TermsView } from './components/TermsView';
import {
  Mountain,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowRight,
  Filter
} from 'lucide-react';

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: 'Nexus Nepal',
  bannerText: 'Authentic Nepali Artisanship & Mountain Gear • Direct Cooperative Sourcing',
  showBanner: true,
  standardShipping: 150,
  taxPercentage: 13,
  promoCode: 'NEPAL10',
  promoDiscount: 10,
  allowVisitorCheckout: false,
  supportEmail: 'support@nexusnepal.com',
  supportPhone: '+977 1 4410000'
};

const MainShop: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'shop' | 'account' | 'checkout' | 'auth' | 'privacy' | 'terms' | 'admin'>('shop');
  const [_completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const { isAuthModalOpen, closeAuthModal, authModalReason, openAuthModal, isAdmin, isVisitor, canBuy } = useAuth();
  const { openCart } = useCart();

  // Products catalog state (persisted to localStorage)
  const [productsList, setProductsList] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('nexus_products');
      if (stored) return JSON.parse(stored);
    } catch {}
    return PRODUCTS;
  });

  // Store settings state (persisted to localStorage)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(() => {
    try {
      const stored = localStorage.getItem('nexus_settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_SETTINGS;
  });

  const handleUpdateProduct = (updated: Product) => {
    setProductsList((prev) => {
      const next = prev.map((p) => (p.id === updated.id ? updated : p));
      localStorage.setItem('nexus_products', JSON.stringify(next));
      return next;
    });
  };

  const handleAddProduct = (newProd: Product) => {
    setProductsList((prev) => {
      const next = [newProd, ...prev];
      localStorage.setItem('nexus_products', JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProductsList((prev) => {
      const next = prev.filter((p) => p.id !== id);
      localStorage.setItem('nexus_products', JSON.stringify(next));
      return next;
    });
  };

  const handleResetCatalog = () => {
    setProductsList(PRODUCTS);
    localStorage.removeItem('nexus_products');
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    setStoreSettings(newSettings);
    localStorage.setItem('nexus_settings', JSON.stringify(newSettings));
  };

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let list = [...productsList];

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
    } else if (sortBy === 'name-asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [productsList, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FBF6E8] text-[#14161A] font-sans flex flex-col">
      {/* Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAccount={() => setActiveView('account')}
        onOpenSignIn={() => openAuthModal()}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* Visitor Mode Information Bar */}
      {isVisitor && activeView === 'shop' && (
        <div className="bg-[#232D0F] text-[#F5EEDC] px-4 py-2 text-xs flex flex-wrap items-center justify-between border-b border-[#3B4A1F] gap-2 shadow-inner">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8F235] shrink-0" />
            <span className="text-[11px] sm:text-xs">
              <strong className="text-white">Viewing as Visitor (Browse Only):</strong> You can explore all authentic products across Nepal. Sign in as a Buyer to order.
            </span>
          </div>
          <button
            onClick={() => openAuthModal('Sign in with Google or Email as a Buyer to order products.')}
            className="px-3 py-1 rounded bg-[#B8F235] hover:bg-[#a6de26] text-[#232D0F] font-bold text-xs transition-colors cursor-pointer shadow-xs ml-auto sm:ml-0"
          >
            Sign In as Buyer to Order
          </button>
        </div>
      )}

      {/* Main Content Area based on active view */}
      <main className="flex-1">
        {activeView === 'admin' && isAdmin ? (
          <AdminPanel
            products={productsList}
            onUpdateProduct={handleUpdateProduct}
            onAddProduct={handleAddProduct}
            onDeleteProduct={handleDeleteProduct}
            onResetCatalog={handleResetCatalog}
            storeSettings={storeSettings}
            onUpdateSettings={handleUpdateSettings}
            onBackToShop={() => setActiveView('shop')}
          />
        ) : activeView === 'auth' ? (
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
          <AccountView
            onBackToShop={() => setActiveView('shop')}
            onNavigateToAuth={() => setActiveView('auth')}
          />
        ) : activeView === 'privacy' ? (
          <PrivacyPolicyView onBackToShop={() => setActiveView('shop')} />
        ) : activeView === 'terms' ? (
          <TermsView onBackToShop={() => setActiveView('shop')} />
        ) : (
          /* Storefront View */
          <div>
            {/* Hero Section */}
            <section className="bg-[#232D0F] text-[#F5EEDC] py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-[#3B4A1F]">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
                <div className="max-w-2xl text-center md:text-left">
                  <p className="text-xs font-semibold text-[#B8F235] uppercase tracking-wider mb-2">
                    Direct Artisan & Cooperative Sourcing
                  </p>

                  <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight text-white">
                    Nepal Craftsmanship and Regional Specialty Goods.
                  </h1>

                  <p className="mt-4 text-sm sm:text-base text-[#F5EEDC]/85 leading-relaxed max-w-xl">
                    Direct from certified producers across Nepal: handwoven Palpali Dhaka, Mustang cashmere, single-estate Ilam orthodox tea, and mountain gear. Shipped nationwide with transparent pricing in NPR.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <button
                      onClick={() => {
                        const el = document.getElementById('catalog');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 rounded-md bg-[#B8F235] hover:bg-[#D6FF6A] text-[#232D0F] font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => openAuthModal('Sign in to access your buyer account.')}
                      className="px-5 py-2.5 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 text-[#F5EEDC] font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                    >
                      Account Access
                    </button>
                  </div>
                </div>

                {/* Hero Showcase Card */}
                <div className="w-full max-w-sm bg-white/5 rounded-lg p-5 border border-white/10">
                  <div className="relative rounded-md overflow-hidden aspect-4/3 mb-4 bg-black/20">
                    <img
                      src="https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&w=800&q=80"
                      alt="Mustang Pashmina Shawl"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-xs bg-[#14161A]/90 text-[#F5EEDC] text-[10px] font-semibold uppercase tracking-wide">
                      Mustang Provenance
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#B8F235] font-medium">
                      <span>Gandaki Province</span>
                      <span className="font-mono tabular-nums">NPR 8,500</span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-white">
                      Pure Nepal Pashmina Shawl
                    </h3>
                    <p className="text-xs text-[#F5EEDC]/75 line-clamp-2">
                      Hand-spun by local cooperatives using natural unbleached Changthangi cashmere fiber.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const prod = productsList.find((p) => p.id === 'nx-pashmina-01') || productsList[0];
                      if (prod) setSelectedProduct(prod);
                    }}
                    className="mt-4 w-full py-2 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    View Specifications & Materials
                  </button>
                </div>
              </div>

              {/* Commercial Guarantees */}
              <div className="max-w-7xl mx-auto mt-10 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-[#F5EEDC]/80">
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-[#B8F235] shrink-0" />
                  <span>Verified Nepali Origin</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#B8F235] shrink-0" />
                  <span>Delivery to 77 Districts</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B8F235] shrink-0" />
                  <span>eSewa, Khalti, COD, connectIPS</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-[#B8F235] shrink-0" />
                  <span>7-Day Doorstep Returns</span>
                </div>
              </div>
            </section>

            {/* Catalog Grid Section */}
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              {/* Filter and sorting bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#14161A]/10">
                <div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#14161A]">
                    {selectedCategory === 'all'
                      ? 'Catalog Overview'
                      : productsList.find((p) => p.category === selectedCategory)?.categoryLabel || 'Catalog'}
                  </h2>
                  <p className="text-xs text-[#5C6678] mt-0.5">
                    Showing {filteredProducts.length} verified products with domestic fulfillment
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-md border border-[#14161A]/15 text-xs text-[#14161A]">
                    <Filter className="w-3.5 h-3.5 text-[#556B2F]" />
                    <span className="text-[#5C6678]">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-transparent font-medium focus:outline-none cursor-pointer"
                    >
                      <option value="featured">Featured Origin</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="name-asc">Product Name (A-Z)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg border border-[#14161A]/10 p-8">
                  <p className="text-base font-semibold text-[#14161A]">No products found</p>
                  <p className="text-xs text-[#5C6678] mt-1 mb-4">
                    Try searching by name, origin (e.g. Mustang, Ilam, Palpa), or material.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="px-4 py-2 bg-[#3B4A1F] text-[#F5EEDC] rounded-md text-xs font-semibold cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
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
      <footer className="bg-[#232D0F] text-[#F5EEDC] border-t border-[#3B4A1F] mt-16 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-[#B8F235] text-[#232D0F] font-serif font-bold text-base flex items-center justify-center">
                N
              </div>
              <span className="font-serif font-bold text-lg text-white">NEXUS NEPAL</span>
            </div>
            <p className="text-xs text-[#F5EEDC]/70 leading-relaxed">
              Curating genuine craftsmanship, organic agriculture, and mountain gear from cooperatives across Nepal.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B8F235] mb-3">
              Regional Origins
            </h3>
            <ul className="text-xs space-y-2 text-[#F5EEDC]/80">
              <li>Mustang and Manang (Cashmere)</li>
              <li>Ilam, Koshi (Organic Orthodox Tea)</li>
              <li>Palpa, Lumbini (Handwoven Dhaka)</li>
              <li>Patan, Bagmati (Bronze & Metalcrafts)</li>
              <li>Boudhanath, Kathmandu (Thangka Painting)</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B8F235] mb-3">
              Customer Support (Nepal)
            </h3>
            <ul className="text-xs space-y-2 text-[#F5EEDC]/80">
              <li>Tracking and Delivery Verification</li>
              <li>eSewa and Khalti Payment Settlement</li>
              <li>7-Day Return and Replacement</li>
              <li>Grievance Officer: privacy@nexusnepal.com</li>
              <li>Office: Lazimpat, Kathmandu 44600</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#B8F235] mb-3">
              Domestic Payment Options
            </h3>
            <p className="text-xs text-[#F5EEDC]/75 mb-3 leading-relaxed">
              Registered under Nepal eCommerce Act 2080. Settled exclusively in Nepali Rupees (NPR).
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 rounded-xs bg-[#437A22] text-white text-[11px] font-medium">
                eSewa
              </span>
              <span className="px-2 py-1 rounded-xs bg-[#1E293B] text-white text-[11px] font-medium">
                Khalti
              </span>
              <span className="px-2 py-1 rounded-xs bg-[#3B4A1F] text-[#F5EEDC] text-[11px] font-medium border border-[#556B2F]">
                Cash on Delivery
              </span>
              <span className="px-2 py-1 rounded-xs bg-[#0F172A] text-white text-[11px] font-medium">
                connectIPS
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F5EEDC]/60 gap-4">
          <p>© 2026 Nexus Nepal Trade & Commerce. All rights reserved.</p>
          <div className="flex gap-4">
            <button
              onClick={() => setActiveView('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms and Conditions
            </button>
            <button
              onClick={() => setActiveView('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
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

      {/* Sign In & Buyer Verification Popup Modal */}
      <SignInModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        reason={authModalReason}
        onAdminLogin={() => setActiveView('admin')}
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
