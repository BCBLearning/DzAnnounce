import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Filter } from 'lucide-react';
import { wilayaService } from '@/services/WilayaService';

interface SearchFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
}

const categories = [
  'Tous',
  'Véhicules',
  'Immobilier',
  'Électronique',
  'Mode',
  'Maison & Jardin',
  'Emploi',
  'Services'
];

const locations = [
  'Toutes les wilayas',
  'Alger',
  'Oran',
  'Constantine',
  'Annaba',
  'Blida',
  'Batna',
  'Djelfa',
  'Sétif',
  'Sidi Bel Abbès',
  'Biskra'
];

export const SearchFilters = ({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation
}: SearchFiltersProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Rechercher une annonce..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 h-12 text-lg"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="h-12">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="h-12">
            <MapPin className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Localisation" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button className="h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Search className="w-4 h-4 mr-2" />
          Rechercher
        </Button>
      </div>
    </div>
  );
};

export { wilayaService };