# Guide de Déploiement Cloud pour MCP Chatbot

Ce guide explique comment déployer le MCP Chatbot avec tous ses serveurs MCP (PowerPoint, Airbnb, etc.) sur différentes plateformes cloud.

## ✅ Plateformes supportées

### 🥇 AWS (Recommandé)
- ✅ Support complet STDIO MCP
- ✅ Python 3.12 + UV
- ✅ PostgreSQL (RDS)
- ✅ Scaling automatique

### 🥈 Google Cloud Platform
- ✅ Cloud Run + Cloud SQL
- ✅ Kubernetes Engine

### 🥉 Autres plateformes
- ✅ DigitalOcean App Platform
- ✅ Railway
- ✅ Render

## 🚀 Déploiement AWS (ECS Fargate)

### 1. Prérequis
```bash
# Installer AWS CLI
aws configure
# Ou utiliser CloudShell dans AWS Console
```

### 2. Build et Push de l'image
```bash
# Créer un repository ECR
aws ecr create-repository --repository-name mcp-chatbot

# Login Docker
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com

# Build et push
docker build -f docker/Dockerfile -t mcp-chatbot .
docker tag mcp-chatbot:latest YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/mcp-chatbot:latest
docker push YOUR_ACCOUNT.dkr.ecr.us-east-1.amazonaws.com/mcp-chatbot:latest
```

### 3. Déploiement ECS
```bash
# Utiliser le fichier aws-deploy.yml
docker-compose -f docker/aws-deploy.yml up
```

## 🌐 Déploiement Google Cloud (Cloud Run)

### 1. Build et deploy
```bash
# Enable APIs
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com

# Deploy
gcloud run deploy mcp-chatbot \
  --source . \
  --dockerfile docker/Dockerfile \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 1
```

## 🚢 Déploiement Railway (Le plus simple)

### 1. Installation
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login et deploy
railway login
railway up
```

### 2. Configuration automatique
Railway détectera automatiquement :
- ✅ Dockerfile
- ✅ PostgreSQL (auto-provisioned)
- ✅ Variables d'environnement

## 🐙 Déploiement DigitalOcean

### 1. App Platform
```yaml
# .do/app.yaml
name: mcp-chatbot
services:
  - name: web
    dockerfile_path: docker/Dockerfile
    source_dir: /
    github:
      repo: votre-repo
      branch: main
    ports:
      - http_port: 3000
    environment_slug: node-js
    instance_count: 1
    instance_size_slug: basic-xxs
databases:
  - name: postgres
    engine: PG
    version: "15"
```

## ⚙️ Variables d'environnement requises

```env
# Database (automatique sur les plateformes gérées)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Auth (optionnel)
GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret
GOOGLE_CLIENT_ID=your_google_id  
GOOGLE_CLIENT_SECRET=your_google_secret

# Sécurité
NEXTAUTH_SECRET=your_random_secret
NEXTAUTH_URL=https://your-domain.com

# MCP (déjà configuré dans l'image)
NO_HTTPS=1
```

## 🔍 Vérification du déploiement

### 1. Santé de l'application
```bash
curl https://your-app-url/api/health
```

### 2. Test des serveurs MCP
```bash
# PowerPoint Creator devrait être disponible
curl https://your-app-url/api/mcp/tools
```

## 🛠️ Dépannage

### Erreurs communes :

#### 1. **Serveur MCP non trouvé**
```bash
# Vérifier que UV est installé
docker exec -it container-id uv --version

# Vérifier les permissions
docker exec -it container-id ls -la /bin/uv
```

#### 2. **Base de données non connectée**
```bash
# Vérifier DATABASE_URL
echo $DATABASE_URL

# Tester la connexion
psql $DATABASE_URL -c "SELECT 1;"
```

#### 3. **Python/UV non disponible**
```bash
# Rebuild avec verbose
docker build -f docker/Dockerfile -t mcp-chatbot . --progress=plain
```

## 📈 Optimisations production

### 1. Cache et CDN
- Utiliser CloudFront (AWS) ou CloudFlare
- Cache des assets statiques

### 2. Monitoring
```bash
# AWS CloudWatch
# Google Cloud Monitoring  
# Railway Analytics (automatique)
```

### 3. Scaling
```yaml
# Auto-scaling configuration
min_instances: 1
max_instances: 10
cpu_threshold: 70%
memory_threshold: 80%
```

## 🔐 Sécurité

### 1. Secrets Management
- AWS Secrets Manager
- Google Secret Manager
- Railway Variables (automatique)

### 2. Network Security
- VPC privé (AWS/GCP)
- Firewall rules
- HTTPS obligatoire

## 💰 Coûts estimés

### AWS ECS Fargate
- **Petit usage** : ~$20-50/mois
- **Usage moyen** : ~$100-200/mois

### Google Cloud Run
- **Petit usage** : ~$15-40/mois  
- **Usage moyen** : ~$80-150/mois

### Railway
- **Hobby** : $5/mois (limité)
- **Pro** : $20/mois (illimité)

### DigitalOcean
- **Basic** : $12/mois
- **Professional** : $24/mois

## 🎯 Recommandation

**Pour débuter** : Railway (le plus simple)
**Pour production** : AWS ECS (le plus robuste)
**Pour budget serré** : DigitalOcean 