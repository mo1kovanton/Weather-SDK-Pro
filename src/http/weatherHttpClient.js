const axios = require("axios");
const { WeatherSdkError } = require("../core/WeatherSdkError");
const { WeatherSdkErrorCode } = require("../types/errorCodes");
const { weatherDto } = require("../types/weatherDto");

async function receiveCurrentWeather(cityName, apiKey) {
  const url = "https://api.openweathermap.org/data/2.5/weather";
  try {
    const response = await axios.get(url, {
      params: {
        q: cityName,
        appid: apiKey,
        units: "metric",
      },
      timeout: 5000,
    });
    return weatherDto(response.data);
  } catch (error) {
    if (error.response) {
      const resStatus = error.response.status;
      if (resStatus === 401) {
        throw new WeatherSdkError(WeatherSdkErrorCode.AUTH, "Invalid API key", {
          resStatus,
        });
      } else if (resStatus === 429) {
        throw new WeatherSdkError(
          WeatherSdkErrorCode.QUOTA,
          "API quota exceeded",
          { resStatus }
        );
      } else if (resStatus === 404) {
        throw new WeatherSdkError(
          WeatherSdkErrorCode.NETWORK,
          "City not found",
          { resStatus }
        );
      } else {
        throw new WeatherSdkError(WeatherSdkErrorCode.NETWORK, "API error", {
          resStatus,
        });
      }
    } else if (error.request) {
      throw new WeatherSdkError(
        WeatherSdkErrorCode.NETWORK,
        "No response from API",
        { error }
      );
    } else {
      throw new WeatherSdkError(WeatherSdkErrorCode.UNKNOWN, error.message, {
        error,
      });
    }
  }
}

module.exports = { receiveCurrentWeather };
