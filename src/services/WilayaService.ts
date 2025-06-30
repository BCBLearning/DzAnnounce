import { supabase } from '@/lib/supabase';

export interface Wilaya {
  id: number;
  name: string;
  code: string;
  created_at?: string;
}

class WilayaService {
  private defaultWilayas = [
    { id: 1, name: 'Adrar', code: '01' },
    { id: 2, name: 'Chlef', code: '02' },
    { id: 3, name: 'Laghouat', code: '03' },
    { id: 4, name: 'Oum El Bouaghi', code: '04' },
    { id: 5, name: 'Batna', code: '05' },
    { id: 6, name: 'Béjaïa', code: '06' },
    { id: 7, name: 'Biskra', code: '07' },
    { id: 8, name: 'Béchar', code: '08' },
    { id: 9, name: 'Blida', code: '09' },
    { id: 10, name: 'Bouira', code: '10' },
    { id: 11, name: 'Tamanrasset', code: '11' },
    { id: 12, name: 'Tébessa', code: '12' },
    { id: 13, name: 'Tlemcen', code: '13' },
    { id: 14, name: 'Tiaret', code: '14' },
    { id: 15, name: 'Tizi Ouzou', code: '15' },
    { id: 16, name: 'Alger', code: '16' },
    { id: 17, name: 'Djelfa', code: '17' },
    { id: 18, name: 'Jijel', code: '18' },
    { id: 19, name: 'Sétif', code: '19' },
    { id: 20, name: 'Saïda', code: '20' },
    { id: 21, name: 'Skikda', code: '21' },
    { id: 22, name: 'Sidi Bel Abbès', code: '22' },
    { id: 23, name: 'Annaba', code: '23' },
    { id: 24, name: 'Guelma', code: '24' },
    { id: 25, name: 'Constantine', code: '25' },
    { id: 26, name: 'Médéa', code: '26' },
    { id: 27, name: 'Mostaganem', code: '27' },
    { id: 28, name: 'M\'Sila', code: '28' },
    { id: 29, name: 'Mascara', code: '29' },
    { id: 30, name: 'Ouargla', code: '30' },
    { id: 31, name: 'Oran', code: '31' },
    { id: 32, name: 'El Bayadh', code: '32' },
    { id: 33, name: 'Illizi', code: '33' },
    { id: 34, name: 'Bordj Bou Arréridj', code: '34' },
    { id: 35, name: 'Boumerdès', code: '35' },
    { id: 36, name: 'El Tarf', code: '36' },
    { id: 37, name: 'Tindouf', code: '37' },
    { id: 38, name: 'Tissemsilt', code: '38' },
    { id: 39, name: 'El Oued', code: '39' },
    { id: 40, name: 'Khenchela', code: '40' },
    { id: 41, name: 'Souk Ahras', code: '41' },
    { id: 42, name: 'Tipaza', code: '42' },
    { id: 43, name: 'Mila', code: '43' },
    { id: 44, name: 'Aïn Defla', code: '44' },
    { id: 45, name: 'Naâma', code: '45' },
    { id: 46, name: 'Aïn Témouchent', code: '46' },
    { id: 47, name: 'Ghardaïa', code: '47' },
    { id: 48, name: 'Relizane', code: '48' }
  ];

  async getWilayas() {
    try {
      const { data, error } = await supabase
        .from('wilayas')
        .select('*')
        .order('name');

      if (error) {
        console.log('Using default wilayas:', error.message);
        return { data: this.defaultWilayas, error: null };
      }
      
      return { data: data || this.defaultWilayas, error: null };
    } catch (error) {
      console.error('Error fetching wilayas:', error);
      return { data: this.defaultWilayas, error };
    }
  }

  async getWilayaById(id: number): Promise<Wilaya | null> {
    try {
      const { data, error } = await supabase
        .from('wilayas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        return this.defaultWilayas.find(w => w.id === id) || null;
      }
      return data;
    } catch (error) {
      console.error('Error fetching wilaya:', error);
      return this.defaultWilayas.find(w => w.id === id) || null;
    }
  }

  async initializeWilayas() {
    try {
      // Check if wilayas already exist
      const { data: existing } = await supabase
        .from('wilayas')
        .select('id')
        .limit(1);

      if (existing && existing.length > 0) {
        console.log('Wilayas already initialized');
        return { success: true, message: 'Wilayas already exist' };
      }

      // Insert default wilayas
      const { error } = await supabase
        .from('wilayas')
        .insert(this.defaultWilayas.map(wilaya => ({
          name: wilaya.name,
          code: wilaya.code
        })));

      if (error) {
        console.error('Error initializing wilayas:', error);
        return { success: false, error };
      }

      console.log('Wilayas initialized successfully');
      return { success: true, message: 'Wilayas initialized' };
    } catch (error) {
      console.error('Error in initializeWilayas:', error);
      return { success: false, error };
    }
  }
}

export const wilayaService = new WilayaService();