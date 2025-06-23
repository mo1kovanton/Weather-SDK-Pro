const nock = require("nock");
const { WeatherSdk } = require("../src/core/WeatherSdk");

describe("WeatherSdk integration", () => {
  const apiKey = "test-api-key";
  const city = "TestCity";

  afterEach(() => {
    nock.cleanAll();
  });

  test("fetches weather and caches it", async () => {
    const mockResponse = {
      name: city,
      weather: [{ main: "Clear", description: "clear sky" }],
      main: { temp: 25 },
      wind: { speed: 5 },
      dt: 1234567890,
      sys: { sunrise: 1234560000 },
      timezone: 3600,
    };

    nock("https://api.openweathermap.org")
      .get("/data/2.5/weather")
      .query(true)
      .reply(200, mockResponse);

    const sdk = new WeatherSdk({ apiKey, mode: "ON_DEMAND" });
    const weather = await sdk.getCurrentWeather(city);

    expect(weather.city).toBe(city);
    expect(weather.weather.main).toBe("Clear");

    const cached = await sdk.getCurrentWeather(city);
    expect(cached).toEqual(weather);
  });

  test("updates cache via _pollCache (POLLING mode)", async () => {
    const mockResponse = {
      name: city,
      weather: [{ main: "Rain", description: "rainy" }],
      main: { temp: 18 },
      wind: { speed: 3 },
      dt: 1234567890,
      sys: { sunrise: 1234560000 },
      timezone: 3600,
    };

    nock("https://api.openweathermap.org")
      .get("/data/2.5/weather")
      .query(true)
      .times(2)
      .reply(200, mockResponse);

    const sdk = new WeatherSdk({ apiKey, mode: "POLLING", intervalMin: 1 });

    const weather = await sdk.getCurrentWeather(city);
    expect(weather.weather.main).toBe("Rain");

    await sdk.pollCache();

    const cached = sdk.cache.getFromCache(city.toLowerCase());
    expect(cached.weather.main).toBe("Rain");

    sdk.dispose();
  });
});
