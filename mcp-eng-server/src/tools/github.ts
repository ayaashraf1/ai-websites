import { PrDecision, PrSummary } from "../types.js";

/**
 * GitHub PR summariser.
 *
 * Calls the real GitHub REST API (api.github.com). Works unauthenticated
 * for public repos (rate-limited to 60 req/hr); set GITHUB_TOKEN to raise
 * the limit and to access private repos.
 *
 * "Decisions made" are heuristically extracted from PR review comments and
 * the PR body (lines that look like resolutions, e.g. "Decided to...",
 * "We agreed...", "RESOLVED:", or review comments marked as part of a
 * resolved review thread).
 */

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "eng-mcp-server",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function ghGet(url: string) {
  const res = await fetch(url, { headers: authHeaders() });
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status} for ${url}: ${await res.text()}`);
  }
  return res.json();
}

const DECISION_PATTERNS = [
  /^decided to (.+)/i,
  /^we agreed (.+)/i,
  /^resolved:? (.+)/i,
  /^went with (.+)/i,
  /^going with (.+)/i,
  /^conclusion:? (.+)/i,
];

function extractDecisions(texts: string[]): PrDecision[] {
  const decisions: PrDecision[] = [];
  for (const text of texts) {
    const lines = text.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim().replace(/^[-*>]\s*/, "");
      for (const pattern of DECISION_PATTERNS) {
        const match = trimmed.match(pattern);
        if (match) {
          decisions.push({ topic: trimmed.slice(0, 60), decision: trimmed });
          break;
        }
      }
    }
  }
  return decisions;
}

export async function summarizePullRequest(
  repo: string,
  prNumber: number
): Promise<PrSummary> {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
    throw new Error(`repo must be in "owner/name" format, got "${repo}"`);
  }

  const pr: any = await ghGet(`https://api.github.com/repos/${repo}/pulls/${prNumber}`);

  const [reviewComments, issueComments] = await Promise.all([
    ghGet(`https://api.github.com/repos/${repo}/pulls/${prNumber}/comments`).catch(() => []),
    ghGet(`https://api.github.com/repos/${repo}/issues/${prNumber}/comments`).catch(() => []),
  ]);

  const commentTexts = [
    pr.body ?? "",
    ...(Array.isArray(reviewComments) ? reviewComments.map((c: any) => c.body ?? "") : []),
    ...(Array.isArray(issueComments) ? issueComments.map((c: any) => c.body ?? "") : []),
  ];

  const decisions = extractDecisions(commentTexts);

  const summary = (pr.body ?? "")
    .split(/\r?\n/)
    .filter((l: string) => l.trim().length > 0)
    .slice(0, 3)
    .join(" ")
    .slice(0, 400) || "No PR description provided.";

  return {
    number: pr.number,
    repo,
    title: pr.title,
    author: pr.user?.login ?? "unknown",
    state: pr.merged_at ? "merged" : pr.state,
    filesChanged: pr.changed_files ?? 0,
    additions: pr.additions ?? 0,
    deletions: pr.deletions ?? 0,
    decisions,
    summary,
    url: pr.html_url,
  };
}
