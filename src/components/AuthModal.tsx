import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Eye, EyeOff, User as UserIcon, Mail, Lock, Check } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    activeAuthView,
    setAuthView,
    login,
    signup
  } = useAuth();

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('sapkotalaxmi703@gmail.com');
  const [loginPassword, setLoginPassword] = useState('Himalaya2026!');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  if (!isAuthModalOpen) return null;

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) s++;
    if (/\d/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 14) s++;
    return pass ? Math.max(s, 1) : 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginIdentifier.trim()) {
      setLoginError('Enter your username or email.');
      return;
    }
    if (!loginPassword) {
      setLoginError('Enter your password.');
      return;
    }

    setIsLoggingIn(true);
    setStatusMsg('Authenticating with Nexus Nepal...');
    try {
      await login(loginIdentifier, loginPassword);
      setStatusMsg('Namaste! Signed in successfully.');
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } catch {
      setLoginError('Authentication failed. Please verify credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    if (signupName.trim().length < 2) {
      setSignupError('Enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(signupEmail.trim())) {
      setSignupError('Enter a valid email address.');
      return;
    }
    if (signupPassword.length < 8) {
      setSignupError('Password must be 8 characters or more.');
      return;
    }

    setIsSigningUp(true);
    setStatusMsg('Creating your Nexus account...');
    try {
      await signup(signupName, signupEmail, signupPassword);
      setStatusMsg('Welcome to Nexus Nepal! Account created.');
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } catch {
      setSignupError('Could not create account. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const isLogin = activeAuthView === 'login';
  const passStrength = getPasswordStrength(signupPassword);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[940px] rounded-3xl overflow-hidden shadow-2xl bg-[#3B4A1F] border border-[#556B2F]/40">
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/50 text-[#F5EEDC] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Outer Container with the dual-panel aesthetic */}
        <div className="relative w-full min-h-[580px] flex flex-col md:flex-row">
          
          {/* Brand Background & Mountain Ridge Layer */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#4F6428] via-[#3B4A1F] to-[#232D0F]">
            {/* Ambient gradients */}
            <div className="absolute top-0 right-0 w-[520px] h-[360px] bg-[#B8F235]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-[#556B2F]/40 rounded-full blur-3xl pointer-events-none" />
            
            {/* Himalayan Mountain Ridge Line */}
            <svg
              className="absolute left-0 right-0 bottom-0 w-full h-[44%] opacity-55 pointer-events-none"
              viewBox="0 0 900 260"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="modal-rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#B8F235" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#B8F235" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 260V190l90-60 70 45 110-110 90 85 60-40 120 130 80-70 70 55 100-95 110 100v130z"
                fill="url(#modal-rg)"
              />
              <path
                d="M0 190l90-60 70 45 110-110 90 85 60-40 120 130 80-70 70 55 100-95 110 100"
                fill="none"
                stroke="#B8F235"
                strokeOpacity="0.35"
                strokeWidth="1.2"
              />
            </svg>

            {/* Brand copy for SIGN IN view (positioned on right side when login is active) */}
            <div
              className={`absolute right-8 md:right-16 top-1/2 -translate-y-1/2 max-w-[280px] text-[#F5EEDC] transition-all duration-500 hidden md:block ${
                isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
              }`}
            >
              <span className="block mb-3 text-xs font-bold tracking-[0.25em] uppercase text-[#B8F235]">
                Nexus Nepal
              </span>
              <h2 className="text-4xl font-serif leading-[1.1] tracking-tight">
                Namaste,
                <em className="block text-[#D6FF6A] not-italic font-sans font-light mt-1">
                  welcome back.
                </em>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#F5EEDC]/80">
                Your cart, your orders and your favourite Himalayan finds are exactly where you left them.
              </p>
              <div className="mt-8 pt-6 border-t border-[#B8F235]/20 flex items-center gap-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#B8F235]/20 text-[#B8F235] text-xs font-bold">
                  ✓
                </span>
                <span className="text-xs text-[#F5EEDC]/70">Verified Himalayan Marketplace</span>
              </div>
            </div>

            {/* Brand copy for SIGN UP view (positioned on left side when signup is active) */}
            <div
              className={`absolute left-8 md:left-16 top-1/2 -translate-y-1/2 max-w-[300px] text-[#F5EEDC] transition-all duration-500 hidden md:block ${
                !isLogin ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 pointer-events-none'
              }`}
            >
              <span className="block mb-3 text-xs font-bold tracking-[0.25em] uppercase text-[#B8F235]">
                Nexus Nepal
              </span>
              <h2 className="text-4xl font-serif leading-[1.1] tracking-tight">
                Start your
                <em className="block text-[#D6FF6A] not-italic font-sans font-light mt-1">
                  first order.
                </em>
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-[#F5EEDC]/80">
                One account for every order, every wishlist and every device you own across Nepal.
              </p>
              <div className="mt-8 pt-6 border-t border-[#B8F235]/20 space-y-2">
                <div className="flex items-center gap-2 text-xs text-[#D6FF6A]">
                  <Check className="w-3.5 h-3.5" /> 100 Reward Points on signup
                </div>
                <div className="flex items-center gap-2 text-xs text-[#D6FF6A]">
                  <Check className="w-3.5 h-3.5" /> Express delivery in Kathmandu Valley
                </div>
              </div>
            </div>
          </div>

          {/* Sliding Cream Card that holds the active form */}
          <div
            className={`relative z-10 w-full md:w-[58%] min-h-[580px] p-8 md:p-12 bg-gradient-to-br from-white via-[#F7F0DD] to-[#F1E7CC] transition-all duration-500 ease-in-out shadow-2xl flex flex-col justify-center ${
              isLogin ? 'md:translate-x-0 md:rounded-r-[40px]' : 'md:translate-x-[72%] md:rounded-l-[40px]'
            }`}
          >
            {/* View Switcher Tabs */}
            <div className="flex items-center gap-2 mb-6 p-1 bg-[#3B4A1F]/10 rounded-full w-fit">
              <button
                type="button"
                onClick={() => setAuthView('login')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  isLogin
                    ? 'bg-[#3B4A1F] text-[#F5EEDC] shadow-sm'
                    : 'text-[#3B4A1F] hover:text-black'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthView('signup')}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  !isLogin
                    ? 'bg-[#3B4A1F] text-[#F5EEDC] shadow-sm'
                    : 'text-[#3B4A1F] hover:text-black'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Logo / Header */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#3B4A1F] flex items-center justify-center text-[#B8F235] font-serif font-bold text-xl shadow-md">
                N
              </div>
              <div>
                <span className="font-serif font-bold tracking-tight text-lg text-[#232D0F]">
                  NEXUS NEPAL
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-[#556B2F] -mt-1 font-semibold">
                  Himalayan Commerce
                </span>
              </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#232D0F] mt-2 mb-1">
              {isLogin ? 'Sign in to Nexus' : 'Create an account'}
            </h1>
            <div className="w-7 h-1 bg-[#B8F235] rounded-full mb-6" />

            {/* SIGN IN FORM */}
            {isLogin ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-[#5C6678] mb-1">
                    Username or email
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. laxmi@example.com"
                      className="w-full bg-white/80 border border-[#3B4A1F]/20 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[#14161A] focus:outline-none focus:border-[#3B4A1F] focus:ring-2 focus:ring-[#B8F235]/40 transition-all"
                    />
                    <UserIcon className="absolute right-3 w-4 h-4 text-[#5C6678] pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-medium text-[#5C6678]">
                      Password
                    </label>
                    <a
                      href="#forgot"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset link has been dispatched to your email.');
                      }}
                      className="text-xs text-[#3B4A1F] font-semibold hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type={showLoginPass ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-white/80 border border-[#3B4A1F]/20 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[#14161A] focus:outline-none focus:border-[#3B4A1F] focus:ring-2 focus:ring-[#B8F235]/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute right-3 p-1 text-[#5C6678] hover:text-black"
                    >
                      {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#5C6678]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#3B4A1F] focus:ring-[#B8F235]"
                    />
                    Keep me signed in
                  </label>
                  
                  {/* Quick demo fill button */}
                  <button
                    type="button"
                    onClick={() => {
                      setLoginIdentifier('sapkotalaxmi703@gmail.com');
                      setLoginPassword('Himalaya2026!');
                    }}
                    className="text-[11px] font-medium text-[#556B2F] bg-[#B8F235]/30 hover:bg-[#B8F235]/50 px-2 py-0.5 rounded transition-colors"
                  >
                    Use Demo User
                  </button>
                </div>

                {loginError && (
                  <p className="text-xs text-[#B3341F] font-medium bg-[#B3341F]/10 p-2.5 rounded-lg">
                    {loginError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-[#556B2F] via-[#3B4A1F] to-[#232D0F] text-white font-semibold text-sm flex items-center justify-between px-6 shadow-lg shadow-[#3B4A1F]/25 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-70"
                >
                  <span>{isLoggingIn ? 'Signing in...' : 'Sign in'}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D6FF6A] to-[#B8F235] text-[#232D0F] flex items-center justify-center font-bold text-base shadow-sm">
                    &rarr;
                  </div>
                </button>

                <p className="text-center text-xs text-[#5C6678] pt-2">
                  New to Nexus Nepal?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('signup')}
                    className="font-bold text-[#3B4A1F] hover:underline"
                  >
                    Create an account
                  </button>
                </p>
              </form>
            ) : (
              /* SIGN UP FORM */
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-[#5C6678] mb-1">
                    Full name
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Laxmi Sapkota"
                      className="w-full bg-white/80 border border-[#3B4A1F]/20 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[#14161A] focus:outline-none focus:border-[#3B4A1F] focus:ring-2 focus:ring-[#B8F235]/40 transition-all"
                    />
                    <UserIcon className="absolute right-3 w-4 h-4 text-[#5C6678] pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-[#5C6678] mb-1">
                    Email address
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="e.g. laxmi@domain.com"
                      className="w-full bg-white/80 border border-[#3B4A1F]/20 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[#14161A] focus:outline-none focus:border-[#3B4A1F] focus:ring-2 focus:ring-[#B8F235]/40 transition-all"
                    />
                    <Mail className="absolute right-3 w-4 h-4 text-[#5C6678] pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-xs font-medium text-[#5C6678] mb-1">
                    Create password
                  </label>
                  <div className="relative flex items-center">
                    <input
                      type={showSignupPass ? 'text' : 'password'}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Minimum 8 characters"
                      className="w-full bg-white/80 border border-[#3B4A1F]/20 rounded-xl py-2.5 pl-3.5 pr-10 text-sm text-[#14161A] focus:outline-none focus:border-[#3B4A1F] focus:ring-2 focus:ring-[#B8F235]/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPass(!showSignupPass)}
                      className="absolute right-3 p-1 text-[#5C6678] hover:text-black"
                    >
                      {showSignupPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password strength meter */}
                  <div className="flex gap-1.5 mt-2">
                    {[1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          passStrength >= step
                            ? step === 1
                              ? 'bg-[#D0742F]'
                              : step === 2
                              ? 'bg-[#C9A52B]'
                              : step === 3
                              ? 'bg-[#556B2F]'
                              : 'bg-[#B8F235]'
                            : 'bg-black/10'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-[#5C6678] mt-1">
                    Use 8 characters or more, mixing letters and numbers.
                  </p>
                </div>

                {signupError && (
                  <p className="text-xs text-[#B3341F] font-medium bg-[#B3341F]/10 p-2.5 rounded-lg">
                    {signupError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="w-full h-12 rounded-full bg-gradient-to-r from-[#556B2F] via-[#3B4A1F] to-[#232D0F] text-white font-semibold text-sm flex items-center justify-between px-6 shadow-lg shadow-[#3B4A1F]/25 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-70"
                >
                  <span>{isSigningUp ? 'Creating account...' : 'Create account'}</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D6FF6A] to-[#B8F235] text-[#232D0F] flex items-center justify-center font-bold text-base shadow-sm">
                    &rarr;
                  </div>
                </button>

                <p className="text-center text-xs text-[#5C6678] pt-2">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthView('login')}
                    className="font-bold text-[#3B4A1F] hover:underline"
                  >
                    Sign in
                  </button>
                </p>
              </form>
            )}

            {statusMsg && (
              <div className="mt-3 text-center text-xs text-[#3B4A1F] font-semibold animate-pulse">
                {statusMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
