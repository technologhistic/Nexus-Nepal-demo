import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  activeAuthView: 'login' | 'signup';
  openAuthModal: (view?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthView: (view: 'login' | 'signup') => void;
  login: (emailOrUser: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  signup: (name: string, email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const DEFAULT_USER: User = {
  id: 'usr_nepal_001',
  name: 'Laxmi Sapkota',
  email: 'sapkotalaxmi703@gmail.com',
  phone: '+977 9841234567',
  city: 'Kathmandu',
  address: 'Lazimpat, Kathmandu 44600',
  rewardPoints: 340,
  orders: [
    {
      id: 'NX-NP-91823',
      date: '2026-09-28',
      items: [
        {
          product: {
            id: 'nx-tea-01',
            name: 'Ilam Orthodox First Flush Tea',
            slug: 'ilam-orthodox-tea',
            category: 'organic',
            categoryLabel: 'Organic & Food',
            price: 1250,
            rating: 4.95,
            reviewCount: 238,
            origin: 'Kanyam, Ilam',
            inStock: true,
            stockCount: 84,
            description: 'Plucked by hand from mist-covered organic slopes of eastern Nepal.',
            features: ['Certified Organic'],
            image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
          },
          quantity: 2
        }
      ],
      subtotal: 2500,
      shipping: 100,
      total: 2600,
      paymentMethod: 'esewa',
      paymentStatus: 'paid',
      orderStatus: 'Delivered',
      shippingAddress: {
        fullName: 'Laxmi Sapkota',
        phone: '+977 9841234567',
        province: 'Bagmati Province',
        city: 'Kathmandu',
        street: 'Lazimpat, Ward No. 2'
      }
    }
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('nexus_user');
      if (stored) return JSON.parse(stored);
      // default demo user for frictionless start if desired, or null
      return DEFAULT_USER;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [activeAuthView, setActiveAuthView] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_user');
    }
  }, [user]);

  const openAuthModal = (view: 'login' | 'signup' = 'login') => {
    setActiveAuthView(view);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const setAuthView = (view: 'login' | 'signup') => {
    setActiveAuthView(view);
  };

  const login = async (emailOrUser: string, _pass: string) => {
    await new Promise((r) => setTimeout(r, 600));
    // If the input is Laxmi or matches user email, load full profile
    const loggedUser: User = {
      id: 'usr_' + Date.now(),
      name: emailOrUser.includes('@') ? emailOrUser.split('@')[0].replace('.', ' ') : emailOrUser,
      email: emailOrUser.includes('@') ? emailOrUser : `${emailOrUser}@nexusnepal.com`,
      phone: '+977 9801234567',
      city: 'Kathmandu',
      address: 'Thamel, Kathmandu',
      rewardPoints: 250,
      orders: user?.orders || []
    };
    setUser(loggedUser);
    return { success: true };
  };

  const signup = async (name: string, email: string, _pass: string) => {
    await new Promise((r) => setTimeout(r, 700));
    const newUser: User = {
      id: 'usr_' + Date.now(),
      name,
      email,
      phone: '+977 98XXXXXXXX',
      city: 'Kathmandu',
      address: 'Kathmandu Valley',
      rewardPoints: 100, // welcome bonus points!
      orders: []
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        activeAuthView,
        openAuthModal,
        closeAuthModal,
        setAuthView,
        login,
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
