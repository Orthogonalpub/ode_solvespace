# Figma MCP Server

An MCP (Model Context Protocol) server that integrates with Figma's API to fetch design data.

## Features

This server provides tools to:
- Get Figma file structure and data
- Fetch styles (colors, text styles, effects)
- Retrieve components
- Get specific node information
- Export images of nodes

## Setup

### 1. Get a Figma Access Token

1. Go to your Figma account settings: https://www.figma.com/settings
2. Scroll down to "Personal access tokens"
3. Click "Create a new personal access token"
4. Give it a name and copy the token (you won't see it again!)

### 2. Install Dependencies

```bash
cd figma-mcp-server
npm install
```

### 3. Configure Claude Code

Add the following to your Claude Code MCP settings file:

**On macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/Users/dennis/Project/ode_solvespace/figma-mcp-server/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "YOUR_FIGMA_ACCESS_TOKEN_HERE"
      }
    }
  }
}
```

**Important:** Replace `YOUR_FIGMA_ACCESS_TOKEN_HERE` with your actual Figma access token.

### 4. Restart Claude Code

After updating the configuration, restart Claude Code completely for the changes to take effect.

## Usage

Once configured, you can use these tools in Claude Code:

### Get File Structure
```
Use the get_figma_file tool with file_key from the Figma URL
Example: https://www.figma.com/file/ABC123/Design -> file_key is "ABC123"
```

### Get Styles
```
Use get_figma_file_styles to fetch all colors, text styles, and effects
```

### Get Components
```
Use get_figma_file_components to list all reusable components
```

### Get Node Details
```
Use get_figma_node with a specific node_id to get detailed information
```

### Export Images
```
Use get_figma_images to render and export nodes as images
```

## Finding File Keys and Node IDs

- **File Key**: In the URL `https://www.figma.com/file/ABC123/My-Design`, the file key is `ABC123`
- **Node ID**: Right-click on any layer in Figma → "Copy/Paste as" → "Copy link" → The node ID is the part after `?node-id=`

## Available Tools

1. **get_figma_file**: Get complete file structure
2. **get_figma_file_styles**: Get all styles (colors, typography, effects)
3. **get_figma_file_components**: Get all components
4. **get_figma_node**: Get specific node details
5. **get_figma_images**: Export rendered images of nodes

## Example Workflow

1. Open your Figma design
2. Copy the file key from the URL
3. In Claude Code, ask: "Get the color styles from Figma file ABC123"
4. Claude will use the MCP server to fetch and display the design data
5. You can then use this data to update your CSS, generate code, etc.

## Troubleshooting

- **Server not starting**: Make sure Node.js is installed and the path in the config is correct
- **Authentication errors**: Verify your Figma access token is valid
- **Permission errors**: Ensure your token has access to the files you're trying to fetch
