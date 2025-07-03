# 🚀 Guide Simple : Configuration Sara LakayAI (Sans Base de Données)

## ✅ Situation Actuelle

- ✅ **Application fonctionne** sur http://localhost:3000
- ✅ **Authentification** configurée avec localStorage
- ✅ **Serveurs MCP** connectés et opérationnels
- ❌ **Clé API OpenAI** manquante (chat ne fonctionne pas)

---

## 🔑 **ÉTAPE CRITIQUE : Configurer OpenAI API**

### 1️⃣ **Obtenir votre Clé API OpenAI**

1. **Allez sur** : https://platform.openai.com/api-keys
2. **Connectez-vous** (ou créez un compte - gratuit avec 5$ de crédit)
3. **Cliquez** sur `"Create new secret key"`
4. **Donnez un nom** : `"Sara LakayAI"`
5. **Copiez la clé** (commence par `sk-proj-...`)

⚠️ **IMPORTANT** : Copiez immédiatement la clé, elle ne sera plus jamais affichée !

### 2️⃣ **Configurer la Clé dans l'Application**

1. **Ouvrez** le fichier `.env` (dans le dossier racine)
2. **Trouvez** cette ligne :
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
3. **Remplacez** `your_openai_api_key_here` par votre vraie clé :
   ```
   OPENAI_API_KEY=sk-proj-votre-vraie-cle-ici
   ```
4. **Sauvegardez** le fichier

### 3️⃣ **Redémarrer l'Application**

```bash
# Dans votre terminal, arrêtez avec Ctrl+C puis :
pnpm dev
```

---

## 🎯 **Test Rapide**

1. **Ouvrez** : http://localhost:3000
2. **Connectez-vous** avec le compte demo :
   - Email : `demo@sara.ai`  
   - Mot de passe : `demo123`
3. **Tapez un message** dans le chat
4. **Si ça marche** : ✅ Configuration réussie !

---

## 💰 **Coûts OpenAI**

- 🎁 **Nouveau compte** : 5$ gratuits
- 💬 **Chat normal** : ~0,001$ par 1000 mots (très économique)
- 📊 **Usage mensuel** : généralement moins de 1$ pour usage personnel

---

## 🛠️ **Fonctionnalités Disponibles**

### ✅ **Déjà Configuré**
- 🔐 **Authentification** : localStorage (pas de DB requise)
- 🤖 **Chat AI** : OpenAI GPT (après config clé)
- 🔧 **Serveurs MCP** : Airbnb, PowerPoint, Sheets, etc.
- 🎨 **Interface** : Moderne et responsive

### 🚀 **Serveurs MCP Actifs**
- **Airbnb** : Recherche de logements
- **PowerPoint-Creator** : Création de présentations  
- **AI-Sheets** : Manipulation de tableurs
- **Context7** : Documentation
- **Sequential-thinking** : Pensée structurée
- **Time** : Gestion du temps
- **Browser-automation** : Automatisation web
- **Playwright** : Tests et scraping
- **Web search** : Recherche web

---

## 🔧 **Dépannage**

### ❌ **"Incorrect API key provided"**
- Vérifiez que la clé commence par `sk-proj-`
- Pas d'espaces avant/après la clé
- Redémarrez l'application après modification

### ❌ **"Port already in use"**
- L'app se lance automatiquement sur un port libre (3001, 3002, etc.)
- Utilisez l'URL affichée dans le terminal

### ❌ **"Thread not found"**
- Rafraîchissez la page (F5)
- Supprimez le cache du navigateur si nécessaire

---

## 📞 **Support**

Si vous avez des problèmes :
1. **Vérifiez** que la clé API est correcte
2. **Consultez** les logs dans le terminal  
3. **Testez** avec un nouveau thread/conversation

---

## 🎉 **Prochaines Étapes (Optionnel)**

Une fois que le chat fonctionne, vous pourrez :
- Configurer Supabase pour une vraie base de données
- Ajouter d'autres modèles AI (Anthropic, Gemini)
- Personnaliser les serveurs MCP
- Déployer en production

Mais pour l'instant, **concentrez-vous sur la configuration de la clé OpenAI** ! 🚀 