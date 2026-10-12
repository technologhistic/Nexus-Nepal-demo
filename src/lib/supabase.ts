import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default configured Supabase project provided for Nexus Nepal
export const DEFAULT_SUPABASE_URL = 'https://qgmpwwbrzognonxgtqkz.supabase.co';
export const SUPABASE_CALLBACK_URL = 'https://qgmpwwbrzognonxgtqkz.supabase.co/auth/v1/callback';

// Retrieve active URL from environment or fallback to project URL
export const getActiveSupabaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('nexus_supabase_url');
    if (stored && stored.trim()) return stored.trim();
  }
  const envUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (envUrl && envUrl.trim() && !envUrl.includes('placeholder')) {
    return envUrl.trim();
  }
  return DEFAULT_SUPABASE_URL;
};

// Retrieve active Anon key from environment or local storage
export const getActiveSupabaseAnonKey = (): string => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('nexus_supabase_anon_key');
    if (stored && stored.trim()) return stored.trim();
  }
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (envKey && envKey.trim() && !envKey.includes('placeholder')) {
    return envKey.trim();
  }
  return '';
};

export const isSupabaseConfigured = Boolean(
  getActiveSupabaseUrl() &&
  getActiveSupabaseAnonKey() &&
  getActiveSupabaseAnonKey().length > 10
);

/**
 * Initialize or get singleton Supabase client instance.
 * Configured with auto-refresh, persistent storage, and automatic OAuth URL fragment parsing.
 */
export function createSupabaseInstance(): SupabaseClient | null {
  const url = getActiveSupabaseUrl();
  const anonKey = getActiveSupabaseAnonKey();

  if (!url || !anonKey || anonKey.length < 10) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      flowType: 'implicit'
    }
  });
}

export let supabase: SupabaseClient | null = createSupabaseInstance();

/**
 * Update custom Supabase credentials at runtime and reinitialize client
 */
export function setCustomSupabaseCredentials(anonKey: string, customUrl?: string): boolean {
  if (typeof window === 'undefined') return false;
  if (customUrl) {
    localStorage.setItem('nexus_supabase_url', customUrl.trim());
  }
  localStorage.setItem('nexus_supabase_anon_key', anonKey.trim());
  supabase = createSupabaseInstance();
  return Boolean(supabase);
}

/**
 * Helper to initiate Google OAuth via Supabase.
 * Redirects through the Supabase Google Auth provider to window.location.origin.
 */
export async function signInWithGoogleOAuth(customRedirectUrl?: string) {
  if (!supabase) {
    supabase = createSupabaseInstance();
  }

  if (!supabase) {
    throw new Error('Supabase client is not initialized. Please configure VITE_SUPABASE_ANON_KEY.');
  }

  const redirectTo = customRedirectUrl || (typeof window !== 'undefined' ? window.location.origin : undefined);

  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });
}
