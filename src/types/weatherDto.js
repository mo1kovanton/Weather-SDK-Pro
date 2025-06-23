function weatherDto(data) {
  data = data || {};
  return {
    city: data.name,
    weather: {
      main: data.weather?.[0]?.main || "",
      description: data.weather?.[0]?.description || "",
    },
    temperature: data.main?.temp,
    windSpeed: data.wind?.speed,
    sunrise: data.sys?.sunrise,
    timezone: data.timezone,
  };
}

module.exports = { weatherDto };
