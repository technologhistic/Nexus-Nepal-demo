import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, MapPin, Clock, ArrowRight, LogOut, CheckCircle2 } from 'lucide-react';

interface AccountViewProps {
  onBackToShop: () => void;
  onNavigateToAuth: () => void;
}

export const AccountView: React.FC<AccountViewProps> = ({ onBackToShop, onNavigateToAuth }) => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-16 text-center p-8 bg-white rounded-lg border border-[#14161A]/10 shadow-xs">
        <h2 className="font-serif font-bold text-xl text-[#14161A] mb-2">
          Sign In to Access Your Orders
        </h2>
        <p className="text-xs text-[#5C6678] mb-6">
          Access your order history and delivery dispatches across Nepal.
        </p>
        <button
          onClick={onNavigateToAuth}
          className="w-full py-2.5 rounded-md bg-[#3B4A1F] text-[#F5EEDC] font-semibold text-xs cursor-pointer"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      {/* Account Header */}
      <div className="bg-[#232D0F] rounded-lg p-6 sm:p-8 text-[#F5EEDC] mb-8 border border-[#3B4A1F]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#B8F235] shadow-sm"
              />
            ) : (
              <div className="w-14 h-14 rounded-md bg-[#3B4A1F] text-[#B8F235] font-serif font-bold text-2xl flex items-center justify-center border border-[#556B2F]">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-serif font-bold">{user.name}</h1>
                <span className="text-[10px] bg-[#B8F235] text-[#232D0F] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {user.role === 'admin' ? 'Administrator' : 'Buyer Verified'}
                </span>
              </div>
              <p className="text-xs text-[#F5EEDC]/80 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-[#F5EEDC]/70">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B8F235]" />
                  <span>Buying permissions active</span>
                </span>
                {user.authProvider && (
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">
                    {user.authProvider === 'google' ? 'Google OAuth' : 'Email & Password'}
                  </span>
                )}
              </div>
              {user.address && (
                <p className="text-[11px] text-[#F5EEDC]/60 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-[#B8F235]" />
                  <span>{user.address}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={logout}
              className="px-3 py-2 rounded-md bg-white/10 hover:bg-white/20 text-[#F5EEDC] text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#14161A]/10">
          <h2 className="font-serif font-bold text-xl text-[#14161A]">
            Order History ({user.orders?.length || 0})
          </h2>
          <button
            onClick={onBackToShop}
            className="text-xs font-medium text-[#3B4A1F] hover:text-black flex items-center gap-1"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {!user.orders || user.orders.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg border border-[#14161A]/10">
            <Package className="w-10 h-10 text-[#5C6678]/40 mx-auto mb-2" />
            <p className="text-sm font-semibold text-[#14161A]">No orders placed yet</p>
            <p className="text-xs text-[#5C6678] mt-1 mb-4">
              Explore authentic Nepali craft goods, tea, and outdoor gear.
            </p>
            <button
              onClick={onBackToShop}
              className="px-4 py-2 rounded-md bg-[#3B4A1F] text-[#F5EEDC] text-xs font-semibold"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          user.orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg p-6 border border-[#14161A]/10 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#14161A]/10 text-xs">
                <div>
                  <span className="text-[#5C6678]">Order ID: </span>
                  <span className="font-mono font-bold text-[#14161A]">{order.id}</span>
                  <span className="text-[#5C6678] ml-3">Date: {order.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-xs bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{order.orderStatus}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-xs bg-gray-100 text-[#14161A] font-medium text-[11px] uppercase border border-gray-200">
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
                      className="w-12 h-12 rounded-sm object-cover bg-gray-100 border border-gray-200"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-[#14161A]">{product.name}</h3>
                      <p className="text-[#5C6678]">
                        Qty: {quantity} · Origin: {product.origin}
                      </p>
                    </div>
                    <span className="font-semibold text-[#14161A] tabular-nums">
                      NPR {(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-[#14161A]/10 text-xs">
                <div className="text-[#5C6678]">
                  <span>Delivery destination: </span>
                  <span className="font-medium text-[#14161A]">
                    {order.shippingAddress.street}, {order.shippingAddress.city}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[#5C6678]">Total: </span>
                  <span className="font-bold text-sm text-[#14161A] tabular-nums">
                    NPR {order.total.toLocaleString()}
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
