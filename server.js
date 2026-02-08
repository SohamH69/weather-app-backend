const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//Endpoint to fetch weather securely
app.get("/weather", async (req, res) => {
  const { lat, lon, city } = req.query;
  const apiKey = process.env.OPENWEATHER_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    let weatherUrl;
    if (lat && lon) {
      weatherUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`;
    } else if (city) {
      weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    } else {
      return res
        .status(400)
        .json({ error: "Please provide either lat/lon or city" });
    }

    const response = await fetch(weatherUrl);
    const data = await response.json();

    res.json({
      city: data.name || data[0].name,
      temp: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
