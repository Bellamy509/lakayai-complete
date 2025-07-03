// Importation des repositories mockés pour fonctionnement sans base de données
import { mockChatRepository, mockUserRepository } from "./mock-repositories";

// Imports des vrais repositories (commentés pour fonctionnement sans DB)
// import { pgChatRepository } from "./pg/repositories/chat-repository.pg";
// import { pgUserRepository } from "./pg/repositories/user-repository.pg";
// import { pgMcpRepository } from "./pg/repositories/mcp-repository.pg";
// import { pgMcpMcpToolCustomizationRepository } from "./pg/repositories/mcp-tool-customization-repository.pg";
// import { pgMcpServerCustomizationRepository } from "./pg/repositories/mcp-server-customization-repository.pg";

// Utilisation des repositories mockés
export const chatRepository = mockChatRepository;
export const userRepository = mockUserRepository;

// Repositories MCP mockés temporairement (pour éviter les erreurs de DB)
export const mcpRepository = {
  selectAll: async () => [],
  insert: async (_config: any) => _config,
  update: async (_id: string, _config: any) => _config,
  delete: async (_id: string) => true,
} as any;

export const mcpMcpToolCustomizationRepository = {
  selectAll: async () => [],
  insert: async (_config: any) => _config,
  update: async (_id: string, _config: any) => _config,
  delete: async (_id: string) => true,
} as any;

export const mcpServerCustomizationRepository = {
  selectAll: async () => [],
  insert: async (_config: any) => _config,
  update: async (_id: string, _config: any) => _config,
  delete: async (_id: string) => true,
} as any;
