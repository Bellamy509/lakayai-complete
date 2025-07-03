# 🚀 Guide : Authentification LocalStorage (SANS PostgreSQL)

## ✨ **Vue d'ensemble**

Ce système d'authentification **ne nécessite AUCUNE base de données** ! Tout est stocké dans le navigateur de l'utilisateur via `localStorage`.

### 🎯 **Avantages**
- ✅ **Aucun serveur de base de données requis**
- ✅ **Gratuit à 100%** - Pas de frais PostgreSQL/Supabase
- ✅ **Démarrage instantané** - Prêt en 2 minutes
- ✅ **Sécurisé** - Données uniquement dans le navigateur de l'utilisateur
- ✅ **Simplicité** - Aucune configuration complexe

---

## 🚦 **Démarrage Rapide**

### 1. **Démarrer l'application**
```bash
pnpm dev
```

### 2. **Accéder à l'application**
- Ouvrir : http://localhost:3000 (ou le port affiché)
- Vous serez automatiquement redirigé vers `/sign-in`

### 3. **Première connexion**
**Option A : Compte de démonstration**
- Cliquer sur "🎯 Compte de démonstration"
- Email : `demo@sara.ai`
- Mot de passe : `demo123`

**Option B : Créer un nouveau compte**
- Cliquer sur "S'inscrire"
- Remplir le formulaire
- Connexion automatique après inscription

---

## 💾 **Comment ça marche ?**

### **Stockage dans le navigateur**
```javascript
// Données stockées dans localStorage :
{
  "sara_users": [              // Liste des utilisateurs
    {
      "id": "user_1234567890",
      "name": "Votre Nom",
      "email": "votre@email.com",
      "avatar": "https://api.dicebear.com/7.x/avataaars/svg?seed=...",
      "createdAt": "2024-01-01T10:00:00.000Z"
    }
  ],
  "sara_passwords": {          // Mots de passe (hashés en production)
    "user_1234567890": "votre_mot_de_passe"
  },
  "sara_user_session": {       // Session active
    "id": "user_1234567890",
    "email": "votre@email.com",
    "name": "Votre Nom",
    "avatar": "...",
    "loginTime": "2024-01-01T10:05:00.000Z"
  },
  "sara_auth_token": "token_user_1234567890_1704110700000"
}
```

### **Sécurité**
- ✅ Données uniquement dans **votre navigateur**
- ✅ Aucune transmission vers des serveurs externes
- ✅ Session automatiquement supprimée à la déconnexion
- ⚠️ **Note** : En production, les mots de passe seraient hashés avec bcrypt/argon2

---

## 📱 **Fonctionnalités disponibles**

### ✅ **Authentification complète**
- [x] Inscription avec email/mot de passe
- [x] Connexion
- [x] Déconnexion
- [x] Session persistante
- [x] Avatar automatique (Dicebear)
- [x] Validation des mots de passe
- [x] Vérification d'email unique

### ✅ **Gestion des utilisateurs**
- [x] Profil utilisateur dans la sidebar
- [x] Informations de session
- [x] Déconnexion sécurisée

### ✅ **Interface utilisateur**
- [x] Pages de connexion/inscription modernes
- [x] Messages d'erreur clairs
- [x] Compte de démonstration intégré
- [x] Design responsive

---

## 🔧 **Configuration avancée**

### **Personnaliser le compte de démonstration**
Modifier dans `src/lib/auth/local-auth.ts` :
```typescript
initializeDemoUser(): void {
  // Modifier ces valeurs :
  const demoUser = this.addUser({
    name: "Votre Nom Demo",      // ← Changer ici
    email: "demo@votre-app.com", // ← Changer ici
    avatar: "...",
  });
  
  // Modifier le mot de passe :
  const passwords = { [demoUser.id]: "nouveau_mot_de_passe" }; // ← Changer ici
}
```

### **Changer les avatars**
Les avatars utilisent [Dicebear](https://dicebear.com/). Pour changer le style :
```typescript
avatar: `https://api.dicebear.com/7.x/STYLE/svg?seed=${email}`,
```

**Styles disponibles :**
- `avataaars` (style cartoon, défaut)
- `pixel-art` (style pixel)
- `bottts` (robots)
- `identicon` (géométrique)

---

## 🚨 **Limitations importantes**

### ⚠️ **Données par navigateur**
- Les comptes sont **liés au navigateur** (Chrome, Firefox, etc.)
- Pas de synchronisation entre appareils
- Effacer les données du navigateur = perdre les comptes

### ⚠️ **Multi-utilisateurs**
- Un seul utilisateur connecté à la fois par navigateur
- Pour changer d'utilisateur : déconnexion puis reconnexion

### ⚠️ **Sécurité basique**
- Mots de passe en clair dans localStorage (OK pour démo/test)
- Pas de récupération de mot de passe
- Pas de validation d'email

---

## 🔄 **Migration vers une vraie base de données**

Si vous voulez passer à un système plus robuste plus tard :

### **Option 1 : Firebase Auth**
```bash
# Installation
pnpm add firebase
```

### **Option 2 : Supabase + PostgreSQL**
Voir le guide : `GUIDE_CONFIGURATION_SUPABASE.md`

### **Option 3 : Clerk**
```bash
# Installation
pnpm add @clerk/nextjs
```

---

## 📚 **Code principal**

### **Système d'authentification**
- `src/lib/auth/local-auth.ts` - Logique principale
- `src/app/(auth)/sign-in/page.tsx` - Page de connexion
- `src/app/(auth)/sign-up/page.tsx` - Page d'inscription

### **Composants UI**
- `src/components/layouts/app-sidebar-user.tsx` - Profil utilisateur

---

## 🎉 **C'est tout !**

Votre système d'authentification **SANS PostgreSQL** est opérationnel !

### **Support & Questions**
- 📧 Problèmes : Créer une issue GitHub
- 💬 Discussion : Rejoindre le Discord
- 📖 Docs : Lire les autres guides dans `/docs`

---

**✨ Profitez de Sara LakayAI sans complexité !** 