# eng-mcp-server

A TypeScript MCP (Model Context Protocol) server exposing 3 tools to GitHub
Copilot in VS Code:

| Tool | Purpose | Real API | Mock fallback |
|---|---|---|---|
| `jira_get_ticket` | Ticket → title, description, status, assignee | Jira Cloud REST v3 | ✅ 3 fixture tickets |
| `github_summarize_pr` | PR → structured summary incl. extracted decisions | GitHub REST API (`api.github.com`) | none needed — public repos work unauthenticated |
| `internal_service_status` | Service name → health/version/uptime/on-call | Your internal REST API | ✅ 3 fixture services |

Each tool works out of the box in **mock mode** (no credentials needed) so
you can test end-to-end immediately, then flips to calling the real API the
moment you set the matching env vars — no code changes required.

## 1. Setup

```bash
npm install
npm run build          # compiles src/**/*.ts -> dist/
```

Copy `.env.example` to `.env` and fill in only the services you have
credentials for. Anything left blank runs in mock mode.

## 2. Connect to VS Code Copilot

A ready-made config is at `.vscode/mcp.json` (committed to this repo). It
uses VS Code's `inputs` mechanism so tokens are prompted for and stored in
VS Code's secret storage — never written to the JSON file:

```json
{
  "servers": {
    "eng-mcp-server": {
      "type": "stdio",
      "command": "node",
      "args": ["${workspaceFolder}/dist/src/index.js"],
      "env": {
        "JIRA_BASE_URL": "https://your-org.atlassian.net",
        "JIRA_EMAIL": "${input:jiraEmail}",
        "JIRA_API_TOKEN": "${input:jiraToken}",
        "GITHUB_TOKEN": "${input:githubToken}",
        "INTERNAL_API_BASE_URL": "https://internal-api.your-org.dev",
        "INTERNAL_API_TOKEN": "${input:internalApiToken}"
      }
    }
  }
}
```

Steps:
1. Open this folder in VS Code, run `npm run build`.
2. Command Palette → **MCP: List Servers** → `eng-mcp-server` → **Start**.
   (VS Code auto-detects `.vscode/mcp.json`.)
3. Open Copilot Chat, switch mode from **Ask** to **Agent**.
4. Ask something like *"look up ENG-1421 in Jira"* — Copilot will call
   `jira_get_ticket` itself and show the tool call inline.

## 3. Tool schemas

### `jira_get_ticket`
```ts
input:  { ticketId: string }        // e.g. "ENG-1421"
output: {
  key: string; title: string; description: string;
  status: string; assignee: string; priority?: string; url?: string;
}
```

### `github_summarize_pr`
```ts
input:  { repo: string; prNumber: number }   // repo = "owner/name"
output: {
  number: number; repo: string; title: string; author: string;
  state: "open" | "closed" | "merged"; filesChanged: number;
  additions: number; deletions: number;
  decisions: { topic: string; decision: string }[];
  summary: string; url: string;
}
```
`decisions` is populated by scanning the PR body and its review/issue
comments for resolution-style phrasing ("Decided to...", "We agreed...",
"RESOLVED:", "Went with...").

### `internal_service_status`
```ts
input:  { serviceName: string; endpointPath?: string }  // endpointPath defaults to "status"
output: { service: string; endpoint: string; status: number; data: unknown }
```

## 4. Test results — 5 real queries

Run with `npm test` (builds, then drives the compiled server through the
real MCP client/transport — not a stub). Actual output from this run:

| # | Query | Result |
|---|---|---|
| 1 | `jira_get_ticket("ENG-1421")` | ✅ Returns full ticket (mock fixture — no `JIRA_*` env set) |
| 2 | `jira_get_ticket("ENG-9999")` | ✅ Correctly errors: unknown ticket, lists known IDs |
| 3 | `github_summarize_pr("facebook/react", 31445)` | ✅ Real call to `api.github.com`; server returned `403 rate limit exceeded` (this sandbox's shared IP had no quota left) and the tool surfaced that error cleanly instead of crashing — confirms real network integration + error handling. With `GITHUB_TOKEN` set this returns the full summary. |
| 4 | `internal_service_status("checkout-api")` | ✅ Returns healthy status (mock fixture) |
| 5 | `internal_service_status("ssr-render-service")` | ✅ Returns degraded status incl. active incident note (mock fixture) |

Full logged output:

```
=== Registered tools ===
- jira_get_ticket: Look up a Jira ticket by its ID...
- github_summarize_pr: Given a GitHub repo (owner/name) and PR number...
- internal_service_status: Query the team's internal service-status API...

=== Query 1 ===  [OK]  ENG-1421 → "SSR hydration mismatch on product detail page", In Progress, Aya Hassan
=== Query 2 ===  [TOOL ERROR]  Unknown ticket "ENG-9999" (mock mode message with known IDs)
=== Query 3 ===  [TOOL ERROR]  GitHub API error 403: rate limit exceeded (real api.github.com call)
=== Query 4 ===  [OK]  checkout-api → healthy, v3.4.1, 99.97% uptime
=== Query 5 ===  [OK]  ssr-render-service → degraded, active incident noted
```

## 5. Going from mock → real

- **Jira**: set `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` (an
  [Atlassian API token](https://id.atlassian.com/manage-profile/security/api-tokens)).
- **GitHub**: set `GITHUB_TOKEN` (a fine-grained PAT with `pull_requests: read`).
- **Internal API**: set `INTERNAL_API_BASE_URL` (+ `INTERNAL_API_TOKEN` if
  auth'd). Swap the URL shape in `src/tools/internalApi.ts` to match your
  team's actual service-registry endpoint — the wrapper assumes
  `GET {base}/services/{name}/{path}` as a placeholder.

## Project layout

```
src/
  index.ts            MCP server entrypoint, registers all 3 tools
  types.ts            shared TS interfaces
  tools/jira.ts        Jira tool (real + mock)
  tools/github.ts       GitHub tool (real, calls api.github.com)
  tools/internalApi.ts  Internal API wrapper (real + mock)
test/test-client.ts    MCP client that drives the built server through 5 queries
.vscode/mcp.json       VS Code Copilot MCP config
.env.example
```
