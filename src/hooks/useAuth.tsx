import { useCallback, useContext, useEffect, useState } from 'react';
import { createSupabaseClient } from '@/utils/supabase/server';
import { Session, AuthResponse, AuthTokenResponsePassword, AuthError } from '@supabase/supabase-js';
import { SubscriptionContext } from '@/context/SessionContext';

interface Actions {
  login: (email: string, password: string) => Promise<AuthTokenResponsePassword>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  signOut: () => Promise<{
    error: AuthError | null;
  }>;
  reloadSession: () => void;
}

const useAuth = (): [Session | null, Actions] => {
  const [session, setSession] = useState<Session|null>(null);
  const supabase = createSupabaseClient();
  const { loadData } = useContext(SubscriptionContext);
  
  useEffect(() => {
    const getSession = async () => {
        reloadSession();
        loadData();
    }
    getSession();
    supabase.auth.onAuthStateChange((_event, session) => {
        if (!session) {
            console.log("SESSION SET", session);
            setSession(session);
            loadData();
        }
    });
  }, []);

  const reloadSession = useCallback(async () => {
    const data = await supabase.auth.getSession();
    if (data?.data?.session){
        setSession(data?.data?.session);
        loadData();
    }
    else {
        setSession(null);
        loadData();
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    return result;
  }, [supabase.auth]);

  const signUp = useCallback(async (email: string, password: string) => {
    const result = await supabase.auth.signUp({
        email,
        password,
    });

    return result;
  }, [supabase.auth]);

  const signOut = useCallback(async () => {
    const data = await supabase.auth.signOut();
    setSession(null);
    return data; 
  }, [supabase.auth])

  const actions = {
    login, signOut, signUp, reloadSession
  }

  return [session, actions];
};

export default useAuth;