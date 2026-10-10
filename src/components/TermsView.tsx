import React from 'react';
import { ArrowLeft, Scale, Shield, CheckCircle } from 'lucide-react';

interface TermsViewProps {
  onBackToShop: () => void;
}

export const TermsView: React.FC<TermsViewProps> = ({ onBackToShop }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-[#14161A] animate-in fade-in">
      <button
        onClick={onBackToShop}
        className="flex items-center gap-2 text-xs font-semibold text-[#3B4A1F] hover:text-black mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </button>

      <div className="bg-white rounded-lg border border-[#14161A]/10 p-6 sm:p-10 shadow-xs">
        <div className="border-b border-[#14161A]/10 pb-6 mb-8">
          <p className="text-xs font-semibold text-[#556B2F] tracking-wide uppercase mb-1">
            Nexus Nepal Legal & Compliance
          </p>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#14161A]">
            Terms and Conditions
          </h1>
          <p className="text-xs text-[#5C6678] mt-2">
            Last Updated: October 2026. Governed under the commercial and consumer protection laws of Nepal.
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#14161A] leading-relaxed">
          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              1. Commercial Relationship
            </h2>
            <p className="text-[#5C6678]">
              By accessing the Nexus Nepal platform, creating an account, or submitting a purchase order, you agree to be bound by these Terms and Conditions. These terms establish a legally binding agreement between you and Nexus Nepal.
            </p>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              2. Authentic Himalayan Provenance & Artisan Representation
            </h2>
            <p className="text-[#5C6678]">
              Nexus Nepal partners directly with recognized cooperatives, craft clusters, and organic producers across Nepal. All geographical indications (such as Mustang Pashmina, Palpali Dhaka, Ilam Orthodox Tea, and Patan Bell-Metalcrafts) represent genuine regional origin. Any claims regarding materials, weight, and specifications are verified by physical inspection prior to warehousing.
            </p>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              3. Pricing, Currency & Payment Terms
            </h2>
            <p className="text-[#5C6678]">
              All product prices are quoted in Nepali Rupees (NPR). Prices include applicable duties and VAT unless explicitly noted otherwise. Orders may be settled via supported digital wallets (eSewa, Khalti), interbank clearing (connectIPS), or Cash on Delivery (COD) within supported domestic delivery zones.
            </p>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              4. Shipping & Nationwide Delivery
            </h2>
            <p className="text-[#5C6678]">
              Deliveries within the Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur) are dispatched through direct courier services. Deliveries outside the valley to all 7 provinces are shipped via domestic logistics partners. Estimated delivery timelines range from 1 to 3 business days for Kathmandu Valley and 3 to 7 business days for regional districts.
            </p>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              5. 7-Day Return & Replacement Policy
            </h2>
            <p className="text-[#5C6678]">
              If an item is delivered with manufacturing defects, shipping damage, or does not match the specifications published on this platform, you may request a return or replacement within 7 calendar days of receipt. The item must be returned in its original condition with artisan certificates and packaging intact.
            </p>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              6. Limitation of Liability & Governing Law
            </h2>
            <p className="text-[#5C6678]">
              These terms shall be governed by and construed in accordance with the laws of Nepal. Any disputes arising out of or in connection with transactions on this platform shall be subject to the exclusive jurisdiction of the competent courts located in Kathmandu, Nepal.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
