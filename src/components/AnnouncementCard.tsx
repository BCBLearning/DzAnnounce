import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, DollarSign } from 'lucide-react';

interface AnnouncementCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  category: string;
  date: string;
  image?: string;
  description: string;
}

export const AnnouncementCard = ({ 
  title, 
  price, 
  location, 
  category, 
  date, 
  image, 
  description 
}: AnnouncementCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={image || '/placeholder.svg'} 
          alt={title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-2 right-2 bg-blue-600 hover:bg-blue-700">
          {category}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-green-600 font-bold text-lg">
            <DollarSign className="w-4 h-4 mr-1" />
            {price.toLocaleString()} DA
          </div>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {date}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};