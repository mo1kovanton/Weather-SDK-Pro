const nock = require("nock");
const { receiveCurrentWeather } = require("../src/http/weatherHttpClient");
const { WeatherSdkError } = require("../src/core/WeatherSdkError");
const { WeatherSdkErrorCode } = require("../src/types/errorCodes");
const axios = require("axios");

describe("receiveCurrentWeather", () => {
  const apiKey = "test-api-key";
  const city = "TestCity";
  const url = "https://api.openweathermap.org";

  afterEach(() => {
    nock.cleanAll();
    jest.restoreAllMocks();
  });

  test("returns weather DTO on success", async () => {
    const mockResponse = {
      name: city,
      weather: [{ main: "Clear", description: "clear sky" }],
      main: { temp: 25 },
      wind: { speed: 5 },
      dt: 1234567890,
      sys: { sunrise: 1234560000 },
      timezone: 3600,
    };

    nock(url).get("/data/2.5/weather").query(true).reply(200, mockResponse);

    const result = await receiveCurrentWeather(city, apiKey);
    expect(result.city).toBe(city);
    expect(result.weather.main).toBe("Clear");
    expect(result.temperature).toBe(25);
  });

  test("throws AUTH error on 401", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      const error = new Error("Request failed with status code 401");
      error.response = { status: 401 };
      throw error;
    });

    await expect(receiveCurrentWeather(city, apiKey)).rejects.toThrow(
      WeatherSdkError
    );
    await expect(receiveCurrentWeather(city, apiKey)).rejects.toHaveProperty(
      "code",
      WeatherSdkErrorCode.AUTH
    );
  });

  test("throws QUOTA error on 429", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      const error = new Error("Request failed with status code 429");
      error.response = { status: 429 };
      throw error;
    });

    await expect(receiveCurrentWeather(city, apiKey)).rejects.toThrow(
      WeatherSdkError
    );
    await expect(receiveCurrentWeather(city, apiKey)).rejects.toHaveProperty(
      "code",
      WeatherSdkErrorCode.QUOTA
    );
  });

  test("throws NETWORK error on 404", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      const error = new Error("Request failed with status code 404");
      error.response = { status: 404 };
      throw error;
    });

    await expect(receiveCurrentWeather(city, apiKey)).rejects.toThrow(
      WeatherSdkError
    );
    await expect(receiveCurrentWeather(city, apiKey)).rejects.toHaveProperty(
      "code",
      WeatherSdkErrorCode.NETWORK
    );
  });

  test("throws NETWORK error on network failure", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      const error = new Error("Network error");
      error.request = {};
      throw error;
    });

    await expect(receiveCurrentWeather(city, apiKey)).rejects.toThrow(
      WeatherSdkError
    );
    await expect(receiveCurrentWeather(city, apiKey)).rejects.toHaveProperty(
      "code",
      WeatherSdkErrorCode.NETWORK
    );
  });

  test("throws UNKNOWN error on unexpected error", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      throw new Error("Unexpected");
    });

    await expect(receiveCurrentWeather(city, apiKey)).rejects.toThrow(
      WeatherSdkError
    );
    await expect(receiveCurrentWeather(city, apiKey)).rejects.toHaveProperty(
      "code",
      WeatherSdkErrorCode.UNKNOWN
    );
  });

  test("throws NETWORK error on unhandled HTTP status (e.g., 500)", async () => {
    jest.spyOn(axios, "get").mockImplementation(() => {
      const error = new Error("Request failed with status code 500");
      error.response = { status: 500 };
      throw error;
    });

    await expect(receiveCurrentWeather(city, apiKey)).rejects.toThrow(
      WeatherSdkError
    );
    await expect(receiveCurrentWeather(city, apiKey)).rejects.toHaveProperty(
      "code",
      WeatherSdkErrorCode.NETWORK
    );
  });
});
