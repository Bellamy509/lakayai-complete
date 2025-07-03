import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import {
  type MCPServerInfo,
  MCPRemoteConfigZodSchema,
  MCPStdioConfigZodSchema,
  type MCPServerConfig,
  type MCPToolInfo,
} from "app-types/mcp";
import { jsonSchema, Tool, tool, ToolExecutionOptions } from "ai";
import { isMaybeRemoteConfig, isMaybeStdioConfig } from "./is-mcp-config";
import logger from "logger";
import type { ConsolaInstance } from "consola";
import { colorize } from "consola/utils";
import {
  createDebounce,
  errorToString,
  isNull,
  Locker,
  toAny,
} from "lib/utils";

import { safe } from "ts-safe";
import { IS_MCP_SERVER_REMOTE_ONLY } from "lib/const";

type ClientOptions = {
  autoDisconnectSeconds?: number;
};

/**
 * Client class for Model Context Protocol (MCP) server connections
 */
export class MCPClient {
  private client?: Client;
  private error?: unknown;
  private isConnected = false;
  private log: ConsolaInstance;
  private locker = new Locker();
  // Information about available tools from the server
  toolInfo: MCPToolInfo[] = [];
  // Tool instances that can be used for AI functions
  tools: { [key: string]: Tool } = {};

  constructor(
    private name: string,
    private serverConfig: MCPServerConfig,
    private options: ClientOptions = {},
    private disconnectDebounce = createDebounce(),
  ) {
    this.log = logger.withDefaults({
      message: colorize("cyan", `MCP Client ${this.name}: `),
    });
  }

  getInfo(): MCPServerInfo {
    return {
      name: this.name,
      config: this.serverConfig,
      status: this.locker.isLocked
        ? "loading"
        : this.isConnected
          ? "connected"
          : "disconnected",
      error: this.error,
      toolInfo: this.toolInfo,
    };
  }

  private scheduleAutoDisconnect() {
    if (this.options.autoDisconnectSeconds) {
      this.disconnectDebounce(() => {
        this.disconnect();
      }, this.options.autoDisconnectSeconds * 1000);
    }
  }

  /**
   * Connect to the MCP server
   * Do not throw Error
   * @returns this
   */
  async connect() {
    if (this.locker.isLocked) {
      await this.locker.wait();
      return this.client;
    }
    if (this.isConnected) {
      return this.client;
    }

    // Ajouter un timeout pour les connexions lentes
    const CONNECTION_TIMEOUT = 15000; // 15 secondes maximum

    try {
      const startedAt = Date.now();
      this.locker.lock();

      this.log.info(`Attempting to connect to ${this.name}...`);

      const client = new Client({
        name: "mcp-chatbot-client",
        version: "1.0.0",
      });

      // Wrapper avec timeout pour éviter les connexions infinies
      const connectWithTimeout = async () => {
        return Promise.race([
          this.performConnection(client),
          new Promise((_, reject) =>
            setTimeout(
              () =>
                reject(
                  new Error(`Connection timeout after ${CONNECTION_TIMEOUT}ms`),
                ),
              CONNECTION_TIMEOUT,
            ),
          ),
        ]);
      };

      await connectWithTimeout();

      const connectionTime = Date.now() - startedAt;
      this.log.info(
        `Connected to MCP server in ${(connectionTime / 1000).toFixed(2)}s`,
      );

      // Log si la connexion est lente
      if (connectionTime > 5000) {
        this.log.warn(
          `Slow connection detected: ${this.name} took ${(connectionTime / 1000).toFixed(2)}s to connect`,
        );
      }

      this.isConnected = true;
      this.error = undefined;
      this.client = client;

      // Charger les outils en parallèle pour améliorer les performances
      await this.loadToolsAsync(client);

      this.scheduleAutoDisconnect();
    } catch (error) {
      this.log.error(`Failed to connect to ${this.name}:`, error);
      this.isConnected = false;
      this.error = error;
    }

    this.locker.unlock();
    return this.client;
  }

