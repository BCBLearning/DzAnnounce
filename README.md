# DzAnnounce - Plateforme d'Annonces Algérienne

Une plateforme moderne d'annonces classées pour l'Algérie, construite avec React, TypeScript, Tailwind CSS et Supabase.

## 🚀 Fonctionnalités

### Frontend
- ✅ Interface utilisateur moderne et responsive
- ✅ Recherche et filtrage d'annonces
- ✅ Catégories d'annonces (Immobilier, Automobile, etc.)
- ✅ Authentification utilisateur (connexion/inscription)
- ✅ Création et gestion d'annonces
- ✅ Panel d'administration
- ✅ Thème sombre/clair

### Backend (Supabase)
- ✅ Base de données PostgreSQL
- ✅ Authentification sécurisée
- ✅ API REST automatique
- ✅ Stockage de fichiers pour images
- ✅ Sécurité au niveau des lignes (RLS)

### Panel d'Administration
- ✅ Gestion des utilisateurs
- ✅ Modération des annonces
- ✅ Paramètres du site
- ✅ Statistiques et analytics

## 🛠️ Technologies Utilisées

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Shadcn/ui, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **État**: React Query, Context API
- **Routage**: React Router
- **Icons**: Lucide React

## 📦 Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd dzannounce
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration Supabase**
```bash
cp .env.example .env
```
Modifiez `.env` avec vos credentials Supabase.

4. **Créer les tables Supabase**
Exécutez les scripts SQL fournis dans `/database` pour créer les tables nécessaires.

5. **Lancer le serveur de développement**
```bash
npm run dev
```

## 🗄️ Structure de la Base de Données

### Table `announcements`
- Stockage des annonces avec modération
- Statuts: pending, approved, rejected
- Support multi-images

### Table `profiles`
- Profils utilisateurs étendus
- Rôles: user, admin
- Informations de contact

## 🔐 Authentification

- Inscription/Connexion par email
- Gestion des sessions sécurisée
- Rôles utilisateur (user/admin)
- Réinitialisation de mot de passe

## 👨‍💼 Administration

Accès au panel admin via `/admin` (réservé aux administrateurs):
- Modération des annonces en attente
- Gestion des utilisateurs
- Configuration du site
- Gestion des catégories

## 🚀 Déploiement

1. **Build de production**
```bash
npm run build
```

2. **Déploiement**
Le dossier `dist/` peut être déployé sur:
- Vercel
- Netlify
- Supabase Hosting
- Serveur traditionnel

## 📱 Responsive Design

L'application est entièrement responsive et optimisée pour:
- 📱 Mobile (320px+)
- 📱 Tablette (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1440px+)

## 🎨 Personnalisation

- Thèmes configurables via Tailwind
- Composants UI modulaires
- Configuration centralisée
- Support RTL (pour l'arabe)

## 🔧 Scripts Disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run lint         # Vérification du code
```

## 📄 Licence

Ce projet est sous licence MIT.

---

**DzAnnounce** - Votre plateforme d'annonces moderne pour l'Algérie 🇩🇿