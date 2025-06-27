# Weather-SDK-Pro

🛰️ **Weather SDK Pro — Кросс-языковая библиотека для доступа к погодному API**

Weather SDK Pro — учебный проект, реализующий SDK для работы с публичным погодным REST API (по умолчанию OpenWeather). Проект демонстрирует современные практики разработки модульных npm-пакетов, работы с сетью, кэшированием, обработкой ошибок и автоматическим тестированием на стеке Node.js + JavaScript.

---

## ⚙️ Технологии

- **Язык:** JavaScript (ES2022), Node.js 20 LTS
- **HTTP-клиент:** Axios
- **Кэш:** lru-cache (LRU с TTL)
- **Планировщик:** setInterval + AbortController
- **CLI:** commander, cli-table3
- **Тесты:** Jest + @jest/globals (coverage ≥ 80%)
- **Документация:** JSDoc, README (EN/RU)
- **CI/CD:** GitHub Actions
- **Лицензия:** MIT

---
**Клонируйте репозиторий:**
git clone https://github.com/mo1kovanton/Weather-SDK-Pro

**Установите зависимости:**

3. **Переименуйте файл `.env.example` в `.env` и добавьте свой OpenWeather API-ключ:**

## 🧩 Основные возможности
- Простая инициализация:
const { WeatherSdk } = require("weather-sdk-pro");
const sdk = new WeatherSdk({
apiKey: process.env.WEATHER_API_KEY,
mode: "ON_DEMAND", // или "POLLING"
intervalMin: 10 // интервал обновления кэша (минуты)
});
