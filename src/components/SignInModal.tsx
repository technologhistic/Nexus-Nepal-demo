import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Shield,
  ShoppingBag,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Lock,
  Mail,
  User as UserIcon,
  Sparkles
} from 'lucide-react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdminLogin?: () => void;
  reason?: string;
}

export const SignInModal: React.FC<SignInModalProps> = ({
  isOpen,
  onClose,
  onAdminLogin,
  reason
}) => {
  const { login, loginWithGoogle, signup } = useAuth();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');

  // Google Sign-in state
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');
  const [isGoogleCustomOpen, setIsGoogleCustomOpen] = useState(false);

  // Email form state
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');

  // Status & loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Google Sign In Handler
  const handleGoogleSignIn = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const emailToUse = googleEmail.trim() || 'buyer.nexus@gmail.com';
      const nameToUse = googleName.trim() || 'Verified Buyer';

      const result = await loginWithGoogle(emailToUse, nameToUse);

      if (result.isAdmin) {
        setSuccessMessage('Admin credentials verified. Opening Admin Panel…');
        setTimeout(() => {
          onClose();
          if (onAdminLogin) onAdminLogin();
        }, 600);
      } else {
        setSuccessMessage('Google ID verified! Buyer permissions active. You can now buy products.');
        setTimeout(() => {
          onClose();
        }, 700);
      }
    } catch {
      setErrorMessage('Google authentication could not be completed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Email / Password Handler
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const res = await login(emailOrUser, password);
      if (res.isAdmin) {
        setSuccessMessage('Administrator verified! Redirecting to Admin Panel…');
        setTimeout(() => {
          onClose();
          if (onAdminLogin) onAdminLogin();
        }, 600);
      } else {
        setSuccessMessage('Welcome back! Buyer permissions activated. Enjoy shopping.');
        setTimeout(() => {
          onClose();
        }, 700);
      }
    } catch {
      setErrorMessage('Invalid credentials. Please verify your email and password.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupEmail.trim() || signupPass.length < 6) {
      setErrorMessage('Please provide your name, valid email, and password (min 6 characters).');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await signup(signupName, signupEmail, signupPass);
      setSuccessMessage('Account created! Buyer permissions active. You can now purchase items.');
      setTimeout(() => {
        onClose();
      }, 700);
    } catch {
      setErrorMessage('Could not register account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-[#FBF6E8] rounded-2xl overflow-hidden border border-[#3B4A1F]/20 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header bar */}
        <div className="bg-[#232D0F] text-[#F5EEDC] px-6 py-5 flex items-center justify-between border-b border-[#3B4A1F]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#B8F235] text-[#232D0F] font-serif font-black text-lg flex items-center justify-center">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-serif font-bold text-lg text-white">
                <span>NEXUS</span>
                <span className="text-[#B8F235]">NEPAL</span>
              </div>
              <p className="text-[10px] text-[#F5EEDC]/80 uppercase tracking-wider">
                Authentication & Buyer Access
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#F5EEDC]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Reason Alert Banner (e.g. visitor trying to buy) */}
          {reason && (
            <div className="mb-5 p-3 rounded-xl bg-[#3B4A1F]/10 border border-[#3B4A1F]/20 flex items-start gap-2.5 text-xs text-[#232D0F]">
              <ShoppingBag className="w-4 h-4 text-[#556B2F] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#14161A]">Buyer Sign In Required</span>
                <span className="text-[#5C6678]">{reason}</span>
              </div>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex border-b border-[#14161A]/10 mb-5">
            <button
              onClick={() => {
                setActiveTab('signin');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'signin'
                  ? 'border-[#3B4A1F] text-[#232D0F]'
                  : 'border-transparent text-[#5C6678] hover:text-[#14161A]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab('signup');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                activeTab === 'signup'
                  ? 'border-[#3B4A1F] text-[#232D0F]'
                  : 'border-transparent text-[#5C6678] hover:text-[#14161A]'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* SIGN IN TAB */}
          {activeTab === 'signin' && (
            <div className="space-y-4">
              {/* PRIMARY METHOD: Google ID Sign-in */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-white hover:bg-gray-50 border border-[#14161A]/15 text-[#14161A] text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                >
                  {/* Google SVG Logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                    />
                  </svg>
                  <span>Continue with Google ID</span>
                  <span className="ml-auto text-[10px] bg-[#B8F235] text-[#232D0F] font-bold px-2 py-0.5 rounded-full">
                    Buyer Access
                  </span>
                </button>

                {/* Option to specify custom Google ID */}
                {!isGoogleCustomOpen ? (
                  <button
                    type="button"
                    onClick={() => setIsGoogleCustomOpen(true)}
                    className="text-[11px] text-[#556B2F] hover:underline block text-center w-full"
                  >
                    Enter specific Google Email or Google ID
                  </button>
                ) : (
                  <div className="p-3 bg-white/70 rounded-xl border border-[#3B4A1F]/15 space-y-2 mt-2">
                    <p className="text-[11px] font-semibold text-[#14161A]">
                      Sign in with your Google Account:
                    </p>
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full text-xs bg-white border border-[#14161A]/15 rounded-lg p-2 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                    />
                    <input
                      type="text"
                      value={googleName}
                      onChange={(e) => setGoogleName(e.target.value)}
                      placeholder="Full Name (optional)"
                      className="w-full text-xs bg-white border border-[#14161A]/15 rounded-lg p-2 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="flex-1 py-1.5 bg-[#3B4A1F] text-[#F5EEDC] text-xs font-semibold rounded-lg hover:bg-[#232D0F]"
                      >
                        Verify & Sign In as Buyer
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsGoogleCustomOpen(false)}
                        className="px-2.5 py-1.5 text-xs text-[#5C6678] hover:text-[#14161A]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="relative my-4 flex items-center justify-center">
                <div className="border-t border-[#14161A]/10 w-full" />
                <span className="bg-[#FBF6E8] px-3 text-[11px] text-[#5C6678] font-medium uppercase tracking-wider shrink-0">
                  Or Email / Admin Login
                </span>
                <div className="border-t border-[#14161A]/10 w-full" />
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSignIn} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#14161A] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={emailOrUser}
                      onChange={(e) => setEmailOrUser(e.target.value)}
                      placeholder="e.g. admin@gmail.com or buyer@gmail.com"
                      className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl py-2.5 pl-9 pr-3 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                    />
                    <Mail className="w-4 h-4 text-[#5C6678] absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#14161A]">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl py-2.5 pl-9 pr-10 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                    />
                    <Lock className="w-4 h-4 text-[#5C6678] absolute left-3 top-2.5" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-[#5C6678] hover:text-[#14161A]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Notice for Admin Login credentials */}
                <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-[#232D0F] flex items-start gap-2">
                  <Shield className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Store Administration:</span> Use{' '}
                    <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono text-[10px]">
                      admin@gmail.com
                    </code>{' '}
                    with password{' '}
                    <code className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-mono text-[10px]">
                      admin
                    </code>{' '}
                    to access the management panel.
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  {isLoading ? 'Verifying…' : 'Sign In'}
                </button>
              </form>
            </div>
          )}

          {/* SIGN UP TAB */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-[#14161A] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Laxmi Sharma"
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl py-2.5 pl-9 pr-3 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                  <UserIcon className="w-4 h-4 text-[#5C6678] absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14161A] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    placeholder="e.g. buyer@gmail.com"
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl py-2.5 pl-9 pr-3 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                  <Mail className="w-4 h-4 text-[#5C6678] absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#14161A] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={signupPass}
                    onChange={(e) => setSignupPass(e.target.value)}
                    placeholder="Create password (min 6 characters)"
                    className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl py-2.5 pl-9 pr-10 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                  />
                  <Lock className="w-4 h-4 text-[#5C6678] absolute left-3 top-2.5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-[#5C6678] hover:text-[#14161A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-[#232D0F] flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Creating an account grants verified buyer status to place orders.</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                {isLoading ? 'Creating Account…' : 'Register & Enable Buying'}
              </button>
            </form>
          )}

          {/* Visitor continue option */}
          <div className="mt-5 pt-4 border-t border-[#14161A]/10 text-center">
            <button
              onClick={onClose}
              className="text-xs text-[#5C6678] hover:text-[#14161A] font-medium transition-colors cursor-pointer"
            >
              Continue viewing store as visitor (Browse only)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
