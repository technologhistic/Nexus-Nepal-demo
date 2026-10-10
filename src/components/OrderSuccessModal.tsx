import React from 'react';
import { Order } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-lg p-6 sm:p-8 border border-[#14161A]/15 shadow-xl text-center">
        <div className="w-12 h-12 rounded-sm bg-[#437A22]/15 text-[#437A22] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-[#556B2F]">
          Order Confirmed
        </p>
        <h2 className="text-xl font-serif font-bold text-[#14161A] mt-1">
          Thank you, {order.shippingAddress.fullName}
        </h2>
        <p className="text-xs text-[#5C6678] mt-2">
          Your order has been recorded and scheduled for domestic courier dispatch.
        </p>

        {/* Order Details Card */}
        <div className="my-6 p-4 rounded-md bg-[#FBF6E8] border border-[#14161A]/10 text-left text-xs space-y-2">
          <div className="flex justify-between items-center pb-2 border-b border-[#14161A]/10">
            <span className="text-[#5C6678]">Order Reference:</span>
            <span className="font-mono font-bold text-[#14161A]">{order.id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5C6678]">Payment Method:</span>
            <span className="font-bold uppercase text-[#14161A]">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5C6678]">Order Total:</span>
            <span className="font-bold text-[#14161A] tabular-nums">NPR {order.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#5C6678]">Delivery Destination:</span>
            <span className="font-medium text-[#14161A] text-right truncate max-w-[200px]">
              {order.shippingAddress.street}, {order.shippingAddress.city}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-md bg-gray-100 hover:bg-gray-200 text-[#14161A] font-medium text-xs transition-colors"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => {
              onClose();
              onGoToOrders();
            }}
            className="flex-1 py-2.5 px-4 rounded-md bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>View Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
