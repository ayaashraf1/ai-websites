# weather-service

A minimal Model Context Protocol (MCP) server with a single tool,
`get-weather`, that returns **mock** weather data for a given city name. No
API key or network access is required — the same city always returns the
same deterministic mock reading.

## Project structure

```text
WeatherService/
├── src/
│   ├── server.ts       # MCP server entry point and tool registration
│   └── mock-data.ts    # Deterministic mock weather data generator
├── package.json
├── tsconfig.json
└── .gitignore
```

## Setup

```bash
npm install
```

## Development

Run the server directly from TypeScript source with `tsx`:

```bash
npm run dev
```

## Build & Run

```bash
npm run build
npm start
```

The server communicates over **stdio**, so it is meant to be launched by an
MCP client (for example VS Code, Claude Desktop, or the MCP Inspector), not
run interactively on its own.

## Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector node dist/server.js
```

This opens a browser UI where you can call the `get-weather` tool directly,
for example with `{ "city": "London" }`.

## Registering with an MCP client

Example client configuration (e.g. VS Code `mcp.json` or Claude Desktop
config):

```json
{
  "mcpServers": {
    "weather-service": {
      "command": "node",
      "args": ["/absolute/path/to/WeatherService/dist/server.js"]
    }
  }
}
```

## Tool reference

### `get-weather`

Returns mock weather data for a city.

**Input**

| Field | Type   | Required | Description                 |
|-------|--------|----------|------------------------------|
| city  | string | yes      | Name of the city, e.g. "Paris" |

**Output**

```json
{
  "city": "Paris",
  "temperatureCelsius": 18,
  "condition": "Partly Cloudy",
  "humidityPercent": 54,
  "windSpeedKph": 12
}
```

## Notes

- Weather data is **mocked**: it is derived deterministically from the city
  name and does not reflect real conditions.
- Invalid or empty city names return a tool error (`isError: true`) instead
  of throwing.
