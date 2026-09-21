import { InternalApiResult } from "../types.js";

/**
 * Internal API wrapper.
 *
 * Wraps a team's internal REST API (e.g. a service-health / deployment-status
 * endpoint) behind a single MCP tool so Copilot can query it by service name.
 *
 * Real mode: set INTERNAL_API_BASE_URL (and INTERNAL_API_TOKEN if the API is
 * authenticated). Calls GET {INTERNAL_API_BASE_URL}/services/{serviceName}/status.
 *
 * Mock mode: if INTERNAL_API_BASE_URL is unset, returns fixture data so this
 * is testable in any environment without exposing a real internal endpoint.
 * Swap MOCK_SERVICES / the base URL for your team's actual service registry.
 */

const MOCK_SERVICES: Record<string, unknown> = {
  "checkout-api": {
    status: "healthy",
    version: "3.4.1",
    uptimePct30d: 99.97,
    lastDeploy: "2026-09-18T14:22:00Z",
    onCall: "Layla Ibrahim",
  },
  "ssr-render-service": {
    status: "degraded",
    version: "1.9.0",
    uptimePct30d: 98.2,
    lastDeploy: "2026-09-20T09:05:00Z",
    onCall: "Aya Hassan",
    incident: "Elevated p95 latency (620ms) since 08:40 UTC, investigating cache layer.",
  },
  "search-api": {
    status: "healthy",
    version: "2.1.6",
    uptimePct30d: 99.99,
    lastDeploy: "2026-09-10T11:00:00Z",
    onCall: "Omar Farouk",
  },
};

export async function callInternalApi(
  serviceName: string,
  endpointPath = "status"
): Promise<InternalApiResult> {
  const baseUrl = process.env.INTERNAL_API_BASE_URL;

  if (baseUrl) {
    const token = process.env.INTERNAL_API_TOKEN;
    const url = `${baseUrl.replace(/\/$/, "")}/services/${encodeURIComponent(
      serviceName
    )}/${endpointPath.replace(/^\//, "")}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await res.json().catch(() => ({}));
    return {
      service: serviceName,
      endpoint: url,
      status: res.status,
      data,
    };
  }

  // Mock mode
  const data = MOCK_SERVICES[serviceName];
  if (!data) {
    return {
      service: serviceName,
      endpoint: `[mock] /services/${serviceName}/${endpointPath}`,
      status: 404,
      data: {
        error: `Unknown service "${serviceName}" in mock registry.`,
        knownServices: Object.keys(MOCK_SERVICES),
      },
    };
  }
  return {
    service: serviceName,
    endpoint: `[mock] /services/${serviceName}/${endpointPath}`,
    status: 200,
    data,
  };
}
