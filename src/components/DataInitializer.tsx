import { categoryService } from './CategoryService';
import { wilayaService } from './WilayaService';
// import { paymentService } from './PaymentService'; // ← si nécessaire

export interface InitStatus {
  categoriesCount: number;
  wilayasCount: number;
  isInitialized: boolean;
}

class DataInitializer {
  /**
   * Vérifie si les données sont déjà initialisées dans la base.
   */
  async checkInitializationStatus(): Promise<InitStatus> {
    try {
      const categories = await categoryService.getCategories();
      const wilayas = await wilayaService.getWilayas();

      const categoriesCount = categories.data?.length || 0;
      const wilayasCount = wilayas.data?.length || 0;

      const isInitialized = categoriesCount > 0 && wilayasCount > 0;

      return {
        categoriesCount,
        wilayasCount,
        isInitialized
      };
    } catch (error) {
      console.error('Erreur lors de la vérification de l’état d’initialisation :', error);
      return {
        categoriesCount: 0,
        wilayasCount: 0,
        isInitialized: false
      };
    }
  }

  /**
   * Initialise les données par défaut dans la base de données.
   */
  async initializeDatabase(): Promise<{ success: boolean; message?: string; error?: any }> {
    try {
      const [catResult, wilayaResult] = await Promise.all([
        categoryService.initializeCategories(),
        wilayaService.initializeWilayas()
        // paymentService.initializeSettings() ← si tu ajoutes un système payant
      ]);

      const allOk = catResult.success && wilayaResult.success;

      return allOk
        ? { success: true, message: 'Base de données initialisée avec succès' }
        : { success: false, error: 'Certaines parties ont échoué à s\'initialiser' };
    } catch (error) {
      console.error('Erreur lors de l’initialisation complète de la base :', error);
      return { success: false, error };
    }
  }
}

export const dataInitializer = new DataInitializer();