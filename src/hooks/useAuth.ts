import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { supabase, supabaseUrl, supabaseAnonKey } from '@/lib/supabaseClient';
import type { Profile } from '@/lib/types';
import type { Session } from '@supabase/supabase-js';

/**
 * Wallet-based auth flow:
 *
 * 1. User connects Solana wallet
 * 2. Clicks "Iniciar sesion"
 * 3. Edge function `ensure-user` creates an auto-confirmed Supabase user
 *    (using service role key — no confirmation email, no rate limit)
 * 4. Client signs in with deterministic credentials derived from wallet address
 * 5. Result: real Supabase session, RLS works, zero friction
 */



export function useAuth() {
  const { publicKey, connected } = useWallet();
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 onAuthStateChange:', event, session?.user?.id ?? 'null session');
      setSession(session);
      if (!session) {
        setProfile(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔍 getSession inicial:', session?.user?.id ?? 'null session');
      setSession(session);
      if (!session) setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch profile when session changes
  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();

      setProfile(data);
      setLoading(false);
    };

    fetchProfile();
  }, [session?.user?.id]);


  const signIn = useCallback(async () => {
    if (!connected || !publicKey) {
      setAuthError('Wallet no conectada. Asegurate de tener Phantom u otra wallet instalada.');
      throw new Error('Wallet no conectada');
    }

    setAuthLoading(true);
    setAuthError(null);

    try {
      const walletAddress = publicKey.toBase58();
      const email = `${walletAddress}@datoschain.app`;
      const password = walletAddress.slice(0, 32) + walletAddress.slice(0, 32);

      // Step 1: Ensure user exists (edge function creates with auto-confirm)
      const ensureRes = await fetch(`${supabaseUrl}/functions/v1/ensure-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ wallet_address: walletAddress }),
      });

      const ensureBody = await ensureRes.json().catch(() => ({}));
      console.log('🛡️ ensure-user status:', ensureRes.status, 'body:', ensureBody);

      if (!ensureRes.ok) {
        const errMsg = ensureBody.error || '';
        if (
          !errMsg.includes("already been registered") && 
          !errMsg.includes("already exists")
        ) {
          throw new Error(errMsg || 'Error al preparar la cuenta');
        }
      }

      // Step 2: Sign in with the deterministic credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log('🔑 signInWithPassword — error:', error, 'user:', data?.user?.id ?? 'null');

      if (error) {
        setAuthError('Error de autenticacion: ' + error.message);
        throw error;
      }

      return data;
    } catch (err) {
      if (err instanceof Error && !authError) {
        setAuthError(err.message);
      }
      throw err;
    } finally {
      setAuthLoading(false);
    }
  }, [connected, publicKey, authError]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
    setAuthError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!session?.user?.id) return;
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();
    setProfile(data);
  }, [session?.user?.id]);

  // Sync Supabase session with the active Solana wallet.
  // IMPORTANT: Only run after 'connected' is stable to avoid the autoConnect
  // race condition where publicKey is null for a brief moment on page load,
  // which would incorrectly sign the user out.
  useEffect(() => {
    if (!connected) return; // Wait for wallet adapter to fully initialize

    if (session?.user?.email && publicKey) {
      const activeWalletAddress = publicKey.toBase58();
      const sessionWalletAddress = session.user.email.split('@')[0];

      if (activeWalletAddress.toLowerCase() !== sessionWalletAddress.toLowerCase()) {
        signOut();
      }
    }
    // Note: We intentionally do NOT sign out when !publicKey && connected
    // because 'connected' being true guarantees publicKey is available.
  }, [connected, publicKey, session, signOut]);

  return {
    session,
    profile,
    loading,
    authLoading,
    authError,
    connected,
    publicKey,
    isAuthenticated: !!session,
    isRegistered: !!profile?.is_registered,
    signIn,
    signOut,
    refreshProfile,
  };
}
