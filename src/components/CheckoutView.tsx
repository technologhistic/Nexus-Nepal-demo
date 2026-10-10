import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { ArrowLeft, CheckCircle2, ShieldCheck, MapPin, CreditCard, Wallet, Truck } from 'lucide-react';

interface CheckoutViewProps {
  onBack: () => void;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ onBack, onOrderComplete }) => {
  const { items, subtotal, shippingFee, discountAmount, total, placeOrder } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [province, setProvince] = useState('Bagmati Province');
  const [city, setCity] = useState(user?.city || 'Kathmandu');
  const [street, setStreet] = useState(user?.address || '');

  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('esewa');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const PROVINCES = [
    'Bagmati Province (Kathmandu Valley & beyond)',
    'Gandaki Province (Pokhara, Mustang)',
    'Koshi Province (Ilam, Biratnagar, Dharan)',
    'Lumbini Province (Palpa, Butwal, Bhairahawa)',
    'Madhesh Province (Janakpur, Birgunj)',
    'Karnali Province (Surkhet)',
    'Sudurpashchim Province (Dhangadhi)'
  ];

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim() || !street.trim()) {
      setErrorMessage('Please fill in your recipient name, phone, and delivery address.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);
    // Simulate gateway handoff
    setTimeout(() => {
      const order = placeOrder(
        {
          fullName,
          phone,
          province,
          city,
          street
        },
        paymentMethod
      );
      setIsSubmitting(false);
      onOrderComplete(order);
    }, 900);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-semibold text-[#3B4A1F] hover:text-black mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Form: Delivery & Payment Details */}
        <div className="flex-1 space-y-6">
          
          {/* Shipping Address Section */}
          <div className="bg-white rounded-lg p-6 md:p-8 border border-[#14161A]/10 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 text-[#14161A]">
              <div className="w-6 h-6 rounded-sm bg-[#3B4A1F] text-[#F5EEDC] flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="font-serif font-bold text-lg">Delivery Destination (Nepal)</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-[#5C6678] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full text-xs md:text-sm bg-[#FBF6E8] border border-[#14161A]/20 rounded-md py-2.5 px-3.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  placeholder="Full name"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C6678] mb-1">
                  Mobile Number (for Courier SMS)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs md:text-sm bg-[#FBF6E8] border border-[#14161A]/20 rounded-md py-2.5 px-3.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  placeholder="+977 98XXXXXXXX"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C6678] mb-1">
                  Province
                </label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="w-full text-xs md:text-sm bg-[#FBF6E8] border border-[#14161A]/20 rounded-md py-2.5 px-3.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                >
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#5C6678] mb-1">
                  City / Municipality
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-xs md:text-sm bg-[#FBF6E8] border border-[#14161A]/20 rounded-md py-2.5 px-3.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  placeholder="Kathmandu, Pokhara, etc."
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-[#5C6678] mb-1">
                  Street Address & Landmark
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs md:text-sm bg-[#FBF6E8] border border-[#14161A]/20 rounded-md py-2.5 px-3.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  placeholder="House No., Street, Landmark (e.g. Near Bhatbhateni Supermarket)"
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method Section */}
          <div className="bg-white rounded-lg p-6 md:p-8 border border-[#14161A]/10 shadow-xs">
            <div className="flex items-center gap-2.5 mb-6 text-[#14161A]">
              <div className="w-6 h-6 rounded-sm bg-[#3B4A1F] text-[#F5EEDC] flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="font-serif font-bold text-lg">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* eSewa */}
              <div
                onClick={() => setPaymentMethod('esewa')}
                className={`p-4 rounded-md border-2 cursor-pointer transition-colors flex items-center gap-3.5 ${
                  paymentMethod === 'esewa'
                    ? 'border-[#437A22] bg-[#437A22]/10 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-sm bg-[#437A22] text-white flex items-center justify-center font-bold text-sm">
                  eS
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#14161A]">eSewa Wallet</span>
                    {paymentMethod === 'esewa' && (
                      <CheckCircle2 className="w-4 h-4 text-[#437A22]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#5C6678]">
                    Digital wallet verification
                  </p>
                </div>
              </div>

              {/* Khalti */}
              <div
                onClick={() => setPaymentMethod('khalti')}
                className={`p-4 rounded-md border-2 cursor-pointer transition-colors flex items-center gap-3.5 ${
                  paymentMethod === 'khalti'
                    ? 'border-[#1E293B] bg-slate-100 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-sm bg-[#1E293B] text-white flex items-center justify-center font-bold text-sm">
                  Kh
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#14161A]">Khalti Digital</span>
                    {paymentMethod === 'khalti' && (
                      <CheckCircle2 className="w-4 h-4 text-[#1E293B]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#5C6678]">
                    Direct QR and wallet transfer
                  </p>
                </div>
              </div>

              {/* Cash on Delivery (COD) */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-md border-2 cursor-pointer transition-colors flex items-center gap-3.5 ${
                  paymentMethod === 'cod'
                    ? 'border-[#3B4A1F] bg-[#3B4A1F]/10 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-sm bg-[#3B4A1F] text-[#F5EEDC] flex items-center justify-center font-bold text-sm">
                  COD
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#14161A]">Cash on Delivery</span>
                    {paymentMethod === 'cod' && (
                      <CheckCircle2 className="w-4 h-4 text-[#3B4A1F]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#5C6678]">
                    Pay cash upon delivery to your doorstep
                  </p>
                </div>
              </div>

              {/* ConnectIPS */}
              <div
                onClick={() => setPaymentMethod('connectips')}
                className={`p-4 rounded-md border-2 cursor-pointer transition-colors flex items-center gap-3.5 ${
                  paymentMethod === 'connectips'
                    ? 'border-[#0F172A] bg-gray-100 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="w-10 h-10 rounded-sm bg-[#0F172A] text-white flex items-center justify-center font-bold text-xs">
                  IPS
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#14161A]">connectIPS / Bank</span>
                    {paymentMethod === 'connectips' && (
                      <CheckCircle2 className="w-4 h-4 text-[#0F172A]" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#5C6678]">
                    Direct bank account transfer via NCHL
                  </p>
                </div>
              </div>

            </div>

            <div className="mt-4 p-3 bg-[#FBF6E8] rounded-xl flex items-center gap-2 text-xs text-[#556B2F]">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Payments are protected with 256-bit SSL encryption & Nepal Rastra Bank compliances.</span>
            </div>
          </div>
        </div>

        {/* Right Summary Column */}
        <div className="w-full lg:w-96 space-y-6">
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-[#3B4A1F]/15 shadow-sm sticky top-28">
            <h3 className="font-serif font-bold text-lg text-[#232D0F] mb-4">
              Order Summary
            </h3>

            {/* Item Thumbnails */}
            <div className="space-y-3 mb-6 max-h-52 overflow-y-auto pr-1">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-11 h-11 rounded-lg object-cover bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#14161A] truncate">{product.name}</p>
                    <p className="text-[#5C6678]">Qty: {quantity}</p>
                  </div>
                  <span className="font-bold text-[#232D0F]">
                    Rs. {(product.price * quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2 text-xs text-[#5C6678] pt-4 border-t border-[#3B4A1F]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-[#14161A]">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Store Promo Discount</span>
                  <span>- Rs. {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping in Nepal</span>
                <span className="font-bold text-[#14161A]">
                  {shippingFee === 0 ? 'FREE' : `Rs. ${shippingFee}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-[#232D0F] pt-3 border-t border-[#3B4A1F]/10">
                <span>Grand Total</span>
                <span>Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {errorMessage && (
              <p className="mt-4 text-xs font-semibold text-[#B3341F] bg-[#B3341F]/10 p-2.5 rounded-lg">
                {errorMessage}
              </p>
            )}

            <button
              onClick={handleSubmitOrder}
              disabled={isSubmitting || items.length === 0}
              className="mt-6 w-full h-11 rounded-md bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] font-semibold text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order</span>
                  <span className="text-[#B8F235]">(NPR {total.toLocaleString()})</span>
                </>
              )}
            </button>

            <p className="mt-3 text-center text-[11px] text-[#5C6678]">
              By confirming, you agree to Nexus Nepal terms & customer protection policies.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
