import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Check } from 'lucide-react';

interface NexusAuthPageProps {
  onBackToShop: () => void;
  initialView?: 'login' | 'signup';
}

export const NexusAuthPage: React.FC<NexusAuthPageProps> = ({
  onBackToShop,
  initialView = 'login'
}) => {
  const { login, signup, user } = useAuth();

  const [currentView, setCurrentView] = useState<'login' | 'signup'>(initialView);
  const [mountedAt] = useState<number>(Date.now());

  // Login inputs
  const [loginUser, setLoginUser] = useState('sapkotalaxmi703@gmail.com');
  const [loginPass, setLoginPass] = useState('Himalaya2026!');
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginInvalid, setLoginInvalid] = useState({ user: false, pass: false });
  const [loginStatus, setLoginStatus] = useState<{ text: string; bad?: boolean }>({ text: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Signup inputs
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPass, setSignupPass] = useState('');
  const [showSignupPass, setShowSignupPass] = useState(false);
  const [signupInvalid, setSignupInvalid] = useState({ name: false, email: false, pass: false });
  const [signupStatus, setSignupStatus] = useState<{ text: string; bad?: boolean }>({ text: '' });
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Password strength
  const getStrength = (pass: string) => {
    let s = 0;
    if (pass.length >= 8) s++;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) s++;
    if (/\d/.test(pass)) s++;
    if (/[^A-Za-z0-9]/.test(pass) || pass.length >= 14) s++;
    return pass ? Math.max(s, 1) : 0;
  };
  const passwordStrength = getStrength(signupPass);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userBad = !loginUser.trim();
    const passBad = !loginPass;
    setLoginInvalid({ user: userBad, pass: passBad });

    if (userBad || passBad) return;

    setIsLoggingIn(true);
    setLoginStatus({ text: 'Signing in to Nexus Nepal…' });

    try {
      await login(loginUser, loginPass);
      setLoginStatus({ text: 'Signed in. Redirecting to store…' });
      setTimeout(() => {
        onBackToShop();
      }, 700);
    } catch {
      setLoginStatus({ text: 'Check your details and try again.', bad: true });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameBad = signupName.trim().length < 2;
    const emailBad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(signupEmail.trim());
    const passBad = signupPass.length < 8;
    setSignupInvalid({ name: nameBad, email: emailBad, pass: passBad });

    if (nameBad || emailBad || passBad) return;

    setIsSigningUp(true);
    setSignupStatus({ text: 'Creating your account…' });

    try {
      await signup(signupName, signupEmail, signupPass);
      setSignupStatus({ text: 'Account created. Welcome to Nexus Nepal!' });
      setTimeout(() => {
        onBackToShop();
      }, 700);
    } catch {
      setSignupStatus({ text: 'Something went wrong. Please try again.', bad: true });
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="nexus-auth-wrapper min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#F1E7CC] relative">
      {/* Return to store top navigation */}
      <div className="w-full max-w-[940px] mb-4 flex items-center justify-between">
        <button
          onClick={onBackToShop}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-white/80 hover:bg-white text-[#232D0F] font-semibold text-xs shadow-xs transition-colors cursor-pointer border border-[#14161A]/10"
        >
          <ArrowLeft className="w-4 h-4 text-[#556B2F]" />
          <span>Back to Marketplace</span>
        </button>

        {user && (
          <div className="flex items-center gap-2 text-xs text-[#3B4A1F] font-semibold bg-[#B8F235]/30 px-3 py-1.5 rounded-md">
            <Check className="w-3.5 h-3.5 text-[#3B4A1F]" />
            <span>Logged in as {user.name}</span>
          </div>
        )}
      </div>

      {/* Main Page Card Container */}
      <main className="page relative w-full max-w-[940px]">
        {/* Hidden radio buttons that drive the pure CSS diagonal clip-path animation */}
        <input
          className="sr"
          type="radio"
          name="view"
          id="v-init"
          checked={false}
          readOnly
        />
        <input
          className="sr"
          type="radio"
          name="view"
          id="v-signup"
          checked={currentView === 'signup'}
          onChange={() => setCurrentView('signup')}
        />
        <input
          className="sr"
          type="radio"
          name="view"
          id="v-login"
          checked={currentView === 'login'}
          onChange={() => setCurrentView('login')}
        />

        <section className="card">
          {/* Brand Panel Background */}
          <div className="brand">
            <svg
              className="ridge"
              viewBox="0 0 900 260"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#B8F235" stopOpacity=".35" />
                  <stop offset="1" stopColor="#B8F235" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M0 260V190l90-60 70 45 110-110 90 85 60-40 120 130 80-70 70 55 100-95 110 100v130z"
                fill="url(#rg)"
              />
              <path
                d="M0 190l90-60 70 45 110-110 90 85 60-40 120 130 80-70 70 55 100-95 110 100"
                fill="none"
                stroke="#B8F235"
                strokeOpacity=".35"
                strokeWidth="1.2"
              />
            </svg>

            <div className="brand-copy is-login">
              <span className="eyebrow">Nexus Nepal</span>
              <h2>
                Namaste,<em>welcome back.</em>
              </h2>
              <p>
                Your cart, your orders and your favourite Himalayan finds are exactly where you left
                them.
              </p>
            </div>

            <div className="brand-copy is-signup">
              <span className="eyebrow">Nexus Nepal</span>
              <h2>
                Start your<em>first order.</em>
              </h2>
              <p>One account for every order, every wishlist and every device you own.</p>
            </div>
          </div>

          {/* Cream Sliding Panel */}
          <div className="cream">
            {/* SIGN IN FORM */}
            <form
              className="form is-login"
              id="loginForm"
              onSubmit={handleLoginSubmit}
              noValidate
            >
              <div className="logo" style={{ ['--i' as any]: 0 }} role="img" aria-label="Nexus Nepal" />
              <h1 style={{ ['--i' as any]: 1 }}>Sign in</h1>

              <div className="fields" style={{ ['--i' as any]: 2 }}>
                <div className={`field ${loginInvalid.user ? 'invalid' : ''}`}>
                  <input
                    id="l-user"
                    name="username"
                    type="text"
                    placeholder=" "
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck="false"
                    value={loginUser}
                    onChange={(e) => {
                      setLoginUser(e.target.value);
                      if (e.target.value.trim()) setLoginInvalid((prev) => ({ ...prev, user: false }));
                    }}
                  />
                  <label htmlFor="l-user">Username or email</label>
                  <span className="bar"></span>
                  <span className="ico">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </span>
                  <span className="err">Enter your username or email.</span>
                </div>

                <div className={`field ${loginInvalid.pass ? 'invalid' : ''}`}>
                  <input
                    id="l-pass"
                    name="password"
                    type={showLoginPass ? 'text' : 'password'}
                    placeholder=" "
                    autoComplete="current-password"
                    value={loginPass}
                    onChange={(e) => {
                      setLoginPass(e.target.value);
                      if (e.target.value) setLoginInvalid((prev) => ({ ...prev, pass: false }));
                    }}
                  />
                  <label htmlFor="l-pass">Password</label>
                  <span className="bar"></span>
                  <button
                    type="button"
                    className="ico toggle-pass"
                    aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                    onClick={() => setShowLoginPass(!showLoginPass)}
                  >
                    <svg viewBox="0 0 24 24">
                      {showLoginPass ? (
                        <>
                          <path d="M3 3l18 18" />
                          <path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.6 0 3-.4 4.3-1" />
                          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        </>
                      ) : (
                        <>
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                  <span className="err">Enter your password.</span>
                </div>
              </div>

              <div className="row" style={{ ['--i' as any]: 3 }}>
                <label className="remember">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="toggle"></span>Keep me signed in
                </label>
                <button
                  type="button"
                  className="link"
                  onClick={() => alert('Password reset verification code dispatched to your email.')}
                >
                  Forgot password?
                </button>
              </div>

              <input className="hp" type="text" name="company_website" tabIndex={-1} autoComplete="off" />

              <button
                className="cta"
                type="submit"
                disabled={isLoggingIn}
                style={{ ['--i' as any]: 4 }}
              >
                <span className="lbl">{isLoggingIn ? 'Signing in…' : 'Sign in'}</span>
                <span className="arrow" aria-hidden="true">
                  &rarr;
                </span>
              </button>

              <p className={`status ${loginStatus.bad ? 'bad' : ''}`} role="status" style={{ ['--i' as any]: 5 }}>
                {loginStatus.text}
              </p>

              <p className="switch" style={{ ['--i' as any]: 5 }}>
                New to Nexus Nepal?{' '}
                <label
                  className="link cursor-pointer"
                  htmlFor="v-signup"
                  tabIndex={0}
                  onClick={() => setCurrentView('signup')}
                >
                  Create an account
                </label>
              </p>
            </form>

            {/* CREATE ACCOUNT FORM */}
            <form
              className="form is-signup"
              id="signupForm"
              onSubmit={handleSignupSubmit}
              noValidate
            >
              <div className="logo" style={{ ['--i' as any]: 0 }} role="img" aria-label="Nexus Nepal" />
              <h1 style={{ ['--i' as any]: 1 }}>Create account</h1>

              <div className="fields" style={{ ['--i' as any]: 2 }}>
                <div className={`field ${signupInvalid.name ? 'invalid' : ''}`}>
                  <input
                    id="s-name"
                    name="name"
                    type="text"
                    placeholder=" "
                    autoComplete="name"
                    value={signupName}
                    onChange={(e) => {
                      setSignupName(e.target.value);
                      if (e.target.value.trim().length >= 2)
                        setSignupInvalid((prev) => ({ ...prev, name: false }));
                    }}
                  />
                  <label htmlFor="s-name">Full name</label>
                  <span className="bar"></span>
                  <span className="ico">
                    <svg viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </span>
                  <span className="err">Enter your full name.</span>
                </div>

                <div className={`field ${signupInvalid.email ? 'invalid' : ''}`}>
                  <input
                    id="s-mail"
                    name="email"
                    type="email"
                    placeholder=" "
                    autoComplete="email"
                    autoCapitalize="none"
                    spellCheck="false"
                    value={signupEmail}
                    onChange={(e) => {
                      setSignupEmail(e.target.value);
                      if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.target.value.trim()))
                        setSignupInvalid((prev) => ({ ...prev, email: false }));
                    }}
                  />
                  <label htmlFor="s-mail">Email address</label>
                  <span className="bar"></span>
                  <span className="ico">
                    <svg viewBox="0 0 24 24">
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <path d="M3 7l9 6 9-6" />
                    </svg>
                  </span>
                  <span className="err">Enter a valid email address.</span>
                </div>

                <div className={`field ${signupInvalid.pass ? 'invalid' : ''}`}>
                  <input
                    id="s-pass"
                    name="new-password"
                    type={showSignupPass ? 'text' : 'password'}
                    placeholder=" "
                    autoComplete="new-password"
                    value={signupPass}
                    onChange={(e) => {
                      setSignupPass(e.target.value);
                      if (e.target.value.length >= 8)
                        setSignupInvalid((prev) => ({ ...prev, pass: false }));
                    }}
                  />
                  <label htmlFor="s-pass">Password</label>
                  <span className="bar"></span>
                  <button
                    type="button"
                    className="ico toggle-pass"
                    aria-label={showSignupPass ? 'Hide password' : 'Show password'}
                    onClick={() => setShowSignupPass(!showSignupPass)}
                  >
                    <svg viewBox="0 0 24 24">
                      {showSignupPass ? (
                        <>
                          <path d="M3 3l18 18" />
                          <path d="M10.6 5.1A10.6 10.6 0 0 1 12 5c6.4 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.7 8.4 2 12 2 12s3.6 7 10 7c1.6 0 3-.4 4.3-1" />
                          <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
                        </>
                      ) : (
                        <>
                          <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </>
                      )}
                    </svg>
                  </button>
                  <span className="err">Use 8 characters or more.</span>
                  <div className="meter" data-s={passwordStrength} aria-hidden="true">
                    <i></i>
                    <i></i>
                    <i></i>
                    <i></i>
                  </div>
                </div>
              </div>

              <p className="hint" style={{ ['--i' as any]: 3 }}>
                Use 8 characters or more, mixing letters and numbers.
              </p>
              <input className="hp" type="text" name="company_website" tabIndex={-1} autoComplete="off" />

              <button
                className="cta"
                type="submit"
                disabled={isSigningUp}
                style={{ ['--i' as any]: 4 }}
              >
                <span className="lbl">{isSigningUp ? 'Creating account…' : 'Create account'}</span>
                <span className="arrow" aria-hidden="true">
                  &rarr;
                </span>
              </button>

              <p className={`status ${signupStatus.bad ? 'bad' : ''}`} role="status" style={{ ['--i' as any]: 5 }}>
                {signupStatus.text}
              </p>

              <p className="switch" style={{ ['--i' as any]: 5 }}>
                Already have an account?{' '}
                <label
                  className="link cursor-pointer"
                  htmlFor="v-login"
                  tabIndex={0}
                  onClick={() => setCurrentView('login')}
                >
                  Sign in
                </label>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};
