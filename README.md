# ai-websites

A collection of AI-assisted websites, developer tools, and prompt experiments.
Each project includes its source code and project-specific documentation.

## Projects

- [`landing-page-using-codex`](landing-page-using-codex/README.md) - Fern & Clay, an editorial landing page for an independent plant shop and greenhouse.
- [`restaurant-website`](restaurant-website/README.md) - Italiano, a contemporary Italian restaurant website with home, menu, and about pages.
- [`mcp-eng-server`](mcp-eng-server/README.md) - A TypeScript MCP server that gives VS Code Copilot Jira, GitHub pull request, and internal service-status tools.
- [`pr-review-bot`](pr-review-bot/README.md) - A GitHub Actions workflow that requests Copilot reviews for non-draft pull requests and applies repository-specific review instructions.

## Running the websites

Each website is self-contained. Open the project directory and follow its README
for installation and development commands.

```bash
cd restaurant-website
pnpm install
pnpm dev
```

For Fern & Clay:

```bash
cd landing-page-using-codex
npm install
npm run dev
```

## Running the MCP server

The MCP server runs locally and connects to VS Code Copilot through the
repository's `.vscode/mcp.json` configuration.

```bash
cd mcp-eng-server
npm install
npm run build
npm test
```

See the [MCP server README](mcp-eng-server/README.md) for VS Code setup,
environment variables, mock mode, and tool schemas.

## Installing the PR review bot

Copy the bot files into a target GitHub repository at these paths:

```text
.github/workflows/pr-review-bot.yml
.github/copilot-instructions.md
```

The workflow requests a Copilot review whenever a non-draft pull request is
opened or updated. See the [PR review bot README](pr-review-bot/README.md) for
permissions, customization, and troubleshooting.

More AI-built websites, developer tools, and prompt experiments will be added
over time.

inspiration from this workshop https://github.com/katia-openai/master-dev-workshop
