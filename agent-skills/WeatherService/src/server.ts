#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getMockWeather } from "./mock-data.js";

const server = new McpServer({
  name: "weather-service",
  version: "1.0.0",
});

const getWeatherInputSchema = {
  city: z
    .string()
    .trim()
    .min(1, "City name must not be empty")
    .describe("The name of the city to get mock weather data for, e.g. 'London'"),
};

const getWeatherOutputSchema = {
  city: z.string(),
  temperatureCelsius: z.number(),
  condition: z.string(),
  humidityPercent: z.number(),
  windSpeedKph: z.number(),
};

server.registerTool(
  "get-weather",
  {
    title: "Get Weather",
    description:
      "Returns mock weather data (temperature, condition, humidity, wind speed) for a given city name. " +
      "Data is deterministic but not real; use for demos and testing only.",
    inputSchema: getWeatherInputSchema,
    outputSchema: getWeatherOutputSchema,
  },
  async ({ city }) => {
    try {
      const weather = getMockWeather(city);

      return {
        content: [
          {
            type: "text",
            text: `Weather for ${weather.city}: ${weather.temperatureCelsius}°C, ${weather.condition}, ` +
              `${weather.humidityPercent}% humidity, ${weather.windSpeedKph} kph wind.`,
          },
        ],
        structuredContent: weather,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      return {
        content: [{ type: "text", text: `Failed to get weather: ${message}` }],
        isError: true,
      };
    }
  }
);

async function main(): Promise<void> {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("weather-service MCP server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error starting weather-service MCP server:", error);
  process.exit(1);
});
