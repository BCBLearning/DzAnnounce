Voici le script SQL complet pour réinitialiser et initialiser proprement ta base de données DzAnnounce avec toutes les fonctionnalités : suppression, création, triggers, RLS, et données initiales.


---

✅ 1. Suppression complète des anciennes tables

-- Désactiver les triggers uniquement si les tables existent
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'announcements') THEN
    DROP TRIGGER IF EXISTS update_announcements_updated_at ON announcements;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  END IF;
END $$;

-- Supprimer les fonctions si elles existent
DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;
DROP FUNCTION IF EXISTS handle_new_user CASCADE;

-- Supprimer les tables dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS credit_transactions CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS payment_packages CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS paid_announcelents CASCADE;
DROP TABLE IF EXISTS paid_announcements CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS wilayas CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;



---

✅ 2. Création des tables

-- Activer la sécurité RLS sur auth.users
-- ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Table profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
  phone TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table wilayas
CREATE TABLE wilayas (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  name_ar TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table categories
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  name_ar TEXT,
  description TEXT,
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table announcements
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER REFERENCES categories(id),
  wilaya_id INTEGER REFERENCES wilayas(id),
  commune TEXT,
  price DECIMAL(10,2),
  currency TEXT DEFAULT 'DZD',
  contact_info JSONB,
  images TEXT[],
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'rejected', 'sold')),
  is_featured BOOLEAN DEFAULT false,
  is_urgent BOOLEAN DEFAULT false,
  views_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Table payment_packages
