const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

//Endpoint to fetch weather securely
app.get("/weather", async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.OPENWEATHER_KEY;

  try {
    //Reverse geocode
    const geoRes = await fetch(
      `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`,
    );
    const geoData = await geoRes.json();
    const city = geoData[0].name;

    //Fetch weather
    const weatherRes = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`,
    );
    const weattherData = await weatherRes.json();

    res.json({
      city,
      temp: weattherData.main.temp,
      description: weattherData.weather[0].description,
      icon: weattherData.weather[0].icon,
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).json({ error: "Failed to fetch weather data" });
  }
});
