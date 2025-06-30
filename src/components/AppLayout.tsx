import { useState } from 'react';
import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { SearchFilters } from './SearchFilters';
import { CategoryGrid } from './CategoryGrid';
import { AnnouncementGrid } from './AnnouncementGrid';

export const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedLocation, setSelectedLocation] = useState('Toutes les wilayas');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <HeroSection />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <SearchFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
          />
        </div>
        
        <CategoryGrid />
        
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Annonces récentes
            </h2>
            <p className="text-gray-600">
              {searchTerm && `Résultats pour "${searchTerm}"`}
            </p>
          </div>
          
          <AnnouncementGrid />
        </div>
      </main>
      
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">DzAnnounce</h3>
          <p className="text-gray-400 mb-4">
            La plateforme de référence pour les petites annonces en Algérie
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <a href="#" className="hover:text-blue-400">À propos</a>
            <a href="#" className="hover:text-blue-400">Contact</a>
            <a href="#" className="hover:text-blue-400">Conditions</a>
            <a href="#" className="hover:text-blue-400">Confidentialité</a>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            © 2024 DzAnnounce. Tous droits réservés.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;