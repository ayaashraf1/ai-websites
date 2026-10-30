---
name: typescript-mcp-server-generator
description: "Generate a complete MCP server in TypeScript with tools, resources, and proper configuration."
---

# Generate TypeScript MCP Server

Create a complete Model Context Protocol (MCP) server in TypeScript with the following specifications:

## Requirements

1. **Project Structure**: Create a new TypeScript/Node.js project with proper directory structure
2. **NPM Packages**: Include @model-context-protocol/sdk, zod@3 and either express (for HTTP) or stdio support.
3. **TypeScript Configuration**: Ensure `tsconfig.json` is properly set up for the project with ES module support.
4. **Server Type**: Choose between an HTTP server using express or a stdio-based server for local MCP clients.
5. **Tools**: Create at least one useful tool with proper schema validation.
6. **Error Handling**: Implement proper error handling for both tool validation errors and provider failures.

## Implementation Requirements

### Project Setup

- Initialize with `npm init` and create package.jason
- Install dependancies: `@model-context-protocol/sdk`, `zod@3`, and transport-specific packages
- Configure TypeScript with ES modules: `"type":"module"` in `package.json`
- Add dev dependancies: `tsx` or `ts-node` for development
- Create proper .gitignore file

## Server Configurartion

- Use `MCPServer` class for high-level implemenation
- Set server name and version
- Choose appropriate transport (StreamableHTTPServerTransport or StdioServerTransport)
- For HTTP: set up Express with proper middleware and error handling
- For stdio: use StdioServerTransport directly

## Tool Implementation

- Use `registerTool()` method with descriptive names
- Define schemas using zod for input and output validation
- Provide clear `title` and `description` fields
- Return both `content` and `structuredContnet` in results
- Implemet proper error handling with try-catch blocks
- Support async operations where appropriate

### Resource/Prompt Setup (Optional)

- Add resource using `registerResource()` with ResourceTemplate for dynamic URLS
- Add prompts using `registerPrompt()` with argument schemas
- Consider adding completion support for better UX

### Code Quality

- Use TypeScript for type safety
- Follow async/await patterns consistently
- Implement proper cleaning on transport close events
- Use environment variables for configuration
- Add inline comments for complex logic
- Structure code with clear separation of concerns

## Example Tool Types to consider

- Data processing and transformation
- External API integrations
- File system operations (read, search, analyze)
- Database queries
- Text analysis or summarization (with sampling)
- System information retrieval

## Configuration Options

- **For HTTP Servers**:
  - port configuration via environment variables
  - CORS setup for browser clients
  - Session managment (stateless vs stateful)
  - DNS rebinding protection for local servers
- **For stdio servers**:
  - Ensure proper handling of stdin and stdout streams
  - Environment-based configuration
  - Process lifecycle management

## Testing Guidence

- Explain how to run the server (e.g., `npm start` or `npx tsx server.ts`)
- Provide MCP Inspector command: `npx @model-context-protocol/inspector`
- For HTTP servers, include connection URL: `http://localhost:PORT/mcp`
- Include example tool invocations
- Add troubleshooting tips for common issues

## Additional Features to consider

- Sampling support for LLM-powered tools
- User input elicitation for interactive workflows
- Dynamic tool registration with enable/disable capabilities
- Notification debouncing for bulk updates
- Resource links for efficient data references

Generate a complete, production-ready MCP server with comprehensive documentation, type safety, and error handling.
