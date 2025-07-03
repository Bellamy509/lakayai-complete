# 🚀 Déploiement du Serveur MCP Thinking Assistant sur Railway

Ce guide vous explique comment déployer le serveur MCP Thinking Assistant sur Railway.

## 📋 Prérequis

- Compte Railway : [railway.app](https://railway.app)
- Compte GitHub (pour le déploiement automatique)
- Node.js 18+ (pour le développement local)

## 🔧 Configuration

### 1. Préparation du Repository

```bash
# Cloner ou pousser votre code vers GitHub
git add .
git commit -m "Prepare MCP server for Railway deployment"
git push origin main
```

### 2. Déploiement sur Railway

#### Option A: Déploiement via GitHub (Recommandé)

1. Connectez-vous à [Railway](https://railway.app)
2. Cliquez sur "New Project"
3. Sélectionnez "Deploy from GitHub repo"
4. Choisissez votre repository
5. Sélectionnez le dossier `custom-mcp-server/`
6. Railway détectera automatiquement le Dockerfile

#### Option B: Déploiement via CLI

```bash
# Installer Railway CLI
npm install -g @railway/cli

# Se connecter
railway login

# Déployer depuis le dossier custom-mcp-server
cd custom-mcp-server
railway up
```

### 3. Variables d'environnement

Railway configurera automatiquement la variable `PORT`. Aucune configuration supplémentaire n'est nécessaire.

## 🌐 Utilisation de l'API

Une fois déployé, votre serveur sera accessible via l'URL fournie par Railway.

### Endpoints disponibles

- `GET /` - Page d'accueil avec documentation
- `GET /tools` - Liste des outils MCP disponibles
- `POST /tools/{tool_name}` - Exécuter un outil spécifique

### Exemples d'utilisation

```bash
# Lister les outils disponibles
curl https://votre-app.railway.app/tools

# Analyser un problème
curl -X POST https://votre-app.railway.app/tools/analyze_problem \
  -H "Content-Type: application/json" \
  -d '{
    "problem": "Comment optimiser les performances de mon application web?",
    "context": "Application React avec 10000+ utilisateurs actifs"
  }'

# Décomposition étape par étape
curl -X POST https://votre-app.railway.app/tools/step_by_step_thinking \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Migrer une base de données MySQL vers PostgreSQL",
    "goal": "Migration sans interruption de service"
  }'

# Analyse avantages/inconvénients
curl -X POST https://votre-app.railway.app/tools/pros_and_cons \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "Adopter TypeScript pour notre projet JavaScript",
    "criteria": ["Performance", "Maintenabilité", "Courbe d'apprentissage"]
  }'

# Brainstorming créatif
curl -X POST https://votre-app.railway.app/tools/creative_brainstorm \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Améliorer l'engagement utilisateur sur notre plateforme",
    "quantity": 8
  }'
```

## 🛠️ Développement local

```bash
# Installation des dépendances
npm install

# Développement avec rechargement automatique
npm run dev

# Build de production
npm run build

# Démarrage du serveur de production
npm start
```

## 📊 Monitoring

Railway fournit automatiquement :
- Métriques de performance
- Logs en temps réel
- Monitoring de santé (healthcheck sur `/`)
- Redémarrage automatique en cas d'erreur

## 🔄 Mises à jour

Pour mettre à jour le serveur :

1. Modifiez votre code localement
2. Commitez et poussez vers GitHub
3. Railway redéploiera automatiquement

```bash
git add .
git commit -m "Update MCP server functionality"
git push origin main
```

## 🐛 Dépannage

### Problèmes courants

1. **Erreur de build** : Vérifiez les logs de build sur Railway
2. **Port non configuré** : Railway configure automatiquement `process.env.PORT`
3. **Timeout de santé** : Le serveur doit répondre sur `/` dans les 300 secondes

### Logs

```bash
# Via CLI Railway
railway logs

# Ou consultez les logs directement sur le dashboard Railway
```

## 📚 Ressources

- [Documentation Railway](https://docs.railway.app/)
- [Documentation MCP](https://modelcontextprotocol.io/)
- [Thinking Assistant MCP Tools](./thinking-server.ts)

## 🤝 Support

Si vous rencontrez des problèmes, vérifiez :
1. Les logs Railway
2. La configuration des variables d'environnement
3. Le statut du service sur le dashboard Railway 