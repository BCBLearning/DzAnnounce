import React from 'react';
import { AnnouncementCard } from './AnnouncementCard';

// Mock data fallback
const mockAnnouncements = [
  {
    id: '1',
    title: 'Appartement F3 à louer - Hydra',
    description: 'Bel appartement F3 meublé dans le quartier résidentiel d\'Hydra',
    price: 45000,
    category: 'Immobilier',
    location: 'Alger',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'],
    user_id: '1',
    status: 'approved' as const,
    created_at: '2024-01-15',
    updated_at: '2024-01-15'
  },
  {
    id: '2',
    title: 'Peugeot 208 - Excellent état',
    description: 'Voiture en très bon état, entretien régulier, première main',
    price: 1200000,
    category: 'Automobile',
    location: 'Oran',
    images: ['https://images.unsplash.com/photo-1549924231-f129b911e442?w=400'],
    user_id: '2',
    status: 'approved' as const,
    created_at: '2024-01-14',
    updated_at: '2024-01-14'
  }
];

interface AnnouncementGridProps {
  announcements?: any[];
  loading?: boolean;
  searchTerm?: string;
  selectedCategory?: string;
  selectedLocation?: string;
}

export const AnnouncementGrid: React.FC<AnnouncementGridProps> = ({
  announcements = mockAnnouncements,
  loading = false,
  searchTerm = '',
  selectedCategory = '',
  selectedLocation = ''
}) => {
  // Filter announcements based on search criteria
  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = !searchTerm || 
      announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !selectedCategory || announcement.category === selectedCategory;
    const matchesLocation = !selectedLocation || announcement.location === selectedLocation;
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-gray-200 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (filteredAnnouncements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Aucune annonce trouvée</p>
        <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAnnouncements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  );
};