import { supabase } from '@/lib/supabase';

export interface Wilaya {
  id: number;
  name: string;
  code: string;
  created_at?: string;
}

class WilayaService {
  async getWilayas(): Promise<Wilaya[]> {
    try {
      const { data, error } = await supabase
        .from('wilayas')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching wilayas:', error);
      // Fallback to some default wilayas
      return [
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
        { id: 16, name: 'Alger', code: '16' },
        { id: 31, name: 'Oran', code: '31' },
        { id: 25, name: 'Constantine', code: '25' }
      ];
    }
  }

  async getWilayaById(id: number): Promise<Wilaya | null> {
    try {
      const { data, error } = await supabase
        .from('wilayas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching wilaya:', error);
      return null;
    }
  }
}

export const wilayaService = new WilayaService();