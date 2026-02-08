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
    let resolvedCity = city;
    if (!resolvedCity && lat && lon) {
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`,
      );
      const geoData = await geoRes.json();
      resolvedCity = geoData[0]?.name;
    }

    if (!resolvedCity) {
      return res
        .status(400)
        .json({ error: "City name or valid coordinates required" });
    }

    //Fetch weather by resolved city name
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${resolvedCity}&units=metric&appid=${apiKey}`,
    );
    const data = await weatherRes.json();
    res.json({
      city: data.name || data[0].name,
      temp: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      wind: data.wind.speed,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
