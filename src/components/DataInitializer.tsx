import { supabase } from '@/lib/supabase';

// Données de base pour l'application - suppression des données constantes
export const initializeData = async () => {
  try {
    // Vérifier si les données existent déjà dans la base
    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id')
      .limit(1);
    
    const { data: existingWilayas } = await supabase
      .from('wilayas')
      .select('id')
      .limit(1);

    // Les données sont maintenant dans la base de données
    // Plus besoin d'insertion manuelle
    return { 
      success: true, 
      categoriesExist: existingCategories && existingCategories.length > 0,
      wilayasExist: existingWilayas && existingWilayas.length > 0
    };
  } catch (error) {
    console.error('Erreur initialisation données:', error);
    return { success: false, error };
  }
};

// Fallback local uniquement en cas d'urgence
export const getLocalCategories = () => [
  { id: 1, name: 'Véhicules', icon: '🚗' },
  { id: 2, name: 'Immobilier', icon: '🏠' },
  { id: 3, name: 'Électronique', icon: '📱' },
  { id: 4, name: 'Mode', icon: '👕' },
  { id: 5, name: 'Maison', icon: '🏡' },
  { id: 6, name: 'Emploi', icon: '💼' },
  { id: 7, name: 'Loisirs', icon: '🎮' },
  { id: 8, name: 'Services', icon: '🔧' }
];

export const getLocalWilayas = () => [
  { id: 16, code: '16', name: 'Alger' },
  { id: 31, code: '31', name: 'Oran' },
  { id: 25, code: '25', name: 'Constantine' },
  { id: 9, code: '09', name: 'Blida' },
  { id: 6, code: '06', name: 'Béjaïa' },
  { id: 19, code: '19', name: 'Sétif' },
  { id: 15, code: '15', name: 'Tizi Ouzou' },
  { id: 23, code: '23', name: 'Annaba' }
];