import { supabase } from '@/lib/supabase';

export interface ManagedUser {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'user' | 'admin';
  is_banned?: boolean;
  created_at: string;
}

class UserAdminService {
  async getAllUsers(): Promise<{ data: ManagedUser[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      return { data: data as ManagedUser[], error };
    } catch (error) {
      return { data: null, error };
    }
  }

  async banUser(id: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: true })
        .eq('id', id);

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }

  async unbanUser(id: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: false })
        .eq('id', id);

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }

  async deleteUser(id: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export const userAdminService = new UserAdminService();