import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Shield,
  FileText,
  BarChart3,
  Database,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

import { toast } from '@/components/ui/use-toast';

import { announcementService } from '@/components/AnnouncementService';
import { dataInitializer } from '@/components/DataInitializer';

import { userAdminService } from '@/services/UserAdminService';
import type { User } from '@/services/UserService';

// ✅ Chemins corrigés vers /services
import { categoryService } from '@/services/CategoryService';
import { wilayaService } from '@/services/WilayaService';

// ✅ Types corrigés également
import type { Announcement } from '@/components/AnnouncementService';
import type { Category } from '@/services/CategoryService';
import type { Wilaya } from '@/services/WilayaService';


const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [initStatus, setInitStatus] = useState<any>(null);
  const [initializing, setInitializing] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newWilaya, setNewWilaya] = useState({ code: '', name: '' });
  const [editingWilaya, setEditingWilaya] = useState<Wilaya | null>(null);

  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    activeAnnouncements: 0,
    pendingAnnouncements: 0,
    totalViews: 0,
  });
  const [userList, setUserList] = useState<User[]>([]);

const loadUserList = async () => {
  const { data } = await userAdminService.getUsers();
  setUserList(data || []);
};

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
          description: `Vous n'avez pas les privilèges administrateur`,
          variant: 'destructive',
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

  const loadData = async () => {
    try {
      const { data: allAnnouncements } = await announcementService.getAnnouncements({ limit: 1000 });
      const { data: categoryData } = await categoryService.getCategories();
      const { data: wilayaData } = await wilayaService.getWilayas();

      if (allAnnouncements) {
        setAnnouncements(allAnnouncements);

        const totalViews = allAnnouncements.reduce((sum, ann) => sum + (ann.views || 0), 0);
        const activeCount = allAnnouncements.filter(ann => ann.status === 'active').length;
        const pendingCount = allAnnouncements.filter(ann => ann.status === 'pending').length;

        setStats({
          totalAnnouncements: allAnnouncements.length,
          activeAnnouncements: activeCount,
          pendingAnnouncements: pendingCount,
          totalViews,
        });
      }

      setCategories(categoryData || []);
      setWilayas(wilayaData || []);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données',
        variant: 'destructive',
      });
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
          description: 'Base de données initialisée avec succès',
        });
        await checkInitStatus();
        await loadData();
      } else {
        toast({
          title: 'Erreur',
          description: `Erreur lors de l'initialisation`,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setInitializing(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    await categoryService.addCategory(newCategory);
    toast({ title: 'Catégorie ajoutée' });
    setNewCategory({ name: '', description: '' });
    await loadData();
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      await categoryService.updateCategory(editingCategory.id, editingCategory);
      toast({ title: 'Catégorie mise à jour' });
      setEditingCategory(null);
      await loadData();
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (confirm('Supprimer cette catégorie ?')) {
      await categoryService.deleteCategory(id);
      toast({ title: 'Catégorie supprimée' });
      await loadData();
    }
  };

  const handleAddWilaya = async (e: React.FormEvent) => {
    e.preventDefault();
    await wilayaService.addWilaya(newWilaya);
    toast({ title: 'Wilaya ajoutée' });
    setNewWilaya({ code: '', name: '' });
    await loadData();
  };

  const handleUpdateWilaya = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingWilaya) {
      await wilayaService.updateWilaya(editingWilaya.id, editingWilaya);
      toast({ title: 'Wilaya mise à jour' });
      setEditingWilaya(null);
      await loadData();
    }
  };

  const handleDeleteWilaya = async (id: number) => {
    if (confirm('Supprimer cette wilaya ?')) {
      await wilayaService.deleteWilaya(id);
      toast({ title: 'Wilaya supprimée' });
      await loadData();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
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
              <Shield className="h-3 w-3 mr-1" /> Admin
            </Badge>
          </div>
          <p className="text-gray-600">Gestion de la plateforme DzAnnounce</p>
        </div>

        <Tabs defaultValue="stats">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="users">
  <Shield className="h-4 w-4 mr-2" /> Utilisateurs
</TabsTrigger>
            <TabsTrigger value="stats">
              <BarChart3 className="h-4 w-4 mr-2" /> Statistiques
            </TabsTrigger>
            <TabsTrigger value="categories">
              <FileText className="h-4 w-4 mr-2" /> Catégories
            </TabsTrigger>
            <TabsTrigger value="wilayas">
              <Database className="h-4 w-4 mr-2" /> Wilayas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium">Annonces totales</h3>
                  <p className="text-2xl font-bold">{stats.totalAnnouncements}</p>
                </div>
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium">Annonces actives</h3>
                  <p className="text-2xl font-bold">{stats.activeAnnouncements}</p>
                </div>
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium">Annonces en attente</h3>
                  <p className="text-2xl font-bold">{stats.pendingAnnouncements}</p>
                </div>
                <div className="border p-4 rounded-lg">
                  <h3 className="font-medium">Vues totales</h3>
                  <p className="text-2xl font-bold">{stats.totalViews}</p>
                </div>
              </CardContent>
            </Card>

            {initStatus && !initStatus.initialized && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Initialisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={handleInitializeDatabase}
                    disabled={initializing}
                  >
                    {initializing ? 'Initialisation...' : 'Initialiser la base de données'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Catégories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const name = form.name.value.trim();
                    const description = form.description.value.trim();
                    if (!name) return;

                    try {
                      const { data, error } = await categoryService.addCategory({ name, description });
                      if (error) throw error;
                      toast({ title: 'Catégorie ajoutée' });
                      form.reset();
                      await loadData();
                    } catch {
                      toast({ title: 'Erreur ajout catégorie', variant: 'destructive' });
                    }
                  }}
                  className="flex flex-col gap-2"
                >
                  <Input name="name" placeholder="Nom" required />
                  <Input name="description" placeholder="Description" />
                  <Button type="submit">Ajouter</Button>
                </form>

                {categories.length === 0 ? (
                  <Alert><AlertDescription>Aucune catégorie</AlertDescription></Alert>
                ) : (
                  <ul className="space-y-2">
                    {categories.map((cat) => (
                      <li key={cat.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <strong>{cat.name}</strong> — {cat.description}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={async () => {
                              const newName = prompt('Nouveau nom', cat.name);
                              if (!newName) return;
                              try {
                                await categoryService.updateCategory(cat.id, {
                                  name: newName,
                                  description: cat.description,
                                });
                                toast({ title: 'Catégorie mise à jour' });
                                await loadData();
                              } catch {
                                toast({ title: 'Erreur mise à jour', variant: 'destructive' });
                              }
                            }}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              if (confirm('Supprimer cette catégorie ?')) {
                                try {
                                  await categoryService.deleteCategory(cat.id);
                                  toast({ title: 'Catégorie supprimée' });
                                  await loadData();
                                } catch {
                                  toast({ title: 'Erreur suppression', variant: 'destructive' });
                                }
                              }
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wilayas">
            <Card>
              <CardHeader>
                <CardTitle>Wilayas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const code = form.code.value.trim();
                    const name = form.name.value.trim();
                    if (!code || !name) return;

                    try {
                      const { data, error } = await wilayaService.addWilaya({ code, name });
                      if (error) throw error;
                      toast({ title: 'Wilaya ajoutée' });
                      form.reset();
                      await loadData();
                    } catch {
                      toast({ title: 'Erreur ajout wilaya', variant: 'destructive' });
                    }
                  }}
                  className="flex flex-col gap-2"
                >
                  <Input name="code" placeholder="Code" required />
                  <Input name="name" placeholder="Nom" required />
                  <Button type="submit">Ajouter</Button>
                </form>

                {wilayas.length === 0 ? (
                  <Alert><AlertDescription>Aucune wilaya</AlertDescription></Alert>
                ) : (
                  <ul className="space-y-2">
                    {wilayas.map((w) => (
                      <li key={w.id} className="p-3 border rounded flex justify-between items-center">
                        <div>
                          <strong>{w.code}</strong> — {w.name}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={async () => {
                              const newName = prompt('Nouveau nom', w.name);
                              if (!newName) return;
                              try {
                                await wilayaService.updateWilaya(w.id, {
                                  code: w.code,
                                  name: newName,
                                });
                                toast({ title: 'Wilaya mise à jour' });
                                await loadData();
                              } catch {
                                toast({ title: 'Erreur mise à jour', variant: 'destructive' });
                              }
                            }}
                          >
                            Modifier
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={async () => {
                              if (confirm('Supprimer cette wilaya ?')) {
                                try {
                                  await wilayaService.deleteWilaya(w.id);
                                  toast({ title: 'Wilaya supprimée' });
                                  await loadData();
                                } catch {
                                  toast({ title: 'Erreur suppression', variant: 'destructive' });
                                }
                              }
                            }}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
              
              
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
  <Card>
    <CardHeader>
      <CardTitle>Utilisateurs</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      {userList.length === 0 ? (
        <Alert><AlertDescription>Aucun utilisateur</AlertDescription></Alert>
      ) : (
        <ul className="space-y-2">
          {userList.map((u) => (
            <li key={u.id} className="p-3 border rounded flex justify-between items-center">
              <div>
                <strong>{u.full_name || 'Utilisateur'}</strong><br />
                {u.email} — <Badge>{u.role}</Badge>
              </div>
              <div className="flex gap-2">
                {u.role !== 'admin' && (
                  <Button
                    variant="outline"
                    onClick={async () => {
                      if (confirm('Promouvoir cet utilisateur en admin ?')) {
                        await userAdminService.updateRole(u.id, 'admin');
                        toast({ title: 'Rôle mis à jour' });
                        await loadUserList();
                      }
                    }}
                  >
                    Promouvoir admin
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={async () => {
                    if (confirm('Supprimer cet utilisateur ?')) {
                      await userAdminService.banUser(u.id);
                      toast({ title: 'Utilisateur banni' });
                      await loadUserList();
                    }
                  }}
                >
                  Bannir
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CardContent>
  </Card>
</TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default Admin;