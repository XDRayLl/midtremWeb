import express from "express";
import cors from "cors";

const app = express();
const PORT = 3000;

app.use(cors()); // ⭐ 開放所有來源存取

// ⚠️ 換成你自己的 Sportradar API KEY
const API_KEY = "kI3HDbMkWOHmvxYCgWu81gcCBOXTDJ3EVeMVyo0D";
const TEAM_ID = "sr:competitor:2817";

app.get("/api/barca/schedule", async (req, res) => {
  try {
    const url = `https://api.sportradar.com/soccer/trial/v4/en/competitors/${TEAM_ID}/schedules.json?api_key=${API_KEY}`;
    console.log("➡️ Fetching from Sportradar:", url);

    const response = await fetch(url);
    console.log("Sportradar status:", response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ Sportradar error:", errText);
      return res.status(response.status).send(errText);
    }

    const data = await response.json();
    console.log("✅ Successfully fetched schedule");
    res.json(data);
  } catch (err) {
    console.error("💥 Proxy crashed:", err);
    res.status(500).json({ error: err.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
