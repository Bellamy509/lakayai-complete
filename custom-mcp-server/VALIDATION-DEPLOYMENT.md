# ✅ Validation du déploiement Railway

## 🎯 Vérification que le serveur MCP fonctionne en ligne

Après le déploiement sur Railway, suivez ces étapes pour valider que tout fonctionne :

### 1. 🔍 **Vérification de base**

```bash
# Remplacez YOUR-APP-NAME par le nom de votre app Railway
export RAILWAY_URL="https://YOUR-APP-NAME.railway.app"

# Test de santé
curl $RAILWAY_URL/health
```

**Résultat attendu :**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-16T12:00:00.000Z"
}
```

### 2. 🛠️ **Vérification des outils**

```bash
# Liste des outils disponibles
curl $RAILWAY_URL/tools
```

**Résultat attendu :** Liste de 4 outils MCP

### 3. 🧪 **Tests fonctionnels**

#### Test 1: Analyse de problème
```bash
curl -X POST $RAILWAY_URL/tools/analyze_problem \
  -H "Content-Type: application/json" \
  -d '{
    "problem": "Mon application est lente",
    "context": "Application web avec base de données"
  }'
```

#### Test 2: Décomposition de tâche
```bash
curl -X POST $RAILWAY_URL/tools/step_by_step_thinking \
  -H "Content-Type: application/json" \
  -d '{
    "task": "Optimiser les performances",
    "goal": "Réduire le temps de chargement de 50%"
  }'
```

#### Test 3: Pros/Cons
```bash
curl -X POST $RAILWAY_URL/tools/pros_and_cons \
  -H "Content-Type: application/json" \
  -d '{
    "decision": "Migrer vers une architecture microservices",
    "criteria": ["Performance", "Coût", "Complexité"]
  }'
```

#### Test 4: Brainstorming
```bash
curl -X POST $RAILWAY_URL/tools/creative_brainstorm \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Améliorer la satisfaction client",
    "quantity": 5
  }'
```

### 4. 🖥️ **Test via navigateur**

1. **Page d'accueil :** `https://YOUR-APP-NAME.railway.app/`
2. **Documentation :** Interface web avec exemples
3. **API Tools :** `https://YOUR-APP-NAME.railway.app/tools`

### 5. 🤖 **Test automatisé**

Si vous avez Node.js local :

```bash
# Depuis le dossier custom-mcp-server/
export RAILWAY_URL="https://YOUR-APP-NAME.railway.app"
npm run test
```

### 6. 📊 **Monitoring Railway**

Dans le dashboard Railway, vérifiez :

- ✅ **Status:** Healthy (vert)
- ✅ **Logs:** Pas d'erreurs critiques
- ✅ **CPU/Memory:** Utilisation normale
- ✅ **Network:** Trafic entrant/sortant

### 7. 🚨 **Diagnostics en cas de problème**

#### Le serveur ne démarre pas
```bash
# Vérifier les logs Railway
railway logs --tail

# Ou dans le dashboard Railway → Deployments → View Logs
```

**Causes communes :**
- Port mal configuré (doit utiliser `process.env.PORT`)
- Erreur de compilation TypeScript
- Dépendances manquantes

#### Le serveur démarre mais les outils ne marchent pas
```bash
# Test de base
curl -i https://YOUR-APP-NAME.railway.app/health

# Vérifier la structure de réponse
curl -s https://YOUR-APP-NAME.railway.app/tools | jq .
```

#### Erreurs dans les logs
**Recherchez :**
- `🚀 Thinking Assistant MCP Server running on port XXX` ✅
- `Error:` ou `Failed:` ❌
- `EADDRINUSE` → Problème de port ❌

### 8. 🎯 **Checklist de validation complète**

- [ ] Page d'accueil accessible
- [ ] Endpoint `/health` retourne `{"status": "healthy"}`
- [ ] Endpoint `/tools` retourne 4 outils
- [ ] Test de `analyze_problem` fonctionne
- [ ] Test de `step_by_step_thinking` fonctionne
- [ ] Test de `pros_and_cons` fonctionne  
- [ ] Test de `creative_brainstorm` fonctionne
- [ ] Pas d'erreurs dans les logs Railway
- [ ] Réponse en moins de 5 secondes

### 9. 📈 **Performance attendue**

- **Temps de réponse :** < 2 secondes par requête
- **Disponibilité :** 99.9% (Railway SLA)
- **Concurrence :** Supporte plusieurs requêtes simultanées
- **Mémoire :** ~50-100MB en utilisation normale

### 10. 🔗 **URLs importantes**

Remplacez `YOUR-APP-NAME` par votre nom d'app Railway :

- **App :** `https://YOUR-APP-NAME.railway.app/`
- **Health :** `https://YOUR-APP-NAME.railway.app/health`
- **API :** `https://YOUR-APP-NAME.railway.app/tools`
- **Dashboard :** `https://railway.app/project/YOUR-PROJECT-ID`

---

## ✅ Si tous les tests passent

**Votre serveur MCP Thinking Assistant est maintenant :**
- 🌍 **En ligne** et accessible partout
- 🔧 **Fonctionnel** avec tous les outils
- 📊 **Monitoré** par Railway
- ⚡ **Performant** et scalable

**Vous pouvez maintenant :**
- Intégrer l'API dans vos applications
- Partager les URLs avec votre équipe
- Utiliser les outils via curl ou code
- Surveiller l'usage via Railway dashboard 