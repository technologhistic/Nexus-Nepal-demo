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
  const { login, signup, loginWithGoogle, loginAsVisitor, user, isSupabaseReady } = useAuth();
  const [isGoogleBusy, setIsGoogleBusy] = useState(false);

  const handleGoogleAction = async (forView: 'login' | 'signup') => {
    setIsGoogleBusy(true);
    if (forView === 'login') {
      setLoginStatus({ text: 'Connecting with Google…' });
    } else {
      setSignupStatus({ text: 'Connecting with Google…' });
    }

    try {
      const res = await loginWithGoogle();
      if (!res.success && res.message) {
        if (forView === 'login') setLoginStatus({ text: res.message, bad: true });
        else setSignupStatus({ text: res.message, bad: true });
        setIsGoogleBusy(false);
        return;
      }

      if (isSupabaseReady) {
        // Redirecting to Google OAuth
      } else {
        if (forView === 'login') setLoginStatus({ text: 'Signed in with Google! Redirecting…' });
        else setSignupStatus({ text: 'Registered with Google! Redirecting…' });
        setTimeout(() => {
          onBackToShop();
        }, 600);
      }
    } catch (err: any) {
      if (forView === 'login') setLoginStatus({ text: err?.message || 'Google sign in failed.', bad: true });
      else setSignupStatus({ text: err?.message || 'Google sign in failed.', bad: true });
      setIsGoogleBusy(false);
    }
  };

  const [currentView, setCurrentView] = useState<'login' | 'signup'>(initialView);
  const [mountedAt] = useState<number>(Date.now());

  // Login inputs
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
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
                Your cart and account details are saved and ready whenever you return.
              </p>
            </div>

            <div className="brand-copy is-signup">
              <span className="eyebrow">Nexus Nepal</span>
              <h2>
                Create your<em>Nexus account.</em>
              </h2>
              <p>One account for secure checkout and orders across all your devices.</p>
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

              {/* Continue with Google */}
              <div style={{ ['--i' as any]: 1 }} className="my-2 w-full">
                <button
                  type="button"
                  onClick={() => handleGoogleAction('login')}
                  disabled={isGoogleBusy || isLoggingIn}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-gray-50 border border-[#14161A]/20 text-[#14161A] text-xs font-semibold flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>Continue with Google</span>
                </button>
                <div className="relative my-2.5 flex items-center justify-center">
                  <div className="border-t border-[#14161A]/10 w-full" />
                  <span className="bg-[#FAF7EE] px-2 text-[10px] text-[#5C6678] font-medium uppercase tracking-wider shrink-0">
                    Or username & password
                  </span>
                  <div className="border-t border-[#14161A]/10 w-full" />
                </div>
              </div>

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

              <div className="text-center mt-3" style={{ ['--i' as any]: 5 }}>
                <button
                  type="button"
                  onClick={() => {
                    loginAsVisitor();
                    onBackToShop();
                  }}
                  className="text-xs text-[#5C6678] hover:text-[#14161A] underline cursor-pointer"
                >
                  Or continue browsing as a visitor (View only)
                </button>
              </div>
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

              {/* Continue with Google */}
              <div style={{ ['--i' as any]: 1 }} className="my-2 w-full">
                <button
                  type="button"
                  onClick={() => handleGoogleAction('signup')}
                  disabled={isGoogleBusy || isSigningUp}
                  className="w-full py-2 px-3 rounded-lg bg-white hover:bg-gray-50 border border-[#14161A]/20 text-[#14161A] text-xs font-semibold flex items-center justify-center gap-2.5 shadow-xs transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>Sign up with Google</span>
                </button>
                <div className="relative my-2.5 flex items-center justify-center">
                  <div className="border-t border-[#14161A]/10 w-full" />
                  <span className="bg-[#FAF7EE] px-2 text-[10px] text-[#5C6678] font-medium uppercase tracking-wider shrink-0">
                    Or create with email
                  </span>
                  <div className="border-t border-[#14161A]/10 w-full" />
                </div>
              </div>

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

              <div className="text-center mt-3" style={{ ['--i' as any]: 5 }}>
                <button
                  type="button"
                  onClick={() => {
                    loginAsVisitor();
                    onBackToShop();
                  }}
                  className="text-xs text-[#5C6678] hover:text-[#14161A] underline cursor-pointer"
                >
                  Or continue browsing as a visitor (View only)
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};
