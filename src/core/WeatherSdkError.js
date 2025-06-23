class WeatherSdkError extends Error {
  constructor(code, message, meta = {}) {
    super(message);
    this.name = "WeatherSdkError";
    this.code = code;
    this.meta = meta;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, WeatherSdkError);
    }
  }
}

module.exports = { WeatherSdkError };
