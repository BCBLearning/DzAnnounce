import { supabase } from '@/lib/supabase';
import { categoryService } from '@/services/CategoryService';
import { wilayaService } from '@/services/WilayaService';
import { paidAnnouncementService } from './PaidAnnouncementService';

export const dataInitializer = {
  async initializeDatabase() {
    try {
      console.log('Initialisation de la base de données...');
      
      // Initialiser les catégories
      await categoryService.initializeCategories();
      console.log('✅ Catégories initialisées');
      
      // Initialiser les wilayas
      await wilayaService.initializeWilayas();
      console.log('✅ Wilayas initialisées');
      
      // Initialiser le système payant
      await paidAnnouncementService.initializePaidSystem();
      console.log('✅ Système payant initialisé');
      
      // Vérifier les politiques RLS
      await this.setupRLS();
      console.log('✅ Politiques RLS configurées');
      
      return { success: true, message: 'Base de données initialisée avec succès' };
    } catch (error) {
      console.error('Erreur initialisation:', error);
      return { success: false, error };
    }
  },

  async setupRLS() {
    try {
      const queries = [
        'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;',
        'ALTER TABLE categories ENABLE ROW LEVEL SECURITY;',
        'ALTER TABLE wilayas ENABLE ROW LEVEL SECURITY;',
        'ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;',
        'ALTER TABLE paid_announcements ENABLE ROW LEVEL SECURITY;'
      ];
      
      for (const query of queries) {
        await supabase.rpc('exec_sql', { sql: query });
      }
      
      return true;
    } catch (error) {
      console.log('RLS setup error (normal):', error);
      return false;
    }
  },

  async checkInitializationStatus() {
    try {
      const [categories, wilayas] = await Promise.all([
        categoryService.getCategories(),
        wilayaService.getWilayas()
      ]);
      
      return {
        categoriesCount: categories.data?.length || 0,
        wilayasCount: wilayas.data?.length || 0,
        isInitialized: (categories.data?.length || 0) > 0 && (wilayas.data?.length || 0) > 0
      };
    } catch (error) {
      return { categoriesCount: 0, wilayasCount: 0, isInitialized: false, error };
    }
  }
};