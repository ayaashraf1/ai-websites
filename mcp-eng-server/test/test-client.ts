import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

async function run() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["dist/src/index.js"],
    // Inherit the parent environment (Jira/GitHub/internal API credentials,
    // TLS/proxy config, etc). VS Code's MCP client does this automatically;
    // when spawning manually it must be passed explicitly.
    env: { ...(process.env as Record<string, string>) },
  });

  const client = new Client({ name: "eng-mcp-server-test-client", version: "1.0.0" });
  await client.connect(transport);

  const tools = await client.listTools();
  console.log("=== Registered tools ===");
  for (const t of tools.tools) console.log(`- ${t.name}: ${t.description}`);
  console.log();

  const queries: { label: string; name: string; args: Record<string, unknown> }[] = [
    {
      label: "Query 1 - Jira lookup (mock fixture)",
      name: "jira_get_ticket",
      args: { ticketId: "ENG-1421" },
    },
    {
      label: "Query 2 - Jira lookup, unknown ticket (error path)",
      name: "jira_get_ticket",
      args: { ticketId: "ENG-9999" },
    },
    {
      label: "Query 3 - GitHub PR summary (real public PR: facebook/react #31445)",
      name: "github_summarize_pr",
      args: { repo: "facebook/react", prNumber: 31445 },
    },
    {
      label: "Query 4 - Internal API, healthy service (mock fixture)",
      name: "internal_service_status",
      args: { serviceName: "checkout-api" },
    },
    {
      label: "Query 5 - Internal API, degraded service (mock fixture)",
      name: "internal_service_status",
      args: { serviceName: "ssr-render-service" },
    },
  ];

  for (const q of queries) {
    console.log(`=== ${q.label} ===`);
    console.log(`tool: ${q.name}  args: ${JSON.stringify(q.args)}`);
    try {
      const result = await client.callTool({ name: q.name, arguments: q.args });
      const text = Array.isArray(result.content)
        ? result.content.map((c: any) => c.text ?? "").join("\n")
        : "";
      console.log(result.isError ? "[TOOL ERROR]" : "[OK]");
      console.log(text);
    } catch (err: any) {
      console.log("[CLIENT ERROR]", err.message);
    }
    console.log();
  }

  await client.close();
}

run().catch((err) => {
  console.error("Test run failed:", err);
  process.exit(1);
});
