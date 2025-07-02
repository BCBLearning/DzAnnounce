import React from 'react';
import { useUser } from '@/contexts/UserContext';

const ProfilePage: React.FC = () => {
  const { user, profile, isAdmin, loading } = useUser();

  if (loading) return <p className="text-center p-4">Chargement du profil...</p>;
  if (!user) return <p className="text-center p-4 text-red-600">Utilisateur non connecté</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-4">Profil utilisateur</h1>
      <p><strong>Nom complet :</strong> {profile?.full_name}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Rôle :</strong> {profile?.role}</p>
      <p><strong>Crédits :</strong> {profile?.credits}</p>
      {isAdmin && (
        <p className="text-green-600 mt-2 font-semibold">✅ Vous êtes administrateur</p>
      )}
    </div>
  );
};

export default ProfilePage;