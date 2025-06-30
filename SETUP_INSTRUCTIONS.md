# DzAnnounce - Configuration Base de Données Supabase

## 🗄️ Requête SQL Complète pour Initialisation

Pour démarrer votre projet DzAnnounce à zéro, suivez ces étapes :

### 1. Créer un Projet Supabase
1. Allez sur [supabase.com](https://supabase.com/dashboard)
2. Créez un nouveau projet
3. Notez votre URL et clé API

### 2. Exécuter le Schéma de Base de Données

**Ouvrez l'éditeur SQL dans Supabase et exécutez le fichier `database_schema.sql`**

Ce fichier contient :
- ✅ Tables principales (users, announcements, categories, wilayas)
- ✅ Système de paiement complet (payment_packages, payments, credit_transactions)
- ✅ Politiques RLS (Row Level Security)
- ✅ Triggers automatiques
- ✅ Fonctions de gestion des crédits
- ✅ Données initiales (48 wilayas, 8 catégories, packs de paiement)

### 3. Structure des Tables Créées

#### Tables Principales :
- `wilayas` - 48 wilayas d'Algérie
- `categories` - 8 catégories d'annonces
- `users` - Profils utilisateurs avec système de crédits
- `announcements` - Annonces avec statuts et coûts

#### Système de Paiement :
- `payment_packages` - Packs de crédits (5, 15, 30, 100 crédits)
- `payments` - Transactions de paiement
- `credit_transactions` - Historique des crédits

### 4. Fonctionnalités Automatiques

#### Gestion des Utilisateurs :
- Création automatique du profil lors de l'inscription
- Mise à jour automatique des timestamps

#### Système de Crédits :
- Attribution automatique des crédits après paiement
- Déduction automatique lors de publication d'annonce
- Historique complet des transactions

#### Sécurité :
- RLS activé sur toutes les tables sensibles
- Politiques de sécurité pour chaque table
- Validation des données avec contraintes

### 5. Configuration Frontend

Après avoir exécuté le SQL, configurez votre application :

```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_cle_anon_supabase
```

### 6. Packs de Paiement Inclus

| Pack | Crédits | Prix (DZD) |
|------|---------|------------|
| Starter | 5 | 500 |
| Standard | 15 | 1,200 |
| Premium | 30 | 2,000 |
| Business | 100 | 5,000 |

### 7. Intégration Paiement

Le système est prêt pour :
- 💳 Stripe
- 💰 PayPal
- 🏦 CCP (Algérie Poste)
- 📱 Paiement mobile

### 8. Fonctionnalités Prêtes

✅ Authentification utilisateur
✅ Gestion des annonces
✅ Système de crédits
✅ Paiements sécurisés
✅ Interface admin
✅ Recherche et filtres
✅ Upload d'images
✅ Notifications

## 🚀 Démarrage Rapide

1. Exécutez `database_schema.sql` dans Supabase
2. Configurez vos variables d'environnement
3. Lancez `npm install && npm run dev`
4. Votre application est prête !

## 📞 Support

En cas de problème :
1. Vérifiez que toutes les tables sont créées
2. Confirmez que RLS est activé
3. Testez la connexion avec vos clés API

Votre base de données DzAnnounce est maintenant complètement configurée ! 🎉