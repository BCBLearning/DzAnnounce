import { supabase } from '@/lib/supabase';

export interface Category {
  id: number;
  name: string;
  icon: string;
  description?: string;
  created_at?: string;
}

class CategoryService {
  private defaultCategories = [
    { id: 1, name: 'Véhicules', icon: 'Car', description: 'Voitures, motos, camions' },
    { id: 2, name: 'Immobilier', icon: 'Home', description: 'Vente et location' },
    { id: 3, name: 'Électronique', icon: 'Smartphone', description: 'Téléphones, ordinateurs' },
    { id: 4, name: 'Mode', icon: 'Shirt', description: 'Vêtements et accessoires' },
    { id: 5, name: 'Maison & Jardin', icon: 'Hammer', description: 'Meubles, décoration' },
    { id: 6, name: 'Emploi', icon: 'Briefcase', description: 'Offres d\'emploi' },
    { id: 7, name: 'Services', icon: 'Wrench', description: 'Services professionnels' },
    { id: 8, name: 'Autres', icon: 'ShoppingBag', description: 'Divers' }
  ];

  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        console.log('Using default categories:', error.message);
        return { data: this.defaultCategories, error: null };
      }
      
      return { data: data || this.defaultCategories, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: this.defaultCategories, error };
    }
  }

  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // Fallback to default category
        return this.defaultCategories.find(cat => cat.id === id) || null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching category:', error);
      return this.defaultCategories.find(cat => cat.id === id) || null;
    }
  }

  async initializeCategories() {
    try {
      // Check if categories already exist
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .limit(1);

      if (existing && existing.length > 0) {
        console.log('Categories already initialized');
        return { success: true, message: 'Categories already exist' };
      }

      // Insert default categories
      const { error } = await supabase
        .from('categories')
        .insert(this.defaultCategories.map(cat => ({
          name: cat.name,
          icon: cat.icon,
          description: cat.description
        })));

      if (error) {
        console.error('Error initializing categories:', error);
        return { success: false, error };
      }

      console.log('Categories initialized successfully');
      return { success: true, message: 'Categories initialized' };
    } catch (error) {
      console.error('Error in initializeCategories:', error);
      return { success: false, error };
    }
  }
}

export const categoryService = new CategoryService();