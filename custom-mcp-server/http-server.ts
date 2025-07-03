#!/usr/bin/env node

import { createServer } from "http";
import { URL } from "url";

// Port pour Railway (utilise la variable d'environnement PORT ou 3000 par défaut)
const PORT = process.env.PORT || 3000;

// Fonctions utilitaires (copiées de thinking-server.ts)
function categorizeeProblem(problem: string): string {
  if (problem.toLowerCase().includes("performance"))
    return "Problème de performance";
  if (problem.toLowerCase().includes("bug")) return "Problème technique";
  if (
    problem.toLowerCase().includes("user") ||
    problem.toLowerCase().includes("utilisateur")
  )
    return "Problème utilisateur";
  return "Problème général";
}

function getPossibleCauses(_problem: string): string {
  return `
• Facteurs techniques
• Facteurs humains  
• Facteurs organisationnels
• Facteurs externes`;
}

function assessImpact(_problem: string): string {
  return "Impact moyen à évaluer selon le contexte";
}

function assessUrgency(_problem: string): string {
  return "Urgence à déterminer selon les priorités";
}

function generateSolutions(_problem: string): string {
  return `
1. **Solution immédiate:** Action rapide pour stabiliser
2. **Solution intermédiaire:** Amélioration progressive
3. **Solution long terme:** Refonte complète si nécessaire`;
}

function getNextSteps(_problem: string): string {
  return `
1. Définir les priorités
2. Rassembler les ressources nécessaires
3. Mettre en place un plan d'action
4. Suivre les progrès`;
}

function generateSteps(_task: string, _goal: string): string {
  return `
1. **Préparation:** Analyser les requirements
2. **Planification:** Définir la roadmap
3. **Exécution:** Implémenter étape par étape
4. **Validation:** Tester et valider
5. **Déploiement:** Mise en production`;
}

function generateCheckpoints(_task: string): string {
  return `
• Checkpoint 25% : Validation de l'approche
• Checkpoint 50% : Première version fonctionnelle
• Checkpoint 75% : Tests et ajustements
• Checkpoint 100% : Livraison finale`;
}

function identifyResources(_task: string): string {
  return `
• **Humaines:** Équipe, expertise, temps
• **Techniques:** Outils, infrastructure, technologies
• **Financières:** Budget, investissements`;
}

function generatePros(_decision: string): string {
  return `
• Amélioration potentielle de la situation
• Opportunités de croissance
• Résolution de problèmes existants`;
}

function generateCons(_decision: string): string {
  return `
• Risques potentiels
• Coûts d'implémentation
• Résistance au changement`;
}

function evaluateByCriteria(_decision: string, criteria: string[]): string {
  return criteria
    .map((criterion) => `• **${criterion}:** Impact à évaluer`)
    .join("\n");
}

function makeRecommendation(_decision: string): string {
  return "Analyser soigneusement tous les aspects avant de prendre une décision finale.";
}

function generateCreativeIdeas(topic: string, quantity: number): string {
  const ideas = [];
  for (let i = 1; i <= quantity; i++) {
    ideas.push(`${i}. Idée créative n°${i} pour "${topic}"`);
  }
  return ideas.join("\n");
}

function generateAlternativeApproaches(_topic: string): string {
  return `
• Approche traditionnelle
• Approche innovante
• Approche hybride`;
}

function getImplementationTips(_topic: string): string {
  return `
• Commencer petit et itérer
• Impliquer les parties prenantes
• Mesurer les résultats`;
}

// Logique des outils MCP
async function executeAnalyzeProblem(args: any) {
  const problem = args.problem as string;
  const context = (args.context as string) || "";

  const analysis = `
🔍 **ANALYSE DU PROBLÈME**

**Problème identifié:**
${problem}

${context ? `**Contexte:**\n${context}\n` : ""}

**Analyse structurée:**
1. **Nature du problème:** ${categorizeeProblem(problem)}
2. **Causes possibles:** ${getPossibleCauses(problem)}
3. **Impact:** ${assessImpact(problem)}
4. **Urgence:** ${assessUrgency(problem)}

**Solutions recommandées:**
${generateSolutions(problem)}

**Prochaines étapes:**
${getNextSteps(problem)}
  `;

  return {
    content: [
      {
        type: "text",
        text: analysis,
      },
    ],
  };
}

async function executeStepByStepThinking(args: any) {
  const task = args.task as string;
  const goal = (args.goal as string) || "Accomplir la tâche";

  const steps = `
📋 **DÉCOMPOSITION ÉTAPE PAR ÉTAPE**

**Tâche:** ${task}
**Objectif:** ${goal}

**Plan d'action:**
${generateSteps(task, goal)}

**Points de contrôle:**
${generateCheckpoints(task)}

**Ressources nécessaires:**
${identifyResources(task)}
  `;

  return {
    content: [
      {
        type: "text",
        text: steps,
      },
    ],
  };
}

async function executeProsAndCons(args: any) {
  const decision = args.decision as string;
  const criteria = (args.criteria as string[]) || [];

  const analysis = `
⚖️ **ANALYSE AVANTAGES/INCONVÉNIENTS**

**Décision:** ${decision}

**✅ AVANTAGES:**
${generatePros(decision)}

**❌ INCONVÉNIENTS:**
${generateCons(decision)}

${criteria.length > 0 ? `**📊 ÉVALUATION SELON VOS CRITÈRES:**\n${evaluateByCriteria(decision, criteria)}` : ""}

**🎯 RECOMMANDATION:**
${makeRecommendation(decision)}
  `;

  return {
    content: [
      {
        type: "text",
        text: analysis,
      },
    ],
  };
}

