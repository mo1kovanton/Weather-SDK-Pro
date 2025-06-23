const { WeatherSdk } = require("../src/core/WeatherSdk");
const { WeatherSdkError } = require("../src/core/WeatherSdkError");
const { WeatherSdkErrorCode } = require("../src/types/errorCodes");

describe("WeatherSdk constructor", () => {
  test("throws AUTH error if apiKey is missing", () => {
    expect(() => new WeatherSdk({})).toThrow(WeatherSdkError);
    expect(() => new WeatherSdk({})).toThrow(
      expect.objectContaining({ code: WeatherSdkErrorCode.AUTH })
    );
  });
});
