// server.js
const express = require('express');
const cors = require('cors');

const API_KEY = '56ecb382ac6840e88df89ba626eb7004'; // 只放在後端
const PORT = 3000;

const app = express();

// 允許任何前端來源來呼叫這個代理（開發期方便）
app.use(cors());

app.get('/api/matches', async (req, res) => {
  const teamId = req.query.teamId || 81; // 預設 Barcelona
  const status = req.query.status || 'SCHEDULED,FINISHED';

  try {
    const url = `https://api.football-data.org/v4/teams/${teamId}/matches?status=${encodeURIComponent(status)}`;
    const r = await fetch(url, {
      headers: { 'X-Auth-Token': API_KEY }
    });
    const text = await r.text(); // 保留原始回應
    res.status(r.status).type(r.headers.get('content-type') || 'application/json').send(text);
  } catch (err) {
    res.status(500).json({ error: 'Proxy error', details: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running at http://localhost:${PORT}`);
});
