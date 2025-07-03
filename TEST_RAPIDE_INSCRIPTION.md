# 🧪 Test Rapide - Vérification Inscription

## 🎯 Objectif
Vérifier que l'inscription fonctionne après les corrections apportées.

---

## 🚀 Étapes de Test

### 1️⃣ **Ouvrir l'Application**
- URL : http://localhost:3001 (ou le port affiché dans votre terminal)
- L'application devrait se charger normalement

### 2️⃣ **Accéder à l'Inscription**
- Cliquez sur "Sign Up" ou allez à http://localhost:3001/sign-up
- Vous devriez voir le formulaire d'inscription

### 3️⃣ **Ouvrir la Console de Débogage**
- Appuyez sur `F12` pour ouvrir les DevTools
- Allez dans l'onglet `Console`
- Gardez cette fenêtre ouverte pour voir les logs

### 4️⃣ **Tester l'Inscription**
Utilisez ces données de test :
```
Nom : Test User
Email : test@example.com
Mot de passe : test123456
```

### 5️⃣ **Observer les Logs**
Après avoir cliqué sur "Créer un compte", vous devriez voir dans la console :

#### 🎯 **Logs Attendus (Supabase fonctionne)** :
```
Utilisateur Supabase créé: [user-id] test@example.com
Profil trouvé via trigger: {...}
ou
Profil créé manuellement: {...}
Inscription Supabase réussie: test@example.com
```

#### 🔄 **Logs Attendus (Fallback localStorage)** :
```
Erreur inscription Supabase: [erreur détails]
# Puis inscription réussie avec localStorage
```

---

## ✅ Résultats Attendus

### **Cas 1 : Supabase fonctionne**
- ✅ Redirection vers la page d'accueil
- ✅ Utilisateur connecté (visible dans la sidebar)
- ✅ Message "Inscription Supabase réussie" dans les logs

### **Cas 2 : Fallback localStorage**
- ✅ Redirection vers la page d'accueil
- ✅ Utilisateur connecté (visible dans la sidebar)
- ✅ Message d'erreur Supabase puis inscription locale réussie

### **Dans tous les cas :**
- ✅ L'utilisateur est connecté
- ✅ L'application fonctionne normalement
- ✅ Pas d'erreur "Erreur création profil: {}"

---

## 🔧 Si le Test Échoue

### **Erreur : "Erreur création profil: {}"**
1. Exécutez le script SQL `GUIDE_SETUP_SUPABASE_TABLES.sql` dans votre dashboard Supabase
2. Redémarrez l'application avec `pnpm dev`
3. Recommencez le test

### **Erreur : "ReferenceError: getMockUser is not defined"**
1. L'application utilise maintenant le nouveau système d'authentification
2. Cette erreur ne devrait plus apparaître
3. Si elle persiste, redémarrez avec `pnpm dev`

### **Autre erreur**
Consultez le fichier `DIAGNOSTIC_ERREUR_INSCRIPTION.md` pour un diagnostic complet.

---

## 🎯 Test Secondaire (Compte Démo)

Si vous préférez tester avec le compte de démonstration :

```
Email : demo@sara.ai
Mot de passe : demo123
```

Allez à http://localhost:3001/sign-in et utilisez ces identifiants.

---

## 📞 Support

En cas de problème :
1. Vérifiez les logs dans la console (F12)
2. Consultez `DIAGNOSTIC_ERREUR_INSCRIPTION.md`
3. Le système de fallback garantit que l'application fonctionne toujours

**🎉 L'inscription devrait maintenant fonctionner parfaitement !** 