  private async performConnection(client: Client) {
    // Create appropriate transport based on server config type
    if (isMaybeStdioConfig(this.serverConfig)) {
      // Skip stdio transport
      if (IS_MCP_SERVER_REMOTE_ONLY) {
        throw new Error("Stdio transport is not supported");
      }

      const config = MCPStdioConfigZodSchema.parse(this.serverConfig);
      const transport = new StdioClientTransport({
        command: config.command,
        args: config.args,
        // Merge process.env with config.env, ensuring PATH is preserved and filtering out undefined values
        env: Object.entries({ ...process.env, ...config.env }).reduce(
          (acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>,
        ),
        cwd: process.cwd(),
      });

      await client.connect(transport);
    } else if (isMaybeRemoteConfig(this.serverConfig)) {
      const config = MCPRemoteConfigZodSchema.parse(this.serverConfig);
      const abortController = new AbortController();
      const url = new URL(config.url);
      try {
        const transport = new StreamableHTTPClientTransport(url, {
          requestInit: {
            headers: config.headers,
            signal: abortController.signal,
          },
        });
        await client.connect(transport);
      } catch {
        this.log.info(
          "Streamable HTTP connection failed, falling back to SSE transport",
        );
        const transport = new SSEClientTransport(url, {
          requestInit: {
            headers: config.headers,
            signal: abortController.signal,
          },
        });
        await client.connect(transport);
      }
    } else {
      throw new Error("Invalid server config");
    }
  }

  private async loadToolsAsync(client: Client) {
    const toolLoadStart = Date.now();
    const toolResponse = await client.listTools();

    this.toolInfo = toolResponse.tools.map(
      (tool) =>
        ({
          name: tool.name,
          description: tool.description,
          inputSchema: tool.inputSchema,
        }) as MCPToolInfo,
    );

    // Create AI SDK tool wrappers for each MCP tool - optimisé en parallèle
    this.tools = toolResponse.tools.reduce((prev, _tool) => {
      const parameters = jsonSchema(
        toAny({
          ..._tool.inputSchema,
          properties: _tool.inputSchema.properties ?? {},
          additionalProperties: false,
        }),
      );
      prev[_tool.name] = tool({
        parameters,
        description: _tool.description,
        execute: (params, options: ToolExecutionOptions) => {
          options?.abortSignal?.throwIfAborted();
          return this.callTool(_tool.name, params);
        },
      });
      return prev;
    }, {});

    const toolLoadTime = Date.now() - toolLoadStart;
    this.log.info(
      `Loaded ${toolResponse.tools.length} tools in ${toolLoadTime}ms`,
    );
  }

  async disconnect() {
    this.log.info("Disconnecting from MCP server");
    await this.locker.wait();
    this.isConnected = false;
    const client = this.client;
    this.client = undefined;
    await client?.close().catch((e) => this.log.error(e));
  }
  async callTool(toolName: string, input?: unknown) {
    const callStart = Date.now();

    return safe(() => this.log.info(`Tool call started: ${toolName}`))
      .ifOk(() => {
        if (this.error) {
          throw new Error(
            "MCP Server is currently in an error state. Please check the configuration and try refreshing the server.",
          );
        }
      })
      .ifOk(() => this.scheduleAutoDisconnect()) // disconnect if autoDisconnectSeconds is set
      .map(async () => {
        // Éviter les reconnexions inutiles si déjà connecté
        let client = this.client;
        if (!this.isConnected || !client) {
          client = await this.connect();
        }

        if (!client) {
          throw new Error("Failed to establish connection to MCP server");
        }

        const result = await client.callTool({
          name: toolName,
          arguments: input as Record<string, unknown>,
        });

        const callTime = Date.now() - callStart;
        this.log.info(`Tool call completed: ${toolName} in ${callTime}ms`);

        // Log des appels lents pour diagnostic
        if (callTime > 2000) {
          this.log.warn(
            `Slow tool call detected: ${toolName} took ${callTime}ms`,
          );
        }

        return result;
      })
      .ifOk((v) => {
        if (isNull(v)) {
          throw new Error("Tool call failed with null");
        }
        return v;
      })
      .ifOk(() => this.scheduleAutoDisconnect())
      .watch((status) => {
        if (!status.isOk) {
          this.log.error("Tool call failed", toolName, status.error);
        } else if (status.value?.isError) {
          this.log.error("Tool call failed", toolName, status.value.content);
        }
      })
      .ifFail((error) => {
        const errorTime = Date.now() - callStart;
        this.log.error(
          `Tool call failed after ${errorTime}ms:`,
          toolName,
          error,
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                error: {
                  message: errorToString(error),
                  name: error?.name,
                  executionTime: errorTime,
                },
              }),
            },
          ],
          isError: true,
        };
      })
      .unwrap();
  }
}

/**
 * Factory function to create a new MCP client
 */
export const createMCPClient = (
  name: string,
  serverConfig: MCPServerConfig,
  options: ClientOptions = {},
): MCPClient => new MCPClient(name, serverConfig, options);
