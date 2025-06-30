import { supabase } from '@/lib/supabase';
import { getLocalCategories, getLocalWilayas, initializeData } from '@/components/DataInitializer';

// Types
export interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number;
  category_id: number;
  wilaya_id: number;
  commune?: string;
  contact_info?: any;
  images: string[];
  user_id: string;
  status: 'pending' | 'active' | 'sold' | 'expired';
  is_featured: boolean;
  is_urgent: boolean;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  name_ar?: string;
  icon?: string;
  description?: string;
  is_active?: boolean;
}

export interface Wilaya {
  id: number;
  name: string;
  name_ar?: string;
  code: string;
}

// Service des annonces
export const announcementService = {
  async getAnnouncements(filters?: { 
    category?: number; 
    wilaya?: number; 
    search?: string;
    status?: string;
    limit?: number;
  }) {
    try {
      let query = supabase
        .from('announcements')
        .select('*')
        .eq('status', filters?.status || 'active')
        .order('is_featured', { ascending: false })
        .order('is_urgent', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters?.category) query = query.eq('category_id', filters.category);
      if (filters?.wilaya) query = query.eq('wilaya_id', filters.wilaya);
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }
      if (filters?.limit) query = query.limit(filters.limit);

      const { data, error } = await query;
      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  },

  async createAnnouncement(announcement: Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'views_count'>) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{ ...announcement, views_count: 0 }])
        .select()
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async deleteAnnouncement(id: string) {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      return { error };
    } catch (error) {
      return { error };
    }
  }
};

// Export services from their dedicated files
export { categoryService } from '@/services/CategoryService';
export { wilayaService } from '@/services/WilayaService';