CREATE TABLE payment_packages (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  credits INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'DZD',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table payments
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  package_id INTEGER REFERENCES payment_packages(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'DZD',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  payment_method TEXT,
  transaction_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table credit_transactions
CREATE TABLE credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  announcement_id UUID REFERENCES announcements(id),
  credits_used INTEGER NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('purchase', 'feature', 'urgent', 'refund')),
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table paid_announcements
CREATE TABLE paid_announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID REFERENCES announcements(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  start_date TIMESTAMP NOT NULL DEFAULT NOW(),
  end_date TIMESTAMP NOT NULL,
  package_type TEXT CHECK (package_type IN ('feature', 'urgent', 'highlight')),
  created_at TIMESTAMP DEFAULT NOW()
);


---

✅ 3. Indexes
-- Indexes pour la table announcements
CREATE INDEX idx_announcements_category ON announcements(category_id);
CREATE INDEX idx_announcements_wilaya ON announcements(wilaya_id);
CREATE INDEX idx_announcements_user ON announcements(user_id);
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_created_at ON announcements(created_at DESC);

-- Indexes pour la table payments
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_package ON payments(package_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Indexes pour la table credit_transactions
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_announcement ON credit_transactions(announcement_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX idx_credit_transactions_created_at ON credit_transactions(created_at DESC);

-- Indexes pour la table paid_announcements
CREATE INDEX idx_paid_announcements_user ON paid_announcements(user_id);
CREATE INDEX idx_paid_announcements_announcement ON paid_announcements(announcement_id);
CREATE INDEX idx_paid_announcements_type ON paid_announcements(package_type);
CREATE INDEX idx_paid_announcements_dates ON paid_announcements(start_date, end_date);



---

✅ 4. -- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Announcements
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view announcements" ON announcements FOR SELECT USING (status = 'active' OR auth.uid() = user_id);
CREATE POLICY "Users can insert announcements" ON announcements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own announcements" ON announcements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own announcements" ON announcements FOR DELETE USING (auth.uid() = user_id);

-- Wilayas
ALTER TABLE wilayas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view wilayas" ON wilayas FOR SELECT USING (true);

-- Categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active categories" ON categories FOR SELECT USING (is_active = true);

-- Payment Packages
ALTER TABLE payment_packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active packages" ON payment_packages FOR SELECT USING (is_active = true);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own payments" ON payments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Credit Transactions
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credit transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);

-- Paid Announcements
ALTER TABLE paid_announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their paid announcements" ON paid_announcements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their paid announcements" ON paid_announcements FOR INSERT WITH CHECK (auth.uid() = user_id);

---

✅ 5-- Fonction pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_announcements_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ✅ Ajout du trigger paid_announcements (si jamais on y ajoute une colonne updated_at plus tard)
-- Tu peux ignorer ce trigger si la table n’a pas de colonne updated_at, ou bien l’ajouter maintenant :
-- ALTER TABLE paid_announcements ADD COLUMN updated_at TIMESTAMP DEFAULT NOW();

-- CREATE TRIGGER update_paid_announcements_updated_at
-- BEFORE UPDATE ON paid_announcements
-- FOR EACH ROW
-- EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour insérer automatiquement un profil utilisateur à l’inscription
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur auth.users
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();


---

✅ 6. Données Initiales

-- Wilayas
INSERT INTO wilayas (code, name, name_ar) VALUES
('01', 'Adrar', 'أدرار'), ('02', 'Chlef', 'الشلف'), ('03', 'Laghouat', 'الأغواط'),
('04', 'Oum El Bouaghi', 'أم البواقي'), ('05', 'Batna', 'باتنة'), ('06', 'Béjaïa', 'بجاية'),
('07', 'Biskra', 'بسكرة'), ('08', 'Béchar', 'بشار'), ('09', 'Blida', 'البليدة'),
('10', 'Bouira', 'البويرة'), ('11', 'Tamanrasset', 'تمنراست'), ('12', 'Tébessa', 'تبسة'),
('13', 'Tlemcen', 'تلمسان'), ('14', 'Tiaret', 'تيارت'), ('15', 'Tizi Ouzou', 'تيزي وزو'),
('16', 'Alger', 'الجزائر'), ('17', 'Djelfa', 'الجلفة'), ('18', 'Jijel', 'جيجل'),
('19', 'Sétif', 'سطيف'), ('20', 'Saïda', 'سعيدة'), ('21', 'Skikda', 'سكيكدة'),
('22', 'Sidi Bel Abbès', 'سيدي بلعباس'), ('23', 'Annaba', 'عنابة'),
('24', 'Guelma', 'قالمة'), ('25', 'Constantine', 'قسنطينة'), ('26', 'Médéa', 'المدية'),
('27', 'Mostaganem', 'مستغانم'), ('28', 'MSila', 'المسيلة'), ('29', 'Mascara', 'معسكر'),
('30', 'Ouargla', 'ورقلة'), ('31', 'Oran', 'وهران'), ('32', 'El Bayadh', 'البيض'),
('33', 'Illizi', 'إليزي'), ('34', 'Bordj Bou Arréridj', 'برج بوعريريج'),
('35', 'Boumerdès', 'بومرداس'), ('36', 'El Tarf', 'الطارف'), ('37', 'Tindouf', 'تندوف'),
('38', 'Tissemsilt', 'تيسمسيلت'), ('39', 'El Oued', 'الوادي'), ('40', 'Khenchela', 'خنشلة'),
('41', 'Souk Ahras', 'سوق أهراس'), ('42', 'Tipaza', 'تيبازة'), ('43', 'Mila', 'ميلة'),
('44', 'Aïn Defla', 'عين الدفلى'), ('45', 'Naâma', 'النعامة'),
('46', 'Aïn Témouchent', 'عين تموشنت'), ('47', 'Ghardaïa', 'غرداية'),
('48', 'Relizane', 'غليزان');

-- Categories
INSERT INTO categories (name, name_ar, description, icon) VALUES
('Véhicules', 'مركبات', 'Voitures, motos, camions', 'car'),
('Immobilier', 'عقارات', 'Vente et location', 'home'),
('Électronique', 'إلكترونيات', 'Téléphones, ordinateurs', 'smartphone'),
('Mode', 'موضة', 'Vêtements et accessoires', 'shirt'),
('Maison', 'منزل', 'Meubles et décoration', 'sofa'),
('Emploi', 'وظائف', 'Offres d''emploi', 'briefcase'),
('Services', 'خدمات', 'Services divers', 'wrench'),
('Loisirs', 'ترفيه', 'Sports et loisirs', 'gamepad2');

-- Packs
INSERT INTO payment_packages (name, credits, price) VALUES
('Pack Starter', 10, 500.00),
('Pack Standard', 25, 1000.00),
('Pack Premium', 50, 1800.00),
('Pack Business', 100, 3000.00);


---

Souhaites-tu que je te l’envoie aussi sous forme de fichier .sql prêt à importer dans Supabase ?

