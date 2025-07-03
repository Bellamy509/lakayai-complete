#!/usr/bin/env tsx

import { mcpClientsManager } from "../src/lib/ai/mcp/mcp-manager";
import { MCPServerConfig } from "../src/types/mcp";

async function updateAirbnbMcpServer() {
  try {
    console.log("🔄 Updating Airbnb MCP Server configuration...");

    // Find existing airbnb server
    const existingClients = await mcpClientsManager.getClients();
    const airbnbClient = existingClients.find(
      (client) => client.client.getInfo().name === "airbnb",
    );

    if (!airbnbClient) {
      console.log("❌ Airbnb MCP server not found");
      return;
    }

    console.log("✅ Found existing Airbnb server with ID:", airbnbClient.id);

    // Remove the old client first
    await mcpClientsManager.removeClient(airbnbClient.id);
    console.log("🗑️  Removed old configuration");

    // Create new configuration using local installation
    const airbnbConfig: MCPServerConfig = {
      command: "node",
      args: ["node_modules/@openbnb/mcp-server-airbnb/dist/index.js"],
    };

    const server = {
      name: "airbnb",
      config: airbnbConfig,
      id: airbnbClient.id, // Keep the same ID
    };

    // Add the updated server
    await mcpClientsManager.persistClient(server);

    console.log("✅ Airbnb MCP Server updated successfully!");
    console.log(
      "📋 New configuration:",
      JSON.stringify(server.config, null, 2),
    );

    // List all servers to confirm
    const clients = await mcpClientsManager.getClients();
    console.log("\n📊 All MCP Servers:");
    clients.forEach((client) => {
      const info = client.client.getInfo();
      console.log(
        `  - ${info.name} (ID: ${client.id}) - Status: ${info.status}`,
      );
    });
  } catch (error) {
    console.error("❌ Error updating Airbnb MCP server:", error);
    process.exit(1);
  }
}

// Run the script
updateAirbnbMcpServer()
  .then(() => {
    console.log("\n🎉 Update completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Update failed:", error);
    process.exit(1);
  });
