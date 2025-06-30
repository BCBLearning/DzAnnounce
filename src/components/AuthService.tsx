import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

// Types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin';
  credits: number;
  created_at: string;
}

export interface AuthResponse {
  data: any;
  error: any;
}

// Service d'authentification avec support admin
export const authService = {
  async signUp(email: string, password: string, fullName: string, role: string = 'user'): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signOut(): Promise<{ error: any }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Erreur utilisateur:', error);
      return null;
    }
  },

  async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erreur profil:', error);
      return null;
    }
  },

  async isAdmin(user: any): Promise<boolean> {
    if (!user) return false;
    
    try {
      // Vérifier dans les métadonnées de l'utilisateur
      if (user.user_metadata?.role === 'admin') return true;
      
      // Vérifier dans la table profiles si elle existe
      const profile = await this.getUserProfile(user.id);
      return profile?.role === 'admin';
    } catch (error) {
      return false;
    }
  }
};

// Hook avec support admin
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      
      if (currentUser) {
        const adminStatus = await authService.isAdmin(currentUser);
        setIsAdmin(adminStatus);
      }
      
      setLoading(false);
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user || null;
        setUser(sessionUser);
        
        if (sessionUser) {
          const adminStatus = await authService.isAdmin(sessionUser);
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading, isAdmin };
};