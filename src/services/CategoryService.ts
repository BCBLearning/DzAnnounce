import { supabase } from '@/lib/supabase';

export interface Category {
  id: number;
  name: string;
  icon: string;
  description?: string;
  created_at?: string;
}

class CategoryService {
  private defaultCategories: Category[] = [
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
        console.warn('Utilisation des catégories par défaut :', error.message);
        return { data: this.defaultCategories, error: null };
      }

      return { data: data || this.defaultCategories, error: null };
    } catch (error) {
      console.error('Erreur lors du chargement des catégories :', error);
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
        return this.defaultCategories.find(cat => cat.id === id) || null;
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération de la catégorie :', error);
      return this.defaultCategories.find(cat => cat.id === id) || null;
    }
  }

  async createCategory(category: Omit<Category, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([category])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Erreur lors de la création de la catégorie :', error);
      return { data: null, error };
    }
  }

  async updateCategory(id: number, updates: Partial<Category>) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la catégorie :', error);
      return { data: null, error };
    }
  }

  async deleteCategory(id: number) {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      return { success: !error, error };
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
      return { success: false, error };
    }
  }

  async initializeCategories() {
    try {
      const { data: existing } = await supabase
        .from('categories')
        .select('id')
        .limit(1);

      if (existing && existing.length > 0) {
        console.log('Les catégories sont déjà initialisées.');
        return { success: true, message: 'Catégories déjà existantes' };
      }

      const { error } = await supabase
        .from('categories')
        .insert(this.defaultCategories.map(cat => ({
          name: cat.name,
          icon: cat.icon,
          description: cat.description
        })));

      if (error) {
        console.error('Erreur lors de l\'initialisation des catégories :', error);
        return { success: false, error };
      }

      console.log('Catégories initialisées avec succès.');
      return { success: true, message: 'Catégories initialisées' };
    } catch (error) {
      console.error('Erreur dans initializeCategories :', error);
      return { success: false, error };
    }
  }
}

export const categoryService = new CategoryService();