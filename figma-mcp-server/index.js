#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

// Figma API configuration
const FIGMA_API_BASE = "https://api.figma.com/v1";
const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN;

if (!FIGMA_ACCESS_TOKEN) {
  console.error("Error: FIGMA_ACCESS_TOKEN environment variable is required");
  process.exit(1);
}

// Helper function to make Figma API requests
async function figmaRequest(endpoint) {
  const response = await fetch(`${FIGMA_API_BASE}${endpoint}`, {
    headers: {
      "X-Figma-Token": FIGMA_ACCESS_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Create MCP server
const server = new Server(
  {
    name: "figma-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_figma_file",
        description: "Get the structure and data of a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            file_key: {
              type: "string",
              description: "The Figma file key (from the URL)",
            },
          },
          required: ["file_key"],
        },
      },
      {
        name: "get_figma_file_styles",
        description: "Get all styles (colors, text styles, effects) from a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            file_key: {
              type: "string",
              description: "The Figma file key (from the URL)",
            },
          },
          required: ["file_key"],
        },
      },
      {
        name: "get_figma_file_components",
        description: "Get all components from a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            file_key: {
              type: "string",
              description: "The Figma file key (from the URL)",
            },
          },
          required: ["file_key"],
        },
      },
      {
        name: "get_figma_node",
        description: "Get detailed information about a specific node in a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            file_key: {
              type: "string",
              description: "The Figma file key (from the URL)",
            },
            node_id: {
              type: "string",
              description: "The node ID to fetch",
            },
          },
          required: ["file_key", "node_id"],
        },
      },
      {
        name: "get_figma_images",
        description: "Get rendered images of nodes from a Figma file",
        inputSchema: {
          type: "object",
          properties: {
            file_key: {
              type: "string",
              description: "The Figma file key (from the URL)",
            },
            node_ids: {
              type: "string",
              description: "Comma-separated list of node IDs",
            },
            scale: {
              type: "number",
              description: "Image scale (1-4), defaults to 1",
              default: 1,
            },
            format: {
              type: "string",
              enum: ["jpg", "png", "svg", "pdf"],
              description: "Image format, defaults to png",
              default: "png",
            },
          },
          required: ["file_key", "node_ids"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "get_figma_file": {
        const data = await figmaRequest(`/files/${args.file_key}`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "get_figma_file_styles": {
        const data = await figmaRequest(`/files/${args.file_key}/styles`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "get_figma_file_components": {
        const data = await figmaRequest(`/files/${args.file_key}/components`);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "get_figma_node": {
        const data = await figmaRequest(
          `/files/${args.file_key}/nodes?ids=${args.node_id}`
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      case "get_figma_images": {
        const scale = args.scale || 1;
        const format = args.format || "png";
        const data = await figmaRequest(
          `/images/${args.file_key}?ids=${args.node_ids}&scale=${scale}&format=${format}`
        );
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(data, null, 2),
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Figma MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
