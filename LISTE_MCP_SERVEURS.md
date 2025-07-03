# 📋 Liste des Serveurs MCP - Configurations Prêtes à Utiliser

## 🚀 **Serveurs MCP Populaires**

### 1. 🎭 **Playwright MCP** - Automatisation Web
```json
{
  "command": "npx",
  "args": ["@playwright/mcp@latest"]
}
```
**Nom suggéré :** `playwright`

---

### 2. 🌤️ **Serveur Météo** - Données Météorologiques  
```json
{
  "command": "node",
  "args": ["custom-mcp-server/index.ts"]
}
```
**Nom suggéré :** `meteo`

---

### 3. 🏠 **Airbnb MCP** - Données de Location
```json
{
  "command": "node",
  "args": ["node_modules/@openbnb/mcp-server-airbnb/dist/index.js"]
}
```
**Nom suggéré :** `airbnb`

---

### 4. 🌐 **API HTTP Générique** - Connexion aux APIs Externes
```json
{
  "url": "https://api.example.com",
  "headers": {
    "Authorization": "Bearer sk-xxx"
  }
}
```
**Nom suggéré :** `api-externe`

---

### 5. 📅 **Google Calendar** - Gestion de Calendrier
```json
{
  "url": "https://mcp-googlecalendar.example.com",
  "headers": {
    "Authorization": "Bearer YOUR_TOKEN"
  }
}
```
**Nom suggéré :** `google-calendar`

---

### 6. 🐙 **GitHub API** - Gestion de Repositories
```json
{
  "url": "https://api.github.com",
  "headers": {
    "Authorization": "Bearer github_pat_xxx"
  }
}
```
**Nom suggéré :** `github`

---

### 7. 💬 **Slack API** - Messages et Channels
```json
{
  "url": "https://slack.com/api",
  "headers": {
    "Authorization": "Bearer xoxb-xxx"
  }
}
```
**Nom suggéré :** `slack`

---

### 8. 🗄️ **Base de Données** - Requêtes SQL
```json
{
  "command": "node",
  "args": ["db-mcp-server.js"],
  "env": {
    "DB_HOST": "localhost",
    "DB_USER": "user",
    "DB_PASSWORD": "password"
  }
}
```
**Nom suggéré :** `database`

---

### 9. 📁 **Système de Fichiers** - Manipulation de Fichiers
```json
{
  "command": "python",
  "args": ["file-system-mcp.py"]
}
```
**Nom suggéré :** `filesystem`

---

### 10. 🧠 **Sequential Thinking** - Pensée Séquentielle (Officiel MCP)
```json
{
  "command": "npx",
  "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
}
```
**Nom suggéré :** `sequential-thinking`

---

### 11. 🔧 **Serveur Personnalisé** - Template de Base
```json
{
  "command": "node",
  "args": ["mon-serveur-mcp.js"],
  "env": {
    "API_KEY": "your-api-key",
    "DEBUG": "true"
  }
}
```
**Nom suggéré :** `custom`

---

## 🛠️ **Instructions d'Installation**

### **1. Copier la Configuration**
- Sélectionnez un serveur MCP de la liste
- Copiez la configuration JSON

### **2. Ajouter le Serveur**
- Allez dans l'interface MCP de l'application
- Cliquez sur "Ajouter Serveur"
- Collez la configuration JSON

### **3. Nommer le Serveur**
- Utilisez le nom suggéré ou créez le vôtre
- Évitez les espaces et caractères spéciaux

### **4. Sauvegarder**
- Cliquez sur "Sauvegarder Configuration"
- Le serveur sera disponible immédiatement

---

## 💡 **Conseils d'Utilisation**

### **🚀 Pour commencer :**
1. **Playwright MCP** - Le plus polyvalent
2. **Serveur Météo** - Simple et efficace
3. **API HTTP** - Pour services externes

### **🔑 Pour les tokens d'API :**
- Remplacez `YOUR_TOKEN` par votre vrai token
- Gardez vos clés API privées et sécurisées
- Utilisez des variables d'environnement quand possible

### **⚡ Pour les performances :**
- Les serveurs locaux (`command`) sont plus rapides
- Les serveurs HTTP (`url`) sont plus flexibles
- Testez vos serveurs individuellement avant usage

---

## 📚 **Ressources Complémentaires**

- 📖 [Guide détaillé des serveurs MCP](DESCRIPTION_SERVEURS_MCP.md)
- 🔧 [Configuration avancée](docs/tips-guides/mcp-server-setup-and-tool-testing.md)
- 🌐 [Marketplace MCP officiel](https://github.com/modelcontextprotocol)

**✨ Astuce :** Vous pouvez avoir plusieurs serveurs MCP actifs en même temps ! 