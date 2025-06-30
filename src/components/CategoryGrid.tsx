import { Card, CardContent } from '@/components/ui/card';
import { Car, Home, Smartphone, Shirt, Hammer, Briefcase, Wrench, ShoppingBag } from 'lucide-react';
import { categoryService } from '@/services/CategoryService';

const categories = [
  { name: 'Véhicules', icon: Car, count: 1234, color: 'bg-red-500' },
  { name: 'Immobilier', icon: Home, count: 856, color: 'bg-blue-500' },
  { name: 'Électronique', icon: Smartphone, count: 2341, color: 'bg-purple-500' },
  { name: 'Mode', icon: Shirt, count: 567, color: 'bg-pink-500' },
  { name: 'Maison & Jardin', icon: Hammer, count: 432, color: 'bg-green-500' },
  { name: 'Emploi', icon: Briefcase, count: 789, color: 'bg-orange-500' },
  { name: 'Services', icon: Wrench, count: 345, color: 'bg-teal-500' },
  { name: 'Autres', icon: ShoppingBag, count: 678, color: 'bg-gray-500' }
];

export const CategoryGrid = () => {
  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        Parcourir par catégorie
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category) => {
          const IconComponent = category.icon;
          return (
            <Card key={category.name} className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {category.count.toLocaleString()} annonces
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