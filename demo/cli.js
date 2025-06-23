const { Command } = require("commander");
const Table = require("cli-table3");
const { WeatherSdk } = require("../src/core/WeatherSdk");
require("dotenv").config();

const program = new Command();
program
  .name("weather-demo")
  .description("Demo CLI for Weather SDK Pro")
  .version("1.0.0")
  .option("-c, --city <name>", "City name")
  .option("-m, --mode <mode>", "SDK mode: ON_DEMAND or POLLING", "ON_DEMAND")
  .option("-i, --interval <minutes>", "Polling interval (minutes)", "10");

program.parse(process.argv);
const options = program.opts();

async function test() {
  if (!options.city) {
    console.error("Please specify a city with -c or --city");
    process.exit(1);
  }

  const sdk = new WeatherSdk({
    apiKey: process.env.WEATHER_API_KEY,
    mode: options.mode,
    intervalMin: Number(options.interval),
  });

  try {
    const start = Date.now();
    const weather = await sdk.getCurrentWeather(options.city);
    const duration = Date.now() - start;

    const cacheHit = duration < 100;

    const table = new Table({
      head: [
        "City",
        "Weather",
        "Description",
        "Temp,°C",
        "Wind",
        "Sunrise",
        "Timezone",
        "Cache",
      ],
    });

    table.push([
      weather.city,
      weather.weather.main,
      weather.weather.description,
      weather.temperature,
      weather.windSpeed,
      new Date(weather.sunrise * 1000).toLocaleTimeString(),
      weather.timezone,
      cacheHit ? "HIT" : "MISS",
    ]);

    console.log(table.toString());
  } catch (error) {
    if (error.code) {
      console.error("WeatherSdkError:", error.code);
    } else {
      console.error("Unexpected error:", error);
    }
  } finally {
    sdk.dispose();
  }
}

test();
