import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, FileText, BarChart3, Settings, Eye, Trash2 } from 'lucide-react';
import { userService } from '@/components/UserService';
import { announcementService } from '@/components/AnnouncementService';
import { toast } from '@/components/ui/use-toast';
import type { Announcement } from '@/components/AnnouncementService';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    activeAnnouncements: 0,
    pendingAnnouncements: 0,
    totalViews: 0
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data } = await userService.getCurrentUser();
      if (!data) {
        navigate('/login');
        return;
      }
      if (data.role !== 'admin') {
        navigate('/');
        toast({
          title: 'Accès refusé',
          description: 'Vous n\'avez pas les privilèges administrateur',
          variant: 'destructive'
        });
        return;
      }
      setUser(data);
      await loadData();
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadData = async () => {
    try {
      // Charger toutes les annonces pour les statistiques
      const { data: allAnnouncements } = await announcementService.getAnnouncements({ limit: 1000 });
      
      if (allAnnouncements) {
        setAnnouncements(allAnnouncements);
        
        const totalViews = allAnnouncements.reduce((sum, ann) => sum + (ann.views || 0), 0);
        const activeCount = allAnnouncements.filter(ann => ann.status === 'active').length;
        const pendingCount = allAnnouncements.filter(ann => ann.status === 'pending').length;
        
        setStats({
          totalAnnouncements: allAnnouncements.length,
          activeAnnouncements: activeCount,
          pendingAnnouncements: pendingCount,
          totalViews
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) return;

    try {
      const { error } = await announcementService.deleteAnnouncement(id);
      if (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de supprimer l\'annonce',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Succès',
          description: 'Annonce supprimée avec succès'
        });
        await loadData();
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Administration</h1>
            <Badge variant="secondary">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          </div>
          <p className="text-gray-600">Gestion de la plateforme DzAnnounce</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Annonces</p>
                  <p className="text-2xl font-bold">{stats.totalAnnouncements}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Annonces Actives</p>
                  <p className="text-2xl font-bold text-green-600">{stats.activeAnnouncements}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">En Attente</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingAnnouncements}</p>
                </div>
                <Settings className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Vues</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.totalViews}</p>
                </div>
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList>
            <TabsTrigger value="announcements">Annonces</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="announcements">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Annonces</CardTitle>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <Alert>
                    <AlertDescription>
                      Aucune annonce trouvée.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{announcement.title}</h3>
                              <Badge variant={announcement.status === 'active' ? 'default' : 'secondary'}>
                                {announcement.status}
                              </Badge>
                              {announcement.is_urgent && (
                                <Badge variant="destructive">Urgent</Badge>
                              )}
                              {announcement.is_featured && (
                                <Badge className="bg-yellow-500">Vedette</Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {announcement.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="font-medium text-blue-600">
                                {formatPrice(announcement.price)}
                              </span>
                              <span>{announcement.views || 0} vues</span>
                              <span>{formatDate(announcement.created_at)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Users className="h-4 w-4" />
                  <AlertDescription>
                    La gestion des utilisateurs sera disponible dans une prochaine version.
                    Actuellement, les utilisateurs sont gérés via Supabase Auth.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de la Plateforme</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <Settings className="h-4 w-4" />
                  <AlertDescription>
                    Les paramètres avancés seront disponibles dans une prochaine version.
                    Configuration actuelle : Base de données Supabase, authentification activée.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;