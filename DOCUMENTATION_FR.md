# 📚 Documentation - MCP Client Chatbot

## 🌟 Vue d'ensemble

**MCP Client Chatbot** est une application de chat IA avancée construite avec Next.js et le SDK AI de Vercel. Elle se distingue par son intégration complète du **Model Context Protocol (MCP)**, permettant d'étendre les capacités de l'IA avec des outils externes de manière transparente.

L'objectif principal est de créer la meilleure expérience utilisateur possible pour les chatbots IA, en mettant l'accent sur l'intuitivité et la fluidité des interactions avec les outils IA.

### 🎯 Objectifs clés
- Interface utilisateur moderne et intuitive
- Intégration transparente d'outils externes via MCP
- Support multimodal (texte, voix, automation web)
- Architecture modulaire et extensible

## 🚀 Fonctionnalités principales

### 💬 Chat IA avancé
- **Multi-modèles** : Support d'OpenAI, Google Gemini, Anthropic Claude, XAI, OpenRouter, Ollama
- **Conversations persistantes** : Sauvegarde automatique des conversations
- **Projets et threads** : Organisation des conversations par projets
- **Chat temporaire** : Conversations non sauvegardées pour tests rapides

### 🎙️ Assistant vocal en temps réel
- **API Realtime d'OpenAI** : Conversation vocale naturelle
- **Intégration MCP** : Exécution d'outils via commandes vocales
- **Feedback visuel** : Visualisation en temps réel des actions

### 🧩 Automatisation web
- **Playwright MCP** : Contrôle de navigateur web automatisé
- **Tâches multi-étapes** : Exécution de séquences d'actions complexes
- **Retour détaillé** : Rapport complet des actions effectuées

## 🔧 Fonctionnalités MCP (Model Context Protocol)

### 📝 Qu'est-ce que MCP ?
Le Model Context Protocol est un standard ouvert qui permet aux applications IA d'intégrer des outils et services externes de manière sécurisée et standardisée.

### 🛠️ Gestion des serveurs MCP

#### **Ajout de serveurs**
- Interface graphique intuitive pour ajouter des serveurs MCP
- Support de deux types de transport :
  - **Stdio** : Exécution locale via ligne de commande
  - **SSE/HTTP** : Serveurs distants via HTTP

#### **Configuration Stdio**
```json
{
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```

#### **Configuration SSE/HTTP**
```json
{
  "url": "https://api.example.com",
  "headers": {
    "Authorization": "Bearer sk-..."
  }
}
```

### 🎯 Fonctionnalités des outils MCP

#### **Mentions rapides (@)**
- Tapez `@` suivi du nom d'un outil pour l'appeler directement
- Autocomplétion intelligente des outils disponibles
- Pas besoin de mémoriser les noms d'outils

#### **Modes de choix d'outils**
- **Auto** : L'IA choisit automatiquement les outils nécessaires
- **Manuel** : Demande confirmation avant d'utiliser un outil
- **Aucun** : Désactive complètement l'utilisation d'outils

#### **Presets d'outils**
- Création de groupes d'outils personnalisés
- Changement rapide entre différents ensembles d'outils
- Organisation par tâche ou workflow

#### **Test d'outils**
- Interface dédiée pour tester chaque outil individuellement
- Formulaires automatiquement générés à partir des schémas
- Debugging facilité sans passer par le chat

### 🎨 Personnalisation MCP

#### **Prompts personnalisés par serveur**
- Ajout d'instructions spécifiques à chaque serveur MCP
- Contexte additionnel pour améliorer les résultats
- Limite de 3000 caractères

#### **Prompts personnalisés par outil**
- Instructions spécifiques pour chaque outil individuel
- Personnalisation fine du comportement
- Limite de 1000 caractères

## 📋 Installation et configuration

### 🐳 Installation rapide (Docker Compose)

```bash
# 1. Installer les dépendances
pnpm i

# 2. Configurer les clés API dans le fichier .env
# Exemple : L'app fonctionne avec juste OPENAI_API_KEY

# 3. Lancer tous les services avec Docker Compose
pnpm docker-compose:up
```

### 🚀 Installation locale

```bash
# 1. Installer les dépendances
pnpm i

# 2. Créer le fichier d'environnement
pnpm initial:env

# 3. (Optionnel) Lancer PostgreSQL avec Docker
pnpm docker:pg

# 4. Exécuter les migrations de base de données
pnpm db:migrate

# 5. Lancer le serveur de développement
pnpm dev
```

### 🔑 Variables d'environnement

```env
# === Clés API des fournisseurs LLM ===
GOOGLE_GENERATIVE_AI_API_KEY=****
OPENAI_API_KEY=****
XAI_API_KEY=****
ANTHROPIC_API_KEY=****
OPENROUTER_API_KEY=****
OLLAMA_BASE_URL=http://localhost:11434/api

# Secret pour Better Auth
BETTER_AUTH_SECRET=****

# === Base de données ===
POSTGRES_URL=postgres://username:password@localhost:5432/database

# Configuration MCP basée sur fichier (défaut: false)
FILE_BASED_MCP_CONFIG=false

# === OAuth (optionnel) ===
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## 🎮 Guide d'utilisation

### 💭 Démarrer une conversation
1. Ouvrez l'application sur `http://localhost:3000`
2. Sélectionnez un modèle IA
3. Commencez à discuter !

