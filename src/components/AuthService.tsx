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

// ✅ Service d'authentification central
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

      // ⚠️ Certains projets nécessitent une reconnexion si email non confirmé
      if (!data.session) {
        await supabase.auth.signInWithPassword({ email, password });
      }

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
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
      console.error('❌ Erreur getCurrentUser:', error);
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
      console.error('❌ Erreur getUserProfile:', error);
      return null;
    }
  },

  async isAdmin(user: any): Promise<boolean> {
    if (!user) return false;

    try {
      // ✅ Vérifie d'abord les metadata
      if (user.user_metadata?.role === 'admin') return true;

      // 🔍 Vérifie la table profiles
      const profile = await this.getUserProfile(user.id);
      return profile?.role === 'admin';
    } catch (error) {
      console.error('❌ Erreur isAdmin:', error);
      return false;
    }
  }
};