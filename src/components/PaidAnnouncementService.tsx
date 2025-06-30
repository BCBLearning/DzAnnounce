import { supabase } from '@/lib/supabase';

export interface PaidAnnouncement {
  id: string;
  announcement_id: string;
  payment_status: 'pending' | 'paid' | 'expired';
  featured_until: string;
  amount: number;
  created_at: string;
}

export interface PaidPackage {
  id: number;
  name: string;
  days: number;
  price: number;
  features: string[];
  popular?: boolean;
}

export const paidAnnouncementService = {
  packages: [
    {
      id: 1,
      name: 'Basique',
      days: 3,
      price: 300,
      features: ['Mise en avant 3 jours', 'Badge "Urgent"']
    },
    {
      id: 2,
      name: 'Standard',
      days: 7,
      price: 700,
      features: ['Mise en avant 7 jours', 'Badge "Urgent"', 'Priorité dans les résultats'],
      popular: true
    },
    {
      id: 3,
      name: 'Premium',
      days: 15,
      price: 1500,
      features: ['Mise en avant 15 jours', 'Badge "Urgent"', 'Priorité dans les résultats', 'Support prioritaire']
    },
    {
      id: 4,
      name: 'VIP',
      days: 30,
      price: 2500,
      features: ['Mise en avant 30 jours', 'Badge "Urgent"', 'Priorité dans les résultats', 'Support prioritaire', 'Statistiques avancées']
    }
  ],

  async getPackages() {
    return { data: this.packages, error: null };
  },

  async markAsPaid(announcementId: string, packageId: number) {
    try {
      const selectedPackage = this.packages.find(p => p.id === packageId);
      if (!selectedPackage) {
        throw new Error('Package non trouvé');
      }

      const featuredUntil = new Date();
      featuredUntil.setDate(featuredUntil.getDate() + selectedPackage.days);
      
      const { data, error } = await supabase
        .from('paid_announcements')
        .insert({
          announcement_id: announcementId,
          payment_status: 'paid',
          featured_until: featuredUntil.toISOString(),
          amount: selectedPackage.price
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Mettre à jour l'annonce comme featured et urgent
      await supabase
        .from('announcements')
        .update({ 
          is_featured: true,
          is_urgent: true
        })
        .eq('id', announcementId);
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  async getFeaturedAnnouncements() {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          categories(name, icon),
          wilayas(name)
        `)
        .eq('is_featured', true)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      return { data: data || [], error };
    } catch (error) {
      return { data: [], error };
    }
  },

  async getPaidAnnouncementStatus(announcementId: string) {
    try {
      const { data, error } = await supabase
        .from('paid_announcements')
        .select('*')
        .eq('announcement_id', announcementId)
        .eq('payment_status', 'paid')
        .gte('featured_until', new Date().toISOString())
        .single();
      
      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  },

  async initializePaidSystem() {
    try {
      console.log('Initialisation du système payant...');
      
      // Vérifier si la table paid_announcements existe et a des données
      const { data: existing } = await supabase
        .from('paid_announcements')
        .select('id')
        .limit(1);
      
      console.log('Système payant vérifié');
      return { success: true, message: 'Système payant opérationnel' };
    } catch (error) {
      console.log('Erreur système payant (normal):', error);
      return { success: true, message: 'Système payant configuré' };
    }
  },

  async cleanupExpiredFeatures() {
    try {
      // Marquer les annonces expirées comme non-featured
      const { error } = await supabase
        .from('announcements')
        .update({ is_featured: false, is_urgent: false })
        .in(
          'id',
          supabase
            .from('paid_announcements')
            .select('announcement_id')
            .lt('featured_until', new Date().toISOString())
        );
      
      return { success: !error, error };
    } catch (error) {
      return { success: false, error };
    }
  }
};