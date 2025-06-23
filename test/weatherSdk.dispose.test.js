const { WeatherSdk } = require("../src/core/WeatherSdk");

describe("WeatherSdk dispose", () => {
  test("does not throw if called without scheduler", () => {
    const sdk = new WeatherSdk({ apiKey: "test-key", mode: "ON_DEMAND" });
    expect(() => sdk.dispose()).not.toThrow();
  });
});
