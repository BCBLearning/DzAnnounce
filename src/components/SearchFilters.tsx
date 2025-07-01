import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Search, MapPin, Tag } from 'lucide-react';
import { categoryService } from '@/services/CategoryService';
import { wilayaService } from '@/services/WilayaService';

interface SearchFiltersProps {
  onSearch: (filters: any) => void;
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWilaya, setSelectedWilaya] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesResult, wilayasResult] = await Promise.all([
        categoryService.getCategories(),
        wilayaService.getWilayas()
      ]);

      setCategories(categoriesResult.data || []);
      setWilayas(wilayasResult.data || []);
    } catch (error) {
      console.error('Error loading filter data:', error);
    }
  };

  const handleSearch = () => {
    onSearch({
      search: searchTerm,
      category: selectedCategory === 'all' ? '' : selectedCategory,
      wilaya: selectedWilaya === 'all' ? '' : selectedWilaya
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Champ recherche texte */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sélecteur catégorie */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Catégorie" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sélecteur wilaya */}
        <Select value={selectedWilaya} onValueChange={setSelectedWilaya}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Wilaya" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les wilayas</SelectItem>
            {wilayas.map((wilaya) => (
              <SelectItem key={wilaya.id} value={wilaya.id.toString()}>
                {wilaya.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Bouton recherche */}
        <Button onClick={handleSearch} className="w-full">
          <Search className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
      </div>
    </div>
  );
};

export { categoryService, wilayaService };