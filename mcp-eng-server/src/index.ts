#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getJiraTicket } from "./tools/jira.js";
import { summarizePullRequest } from "./tools/github.js";
import { callInternalApi } from "./tools/internalApi.js";

const server = new McpServer({
  name: "eng-mcp-server",
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool 1: Jira ticket lookup
// ---------------------------------------------------------------------------
server.registerTool(
  "jira_get_ticket",
  {
    title: "Jira: Get Ticket",
    description:
      "Look up a Jira ticket by its ID (e.g. ENG-1421) and return its title, description, status, and assignee.",
    inputSchema: {
      ticketId: z
        .string()
        .describe('Jira ticket key, e.g. "ENG-1421"'),
    },
  },
  async ({ ticketId }) => {
    try {
      const ticket = await getJiraTicket(ticketId);
      return {
        content: [{ type: "text", text: JSON.stringify(ticket, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [{ type: "text", text: `Failed to fetch ${ticketId}: ${err.message}` }],
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool 2: GitHub PR summariser
// ---------------------------------------------------------------------------
server.registerTool(
  "github_summarize_pr",
  {
    title: "GitHub: Summarize PR",
    description:
      "Given a GitHub repo (owner/name) and PR number, return a structured summary: title, author, state, files/lines changed, extracted decisions, and a short synopsis.",
    inputSchema: {
      repo: z
        .string()
        .describe('Repository in "owner/name" format, e.g. "facebook/react"'),
      prNumber: z.number().int().positive().describe("Pull request number"),
    },
  },
  async ({ repo, prNumber }) => {
    try {
      const summary = await summarizePullRequest(repo, prNumber);
      return {
        content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          { type: "text", text: `Failed to summarize ${repo}#${prNumber}: ${err.message}` },
        ],
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Tool 3: Internal API wrapper (service status/health)
// ---------------------------------------------------------------------------
server.registerTool(
  "internal_service_status",
  {
    title: "Internal API: Service Status",
    description:
      "Query the team's internal service-status API for a given service name (e.g. checkout-api, ssr-render-service) and return its health, version, uptime, and on-call owner.",
    inputSchema: {
      serviceName: z
        .string()
        .describe('Internal service identifier, e.g. "ssr-render-service"'),
      endpointPath: z
        .string()
        .optional()
        .describe('Sub-path to query, defaults to "status"'),
    },
  },
  async ({ serviceName, endpointPath }) => {
    try {
      const result = await callInternalApi(serviceName, endpointPath);
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (err: any) {
      return {
        isError: true,
        content: [
          { type: "text", text: `Failed to query internal API for ${serviceName}: ${err.message}` },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("eng-mcp-server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error starting eng-mcp-server:", err);
  process.exit(1);
});
