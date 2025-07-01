import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardHeader, CardTitle
} from '@/components/ui/card';
import {
  Button
} from '@/components/ui/button';
import {
  Input
} from '@/components/ui/input';
import {
  Label
} from '@/components/ui/label';
import {
  Textarea
} from '@/components/ui/textarea';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import {
  Badge
} from '@/components/ui/badge';
import {
  Trash2, Edit, Plus, Users, FileText, Settings
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { categoryService, type Category } from '@/services/CategoryService';
import { wilayaService, type Wilaya } from '@/services/WilayaService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}

interface Announcement {
  id: string;
  title: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  author: string;
  createdAt: string;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'announcements' | 'settings'>('users');

  const [users] = useState<User[]>([
    { id: '1', name: 'Ahmed Benali', email: 'ahmed@email.com', role: 'user', status: 'active' },
    { id: '2', name: 'Fatima Kadi', email: 'fatima@email.com', role: 'admin', status: 'active' },
  ]);
  const [announcements] = useState<Announcement[]>([
    { id: '1', title: 'Appartement à louer', category: 'Immobilier', status: 'pending', author: 'Ahmed', createdAt: '2024-01-15' },
    { id: '2', title: 'Voiture à vendre', category: 'Automobile', status: 'approved', author: 'Fatima', createdAt: '2024-01-14' },
  ]);

  // === Gestion des catégories ===
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({ name: '', icon: '', description: '' });
  const [editCategoryId, setEditCategoryId] = useState<number | null>(null);

  const fetchCategories = async () => {
    const { data } = await categoryService.getCategories();
    setCategories(data || []);
  };

  const handleCategorySave = async () => {
    if (!newCategory.name || !newCategory.icon) {
      toast({ title: 'Champs requis', description: 'Nom et icône requis', variant: 'destructive' });
      return;
    }

    const res = editCategoryId
      ? await categoryService.updateCategory(editCategoryId, newCategory)
      : await categoryService.createCategory(newCategory);

    if (res.error) {
      toast({ title: 'Erreur', description: 'Échec de l\'opération', variant: 'destructive' });
    } else {
      toast({ title: editCategoryId ? 'Modifiée' : 'Ajoutée', description: `Catégorie ${editCategoryId ? 'mise à jour' : 'créée'}` });
      setNewCategory({ name: '', icon: '', description: '' });
      setEditCategoryId(null);
      fetchCategories();
    }
  };

  const handleEditCategory = (cat: Category) => {
    setEditCategoryId(cat.id);
    setNewCategory(cat);
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Supprimer cette catégorie ?')) return;
    const res = await categoryService.deleteCategory(id);
    if (res.error) {
      toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
    } else {
      toast({ title: 'Supprimée', description: 'Catégorie supprimée' });
      fetchCategories();
    }
  };

  // === Gestion des wilayas ===
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [newWilaya, setNewWilaya] = useState<Partial<Wilaya>>({ name: '', code: '' });
  const [editWilayaId, setEditWilayaId] = useState<number | null>(null);

  const fetchWilayas = async () => {
    const { data } = await wilayaService.getWilayas();
    setWilayas(data || []);
  };

  const handleWilayaSave = async () => {
    if (!newWilaya.name || !newWilaya.code) {
      toast({ title: 'Champs requis', description: 'Nom et code requis', variant: 'destructive' });
      return;
    }

    const res = editWilayaId
      ? await wilayaService.updateWilaya(editWilayaId, newWilaya)
      : await wilayaService.createWilaya(newWilaya);

    if (res.error) {
      toast({ title: 'Erreur', description: 'Échec de l\'opération', variant: 'destructive' });
    } else {
      toast({ title: editWilayaId ? 'Modifiée' : 'Ajoutée', description: `Wilaya ${editWilayaId ? 'mise à jour' : 'créée'}` });
      setNewWilaya({ name: '', code: '' });
      setEditWilayaId(null);
      fetchWilayas();
    }
  };

  const handleEditWilaya = (w: Wilaya) => {
    setEditWilayaId(w.id);
    setNewWilaya(w);
  };

  const handleDeleteWilaya = async (id: number) => {
    if (!confirm('Supprimer cette wilaya ?')) return;
    const res = await wilayaService.deleteWilaya(id);
    if (res.error) {
      toast({ title: 'Erreur', description: 'Échec de la suppression', variant: 'destructive' });
    } else {
      toast({ title: 'Supprimée', description: 'Wilaya supprimée' });
      fetchWilayas();
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchWilayas();
  }, []);

  const handleApprove = (id: string) => {
    toast({ title: 'Annonce approuvée', description: 'L\'annonce a été approuvée avec succès.' });
  };

  const handleReject = (id: string) => {
    toast({ title: 'Annonce rejetée', description: 'L\'annonce a été rejetée.' });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Panel d'Administration</h1>

      <div className="flex space-x-4 border-b">
        <Button variant={activeTab === 'users' ? 'default' : 'ghost'} onClick={() => setActiveTab('users')} className="flex items-center gap-2">
          <Users className="h-4 w-4" /> Utilisateurs
        </Button>
        <Button variant={activeTab === 'announcements' ? 'default' : 'ghost'} onClick={() => setActiveTab('announcements')} className="flex items-center gap-2">
          <FileText className="h-4 w-4" /> Annonces
        </Button>
        <Button variant={activeTab === 'settings' ? 'default' : 'ghost'} onClick={() => setActiveTab('settings')} className="flex items-center gap-2">
          <Settings className="h-4 w-4" /> Paramètres
        </Button>
      </div>

      {activeTab === 'users' && (
        <Card>
          <CardHeader><CardTitle>Gestion des Utilisateurs</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell><Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge></TableCell>
                    <TableCell><Badge variant={user.status === 'active' ? 'default' : 'destructive'}>{user.status}</Badge></TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'announcements' && (
        <Card>
          <CardHeader><CardTitle>Modération des Annonces</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Auteur</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {announcements.map((a) => (
                  <TableRow key={a.id}>
                    <TableCell>{a.title}</TableCell>
                    <TableCell>{a.category}</TableCell>
                    <TableCell>{a.author}</TableCell>
                    <TableCell><Badge variant={
                      a.status === 'approved' ? 'default'
                      : a.status === 'rejected' ? 'destructive'
                      : 'secondary'
                    }>{a.status}</Badge></TableCell>
                    <TableCell>{a.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {a.status === 'pending' && (
                          <>
                            <Button size="sm" onClick={() => handleApprove(a.id)}>Approuver</Button>
                            <Button size="sm" variant="destructive" onClick={() => handleReject(a.id)}>Rejeter</Button>
                          </>
                        )}
                        <Button size="sm" variant="outline"><Edit className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Paramètres généraux */}
          <Card>
            <CardHeader><CardTitle>Paramètres du Site</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label>Nom du Site</Label><Input defaultValue="DzAnnounce" /></div>
              <div><Label>Description</Label><Textarea defaultValue="Plateforme d'annonces en Algérie" /></div>
              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>

          {/* Gestion des Catégories */}
          <Card>
            <CardHeader><CardTitle>Catégories</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Nom" value={newCategory.name || ''} onChange={e => setNewCategory(prev => ({ ...prev, name: e.target.value }))} />
                <Input placeholder="Icône (ex: Car)" value={newCategory.icon || ''} onChange={e => setNewCategory(prev => ({ ...prev, icon: e.target.value }))} />
                <Button onClick={handleCategorySave}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <div key={cat.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <strong>{cat.name}</strong> <span className="text-gray-500">({cat.icon})</span>
                      <div className="text-sm text-gray-600">{cat.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditCategory(cat)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteCategory(cat.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gestion des Wilayas */}
          <Card>
            <CardHeader><CardTitle>Wilayas</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Nom" value={newWilaya.name || ''} onChange={e => setNewWilaya(prev => ({ ...prev, name: e.target.value }))} />
                <Input placeholder="Code (ex: 16)" value={newWilaya.code || ''} onChange={e => setNewWilaya(prev => ({ ...prev, code: e.target.value }))} />
                <Button onClick={handleWilayaSave}><Plus className="h-4 w-4" /></Button>
              </div>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {wilayas.map((wilaya) => (
                  <div key={wilaya.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <strong>{wilaya.name}</strong> <span className="text-gray-500">(Code: {wilaya.code})</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEditWilaya(wilaya)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteWilaya(wilaya.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;