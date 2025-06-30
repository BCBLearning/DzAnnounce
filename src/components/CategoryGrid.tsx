import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, Home, Smartphone, Shirt, Hammer, Briefcase, Wrench, ShoppingBag } from 'lucide-react';
import { categoryService } from '@/services/CategoryService';

const iconMap = {
  Car, Home, Smartphone, Shirt, Hammer, Briefcase, Wrench, ShoppingBag
};

const colors = [
  'bg-red-500', 'bg-blue-500', 'bg-purple-500', 'bg-pink-500',
  'bg-green-500', 'bg-orange-500', 'bg-teal-500', 'bg-gray-500'
];

export const CategoryGrid = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await categoryService.getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Parcourir par catégorie
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-20 mx-auto"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Parcourir par catégorie
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => {
          const IconComponent = iconMap[category.icon as keyof typeof iconMap] || ShoppingBag;
          const color = colors[index % colors.length];
          
          return (
            <Card key={category.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className={`${color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {Math.floor(Math.random() * 1000)} annonces
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export { categoryService };