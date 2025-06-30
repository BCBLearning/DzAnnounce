import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, MapPin, Star } from 'lucide-react';

export const HeroSection = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4 bg-green-100 text-green-800 border-green-200">
            🚀 Nouvelle plateforme lancée !
          </Badge>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Trouvez tout ce que vous cherchez en
            <span className="text-blue-600 block">Algérie</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            La première plateforme de petites annonces géolocalisées d'Algérie. 
            Achetez, vendez et découvrez des opportunités près de chez vous.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
              Commencer à explorer
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Publier une annonce
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">10K+</div>
              <div className="text-sm text-gray-600">Annonces actives</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">5K+</div>
              <div className="text-sm text-gray-600">Utilisateurs</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">48</div>
              <div className="text-sm text-gray-600">Wilayas</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">4.8</div>
              <div className="text-sm text-gray-600">Note moyenne</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};