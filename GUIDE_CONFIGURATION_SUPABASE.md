# 🔐 Guide de Configuration Supabase - Authentification et Sauvegarde des Chats

## 🎯 **Objectif**
Activer l'authentification des utilisateurs avec Supabase et permettre la sauvegarde automatique des conversations de chat.

## ⚙️ **Configuration Supabase**

### 1. **Récupération du mot de passe de base de données**

1. Allez sur votre tableau de bord Supabase : https://fsgossoeshkajzhblufs.supabase.co
2. Cliquez sur **Settings** (⚙️) dans le menu de gauche
3. Allez dans l'onglet **Database**
4. Dans la section **Connection info**, copiez le mot de passe

### 2. **Configuration du fichier .env**

Modifiez la ligne suivante dans votre fichier `.env` :
```bash
# Remplacez [YOUR_SUPABASE_PASSWORD] par votre vrai mot de passe
POSTGRES_URL=postgresql://postgres:VOTRE_MOT_DE_PASSE_ICI@db.fsgossoeshkajzhblufs.supabase.co:5432/postgres
```

### 3. **Configuration OpenAI (obligatoire)**
```bash
# Ajoutez votre clé API OpenAI
OPENAI_API_KEY=sk-votre-cle-openai-ici
```

## 🗄️ **Création des Tables**

Une fois le `.env` configuré, exécutez les migrations :

```bash
pnpm run db:migrate
```

Cela créera automatiquement les tables suivantes dans Supabase :

- ✅ **user** - Comptes utilisateurs (email, mot de passe, préférences)
- ✅ **session** - Sessions d'authentification 
- ✅ **account** - Comptes OAuth (GitHub, Google)
- ✅ **chat_thread** - Conversations/threads de chat **→ SAUVEGARDE AUTOMATIQUE**
- ✅ **chat_message** - Messages de chat **→ SAUVEGARDE AUTOMATIQUE**
- ✅ **project** - Projets des utilisateurs
- ✅ **mcp_server** - Configuration des serveurs MCP
- ✅ **mcp_tool_customization** - Personnalisations des outils MCP

## 🔓 **Fonctionnalités Activées**

### **Authentification Complète**
- ✅ Inscription/Connexion par email/mot de passe
- ✅ OAuth GitHub (optionnel - configurez GITHUB_CLIENT_ID/SECRET)
- ✅ OAuth Google (optionnel - configurez GOOGLE_CLIENT_ID/SECRET)
- ✅ Sessions sécurisées avec cookies
- ✅ Protection des pages (redirection vers /sign-in)

### **Sauvegarde des Chats** 
- ✅ **Tous les chats sont automatiquement sauvegardés par utilisateur**
- ✅ Historique complet des conversations
- ✅ Messages avec métadonnées (modèle IA, timestamps, etc.)
- ✅ Projets personnalisés avec instructions système
- ✅ Préférences utilisateur sauvegardées

### **Protection des Données**
- ✅ Chaque utilisateur ne voit que ses propres chats
- ✅ Isolation complète des données utilisateur
- ✅ Sessions sécurisées avec expiration
- ✅ Base de données PostgreSQL sécurisée (Supabase)

## 🚀 **Lancement du Serveur**

```bash
pnpm dev
```

Le serveur démarrera sur http://localhost:3001 (ou 3002) avec :
- ✅ Authentification activée
- ✅ Pages de connexion/inscription fonctionnelles  
- ✅ Sauvegarde automatique des chats
- ✅ Tous les serveurs MCP configurés

## 📱 **Interface Utilisateur**

### **Pages d'Authentification**
- `/sign-in` - Page de connexion (email/password + OAuth)
- `/sign-up` - Page d'inscription (processus en 3 étapes)

### **Pages Protégées** 
- `/` - Chat principal (nécessite une connexion)
- `/chat/[thread]` - Conversation spécifique
- `/project/[id]` - Projets personnalisés
- `/mcp/*` - Configuration des serveurs MCP

## 🔧 **Variables d'Environnement Complètes**

```bash
# Supabase Configuration (OBLIGATOIRE)
NEXT_PUBLIC_SUPABASE_URL=https://fsgossoeshkajzhblufs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzZ29zc29lc2hrYWp6aGJsdWZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjQ4NDEsImV4cCI6MjA2Mzk0MDg0MX0.lener_f3RySOuUFUtgnbjTkbDlikjB-scIoK_hTI_N4

# Database PostgreSQL (OBLIGATOIRE - Remplacez le mot de passe)
POSTGRES_URL=postgresql://postgres:[YOUR_SUPABASE_PASSWORD]@db.fsgossoeshkajzhblufs.supabase.co:5432/postgres

# Better Auth (OBLIGATOIRE)
BETTER_AUTH_SECRET=sara-lakay-ai-super-secret-key-production-change-me-32-chars-minimum
BETTER_AUTH_URL=http://localhost:3001

# IA Chat (OBLIGATOIRE)
OPENAI_API_KEY=sk-votre-cle-openai-ici

# Configuration
DISABLE_SIGN_UP=false
NO_HTTPS=1
MCP_TIMEOUT=30000

# OAuth Optionnel
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id  
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## ✅ **Test de la Configuration**

1. **Vérifiez la connexion à la base** : `pnpm run db:migrate`
2. **Lancez le serveur** : `pnpm dev` 
3. **Testez l'inscription** : Allez sur http://localhost:3001/sign-up
4. **Créez un compte** : Email + nom + mot de passe
5. **Testez un chat** : Envoyez un message et vérifiez qu'il se sauvegarde
6. **Déconnexion/Reconnexion** : Vérifiez que l'historique est préservé

## 🔍 **Vérification dans Supabase**

Dans votre tableau de bord Supabase :
1. Allez dans **Table Editor**
2. Vérifiez que les tables sont créées
3. Dans la table **user**, vous devriez voir vos comptes
4. Dans **chat_thread** et **chat_message**, vos conversations

## 🎉 **Résultat Final**

- 🔐 **Authentification complète** avec Supabase
- 💾 **Chats sauvegardés automatiquement** par utilisateur
- 🚀 **Interface moderne** de connexion/inscription
- 🔒 **Données sécurisées** et isolées par utilisateur
- 🛠️ **Tous les serveurs MCP** fonctionnels
- 📱 **Experience utilisateur** fluide et professionnelle

L'application fonctionne maintenant comme un vrai service SaaS avec comptes utilisateurs ! 