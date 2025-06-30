# Guide de Débogage - Problème d'Inscription DzAnnounce

## Problème Identifié
"La requête touche aux user mais supabase n'autorise pas ca"

## Solutions Appliquées

### 1. Modification du Service d'Authentification
- ✅ Gestion des erreurs de profil utilisateur
- ✅ Création manuelle du profil si le trigger échoue
- ✅ Fallback sur l'utilisateur auth si pas de profil

### 2. Configuration RLS Recommandée (À faire dans Supabase Dashboard)

#### Étape 1: Activer RLS sur la table users
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
```

#### Étape 2: Créer les politiques RLS
```sql
-- Lecture du profil utilisateur
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Mise à jour du profil utilisateur
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Insertion pour nouveaux utilisateurs
CREATE POLICY "Allow user registration" ON users
  FOR INSERT WITH CHECK (true);
```

#### Étape 3: Créer le trigger pour auto-création de profil
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, credits)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    'user',
    10
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

### 3. Test de l'Inscription

1. **Ouvrir l'application**
2. **Aller sur la page de connexion**
3. **Cliquer sur "S'inscrire"**
4. **Remplir le formulaire:**
   - Email: test@example.com
   - Mot de passe: minimum 6 caractères
   - Nom complet: Votre nom
5. **Vérifier l'email de confirmation**

### 4. Débogage Avancé

#### Vérifier les logs Supabase:
1. Aller dans Supabase Dashboard
2. Logs > Auth
3. Chercher les erreurs d'inscription

#### Vérifier la table users:
```sql
SELECT * FROM users;
```

#### Vérifier les utilisateurs auth:
```sql
SELECT * FROM auth.users;
```

### 5. Solutions Alternatives

#### Option A: Désactiver RLS temporairement
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
```

#### Option B: Politique RLS permissive
```sql
CREATE POLICY "Allow all operations" ON users
  FOR ALL USING (true) WITH CHECK (true);
```

### 6. Vérification Finale

- [ ] L'inscription fonctionne
- [ ] L'utilisateur reçoit l'email de confirmation
- [ ] Le profil utilisateur est créé
- [ ] La connexion fonctionne après confirmation
- [ ] Les données utilisateur s'affichent correctement

## Contact Support
Si le problème persiste, vérifier:
1. Configuration Supabase (URL/Key)
2. Politiques RLS
3. Triggers de base de données
4. Logs d'erreur dans la console