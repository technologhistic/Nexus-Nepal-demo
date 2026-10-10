import React from 'react';
import { ArrowLeft, Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBackToShop: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBackToShop }) => {
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
            Privacy Policy
          </h1>
          <p className="text-xs text-[#5C6678] mt-2">
            Effective Date: October 2026. Compliant with Nepal Electronic Transactions Act 2063 and Consumer Protection Act 2075.
          </p>
        </div>

        <div className="space-y-8 text-xs sm:text-sm text-[#14161A] leading-relaxed">
          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              1. Our Privacy Commitment
            </h2>
            <p className="text-[#5C6678]">
              Nexus Nepal ("we", "our", or "us") operates the marketplace for authentic Nepali handicrafts, organic produce, and regional specialties. We are committed to protecting your personal information. We do not sell, rent, trade, or monetize customer data to third-party advertisers or data brokers under any circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              2. Information We Collect
            </h2>
            <p className="text-[#5C6678] mb-3">
              We collect only the minimum required information necessary to fulfill your orders and maintain account security:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-[#5C6678]">
              <li><strong>Contact Information:</strong> Full name, verified mobile number, and email address.</li>
              <li><strong>Fulfillment & Delivery Details:</strong> Physical address, city, ward number, province, and local landmark in Nepal.</li>
              <li><strong>Order History:</strong> Specific items purchased, order totals, and fulfillment status timestamps.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              3. Payment Security & Financial Data
            </h2>
            <p className="text-[#5C6678]">
              All electronic payments in Nepal (via eSewa, Khalti, or connectIPS) are processed directly through licensed Nepal Rastra Bank payment service providers. Nexus Nepal never handles, stores, or logs your wallet PINs, banking passwords, or card verification codes. Transactions are authenticated using secure cryptographic tokens and TLS encryption.
            </p>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              4. Logistics & Courier Disclosure
            </h2>
            <p className="text-[#5C6678]">
              To deliver your products across Nepal's 7 provinces, your recipient name, delivery destination, and contact phone number are shared solely with authorized domestic courier partners for the express purpose of package delivery and dispatch confirmation.
            </p>
          </section>

          <section>
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              5. Customer Rights & Data Deletion
            </h2>
            <p className="text-[#5C6678]">
              You hold the right to inspect, correct, or permanently request deletion of your account and personal data from our systems. Upon receiving a formal data deletion request, all personal identifiers are permanently purged within 30 business days, excluding records required for statutory tax accounting under Nepal tax regulations.
            </p>
          </section>

          <section className="pt-4 border-t border-[#14161A]/10">
            <h2 className="text-base font-serif font-bold text-[#14161A] mb-2">
              6. Grievance Officer & Contact
            </h2>
            <p className="text-[#5C6678]">
              In accordance with Nepal eCommerce guidelines, you may direct privacy inquiries or grievance notices to:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-md text-xs space-y-1 text-[#14161A]">
              <p><strong>Grievance Officer:</strong> Legal & Compliance Department</p>
              <p><strong>Entity:</strong> Nexus Nepal Trade & Commerce</p>
              <p><strong>Address:</strong> Lazimpat, Kathmandu 44600, Nepal</p>
              <p><strong>Email:</strong> privacy@nexusnepal.com</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
