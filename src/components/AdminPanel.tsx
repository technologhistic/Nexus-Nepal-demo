import React, { useState } from 'react';
import { Product, StoreSettings } from '../types';
import {
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  Settings,
  Package,
  DollarSign,
  Search,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Sliders,
  Store,
  Upload
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  onUpdateProduct: (product: Product) => void;
  onAddProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onResetCatalog: () => void;
  storeSettings: StoreSettings;
  onUpdateSettings: (settings: StoreSettings) => void;
  onBackToShop: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onResetCatalog,
  storeSettings,
  onUpdateSettings,
  onBackToShop
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Edit / Add Product State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);

  // Quick Amount Edit State
  const [quickAmountId, setQuickAmountId] = useState<string | null>(null);
  const [quickAmountValue, setQuickAmountValue] = useState<number>(0);

  // Delete Confirmation State
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  // Notification message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Form State for Adding / Editing Product
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<'crafts' | 'organic' | 'gear' | 'clothing' | 'tech'>('crafts');
  const [formCategoryLabel, setFormCategoryLabel] = useState('Artisan Crafts');
  const [formPrice, setFormPrice] = useState<number>(1000);
  const [formOriginalPrice, setFormOriginalPrice] = useState<number>(1200);
  const [formOrigin, setFormOrigin] = useState('Kathmandu, Bagmati Province');
  const [formArtisanTag, setFormArtisanTag] = useState('');
  const [formStockCount, setFormStockCount] = useState<number>(20);
  const [formWeight, setFormWeight] = useState('250g');
  const [formMaterials, setFormMaterials] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formFeatures, setFormFeatures] = useState('');
  const [formImage, setFormImage] = useState('');

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<StoreSettings>({ ...storeSettings });

  // Open Edit Modal
  const openEditModal = (p: Product) => {
    setIsNewProduct(false);
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormCategoryLabel(p.categoryLabel);
    setFormPrice(p.price);
    setFormOriginalPrice(p.originalPrice || p.price);
    setFormOrigin(p.origin);
    setFormArtisanTag(p.artisanTag || '');
    setFormStockCount(p.stockCount);
    setFormWeight(p.weight || '');
    setFormMaterials(p.materials || '');
    setFormDescription(p.description);
    setFormFeatures(p.features.join('\n'));
    setFormImage(p.image);
    setIsEditModalOpen(true);
  };

  // Open New Product Modal
  const openNewProductModal = () => {
    setIsNewProduct(true);
    setEditingProduct(null);
    setFormName('');
    setFormCategory('crafts');
    setFormCategoryLabel('Artisan Crafts');
    setFormPrice(1500);
    setFormOriginalPrice(1800);
    setFormOrigin('Kathmandu, Bagmati Province');
    setFormArtisanTag('Handmade Authentic');
    setFormStockCount(25);
    setFormWeight('300g');
    setFormMaterials('Natural sustainable material');
    setFormDescription('Authentic craft direct from artisans in Nepal.');
    setFormFeatures('Handcrafted in Nepal\nDirect artisan trade\nEco-friendly materials');
    setFormImage('https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80');
    setIsEditModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || formPrice <= 0) {
      alert('Please enter a valid product name and price.');
      return;
    }

    const categoryLabels: Record<string, string> = {
      crafts: 'Artisan Crafts',
      organic: 'Organic & Food',
      gear: 'Mountain & Living',
      clothing: 'Apparel & Weaves',
      tech: 'Modern Essentials'
    };

    const featuresList = formFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const updatedProduct: Product = {
      id: isNewProduct ? `nx-item-${Date.now()}` : (editingProduct ? editingProduct.id : `nx-${Date.now()}`),
      name: formName.trim(),
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: formCategory,
      categoryLabel: categoryLabels[formCategory] || formCategoryLabel,
      price: Number(formPrice),
      originalPrice: formOriginalPrice > formPrice ? Number(formOriginalPrice) : undefined,
      origin: formOrigin.trim(),
      artisanTag: formArtisanTag.trim() || undefined,
      inStock: formStockCount > 0,
      stockCount: Number(formStockCount),
      weight: formWeight.trim() || undefined,
      materials: formMaterials.trim() || undefined,
      description: formDescription.trim(),
      features: featuresList.length > 0 ? featuresList : ['Authentic Nepal craftsmanship'],
      image: formImage.trim() || 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
    };

    if (isNewProduct) {
      onAddProduct(updatedProduct);
      showToast(`Product "${updatedProduct.name}" added successfully.`);
    } else {
      onUpdateProduct(updatedProduct);
      showToast(`Product "${updatedProduct.name}" updated successfully.`);
    }

    setIsEditModalOpen(false);
  };

  // Quick Amount Save
  const handleQuickAmountSave = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    if (quickAmountValue <= 0) {
      alert('Price amount must be greater than zero.');
      return;
    }

    const updated: Product = {
      ...prod,
      price: Number(quickAmountValue)
    };
    onUpdateProduct(updated);
    setQuickAmountId(null);
    showToast(`Amount updated to Rs. ${quickAmountValue.toLocaleString()} for ${prod.name}`);
  };

  // Delete product action
  const confirmDelete = () => {
    if (!productToDelete) return;
    onDeleteProduct(productToDelete.id);
    showToast(`Product "${productToDelete.name}" removed from catalog.`);
    setProductToDelete(null);
  };

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(settingsForm);
    showToast('Store settings saved successfully.');
  };

  // Filtered products list
  const filteredProducts = products.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F5EEDC]/40 text-[#14161A] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#232D0F] text-[#F5EEDC] px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-[#B8F235]/40 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-[#B8F235]" />
          <span className="text-xs sm:text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Admin Navigation Header */}
      <div className="bg-[#232D0F] text-[#F5EEDC] border-b border-[#3B4A1F] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToShop}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[#F5EEDC] text-xs font-semibold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#B8F235]" />
              <span>Back to Storefront</span>
            </button>
            <div className="h-6 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#B8F235] text-[#232D0F] font-bold text-[10px] tracking-wider uppercase">
                Admin Panel
              </span>
              <h1 className="font-serif font-bold text-lg text-white hidden md:block">
                Nexus Nepal Store Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#B8F235] text-[#232D0F]'
                  : 'bg-white/10 text-[#F5EEDC] hover:bg-white/15'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Products ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#B8F235] text-[#232D0F]'
                  : 'bg-white/10 text-[#F5EEDC] hover:bg-white/15'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Other Settings</span>
            </button>

            <button
              onClick={openNewProductModal}
              className="px-3.5 py-1.5 rounded-lg bg-[#556B2F] hover:bg-[#3B4A1F] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ml-2"
            >
              <Plus className="w-3.5 h-3.5 text-[#B8F235]" />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Quick Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-[#14161A]/10 shadow-xs">
            <span className="text-[11px] font-medium text-[#5C6678] uppercase tracking-wider block">
              Total Products
            </span>
            <div className="text-2xl font-serif font-bold text-[#14161A] mt-1">
              {products.length}
            </div>
            <span className="text-[11px] text-[#556B2F] font-semibold">Active in Catalog</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#14161A]/10 shadow-xs">
            <span className="text-[11px] font-medium text-[#5C6678] uppercase tracking-wider block">
              Total Stock Units
            </span>
            <div className="text-2xl font-serif font-bold text-[#14161A] mt-1">
              {products.reduce((acc, p) => acc + p.stockCount, 0)}
            </div>
            <span className="text-[11px] text-emerald-600 font-semibold">Ready to fulfill</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#14161A]/10 shadow-xs">
            <span className="text-[11px] font-medium text-[#5C6678] uppercase tracking-wider block">
              Catalog Value
            </span>
            <div className="text-2xl font-serif font-bold text-[#14161A] mt-1 tabular-nums">
              Rs. {products.reduce((acc, p) => acc + p.price * p.stockCount, 0).toLocaleString()}
            </div>
            <span className="text-[11px] text-[#5C6678]">Inventory estimate</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#14161A]/10 shadow-xs">
            <span className="text-[11px] font-medium text-[#5C6678] uppercase tracking-wider block">
              Admin Access
            </span>
            <div className="text-sm font-bold text-[#232D0F] mt-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#B8F235] inline-block animate-pulse" />
              <span>Full Permissions</span>
            </div>
            <span className="text-[11px] text-[#5C6678]">Change, Add, Price, Remove</span>
          </div>
        </div>

        {/* TAB 1: PRODUCT MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-[#14161A]/10 shadow-xs overflow-hidden">
            {/* Toolbar */}
            <div className="p-4 sm:p-5 border-b border-[#14161A]/10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#FBF6E8]/40">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products by title or origin..."
                  className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl py-2 pl-9 pr-3 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                />
                <Search className="w-4 h-4 text-[#5C6678] absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs bg-white border border-[#14161A]/15 rounded-xl py-2 px-3 text-[#14161A] focus:outline-none focus:border-[#3B4A1F] cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  <option value="crafts">Artisan Crafts</option>
                  <option value="organic">Organic & Food</option>
                  <option value="gear">Mountain & Living</option>
                  <option value="clothing">Apparel & Weaves</option>
                  <option value="tech">Modern Essentials</option>
                </select>

                <button
                  onClick={openNewProductModal}
                  className="px-4 py-2 bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-bold rounded-xl flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#B8F235]" />
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#232D0F]/5 text-[#5C6678] uppercase text-[10px] tracking-wider border-b border-[#14161A]/10">
                  <tr>
                    <th className="py-3 px-4">Item</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Origin / Tag</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Amount (NPR)</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#14161A]/10">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#FBF6E8]/50 transition-colors">
                      {/* Product Image & Title */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0 border border-[#14161A]/10"
                          />
                          <div>
                            <span className="font-bold text-sm text-[#14161A] line-clamp-1 block">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-[#5C6678] font-mono">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#3B4A1F]/10 text-[#3B4A1F] font-semibold text-[11px]">
                          {product.categoryLabel}
                        </span>
                      </td>

                      {/* Origin & Tag */}
                      <td className="py-3 px-4">
                        <div className="text-[11px] text-[#14161A] font-medium">{product.origin}</div>
                        {product.artisanTag && (
                          <div className="text-[10px] text-[#556B2F] font-semibold">
                            {product.artisanTag}
                          </div>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold tabular-nums ${
                            product.stockCount <= 5 ? 'text-amber-700' : 'text-[#14161A]'
                          }`}
                        >
                          {product.stockCount} in stock
                        </span>
                      </td>

                      {/* Amount / Price with Inline Edit */}
                      <td className="py-3 px-4">
                        {quickAmountId === product.id ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={quickAmountValue}
                              onChange={(e) => setQuickAmountValue(Number(e.target.value))}
                              className="w-24 text-xs bg-white border border-[#3B4A1F] rounded-lg p-1.5 font-bold"
                              min="1"
                            />
                            <button
                              onClick={() => handleQuickAmountSave(product.id)}
                              className="p-1 bg-[#3B4A1F] text-[#B8F235] rounded-md hover:bg-[#232D0F]"
                              title="Save amount"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setQuickAmountId(null)}
                              className="p-1 text-[#5C6678] hover:text-[#14161A]"
                              title="Cancel"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div>
                              <span className="text-sm font-extrabold text-[#232D0F] tabular-nums">
                                Rs. {product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-[10px] text-[#5C6678] line-through block tabular-nums">
                                  Rs. {product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                setQuickAmountId(product.id);
                                setQuickAmountValue(product.price);
                              }}
                              className="p-1 text-[#556B2F] hover:bg-[#3B4A1F]/10 rounded-md transition-colors"
                              title="Quick edit amount"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Admin Actions: Edit (Change Item), Delete (Remove Product) */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(product)}
                            className="px-2.5 py-1.5 bg-[#3B4A1F]/10 hover:bg-[#3B4A1F] text-[#3B4A1F] hover:text-[#F5EEDC] rounded-lg font-medium transition-colors flex items-center gap-1 cursor-pointer"
                            title="Change item details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Change</span>
                          </button>

                          <button
                            onClick={() => setProductToDelete(product)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="p-8 text-center text-[#5C6678]">
                  <p className="text-sm font-semibold">No products match your search or filter.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: OTHER SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl border border-[#14161A]/10 shadow-xs p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-serif font-bold text-xl text-[#14161A]">Store & Catalog Settings</h2>
              <p className="text-xs text-[#5C6678] mt-1">
                Configure delivery rates, announcement bar, discounts, and store behavior.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store Name */}
                <div>
                  <label className="block text-xs font-bold text-[#14161A] mb-1.5">
                    Store Brand Name
                  </label>
                  <input
                    type="text"
                    value={settingsForm.storeName}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, storeName: e.target.value })
                    }
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Announcement Bar */}
                <div>
                  <label className="block text-xs font-bold text-[#14161A] mb-1.5">
                    Announcement Banner Text
                  </label>
                  <input
                    type="text"
                    value={settingsForm.bannerText}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, bannerText: e.target.value })
                    }
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Standard Shipping Fee */}
                <div>
                  <label className="block text-xs font-bold text-[#14161A] mb-1.5">
                    Standard Shipping Fee across Nepal (NPR)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.standardShipping}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        standardShipping: Number(e.target.value)
                      })
                    }
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Tax / VAT Percentage */}
                <div>
                  <label className="block text-xs font-bold text-[#14161A] mb-1.5">
                    Tax / VAT Rate (%)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.taxPercentage}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        taxPercentage: Number(e.target.value)
                      })
                    }
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Active Promo Code */}
                <div>
                  <label className="block text-xs font-bold text-[#14161A] mb-1.5">
                    Active Promo Code
                  </label>
                  <input
                    type="text"
                    value={settingsForm.promoCode}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        promoCode: e.target.value.toUpperCase()
                      })
                    }
                    className="w-full text-xs uppercase bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Promo Discount Rate */}
                <div>
                  <label className="block text-xs font-bold text-[#14161A] mb-1.5">
                    Promo Discount (%)
                  </label>
                  <input
                    type="number"
                    value={settingsForm.promoDiscount}
                    onChange={(e) =>
                      setSettingsForm({
                        ...settingsForm,
                        promoDiscount: Number(e.target.value)
                      })
                    }
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Support Email */}
                <div>
                  <label className="block text-xs font-bold text-[#14161A] mb-1.5">
                    Customer Support Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.supportEmail}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, supportEmail: e.target.value })
                    }
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Support Phone */}
                <div>
                  <label className="block text-xs font-bold text-[#14161A] mb-1.5">
                    Support Hotline / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={settingsForm.supportPhone}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, supportPhone: e.target.value })
                    }
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>
              </div>

              {/* Reset Catalog Section */}
              <div className="pt-6 border-t border-[#14161A]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-[#14161A]">Restore Default Products</h4>
                  <p className="text-[11px] text-[#5C6678]">
                    Reset the catalog to initial verified Nepal products if you want to start fresh.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Are you sure you want to reset all products to default? Any custom items will be overwritten.')) {
                      onResetCatalog();
                      showToast('Catalog restored to default items.');
                    }
                  }}
                  className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-xl border border-red-200 transition-colors cursor-pointer"
                >
                  Reset Catalog
                </button>
              </div>

              {/* Submit Settings */}
              <div className="pt-4 border-t border-[#14161A]/10 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT PRODUCT (Change Item & Add Product) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl overflow-hidden border border-[#14161A]/15 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="bg-[#232D0F] text-[#F5EEDC] px-6 py-4 flex items-center justify-between border-b border-[#3B4A1F]">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[#B8F235]" />
                <h3 className="font-serif font-bold text-base text-white">
                  {isNewProduct ? 'Add New Product to Catalog' : `Change Item: ${editingProduct?.name}`}
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#F5EEDC]/80 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scroll Area */}
            <form onSubmit={handleSaveProduct} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Product Name */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#14161A] mb-1">Product Title</label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Pure Nepal Pashmina Shawl"
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block font-bold text-[#14161A] mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  >
                    <option value="crafts">Artisan Crafts</option>
                    <option value="organic">Organic & Food</option>
                    <option value="gear">Mountain & Living</option>
                    <option value="clothing">Apparel & Weaves</option>
                    <option value="tech">Modern Essentials</option>
                  </select>
                </div>

                {/* Amount / Price */}
                <div>
                  <label className="block font-bold text-[#14161A] mb-1">
                    Amount / Selling Price (NPR)
                  </label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    min="1"
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F] font-bold"
                    required
                  />
                </div>

                {/* Original Price */}
                <div>
                  <label className="block font-bold text-[#14161A] mb-1">
                    Original Price (Optional strikethrough)
                  </label>
                  <input
                    type="number"
                    value={formOriginalPrice}
                    onChange={(e) => setFormOriginalPrice(Number(e.target.value))}
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Stock Count */}
                <div>
                  <label className="block font-bold text-[#14161A] mb-1">Units in Stock</label>
                  <input
                    type="number"
                    value={formStockCount}
                    onChange={(e) => setFormStockCount(Number(e.target.value))}
                    min="0"
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Origin */}
                <div>
                  <label className="block font-bold text-[#14161A] mb-1">
                    Origin (District / Region)
                  </label>
                  <input
                    type="text"
                    value={formOrigin}
                    onChange={(e) => setFormOrigin(e.target.value)}
                    placeholder="e.g. Mustang, Gandaki Province"
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Artisan Tag */}
                <div>
                  <label className="block font-bold text-[#14161A] mb-1">Artisan Tag / Provenance</label>
                  <input
                    type="text"
                    value={formArtisanTag}
                    onChange={(e) => setFormArtisanTag(e.target.value)}
                    placeholder="e.g. 100% Changthangi Cashmere"
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#14161A] mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                  {formImage && (
                    <div className="mt-2 flex items-center gap-2">
                      <img
                        src={formImage}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as any).src =
                            'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <span className="text-[11px] text-[#5C6678]">Image preview loaded</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#14161A] mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>

                {/* Features (One per line) */}
                <div className="sm:col-span-2">
                  <label className="block font-bold text-[#14161A] mb-1">
                    Features / Bullets (One per line)
                  </label>
                  <textarea
                    rows={3}
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                    placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                    className="w-full bg-white border border-[#14161A]/15 rounded-xl p-2.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#14161A]/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#14161A]/20 rounded-xl text-[#5C6678] hover:text-[#14161A] font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] font-bold rounded-xl shadow-xs"
                >
                  {isNewProduct ? 'Add to Catalog' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL (Remove Product) */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-sm bg-white rounded-2xl p-6 border border-red-200 shadow-2xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#14161A]">Remove Product?</h3>
              <p className="text-xs text-[#5C6678] mt-1">
                Are you sure you want to remove <strong className="text-[#14161A]">"{productToDelete.name}"</strong> from the store catalog?
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-2 border border-[#14161A]/20 rounded-xl text-xs font-semibold text-[#5C6678] hover:text-[#14161A]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