async function executeCreativeBrainstorm(args: any) {
  const topic = args.topic as string;
  const quantity = (args.quantity as number) || 5;

  const brainstorm = `
💡 **BRAINSTORMING CRÉATIF**

**Sujet:** ${topic}

**🎯 IDÉES GÉNÉRÉES:**
${generateCreativeIdeas(topic, quantity)}

**🔄 APPROCHES ALTERNATIVES:**
${generateAlternativeApproaches(topic)}

**💼 CONSEILS D'IMPLÉMENTATION:**
${getImplementationTips(topic)}
  `;

  return {
    content: [
      {
        type: "text",
        text: brainstorm,
      },
    ],
  };
}

// Configuration des outils disponibles
const tools = [
  {
    name: "analyze_problem",
    description:
      "Analyser un problème de manière structurée et proposer des solutions",
    inputSchema: {
      type: "object",
      properties: {
        problem: {
          type: "string",
          description: "Le problème à analyser",
        },
        context: {
          type: "string",
          description: "Contexte supplémentaire (optionnel)",
        },
      },
      required: ["problem"],
    },
  },
  {
    name: "step_by_step_thinking",
    description: "Décomposer une tâche complexe en étapes logiques",
    inputSchema: {
      type: "object",
      properties: {
        task: {
          type: "string",
          description: "La tâche à décomposer",
        },
        goal: {
          type: "string",
          description: "L'objectif final",
        },
      },
      required: ["task"],
    },
  },
  {
    name: "pros_and_cons",
    description: "Analyser les avantages et inconvénients d'une décision",
    inputSchema: {
      type: "object",
      properties: {
        decision: {
          type: "string",
          description: "La décision à analyser",
        },
        criteria: {
          type: "array",
          items: {
            type: "string",
          },
          description: "Critères d'évaluation (optionnel)",
        },
      },
      required: ["decision"],
    },
  },
  {
    name: "creative_brainstorm",
    description: "Générer des idées créatives pour un sujet donné",
    inputSchema: {
      type: "object",
      properties: {
        topic: {
          type: "string",
          description: "Le sujet pour le brainstorming",
        },
        quantity: {
          type: "number",
          description: "Nombre d'idées à générer (défaut: 5)",
        },
      },
      required: ["topic"],
    },
  },
];

// Serveur HTTP
const server = createServer(async (req, res) => {
  // Configuration CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  const url = new URL(req.url!, `http://${req.headers.host}`);

  try {
    if (req.method === "GET" && url.pathname === "/") {
      // Page d'accueil avec documentation
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Thinking Assistant MCP Server</title>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            pre { background: #f5f5f5; padding: 10px; border-radius: 5px; }
            code { background: #f0f0f0; padding: 2px 4px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>🧠 Thinking Assistant MCP Server</h1>
          <p>Serveur MCP pour la réflexion et l'analyse structurée</p>
          
          <h2>🔧 Endpoints disponibles:</h2>
          <ul>
            <li><code>GET /</code> - Cette page d'accueil</li>
            <li><code>GET /tools</code> - Liste des outils disponibles</li>
            <li><code>POST /tools/:toolName</code> - Exécuter un outil</li>
            <li><code>GET /health</code> - Vérification de santé</li>
          </ul>
          
          <h2>🛠️ Outils disponibles:</h2>
          <ul>
            <li><strong>analyze_problem</strong> - Analyser un problème</li>
            <li><strong>step_by_step_thinking</strong> - Décomposer une tâche</li>
            <li><strong>pros_and_cons</strong> - Analyser les avantages/inconvénients</li>
            <li><strong>creative_brainstorm</strong> - Brainstorming créatif</li>
          </ul>
          
          <h2>📚 Exemple d'utilisation:</h2>
          <pre>
curl -X POST ${req.headers.host ? `http://${req.headers.host}` : "https://votre-app.railway.app"}/tools/analyze_problem \\
  -H "Content-Type: application/json" \\
  -d '{"problem": "Comment améliorer les performances de mon application?"}'
          </pre>
          
          <p><a href="/tools">Voir les outils disponibles (JSON)</a></p>
        </body>
        </html>
      `);
    } else if (req.method === "GET" && url.pathname === "/health") {
      // Health check pour Railway
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          status: "healthy",
          timestamp: new Date().toISOString(),
        }),
      );
    } else if (req.method === "GET" && url.pathname === "/tools") {
      // Liste des outils
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ tools }, null, 2));
    } else if (req.method === "POST" && url.pathname.startsWith("/tools/")) {
      // Exécution d'un outil
      const toolName = url.pathname.split("/")[2];

      let body = "";
      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", async () => {
        try {
          const args = JSON.parse(body);
          let result;

          switch (toolName) {
            case "analyze_problem":
              result = await executeAnalyzeProblem(args);
              break;
            case "step_by_step_thinking":
              result = await executeStepByStepThinking(args);
              break;
            case "pros_and_cons":
              result = await executeProsAndCons(args);
              break;
            case "creative_brainstorm":
              result = await executeCreativeBrainstorm(args);
              break;
            default:
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({ error: `Tool '${toolName}' not found` }),
              );
              return;
          }

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(result, null, 2));
        } catch (error: any) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({ error: `Invalid request: ${error.message}` }),
          );
        }
      });
    } else {
      // 404
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Endpoint not found" }));
    }
  } catch (error: any) {
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: `Server error: ${error.message}` }));
  }
});

server.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`🚀 Thinking Assistant MCP Server running on port ${PORT}`);
  console.log(`📱 Health check: http://localhost:${PORT}/health`);
  console.log(`🛠️ Tools API: http://localhost:${PORT}/tools`);
  console.log(`📖 Documentation: http://localhost:${PORT}/`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`🕐 Started at: ${new Date().toISOString()}`);
});

// Gestion gracieuse de l'arrêt
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed successfully");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed successfully");
    process.exit(0);
  });
});

export default server;
