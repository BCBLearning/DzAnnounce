import React, { useState, useEffect } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { CategoryGrid } from '@/components/CategoryGrid';
import { SearchFilters } from '@/components/SearchFilters';
import { AnnouncementGrid } from '@/components/AnnouncementGrid';
import { announcementService } from '@/components/AnnouncementService';
import { paidAnnouncementService } from '@/components/PaidAnnouncementService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Eye } from 'lucide-react';

const Index: React.FC = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [featuredAnnouncements, setFeaturedAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [announcementsResult, featuredResult] = await Promise.all([
        announcementService.getAnnouncements({ limit: 12 }),
        paidAnnouncementService.getFeaturedAnnouncements()
      ]);
      
      setAnnouncements(announcementsResult.data || []);
      setFeaturedAnnouncements(featuredResult.data || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (newFilters: any) => {
    setFilters(newFilters);
    setLoading(true);
    try {
      const { data } = await announcementService.getAnnouncements({
        ...newFilters,
        limit: 12
      });
      setAnnouncements(data || []);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilters onSearch={handleSearch} />
        
        <CategoryGrid />
        
        {/* Featured Announcements */}
        {featuredAnnouncements.length > 0 && (
          <section className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              Annonces en vedette
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredAnnouncements.slice(0, 6).map((announcement: any) => (
                <Card key={announcement.id} className="hover:shadow-lg transition-shadow border-yellow-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg line-clamp-2">{announcement.title}</CardTitle>
                      <Badge className="bg-yellow-500 text-white ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        VIP
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {announcement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-blue-600">
                        {announcement.price?.toLocaleString()} DA
                      </span>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {announcement.views || 0}
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      {announcement.wilayas?.name} • {announcement.categories?.name}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
        
        {/* Regular Announcements */}
        <section className="py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Dernières annonces
          </h2>
          <AnnouncementGrid 
            announcements={announcements} 
            loading={loading}
          />
        </section>
      </div>
    </div>
  );
};

export default Index;