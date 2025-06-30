import { supabase } from '@/lib/supabase';

export interface Category {
  id: number;
  name: string;
  icon: string;
  description?: string;
  created_at?: string;
}

class CategoryService {
  async getCategories(): Promise<Category[]> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      // Fallback to default categories
      return [
        { id: 1, name: 'Véhicules', icon: 'Car' },
        { id: 2, name: 'Immobilier', icon: 'Home' },
        { id: 3, name: 'Électronique', icon: 'Smartphone' },
        { id: 4, name: 'Mode', icon: 'Shirt' },
        { id: 5, name: 'Maison & Jardin', icon: 'Hammer' },
        { id: 6, name: 'Emploi', icon: 'Briefcase' },
        { id: 7, name: 'Services', icon: 'Wrench' },
        { id: 8, name: 'Autres', icon: 'ShoppingBag' }
      ];
    }
  }

  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      return null;
    }
  }
}

export const categoryService = new CategoryService();