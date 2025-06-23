const { WeatherCache } = require("../cache/weatherCache");
const { receiveCurrentWeather } = require("../http/weatherHttpClient");
const { WeatherScheduler } = require("../scheduler/WeatherScheduler");
const { WeatherSdkError } = require("../core/WeatherSdkError");
const { WeatherSdkErrorCode } = require("../types/errorCodes");

class WeatherSdk {
  constructor({ apiKey, mode = "ON_DEMAND", intervalMin = 10 }) {
    if (!apiKey) {
      throw new WeatherSdkError(
        WeatherSdkErrorCode.AUTH,
        "API key is required"
      );
    }
    this.apiKey = apiKey;
    this.mode = mode;
    this.intervalMin = intervalMin;
    this.cache = new WeatherCache(10, 600);
    this.scheduler = null;
    if (this.mode === "POLLING") {
      this.scheduler = new WeatherScheduler({
        intervalMin: this.intervalMin,
        task: this.pollCache.bind(this),
      });
      this.scheduler.start();
    }
  }

  async getCurrentWeather(cityName) {
    const cacheKey = cityName.toLowerCase();
    const cached = this.cache.getFromCache(cacheKey);
    if (cached) {
      return cached;
    }
    const weatherDto = await receiveCurrentWeather(cityName, this.apiKey);
    this.cache.setToCache(cacheKey, weatherDto);
    return weatherDto;
  }

  async pollCache() {
    const keys = this.cache.getAllKeys();
    for (const key of keys) {
      try {
        const weatherDto = await receiveCurrentWeather(key, this.apiKey);
        this.cache.setToCache(key, weatherDto);
      } catch (err) {
        if (err instanceof WeatherSdkError) {
          console.error("WeatherSdkError: ", err.code);
        } else {
          console.error("Unexpected error: ", err);
        }
      }
    }
  }

  dispose() {
    if (this.scheduler) {
      this.scheduler.dispose();
    }
  }
}

module.exports = { WeatherSdk };
