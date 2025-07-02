import { supabase } from '@/lib/supabase';

export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: string;
}

export const userService = {
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) return { data: null, error };

      const userData: User = {
        id: user.id,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        role: user.user_metadata?.role || 'user',
        created_at: user.created_at
      };

      return { data: userData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },
async createAdmin(email: string, password: string, fullName: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: 'admin'
        }
      }
    });

    if (error || !data?.user?.id) {
      return { data: null, error };
    }

    // 👇 Forcer la vérification email (fonction RPC Supabase)
    const { error: rpcError } = await supabase.rpc('verify_user_email', {
      uid: data.user.id
    });

    if (rpcError) {
      console.error('Erreur forçage vérification email:', rpcError);
    }

    return { data, error: rpcError || error };
  } catch (error) {
    return { data: null, error };
  }
}
,
  

  async isAdmin() {
    try {
      const { data: user } = await this.getCurrentUser();
      return user?.role === 'admin';
    } catch {
      return false;
    }
  },

  async checkAdminExists() {
  try {
    const { data, error } = await supabase.rpc('admin_exists_with_verified_email');

    if (error) {
      console.error('Erreur Supabase RPC:', error);
      return false;
    }

    return data === true;
  } catch (error) {
    console.error('Erreur checkAdminExists:', error);
    return false;
  }
},

  async signIn(email: string, password: string) {
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

  async signUp(email: string, password: string, fullName: string) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'user'
          }
        }
      });
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      return { error };
    }
  }
};