### 🔧 Ajouter un serveur MCP
1. Allez dans la section "MCP Servers"
2. Cliquez sur "Add MCP Server"
3. Entrez le nom et la configuration JSON
4. Les outils sont disponibles immédiatement

### 🎯 Utiliser les outils MCP
- **Mention directe** : `@toolname param1 param2`
- **Conversation naturelle** : "Peux-tu utiliser Playwright pour aller sur GitHub ?"
- **Mode manuel** : Confirmez chaque utilisation d'outil

### 🎙️ Chat vocal
1. Cliquez sur l'icône microphone
2. Autorisez l'accès au microphone
3. Parlez naturellement
4. L'IA peut exécuter des outils via voix

### 📊 Projets et organisation
- **Créer un projet** : Groupez les conversations par thème
- **Instructions système** : Définissez le comportement de l'IA par projet
- **Threads multiples** : Plusieurs conversations dans un projet

## 🏗️ Architecture technique

### 🔧 Stack technologique
- **Frontend** : Next.js 15, React 19, TailwindCSS
- **Backend** : API Routes Next.js, Drizzle ORM
- **Base de données** : PostgreSQL
- **IA** : Vercel AI SDK avec support multi-fournisseurs
- **Authentification** : Better Auth
- **MCP** : Model Context Protocol SDK

### 📁 Structure du projet

```
src/
├── app/                    # Pages et API routes
│   ├── (auth)/            # Pages d'authentification
│   ├── (chat)/            # Interface de chat
│   └── api/               # API backend
├── components/            # Composants React
├── lib/                   # Logique métier
│   ├── ai/               # Intégration IA et MCP
│   ├── auth/             # Système d'authentification
│   └── db/               # Accès base de données
└── types/                # Définitions TypeScript
```

### 🔌 Architecture MCP

#### **MCPClientsManager**
- Gère les connexions aux serveurs MCP
- Cache les outils disponibles
- Déconnexion automatique après inactivité

#### **MCPConfigStorage**
- Interface pour le stockage des configurations
- Support base de données et fichiers
- Synchronisation en temps réel

#### **Types MCP principaux**
```typescript
// Configuration serveur MCP
export type MCPServerConfig = MCPRemoteConfig | MCPStdioConfig;

// Information sur un outil MCP
export type MCPToolInfo = {
  name: string;
  description: string;
  inputSchema?: object;
};

// Outil intégré à Vercel AI
export type VercelAIMcpTool = Tool & {
  _mcpServerName: string;
  _mcpServerId: string;
  _originToolName: string;
};
```

### 🗄️ Base de données

#### **Tables principales**
- `mcp_servers` : Configurations des serveurs MCP
- `mcp_tool_customizations` : Prompts personnalisés par outil
- `mcp_server_customizations` : Prompts personnalisés par serveur
- `threads` : Conversations sauvegardées
- `projects` : Projets groupant les conversations

## 🔍 Exemples d'utilisation

### 🌐 Automatisation web avec Playwright
```
Prompt : "Va sur GitHub et visite le projet cgoinglove/mcp-client-chatbot. 
Clique sur README.md, puis ferme le navigateur et dis-moi comment installer le package."
```

### 📊 Création de graphiques
```
Prompt : "Crée un graphique en barres montrant les ventes par mois : 
Janvier: 100, Février: 150, Mars: 200"
```

### 🎙️ Commande vocale
```
Vocal : "Peux-tu rechercher des informations sur la météo à Paris ?"
```

## 🛠️ Développement et contribution

### 🧪 Tests
```bash
# Tests unitaires
pnpm test

# Tests en mode watch
pnpm test:watch
```

### 🔍 Linting et formatage
```bash
# Linting
pnpm lint

# Formatage automatique
pnpm format
```

### 📦 Build
```bash
# Build de production
pnpm build

# Build local (sans HTTPS)
pnpm build:local
```

## 🌐 Déploiement

### ▲ Vercel
- Utilisation du bouton "Deploy with Vercel"
- Configuration automatique des variables d'environnement
- Intégration Neon pour PostgreSQL

### 🐳 Docker
```bash
# Build et run avec Docker
pnpm docker:app

# Ou avec Docker Compose
pnpm docker-compose:up
```

## 📈 Roadmap

- [ ] Support de nouvelles modalités (images, fichiers)
- [ ] Marketplace d'outils MCP intégré
- [ ] Interface mobile optimisée
- [ ] Collaboration en temps réel
- [ ] Analytics et métriques d'usage

## 🆘 Support et communauté

- **Documentation** : Guides dans le dossier `docs/`
- **Discord** : [Rejoindre la communauté](https://discord.gg/gCRu69Upnp)
- **GitHub** : Issues et contributions
- **Smithery.ai** : Marketplace d'outils MCP

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 