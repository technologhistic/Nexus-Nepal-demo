import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEFAULT_SUPABASE_URL, SUPABASE_CALLBACK_URL } from '../lib/supabase';
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
  Sparkles,
  Compass,
  ArrowRight,
  ExternalLink
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
  const { login, loginWithGoogle, signup, loginAsVisitor, isSupabaseReady } = useAuth();

  // If reason is present (visitor wanted to buy), default to buyer tab
  const [selectedOption, setSelectedOption] = useState<'buyer' | 'visitor'>(reason ? 'buyer' : 'buyer');
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

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
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  if (!isOpen) return null;

  // Handle Login as Visitor
  const handleVisitorLogin = () => {
    loginAsVisitor();
  };

  // Google OAuth Sign In Handler for Buyer
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const result = await loginWithGoogle();

      if (!result.success && result.message) {
        setErrorMessage(result.message);
        setIsGoogleLoading(false);
        return;
      }

      if (isSupabaseReady) {
        setSuccessMessage('Redirecting to Google OAuth authentication…');
      } else {
        if (result.isAdmin) {
          setSuccessMessage('Administrator verified! Opening Admin Panel…');
          setTimeout(() => {
            onClose();
            if (onAdminLogin) onAdminLogin();
          }, 600);
        } else {
          setSuccessMessage('Logged in as verified Buyer! You can now order products.');
          setTimeout(() => {
            onClose();
          }, 600);
        }
        setIsGoogleLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Google authentication could not be completed.');
      setIsGoogleLoading(false);
    }
  };

  // Email / Password Sign In Handler
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
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid credentials. Please verify your email and password.');
        setIsLoading(false);
        return;
      }

      if (res.isAdmin) {
        setSuccessMessage('Administrator verified! Opening Admin Panel…');
        setTimeout(() => {
          onClose();
          if (onAdminLogin) onAdminLogin();
        }, 600);
      } else {
        setSuccessMessage('Welcome! Buyer permissions active. You can now order products.');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Invalid credentials. Please verify your email and password.');
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
      const res = await signup(signupName, signupEmail, signupPass);
      if (!res.success) {
        setErrorMessage(res.message || 'Could not register account. Please try again.');
        setIsLoading(false);
        return;
      }

      if (res.requiresEmailConfirmation) {
        setSuccessMessage(res.message || 'Confirmation link sent to your email.');
      } else {
        setSuccessMessage('Account created! Buyer permissions active. You can now order products.');
        setTimeout(() => {
          onClose();
        }, 700);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not register account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-[#FBF6E8] rounded-2xl overflow-hidden border border-[#3B4A1F]/20 shadow-2xl max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header bar */}
        <div className="bg-[#232D0F] text-[#F5EEDC] px-5 sm:px-6 py-4 flex items-center justify-between border-b border-[#3B4A1F] shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#B8F235] text-[#232D0F] font-serif font-black text-lg flex items-center justify-center">
              N
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-serif font-bold text-base sm:text-lg text-white">
                <span>NEXUS</span>
                <span className="text-[#B8F235]">NEPAL</span>
              </div>
              <p className="text-[10px] text-[#F5EEDC]/80 uppercase tracking-wider">
                Select Your Access Mode
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              // If closed via X, default to visitor mode if not logged in
              loginAsVisitor();
            }}
            className="p-1.5 rounded-lg text-[#F5EEDC]/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
            title="Continue as visitor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {/* Reason Alert Banner (when visitor tries to buy) */}
          {reason && (
            <div className="mb-4 p-3 rounded-xl bg-[#3B4A1F]/10 border border-[#3B4A1F]/25 flex items-start gap-2.5 text-xs text-[#232D0F]">
              <ShoppingBag className="w-4 h-4 text-[#556B2F] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-[#14161A]">Buyer Login Required to Order</span>
                <span className="text-[#5C6678]">{reason}</span>
              </div>
            </div>
          )}

          {/* TWO MAIN OPTIONS: LOGIN AS VISITOR vs LOGIN AS BUYER */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-[#5C6678] uppercase tracking-wider mb-2.5 text-center">
              Choose How You Want to Enter:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Login as Visitor */}
              <button
                type="button"
                onClick={() => setSelectedOption('visitor')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedOption === 'visitor'
                    ? 'bg-white border-[#3B4A1F] shadow-sm ring-2 ring-[#3B4A1F]/20'
                    : 'bg-white/60 border-[#14161A]/10 hover:border-[#14161A]/30 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#14161A]">
                      <Eye className="w-4 h-4 text-[#556B2F]" />
                      Login as Visitor
                    </span>
                    <span className="text-[10px] bg-gray-200 text-gray-800 font-semibold px-2 py-0.5 rounded-full">
                      View Only
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C6678] leading-tight mb-2">
                    Browse all authentic products, crafts & mountain gear. Ordering locked.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#14161A]/5 flex items-center justify-between text-[11px] font-semibold text-[#3B4A1F]">
                  <span>Explore catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>

              {/* Option 2: Login as Buyer */}
              <button
                type="button"
                onClick={() => setSelectedOption('buyer')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedOption === 'buyer'
                    ? 'bg-white border-[#3B4A1F] shadow-sm ring-2 ring-[#3B4A1F]/20'
                    : 'bg-white/60 border-[#14161A]/10 hover:border-[#14161A]/30 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-[#232D0F]">
                      <ShoppingBag className="w-4 h-4 text-[#232D0F]" />
                      Login as Buyer
                    </span>
                    <span className="text-[10px] bg-[#B8F235] text-[#232D0F] font-bold px-2 py-0.5 rounded-full">
                      Order Products
                    </span>
                  </div>
                  <p className="text-[11px] text-[#5C6678] leading-tight mb-2">
                    Add to cart, place orders, eSewa/Khalti/COD checkout, nationwide delivery.
                  </p>
                </div>
                <div className="pt-2 border-t border-[#14161A]/5 flex items-center justify-between text-[11px] font-semibold text-[#232D0F]">
                  <span>Sign in to purchase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="leading-tight">{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span className="leading-tight">{successMessage}</span>
            </div>
          )}

          {/* VIEW CONTENT BASED ON SELECTED OPTION */}
          {selectedOption === 'visitor' ? (
            /* VISITOR MODE DETAILS & ACTION */
            <div className="p-4 rounded-xl bg-white border border-[#14161A]/10 space-y-3 animate-in fade-in">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#3B4A1F]/10 text-[#3B4A1F] flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#14161A]">Visitor Mode (View Only)</h4>
                  <p className="text-[11px] text-[#5C6678] leading-relaxed mt-0.5">
                    You can view all products, examine regional origins (Ilam, Mustang, Palpa), and check prices in NPR. 
                    If you want to buy any product, you will be prompted to sign in with your Google ID or Email.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#14161A]/10">
                <button
                  type="button"
                  onClick={handleVisitorLogin}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-[#B8F235]" />
                  <span>Continue as Visitor (View Products Only)</span>
                </button>
              </div>

              <p className="text-[10px] text-center text-[#5C6678]">
                Want to order right away?{' '}
                <button
                  type="button"
                  onClick={() => setSelectedOption('buyer')}
                  className="text-[#3B4A1F] font-bold underline hover:text-[#232D0F] cursor-pointer"
                >
                  Switch to Buyer Login
                </button>
              </p>
            </div>
          ) : (
            /* BUYER LOGIN / REGISTRATION OPTIONS */
            <div className="space-y-4 animate-in fade-in">
              {/* GOOGLE SIGN IN BUTTON (Primary Buyer OAuth method) */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading || isLoading}
                  className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 border border-[#14161A]/20 text-[#14161A] text-xs sm:text-sm font-semibold flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60"
                >
                  {/* Google SVG Official Logo */}
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
                  <span>{isGoogleLoading ? 'Connecting with Google…' : 'Continue with Google'}</span>
                  <span className="ml-auto text-[10px] bg-[#B8F235] text-[#232D0F] font-bold px-2 py-0.5 rounded-full">
                    Buyer Access
                  </span>
                </button>

                {/* Supabase Google Auth Connection Details */}
                <div className="mt-2.5 px-3 py-2 rounded-xl bg-[#232D0F]/5 border border-[#232D0F]/10 text-[11px] text-[#232D0F]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 font-semibold text-[#232D0F]">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Supabase Auth Connected</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full">
                      Google OAuth Ready
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px] text-[#5C6678]">
                    <span className="truncate">
                      Callback URL:{' '}
                      <code className="font-mono text-[#232D0F] bg-black/5 px-1 rounded select-all">
                        {SUPABASE_CALLBACK_URL}
                      </code>
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative my-2 flex items-center justify-center">
                <div className="border-t border-[#14161A]/10 w-full" />
                <span className="bg-[#FBF6E8] px-3 text-[11px] text-[#5C6678] font-medium uppercase tracking-wider shrink-0">
                  Or with Email & Password
                </span>
                <div className="border-t border-[#14161A]/10 w-full" />
              </div>

              {/* Tab Switcher for Email */}
              <div className="flex border-b border-[#14161A]/10">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signin');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'signin'
                      ? 'border-[#3B4A1F] text-[#232D0F]'
                      : 'border-transparent text-[#5C6678] hover:text-[#14161A]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('signup');
                    setErrorMessage('');
                    setSuccessMessage('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                    activeTab === 'signup'
                      ? 'border-[#3B4A1F] text-[#232D0F]'
                      : 'border-transparent text-[#5C6678] hover:text-[#14161A]'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* EMAIL SIGN IN FORM */}
              {activeTab === 'signin' && (
                <form onSubmit={handleEmailSignIn} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#14161A] mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={emailOrUser}
                        onChange={(e) => setEmailOrUser(e.target.value)}
                        placeholder="e.g. buyer@gmail.com or admin@gmail.com"
                        className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl py-2.5 pl-9 pr-3 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                        required
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
                        placeholder="Enter your password"
                        className="w-full text-xs bg-white border border-[#14161A]/15 rounded-xl py-2.5 pl-9 pr-10 text-[#14161A] focus:outline-none focus:border-[#3B4A1F]"
                        required
                      />
                      <Lock className="w-4 h-4 text-[#5C6678] absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#5C6678] hover:text-[#14161A] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? 'Verifying…' : 'Sign In as Buyer'}
                  </button>
                </form>
              )}

              {/* CREATE ACCOUNT / SIGN UP FORM */}
              {activeTab === 'signup' && (
                <form onSubmit={handleSignUp} className="space-y-3">
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
                        required
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
                        required
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
                        required
                      />
                      <Lock className="w-4 h-4 text-[#5C6678] absolute left-3 top-2.5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-[#5C6678] hover:text-[#14161A] cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-[#232D0F] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Registering grants verified buyer status to order products across Nepal.</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#3B4A1F] hover:bg-[#232D0F] text-[#F5EEDC] text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {isLoading ? 'Creating Account…' : 'Register & Enable Ordering'}
                  </button>
                </form>
              )}

              {/* Quick switch to Visitor button */}
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={handleVisitorLogin}
                  className="text-xs text-[#5C6678] hover:text-[#14161A] font-medium transition-colors cursor-pointer"
                >
                  Just looking? <span className="underline">Continue as Visitor (Browse Only)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
