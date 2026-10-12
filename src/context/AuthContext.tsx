import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types';
import { supabase, isSupabaseConfigured, signInWithGoogleOAuth } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVisitor: boolean;
  canBuy: boolean;
  authLoading: boolean;
  isSupabaseReady: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  pendingItemToBuy: { product: any; quantity: number } | null;
  setPendingItemToBuy: (item: { product: any; quantity: number } | null) => void;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  loginAsVisitor: () => void;
  login: (emailOrUser: string, pass: string) => Promise<{ success: boolean; isAdmin?: boolean; message?: string }>;
  loginWithGoogle: (emailOrId?: string, displayName?: string) => Promise<{ success: boolean; isAdmin?: boolean; message?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string; requiresEmailConfirmation?: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('nexus_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Wipe legacy demo / simulated users on load so genuine Supabase Auth is strictly used
        if (
          !parsed?.id ||
          parsed?.id === 'usr_nepal_001' ||
          parsed?.id === 'usr_admin_google' ||
          (typeof parsed?.id === 'string' && parsed?.id.startsWith('usr_goog_'))
        ) {
          localStorage.removeItem('nexus_user');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalReason, setAuthModalReason] = useState<string>('');
  const [pendingItemToBuy, setPendingItemToBuy] = useState<{ product: any; quantity: number } | null>(null);

  // Auto pop-up sign-in form after website is loaded if not logged in as buyer/admin
  useEffect(() => {
    const timer = setTimeout(() => {
      // If user is not logged in as a verified buyer or admin, show popup on page load
      const isAlreadyBuyerOrAdmin = user && (user.role === 'buyer' || user.role === 'admin');
      if (!isAlreadyBuyerOrAdmin) {
        setIsAuthModalOpen(true);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, []); // Run once on initial website load

  const openAuthModal = useCallback((reason?: string) => {
    setAuthModalReason(reason || 'Sign in to access your account and buy products');
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setAuthModalReason('');
  }, []);

  // Login as Visitor: allows viewing products only; ordering is locked
  const loginAsVisitor = useCallback(() => {
    const visitorUser: User = {
      id: 'usr_visitor_' + Date.now(),
      name: 'Visitor',
      email: '',
      role: 'visitor',
      canBuy: false,
      orders: []
    };
    setUser(visitorUser);
    setIsAuthModalOpen(false);
    setAuthModalReason('');
  }, []);

  // Synchronize localStorage with active user
  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_user');
    }
  }, [user]);

  // Helper to construct User profile from Supabase Auth User object
  const mapSupabaseUser = useCallback((sbUser: any): User => {
    const meta = sbUser.user_metadata || {};
    const email = sbUser.email || '';
    const isAdminUser = email.toLowerCase() === 'admin@gmail.com' || meta.role === 'admin';
    const rawName = meta.full_name || meta.name || meta.user_name || (email ? email.split('@')[0].replace(/[\._]/g, ' ') : 'Nexus Member');
    const avatarUrl = meta.avatar_url || meta.picture || undefined;
    const provider = sbUser.app_metadata?.provider === 'google' ? 'google' : 'supabase';

    return {
      id: sbUser.id,
      name: rawName ? rawName.charAt(0).toUpperCase() + rawName.slice(1) : 'Buyer',
      email,
      avatarUrl,
      role: isAdminUser ? 'admin' : 'buyer',
      authProvider: provider,
      canBuy: true,
      orders: user?.orders || []
    };
  }, [user?.orders]);

  // Initialize and restore Supabase session on mount & handle OAuth callback redirects
  useEffect(() => {
    let mounted = true;

    async function initSession() {
      if (!isSupabaseConfigured || !supabase) {
        setAuthLoading(false);
        return;
      }

      try {
        // Fetch current session (restores from storage or URL fragments automatically)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Error fetching Supabase session:', error.message);
        }

        if (session?.user && mounted) {
          const mapped = mapSupabaseUser(session.user);
          setUser(mapped);

          // Clean URL hash if redirected back with auth tokens
          if (window.location.hash.includes('access_token') || window.location.search.includes('code=')) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }
      } catch (err) {
        console.error('Supabase session initialization exception:', err);
      } finally {
        if (mounted) {
          setAuthLoading(false);
        }
      }
    }

    initSession();

    // Listen to real-time auth changes (sign in, sign out, token refresh, OAuth return)
    if (isSupabaseConfigured && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        if (event === 'SIGNED_IN' || event === 'USER_UPDATED' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            setUser(mapSupabaseUser(session.user));
            setIsAuthModalOpen(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    } else {
      setAuthLoading(false);
    }

    return () => {
      mounted = false;
    };
  }, [mapSupabaseUser]);

  // Login via Email and Password
  const login = async (emailOrUser: string, pass: string): Promise<{ success: boolean; isAdmin?: boolean; message?: string }> => {
    const cleanEmail = emailOrUser.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. Admin hardcoded authorization check for immediate control
    if (cleanEmail === 'admin@gmail.com' && cleanPass === 'admin') {
      const adminUser: User = {
        id: 'usr_admin_01',
        name: 'Nexus Administrator',
        email: 'admin@gmail.com',
        phone: '+977 9801000000',
        city: 'Kathmandu',
        address: 'Lazimpat, Kathmandu',
        role: 'admin',
        authProvider: 'password',
        canBuy: true,
        orders: user?.orders || []
      };
      setUser(adminUser);
      setIsAuthModalOpen(false);
      return { success: true, isAdmin: true, message: 'Admin authenticated' };
    }

    // 2. If Supabase is configured, authenticate via Supabase Auth
    if (isSupabaseConfigured && supabase) {
      const formattedEmail = cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formattedEmail,
        password: cleanPass
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        setIsAuthModalOpen(false);
        return { success: true, isAdmin: mapped.role === 'admin' };
      }
    }

    // 3. Fallback standard local buyer login when Supabase is not configured
    const loggedUser: User = {
      id: 'usr_' + Date.now(),
      name: emailOrUser.includes('@') ? emailOrUser.split('@')[0].replace(/[\._]/g, ' ') : emailOrUser,
      email: emailOrUser.includes('@') ? emailOrUser : `${emailOrUser}@gmail.com`,
      phone: '+977 9801234567',
      city: 'Kathmandu',
      address: 'Thamel, Kathmandu',
      role: 'buyer',
      authProvider: 'password',
      canBuy: true,
      orders: user?.orders || []
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return { success: true, isAdmin: false };
  };

  // Google OAuth Login
  const loginWithGoogle = async (_emailOrId?: string, _displayName?: string): Promise<{ success: boolean; isAdmin?: boolean; message?: string }> => {
    // 1. If Supabase is configured, trigger genuine Google OAuth flow
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await signInWithGoogleOAuth();
        if (error) {
          return { success: false, message: error.message };
        }
        // Redirecting to Google identity consent screen
        return { success: true, message: 'Redirecting to Google OAuth…' };
      } catch (err: any) {
        return { success: false, message: err?.message || 'Google OAuth failed to start.' };
      }
    }

    // If Supabase is not configured, show clear error rather than fake fallback
    return {
      success: false,
      message: 'Supabase Google Auth is not configured. Please check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    };
  };

  // Sign up via Email and Password
  const signup = async (
    name: string,
    email: string,
    pass: string
  ): Promise<{ success: boolean; message?: string; requiresEmailConfirmation?: boolean }> => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // 1. If Supabase is configured, create user in Supabase Auth
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: {
            full_name: name.trim(),
            role: 'buyer'
          }
        }
      });

      if (error) {
        return { success: false, message: error.message };
      }

      if (data.user && !data.session) {
        // Confirmation email required by Supabase settings
        return {
          success: true,
          requiresEmailConfirmation: true,
          message: 'Confirmation email sent! Please check your inbox to activate your account.'
        };
      }

      if (data.user && data.session) {
        const mapped = mapSupabaseUser(data.user);
        setUser(mapped);
        setIsAuthModalOpen(false);
        return { success: true };
      }
    }

    // 2. Fallback local user creation
    await new Promise((r) => setTimeout(r, 400));
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      phone: '+977 98XXXXXXXX',
      city: 'Kathmandu',
      address: 'Kathmandu Valley',
      role: 'buyer',
      authProvider: 'password',
      canBuy: true,
      orders: []
    };
    setUser(newUser);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  // Sign out
  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('Supabase signOut error:', err);
      }
    }
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.email.toLowerCase() === 'admin@gmail.com';
  const isVisitor = user?.role === 'visitor';
  const canBuy = !!user && (user.role === 'buyer' || user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && user.role !== 'visitor',
        isAdmin,
        isVisitor,
        canBuy,
        authLoading,
        isSupabaseReady: isSupabaseConfigured,
        isAuthModalOpen,
        authModalReason,
        pendingItemToBuy,
        setPendingItemToBuy,
        openAuthModal,
        closeAuthModal,
        loginAsVisitor,
        login,
        loginWithGoogle,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
