const { weatherDto } = require("../src/types/weatherDto");

describe("weatherDto", () => {
  test("returns default values for missing fields", () => {
    const result = weatherDto({});
    expect(result.city).toBeUndefined();
    expect(result.weather).toEqual({ main: "", description: "" });
    expect(result.temperature).toBeUndefined();
  });

  test("handles null input gracefully", () => {
    const result = weatherDto(null);
    expect(result).toEqual({
      city: undefined,
      weather: { main: "", description: "" },
      temperature: undefined,
      windSpeed: undefined,
      sunrise: undefined,
      timezone: undefined,
    });
  });
});
