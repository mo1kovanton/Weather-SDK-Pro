const { WeatherSdkError } = require("../src/core/WeatherSdkError");
const { WeatherSdkErrorCode } = require("../src/types/errorCodes");

describe("WeatherSdkError", () => {
  test("should create error with code and message", () => {
    const error = new WeatherSdkError(WeatherSdkErrorCode.AUTH, "Auth error");
    expect(error.code).toBe(WeatherSdkErrorCode.AUTH);
    expect(error.message).toBe("Auth error");
    expect(error.name).toBe("WeatherSdkError");
  });
});
