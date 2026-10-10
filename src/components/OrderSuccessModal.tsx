import React from 'react';
import { Order } from '../types';
import { CheckCircle, Package, ArrowRight, MapPin, CreditCard, Sparkles } from 'lucide-react';

interface OrderSuccessModalProps {
  order: Order | null;
  onClose: () => void;
  onGoToOrders: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onGoToOrders
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#3B4A1F]/20 text-center animate-in zoom-in-95">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#556B2F]">
          Dhanyabad! Order Confirmed
        </span>
        <h2 className="text-2xl font-serif font-bold text-[#232D0F] mt-1">
          Namaste, {order.shippingAddress.fullName}!
        </h2>
        <p className="text-xs sm:text-sm text-[#5C6678] mt-2">
          Your order has been placed with Nexus Nepal artisans and is preparing for dispatch.
        </p>

        {/* Order Details Card */}
        <div className="my-6 p-4 rounded-2xl bg-[#FBF6E8] border border-[#3B4A1F]/15 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center pb-2 border-b border-[#3B4A1F]/10">
            <span className="text-[#5C6678]">Order ID:</span>
            <span className="font-mono font-bold text-[#232D0F]">{order.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5C6678]">Payment Method:</span>
            <span className="font-bold uppercase text-[#232D0F]">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5C6678]">Total Paid / Due:</span>
            <span className="font-bold text-[#232D0F]">Rs. {order.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5C6678]">Delivery Location:</span>
            <span className="font-medium text-[#14161A] text-right truncate max-w-[200px]">
              {order.shippingAddress.street}, {order.shippingAddress.city}
            </span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-[#3B4A1F]/10 text-emerald-700 font-bold">
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F235]" />
              <span>Himalayan Club Reward:</span>
            </div>
            <span>+{Math.floor(order.total * 0.05)} Points</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#14161A] font-semibold text-xs transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToOrders();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-md"
          >
            <span>Track in Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
