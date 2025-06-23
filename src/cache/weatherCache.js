const { LRUCache } = require("lru-cache");

class WeatherCache {
  constructor(maxSize = 10, ttlSeconds = 600) {
    this.cache = new LRUCache({
      max: maxSize,
      ttl: ttlSeconds * 1000,
    });
  }

  getFromCache(key) {
    return this.cache.get(key) || null;
  }

  setToCache(key, value) {
    this.cache.set(key, value);
  }

  cacheSize() {
    return this.cache.size;
  }

  getAllKeys() {
    return this.cache.keys();
  }
}

module.exports = { WeatherCache };
