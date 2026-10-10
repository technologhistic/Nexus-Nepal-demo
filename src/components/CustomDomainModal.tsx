import React, { useState, useEffect } from 'react';
import { X, Globe, Check, AlertCircle, Copy, Shield, RefreshCw } from 'lucide-react';

interface CustomDomainModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomDomainModal: React.FC<CustomDomainModalProps> = ({ isOpen, onClose }) => {
  const [domainInput, setDomainInput] = useState(() => {
    return localStorage.getItem('nexus_custom_domain') || 'shop.nexusnepal.com';
  });
  const [connectedDomain, setConnectedDomain] = useState(() => {
    return localStorage.getItem('nexus_connected_domain') || 'shop.nexusnepal.com';
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'connected' | 'pending' | 'unconfigured'>('connected');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const dnsRecords = [
    {
      type: 'A',
      name: '@',
      value: '216.239.32.21',
      ttl: '3600',
      status: 'Verified'
    },
    {
      type: 'CNAME',
      name: 'www',
      value: 'ghs.googlehosted.com',
      ttl: '3600',
      status: 'Verified'
    },
    {
      type: 'TXT',
      name: '_nexus-verify',
      value: 'nexus-verification=np-84920-prod',
      ttl: '3600',
      status: 'Verified'
    }
  ];

  const handleCopy = (val: string, field: string) => {
    navigator.clipboard.writeText(val);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleVerify = () => {
    if (!domainInput.trim()) return;
    setIsVerifying(true);
    setTimeout(() => {
      setConnectedDomain(domainInput.trim());
      setVerificationStatus('connected');
      localStorage.setItem('nexus_custom_domain', domainInput.trim());
      localStorage.setItem('nexus_connected_domain', domainInput.trim());
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-lg p-6 sm:p-8 shadow-xl border border-[#14161A]/15 text-[#14161A]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-md hover:bg-gray-100 text-[#5C6678] transition-colors"
          aria-label="Close domain settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-md bg-[#3B4A1F] text-[#F5EEDC] flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-bold text-xl">Custom Domain Settings</h2>
            <p className="text-xs text-[#5C6678]">
              Connect your official production domain for Nexus Nepal
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-4 p-3.5 bg-gray-50 rounded-md border border-gray-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-xs bg-emerald-600"></span>
            <span className="font-medium text-[#14161A]">
              Active Domain: <strong className="font-mono">{connectedDomain}</strong>
            </span>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-xs">
            SSL TLS Encrypted
          </span>
        </div>

        {/* Domain Input */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-[#14161A] mb-1.5">
            Production Domain Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="e.g. nexusnepal.com or shop.nexusnepal.com.np"
              className="flex-1 text-xs font-mono bg-white border border-[#14161A]/20 rounded-md py-2.5 px-3.5 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
            />
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="px-4 py-2.5 bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Checking DNS...' : 'Verify & Connect'}</span>
            </button>
          </div>
        </div>

        {/* DNS Configuration Table */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#5C6678] mb-2">
            Required DNS Records at Your Registrar
          </h3>
          <div className="border border-gray-200 rounded-md overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[#5C6678] font-medium text-[11px]">
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Host / Name</th>
                  <th className="py-2 px-3">Target Value</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-mono text-[11px]">
                {dnsRecords.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="py-2.5 px-3 font-bold text-[#14161A]">{r.type}</td>
                    <td className="py-2.5 px-3 text-[#5C6678]">{r.name}</td>
                    <td className="py-2.5 px-3 text-[#14161A] truncate max-w-[200px]">
                      {r.value}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => handleCopy(r.value, `record-${i}`)}
                        className="text-[11px] text-[#3B4A1F] hover:text-black font-sans font-medium"
                      >
                        {copiedField === `record-${i}` ? 'Copied' : 'Copy'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-4 p-3 bg-gray-50 rounded-md text-[11px] text-[#5C6678] flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#556B2F] shrink-0" />
          <span>
            DNS changes usually take 1 to 24 hours to propagate worldwide. Automatic TLS certificates are provisioned upon DNS validation.
          </span>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs font-semibold transition-colors"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
