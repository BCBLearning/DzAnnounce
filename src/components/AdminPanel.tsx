import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Users, FileText, Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

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

  const handleApprove = (id: string) => {
    toast({ title: 'Annonce approuvée', description: 'L\'annonce a été approuvée avec succès.' });
  };

  const handleReject = (id: string) => {
    toast({ title: 'Annonce rejetée', description: 'L\'annonce a été rejetée.' });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Panel d'Administration</h1>
      </div>

      <div className="flex space-x-4 border-b">
        <Button
          variant={activeTab === 'users' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('users')}
          className="flex items-center gap-2"
        >
          <Users className="h-4 w-4" />
          Utilisateurs
        </Button>
        <Button
          variant={activeTab === 'announcements' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('announcements')}
          className="flex items-center gap-2"
        >
          <FileText className="h-4 w-4" />
          Annonces
        </Button>
        <Button
          variant={activeTab === 'settings' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-2"
        >
          <Settings className="h-4 w-4" />
          Paramètres
        </Button>
      </div>

      {activeTab === 'users' && (
        <Card>
          <CardHeader>
            <CardTitle>Gestion des Utilisateurs</CardTitle>
          </CardHeader>
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
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
          <CardHeader>
            <CardTitle>Modération des Annonces</CardTitle>
          </CardHeader>
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
                {announcements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell>{announcement.title}</TableCell>
                    <TableCell>{announcement.category}</TableCell>
                    <TableCell>{announcement.author}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          announcement.status === 'approved'
                            ? 'default'
                            : announcement.status === 'rejected'
                            ? 'destructive'
                            : 'secondary'
                        }
                      >
                        {announcement.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{announcement.createdAt}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {announcement.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(announcement.id)}
                            >
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleReject(announcement.id)}
                            >
                              Rejeter
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4" />
                        </Button>
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
          <Card>
            <CardHeader>
              <CardTitle>Paramètres du Site</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Nom du Site</Label>
                <Input id="siteName" defaultValue="DzAnnounce" />
              </div>
              <div>
                <Label htmlFor="siteDescription">Description</Label>
                <Textarea id="siteDescription" defaultValue="Plateforme d'annonces en Algérie" />
              </div>
              <Button>Sauvegarder</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catégories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Nouvelle catégorie" />
                <Button>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {['Immobilier', 'Automobile', 'Électronique', 'Mode'].map((category) => (
                  <div key={category} className="flex items-center justify-between p-2 border rounded">
                    <span>{category}</span>
                    <Button size="sm" variant="destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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