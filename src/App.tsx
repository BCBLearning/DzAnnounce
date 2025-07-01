import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { userService } from '@/services/UserService';
import AdminSetup from '@/components/AdminSetup';
import Header from '@/components/Header';
import Index from '@/pages/Index';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';
import CreateAnnouncement from '@/pages/CreateAnnouncement';
import NotFound from '@/pages/NotFound';

function App() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSetupRequired();
  }, []);

  const checkSetupRequired = async () => {
    try {
      const adminExists = await userService.checkAdminExists();
      setNeedsSetup(!adminExists);
    } catch (err) {
      console.log('Setup requis: erreur de vérification admin');
      setNeedsSetup(true);
    } finally {
      setLoading(false);
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

  if (needsSetup) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminSetup />
        <Toaster />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/create-announcement" element={<CreateAnnouncement />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;