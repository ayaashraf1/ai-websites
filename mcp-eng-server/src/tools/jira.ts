import { JiraTicket } from "../types.js";

/**
 * Jira ticket lookup.
 *
 * Real mode: set JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN env vars and this
 * calls the real Jira Cloud REST API (GET /rest/api/3/issue/{key}).
 *
 * Mock mode: if those env vars are absent, returns data from an in-memory
 * fixture so the tool is fully testable without real credentials. This is
 * what the bundled test suite exercises.
 */

const MOCK_TICKETS: Record<string, JiraTicket> = {
  "ENG-1421": {
    key: "ENG-1421",
    title: "SSR hydration mismatch on product detail page",
    description:
      "Users on slow connections see a flash of unstyled content and a React hydration warning on /product/[id]. Likely caused by a client-only Date.now() call in the price banner component.",
    status: "In Progress",
    assignee: "Aya Hassan",
    priority: "High",
    url: "https://example.atlassian.net/browse/ENG-1421",
  },
  "ENG-1388": {
    key: "ENG-1388",
    title: "Migrate legacy getInitialProps pages to app router",
    description:
      "Remaining pages under /pages still use getInitialProps, blocking full adoption of React Server Components. Needs incremental migration plan.",
    status: "To Do",
    assignee: "Unassigned",
    priority: "Medium",
    url: "https://example.atlassian.net/browse/ENG-1388",
  },
  "ENG-1502": {
    key: "ENG-1502",
    title: "Add rate limiting to internal search API",
    description:
      "Internal search API has no rate limiting, causing occasional spikes to degrade latency for other consumers.",
    status: "Done",
    assignee: "Omar Farouk",
    priority: "Medium",
    url: "https://example.atlassian.net/browse/ENG-1502",
  },
};

export async function getJiraTicket(ticketId: string): Promise<JiraTicket> {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const token = process.env.JIRA_API_TOKEN;

  if (baseUrl && email && token) {
    const auth = Buffer.from(`${email}:${token}`).toString("base64");
    const res = await fetch(
      `${baseUrl}/rest/api/3/issue/${encodeURIComponent(ticketId)}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );
    if (!res.ok) {
      throw new Error(`Jira API error ${res.status}: ${await res.text()}`);
    }
    const data: any = await res.json();
    return {
      key: data.key,
      title: data.fields?.summary ?? "",
      description:
        typeof data.fields?.description === "string"
          ? data.fields.description
          : extractPlainTextFromADF(data.fields?.description),
      status: data.fields?.status?.name ?? "Unknown",
      assignee: data.fields?.assignee?.displayName ?? "Unassigned",
      priority: data.fields?.priority?.name,
      url: `${baseUrl}/browse/${data.key}`,
    };
  }

  // Mock mode
  const ticket = MOCK_TICKETS[ticketId.toUpperCase()];
  if (!ticket) {
    throw new Error(
      `[mock mode] Unknown ticket "${ticketId}". Known mock tickets: ${Object.keys(
        MOCK_TICKETS
      ).join(", ")}. Set JIRA_BASE_URL/JIRA_EMAIL/JIRA_API_TOKEN to hit real Jira.`
    );
  }
  return ticket;
}

// Very small Atlassian Document Format -> plain text extractor for description fields.
function extractPlainTextFromADF(node: any): string {
  if (!node) return "";
  if (typeof node === "string") return node;
  let text = "";
  if (node.type === "text" && typeof node.text === "string") {
    text += node.text;
  }
  if (Array.isArray(node.content)) {
    for (const child of node.content) {
      text += extractPlainTextFromADF(child);
      if (child.type === "paragraph") text += "\n";
    }
  }
  return text.trim();
}
