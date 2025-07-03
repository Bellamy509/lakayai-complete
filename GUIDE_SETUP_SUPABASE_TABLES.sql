-- 🚀 Configuration Simple Supabase pour Sara LakayAI
-- ⚠️ À exécuter dans l'éditeur SQL de Supabase Dashboard

-- 1️⃣ Créer la table profiles (simple et efficace)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2️⃣ Politique RLS simple et permissive (pour le développement)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Permettre à tous les utilisateurs authentifiés de lire tous les profils
CREATE POLICY "Lecture publique profils" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Permettre aux utilisateurs de créer leur propre profil
CREATE POLICY "Insertion propre profil" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Permettre aux utilisateurs de modifier leur propre profil
CREATE POLICY "Modification propre profil" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 3️⃣ Fonction trigger pour créer automatiquement un profil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, avatar)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Utilisateur'),
    NEW.email,
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4️⃣ Créer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5️⃣ Test des données (optionnel)
-- INSERT INTO auth.users (id, email) VALUES ('test-user-id', 'test@example.com');

-- ✅ Configuration terminée !
-- Maintenant vous pouvez tester l'inscription sur votre application. 