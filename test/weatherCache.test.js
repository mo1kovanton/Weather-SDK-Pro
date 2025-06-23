const { WeatherCache } = require("../src/cache/weatherCache");

describe("WeatherCache", () => {
  let cache;

  beforeEach(() => {
    cache = new WeatherCache(3, 1);
  });

  test("stores and retrieves values", () => {
    cache.setToCache("key1", "value1");
    expect(cache.getFromCache("key1")).toBe("value1");
  });

  test("returns null for missing keys", () => {
    expect(cache.getFromCache("missing")).toBeNull();
  });

  test("evicts least recently used items", () => {
    cache.setToCache("key1", "value1");
    cache.setToCache("key2", "value2");
    cache.setToCache("key3", "value3");
    cache.setToCache("key4", "value4");
    expect(cache.getFromCache("key1")).toBeNull();
    expect(cache.getFromCache("key2")).toBe("value2");
    expect(cache.getFromCache("key3")).toBe("value3");
    expect(cache.getFromCache("key4")).toBe("value4");
  });

  test("expires items after TTL", (done) => {
    cache.setToCache("key1", "value1");
    setTimeout(() => {
      expect(cache.getFromCache("key1")).toBeNull();
      done();
    }, 1100);
  });
});
