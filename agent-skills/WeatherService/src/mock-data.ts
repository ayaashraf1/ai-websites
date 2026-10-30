/**
 * Deterministic mock weather data generator.
 *
 * This keeps the MCP server self-contained for demos: no API key or network
 * call is required. Each city name is hashed to a stable set of values so the
 * same city always returns the same mock reading.
 */

export interface WeatherReading {
  [key: string]: unknown;
  city: string;
  temperatureCelsius: number;
  condition: string;
  humidityPercent: number;
  windSpeedKph: number;
}

const CONDITIONS = [
  "Sunny",
  "Partly Cloudy",
  "Cloudy",
  "Light Rain",
  "Thunderstorms",
  "Snow",
  "Windy",
  "Foggy",
] as const;

// Simple string hash (djb2) so output is deterministic per city name.
function hashString(value: string): number {
  let hash = 5381;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function getMockWeather(city: string): WeatherReading {
  const normalized = city.trim().toLowerCase();
  const hash = hashString(normalized);

  const temperatureCelsius = (hash % 45) - 10; // -10°C to 34°C
  const condition = CONDITIONS[hash % CONDITIONS.length];
  const humidityPercent = 20 + (Math.floor(hash / 7) % 71); // 20% to 90%
  const windSpeedKph = Math.floor(hash / 13) % 61; // 0 to 60 kph

  return {
    city: city.trim(),
    temperatureCelsius,
    condition,
    humidityPercent,
    windSpeedKph,
  };
}
