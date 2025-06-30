import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Users, FileText, BarChart3, Settings, Eye, Trash2, Database } from 'lucide-react';
import { userService } from '@/components/UserService';
import { announcementService } from '@/components/AnnouncementService';
import { dataInitializer } from '@/components/DataInitializer';
import { toast } from '@/components/ui/use-toast';
import type { Announcement } from '@/components/AnnouncementService';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [initStatus, setInitStatus] = useState<any>(null);
  const [initializing, setInitializing] = useState(false);
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
      await checkInitStatus();
    } catch (error) {
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const checkInitStatus = async () => {
    try {
      const status = await dataInitializer.checkInitializationStatus();
      setInitStatus(status);
    } catch (error) {
      console.error('Erreur vérification init:', error);
    }
  };

  const handleInitializeDatabase = async () => {
    setInitializing(true);
    try {
      const result = await dataInitializer.initializeDatabase();
      if (result.success) {
        toast({
          title: 'Succès',
          description: 'Base de données initialisée avec succès'
        });
        await checkInitStatus();
      } else {
        toast({
          title: 'Erreur',
          description: 'Erreur lors de l\'initialisation',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive'
      });
    } finally {
      setInitializing(false);
    }
  };

  const loadData = async () => {
    try {
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

        {/* Initialisation Database */}
        {initStatus && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Initialisation de la Base de Données
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Catégories</span>
                    <Badge variant={initStatus.categoriesCount > 0 ? 'default' : 'secondary'}>
                      {initStatus.categoriesCount} initialisées
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span>Wilayas</span>
                    <Badge variant={initStatus.wilayasCount > 0 ? 'default' : 'secondary'}>
                      {initStatus.wilayasCount} initialisées
                    </Badge>
                  </div>
                </div>
                
                {!initStatus.isInitialized && (
                  <Alert>
                    <AlertDescription>
                      La base de données n'est pas encore initialisée. Cliquez sur le bouton ci-dessous pour initialiser les catégories, wilayas et le système payant.
                    </AlertDescription>
                  </Alert>
                )}
                
                <Button 
                  onClick={handleInitializeDatabase}
                  disabled={initializing}
                  className="w-full"
                >
                  {initializing ? 'Initialisation...' : 'Initialiser la Base de Données'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
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
                  <p className="text-sm font-medium text-gray-600">Actives</p>
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

        {/* Tabs */}
        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList>
            <TabsTrigger value="announcements">Annonces</TabsTrigger>
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
                    {announcements.slice(0, 10).map((announcement) => (
                      <div key={announcement.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{announcement.title}</h3>
                              <Badge variant={announcement.status === 'active' ? 'default' : 'secondary'}>
                                {announcement.status}
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                              {announcement.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="font-medium text-blue-600">
                                {announcement.price.toLocaleString()} DA
                              </span>
                              <span>{announcement.views || 0} vues</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    Application opérationnelle avec base de données initialisée.
                    Catégories, wilayas et système payant configurés.
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