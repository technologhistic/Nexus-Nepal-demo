import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, Award, Clock, ArrowRight, ShieldCheck, LogOut } from 'lucide-react';

interface AccountViewProps {
  onBackToShop: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onBackToShop }) => {
  const { user, logout, openAuthModal } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-3xl border border-[#3B4A1F]/15 shadow-sm">
        <h2 className="font-serif font-bold text-xl text-[#232D0F] mb-2">
          Sign In to Access Your Orders
        </h2>
        <p className="text-xs text-[#5C6678] mb-6">
          Keep track of your Himalayan artisan orders, delivery status, and club rewards.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="w-full py-3 rounded-full bg-[#3B4A1F] text-[#F5EEDC] font-bold text-xs"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Account Header */}
      <div className="bg-gradient-to-r from-[#3B4A1F] via-[#4F6428] to-[#232D0F] rounded-3xl p-6 sm:p-8 text-[#F5EEDC] shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B8F235]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D6FF6A] to-[#B8F235] text-[#232D0F] font-serif font-extrabold text-2xl flex items-center justify-center shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold">{user.name}</h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#B8F235]/25 text-[#D6FF6A]">
                  Himalayan Member
                </span>
              </div>
              <p className="text-xs text-[#F5EEDC]/80 mt-0.5">{user.email}</p>
              <p className="text-[11px] text-[#F5EEDC]/60 flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-[#B8F235]" />
                <span>{user.address || 'Kathmandu, Nepal'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <span className="block text-[10px] uppercase font-bold text-[#D6FF6A]">
                Reward Points
              </span>
              <span className="text-xl font-extrabold font-mono text-white">
                {user.rewardPoints}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 text-[#F5EEDC] transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl text-[#232D0F]">
            Your Orders ({user.orders?.length || 0})
          </h2>
          <button
            onClick={onBackToShop}
            className="text-xs font-semibold text-[#556B2F] hover:text-black flex items-center gap-1"
          >
            <span>Browse Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {!user.orders || user.orders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-[#3B4A1F]/15">
            <Package className="w-12 h-12 text-[#5C6678]/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#232D0F]">No orders placed yet</p>
            <p className="text-xs text-[#5C6678] mt-1 mb-4">
              Explore authentic Nepali teas, singing bowls, and mountain apparel.
            </p>
            <button
              onClick={onBackToShop}
              className="px-5 py-2.5 rounded-full bg-[#3B4A1F] text-[#F5EEDC] text-xs font-bold"
            >
              Shop Now
            </button>
          </div>
        ) : (
          user.orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-[#3B4A1F]/15 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#3B4A1F]/10 text-xs">
                <div>
                  <span className="text-[#5C6678]">Order ID: </span>
                  <span className="font-mono font-bold text-[#232D0F]">{order.id}</span>
                  <span className="text-[#5C6678] ml-3">Date: {order.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px] flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{order.orderStatus}</span>
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#3B4A1F]/10 text-[#232D0F] font-bold text-[11px] uppercase">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 rounded-xl object-cover bg-gray-100"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-[#14161A]">{product.name}</h4>
                      <p className="text-[#5C6678]">
                        Qty: {quantity} • Provenance: {product.origin}
                      </p>
                    </div>
                    <span className="font-bold text-[#232D0F]">
                      Rs. {(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#3B4A1F]/10 text-xs">
                <div className="text-[#5C6678]">
                  <span>Shipping to: </span>
                  <span className="font-medium text-[#14161A]">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#5C6678]">Grand Total: </span>
                  <span className="font-extrabold text-sm text-[#232D0F]">
                    Rs. {order.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
