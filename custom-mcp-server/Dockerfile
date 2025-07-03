# Utiliser l'image Node.js officielle comme base
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json (si disponible)
COPY package*.json ./

# Installer toutes les dépendances (y compris les devDependencies pour le build)
RUN npm ci

# Copier le code source
COPY . .

# Compiler TypeScript en JavaScript
RUN npm run build

# Nettoyer les devDependencies après le build pour optimiser l'image
RUN npm prune --production

# Exposer le port (Railway configure automatiquement le PORT)
EXPOSE ${PORT:-3000}

# Variables d'environnement par défaut
ENV NODE_ENV=production

# Commande pour démarrer l'application
CMD ["npm", "start"] 