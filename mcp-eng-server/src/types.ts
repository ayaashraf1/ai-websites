export interface JiraTicket {
  key: string;
  title: string;
  description: string;
  status: string;
  assignee: string;
  priority?: string;
  url?: string;
}

export interface PrDecision {
  topic: string;
  decision: string;
}

export interface PrSummary {
  number: number;
  repo: string;
  title: string;
  author: string;
  state: string;
  filesChanged: number;
  additions: number;
  deletions: number;
  decisions: PrDecision[];
  summary: string;
  url: string;
}

export interface InternalApiResult {
  service: string;
  endpoint: string;
  status: number;
  data: unknown;
}
