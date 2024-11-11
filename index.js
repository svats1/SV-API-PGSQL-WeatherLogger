import express, { json } from "express";
import { createClient } from "@supabase/supabase-js";
import fetch from "node-fetch";

const app = express();
app.use(json());

// Environment variables (we'll set these in Replit's secrets)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to fetch weather data
async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    return {
        temperature: data.main.temp,
        city: city.toLowerCase(),
    };
}

// Endpoint to log weather for a city
app.post("/log-weather/:city", async (req, res) => {
    try {
        const city = req.params.city;
        const weatherData = await fetchWeatherData(city);

        const { data, error } = await supabase
            .from("weather_logs")
            .insert([weatherData]);

        if (error) throw error;
        res.json({ success: true, data: weatherData });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Endpoint to get weather history for a city
app.get("/weather/:city", async (req, res) => {
    try {
        res.json(await fetchWeatherData(req.params.city));

        if (error) throw error;
        res.json(data);
    } catch (error) {
        // res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
