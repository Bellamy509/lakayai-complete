"use server";
import { mcpClientsManager } from "lib/ai/mcp/mcp-manager";
import { z } from "zod";
import { Safe, safe } from "ts-safe";
import { errorToString } from "lib/utils";
import { McpServerSchema } from "lib/db/pg/schema.pg";

// Variable pour éviter la double initialisation
let isInitialized = false;

export async function selectMcpClientsAction() {
  try {
    // Debug: Forcer l'initialisation si pas encore fait
    if (!isInitialized) {
      console.log("🔧 MCP: Initialisation forcée...");
      await mcpClientsManager.init();

      // Vérifier si des clients sont connectés
      const clients = await mcpClientsManager.getClients();
      console.log(`🔧 MCP: ${clients.length} clients après init`);

      // Si pas de clients, forcer la connexion manuelle
      if (clients.length === 0) {
        console.log("🔧 MCP: Aucun client, connexion manuelle...");

        // Lire la configuration complète depuis .mcp-config.json
        try {
          console.log("🔧 MCP: Lecture de .mcp-config.json...");
          const fs = await import("fs/promises");
          const configContent = await fs.readFile(".mcp-config.json", "utf8");
          const mcpConfigs = JSON.parse(configContent);
          console.log(
            `🔧 MCP: ${Object.keys(mcpConfigs).length} serveurs dans le fichier config`,
          );

          // Tenter de connecter chaque serveur du fichier de configuration
          for (const [name, config] of Object.entries(mcpConfigs)) {
            try {
              console.log(`🔧 MCP: Connexion à ${name}...`);
              await mcpClientsManager.addClient(name, name, config as any);
              console.log(`✅ MCP: ${name} connecté`);
            } catch (error) {
              console.error(`❌ MCP: ${name} échec:`, error);
              // Continue avec les autres serveurs même en cas d'erreur
            }
          }
        } catch (configError) {
          console.error(
            "🔧 MCP: Erreur lecture config, utilisation des serveurs de base:",
            configError,
          );

          // Configuration de base seulement si impossible de lire le fichier
          const baseConfigs = {
            "sequential-thinking": {
              command: "npx",
              args: ["-y", "@modelcontextprotocol/server-sequential-thinking"],
            },
            time: {
              command: "npx",
              args: ["-y", "time-mcp"],
            },
            "web-search": {
              command: "npx",
              args: ["-y", "@pinkpixel/web-scout-mcp"],
            },
          };

          for (const [name, config] of Object.entries(baseConfigs)) {
            try {
              console.log(`🔧 MCP: Connexion de base à ${name}...`);
              await mcpClientsManager.addClient(name, name, config);
              console.log(`✅ MCP: ${name} connecté (base)`);
            } catch (error) {
              console.error(`❌ MCP: ${name} échec (base):`, error);
            }
          }
        }
      }

      isInitialized = true;
    }

    const list = await mcpClientsManager.getClients();
    console.log(`🔧 MCP: Retour de ${list.length} clients`);

    const result = list.map(({ client, id }) => {
      const info = client.getInfo();
      console.log(
        `🔧 MCP: Client ${id}: ${info.name} (${info.toolInfo.length} outils)`,
      );

      // Format the data correctly for the UI
      const formattedData = {
        id,
        name: info.name,
        description: (info as any).description || "",
        status: "connected" as const,
        toolInfo: info.toolInfo || [],
        config: {
          command: "npx", // Default command
          args: [], // Default args
        },
        error: null,
      };

      console.log(
        `🔧 MCP: Données formatées pour ${id}:`,
        JSON.stringify(formattedData, null, 2),
      );

      return formattedData;
    });

    console.log(`🔧 MCP: Résultat final: ${result.length} serveurs formatés`);
    return result;
  } catch (error) {
    console.error("❌ MCP: Erreur dans selectMcpClientsAction:", error);
    return [];
  }
}

export async function selectMcpClientAction(id: string) {
  const client = await mcpClientsManager.getClient(id);
  if (!client) {
    throw new Error("Client not found");
  }
  return {
    ...client.client.getInfo(),
    id,
  };
}

export async function saveMcpClientAction(
  server: typeof McpServerSchema.$inferInsert,
) {
  if (process.env.NOT_ALLOW_ADD_MCP_SERVERS) {
    throw new Error("Not allowed to add MCP servers");
  }
  // Validate name to ensure it only contains alphanumeric characters and hyphens
  const nameSchema = z.string().regex(/^[a-zA-Z0-9\-]+$/, {
    message:
      "Name must contain only alphanumeric characters (A-Z, a-z, 0-9) and hyphens (-)",
  });

  const result = nameSchema.safeParse(server.name);
  if (!result.success) {
    throw new Error(
      "Name must contain only alphanumeric characters (A-Z, a-z, 0-9) and hyphens (-)",
    );
  }

  await mcpClientsManager.persistClient(server);
}

export async function existMcpClientByServerNameAction(serverName: string) {
  const client = await mcpClientsManager.getClients().then((clients) => {
    return clients.find(
      (client) => client.client.getInfo().name === serverName,
    );
  });
  return !!client;
}

export async function removeMcpClientAction(id: string) {
  await mcpClientsManager.removeClient(id);
}

export async function refreshMcpClientAction(id: string) {
  await mcpClientsManager.refreshClient(id);
}

function safeCallToolResult(chain: Safe<any>) {
  return chain
    .ifFail((err) => {
      console.error(err);
      return {
        isError: true,
        content: [
          JSON.stringify({
            error: { message: errorToString(err), name: err?.name },
          }),
        ],
      };
    })
    .unwrap();
}

export async function callMcpToolAction(
  id: string,
  toolName: string,
  input?: unknown,
) {
  const chain = safe(async () => {
    const client = await mcpClientsManager.getClient(id);
    if (!client) {
      throw new Error("Client not found");
    }
    return client.client.callTool(toolName, input).then((res) => {
      if (res?.isError) {
        throw new Error(
          res.content?.[0]?.text ??
            JSON.stringify(res.content, null, 2) ??
            "Unknown error",
        );
      }
      return res;
    });
  });
  return safeCallToolResult(chain);
}

export async function callMcpToolByServerNameAction(
  serverName: string,
  toolName: string,
  input?: unknown,
) {
  const chain = safe(async () => {
    const clients = await mcpClientsManager.getClients();

    // First try to find with exact name match
    let client = clients.find(
      (client) => client.client.getInfo().name === serverName,
    );

    // If not found, try with reverse sanitizing (replace underscores with spaces)
    if (!client) {
      const unsanitizedName = serverName.replace(/_/g, " ");
      client = clients.find(
        (client) => client.client.getInfo().name === unsanitizedName,
      );
    }

    // If still not found, try with different cases
    if (!client) {
      client = clients.find(
        (client) =>
          client.client.getInfo().name.toLowerCase() ===
          serverName.toLowerCase(),
      );
    }

    if (!client) {
      throw new Error(`Client not found for server: ${serverName}`);
    }
    return client.client.callTool(toolName, input);
  });
  return safeCallToolResult(chain);
}
