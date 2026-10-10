import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  canBuy: boolean;
  isAuthModalOpen: boolean;
  authModalReason: string;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  login: (emailOrUser: string, pass: string) => Promise<{ success: boolean; isAdmin?: boolean; message?: string }>;
  loginWithGoogle: (emailOrId?: string, displayName?: string) => Promise<{ success: boolean; isAdmin?: boolean; message?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('nexus_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.id === 'usr_nepal_001') {
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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState('');

  const openAuthModal = (reason?: string) => {
    setAuthModalReason(reason || 'Sign in to access your account and buy products');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthModalReason('');
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_user');
    }
  }, [user]);

  const login = async (emailOrUser: string, pass: string) => {
    await new Promise((r) => setTimeout(r, 400));
    const cleanEmail = emailOrUser.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Admin authentication check: admin@gmail.com and pass=admin
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

    // Standard Buyer Login
    const loggedUser: User = {
      id: 'usr_' + Date.now(),
      name: emailOrUser.includes('@') ? emailOrUser.split('@')[0].replace('.', ' ') : emailOrUser,
      email: emailOrUser.includes('@') ? emailOrUser : `${emailOrUser}@gmail.com`,
      phone: '+977 9801234567',
      city: 'Kathmandu',
      address: 'Thamel, Kathmandu',
      role: 'buyer',
      authProvider: 'password',
      canBuy: true, // Permission allow buy products
      orders: user?.orders || []
    };
    setUser(loggedUser);
    setIsAuthModalOpen(false);
    return { success: true, isAdmin: false };
  };

  // Google ID Sign-in for Buyer (Grants buying permission)
  const loginWithGoogle = async (emailOrId?: string, displayName?: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const googleEmail = emailOrId?.trim() ? (emailOrId.includes('@') ? emailOrId.trim() : `${emailOrId.trim()}@gmail.com`) : 'buyer.google@gmail.com';
    const name = displayName?.trim() || (googleEmail.split('@')[0].replace(/[\._]/g, ' ') || 'Google Verified Buyer');

    // If Google login enters admin email
    if (googleEmail.toLowerCase() === 'admin@gmail.com') {
      const adminUser: User = {
        id: 'usr_admin_google',
        name: 'Nexus Administrator',
        email: 'admin@gmail.com',
        phone: '+977 9801000000',
        city: 'Kathmandu',
        address: 'Lazimpat, Kathmandu',
        role: 'admin',
        authProvider: 'google',
        canBuy: true,
        orders: user?.orders || []
      };
      setUser(adminUser);
      setIsAuthModalOpen(false);
      return { success: true, isAdmin: true };
    }

    const buyerUser: User = {
      id: 'usr_goog_' + Date.now(),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: googleEmail,
      phone: '+977 9841234567',
      city: 'Kathmandu',
      address: 'Nepal',
      role: 'buyer',
      authProvider: 'google',
      canBuy: true, // Buyer permission to buy products enabled
      orders: user?.orders || []
    };
    setUser(buyerUser);
    setIsAuthModalOpen(false);
    return { success: true, isAdmin: false };
  };

  const signup = async (name: string, email: string, _pass: string) => {
    await new Promise((r) => setTimeout(r, 500));
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
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

  const logout = () => {
    setUser(null);
  };

  const isAdmin = user?.role === 'admin' || user?.email.toLowerCase() === 'admin@gmail.com';
  const canBuy = !!user && (user.role === 'buyer' || user.role === 'admin' || user.canBuy === true);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin,
        canBuy,
        isAuthModalOpen,
        authModalReason,
        openAuthModal,
        closeAuthModal,
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
