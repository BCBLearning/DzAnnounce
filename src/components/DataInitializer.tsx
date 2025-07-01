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
      
      return { success: true, message: 'Base de données initialisée avec succès' };
    } catch (error) {
      console.error('Erreur initialisation:', error);
      return { success: false, error };
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