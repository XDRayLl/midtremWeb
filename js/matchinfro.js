// matchinfo.js
const TEAM_ID = "sr:competitor:2817"; // Barcelona
const API_BASE = "https://midtremweb.onrender.com/api"; // 後端 proxy
const CREST_BASE_URL = "https://api.sportradar.com"; // Sportradar 圖片根 URL
const PLACEHOLDER_CREST = "FC_Barcelona_(crest).png"; // 本地 fallback

async function loadMatches() {
  const res = await fetch(`${API_BASE}/barca/schedule`);
  if (!res.ok) {
    console.error("Proxy/API error:", res.status, await res.text());
    return;
  }
  const data = await res.json();
  const matches = data.schedules || [];

  const normalizedMatches = matches.map(m => {
    const ev = m.sport_event;
    const status = m.sport_event_status?.status || "scheduled";
    const home = ev.competitors.find(c => c.qualifier === "home");
    const away = ev.competitors.find(c => c.qualifier === "away");

    // 🔹 檢查 icon_path
    console.log("Home:", home?.name, home?.icon_path);
    console.log("Away:", away?.name, away?.icon_path);

    return {
      status: status === "closed" ? "FINISHED" : "SCHEDULED",
      utcDate: ev.start_time,
      competition: { name: ev.tournament?.name || "—" },
      venue: ev.venue?.name || "",
      homeTeam: {
        id: home?.id,
        name: home?.name,
        crest: getCrest(home)
      },
      awayTeam: {
        id: away?.id,
        name: away?.name,
        crest: getCrest(away)
      },
      score: {
        fullTime: {
          home: m.sport_event_status?.home_score ?? null,
          away: m.sport_event_status?.away_score ?? null
        }
      }
    };
  });

  const now = new Date();

  const pastMatches = normalizedMatches
    .filter(m => m.status === "FINISHED")
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 2);

  const futureMatches = normalizedMatches
    .filter(m => m.status === "SCHEDULED" && new Date(m.utcDate) > now)
    .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate));

  const nextMatch = futureMatches[0] || null;
  const upcoming = futureMatches.slice(1, 3);

  renderMatch("past1", pastMatches[0]);
  renderMatch("past2", pastMatches[1]);

  if (nextMatch) {
    renderMatch("next", nextMatch);
    startCountdown(new Date(nextMatch.utcDate)); // 啟動倒數
  } else {
    document.getElementById("next").innerHTML = "<p>No upcoming match</p>";
    document.getElementById("countdown").textContent = "";
  }

  renderMatch("future1", upcoming[0]);
  renderMatch("future2", upcoming[1]);
}

// 🔹 每隊隊徽獨立判斷
function getCrest(team) {
  if (!team?.icon_path) return PLACEHOLDER_CREST; // 沒圖用本地 placeholder
  if (team.icon_path.startsWith("http")) return team.icon_path; // 完整 URL
  try {
    return new URL(team.icon_path, CREST_BASE_URL).href; // 相對路徑拼 base URL
  } catch {
    return PLACEHOLDER_CREST;
  }
}

function renderMatch(elementId, match) {
  const el = document.getElementById(elementId);
  if (!el || !match) {
    if (el) el.innerHTML = "<p>No match data</p>";
    return;
  }

  const { homeTeam, awayTeam, utcDate, competition, venue, status, score } = match;
  const dateStr = new Date(utcDate).toLocaleString('en-US');

  const middle =
    status === "FINISHED" && score.fullTime.home != null && score.fullTime.away != null
      ? `<div class="score">${score.fullTime.home} - ${score.fullTime.away}</div>`
      : `<div class="vs">vs</div>`;

  el.innerHTML = `
    <div class="teams">
      <div class="team">
        <img src="${homeTeam.crest}" alt="${homeTeam.name} logo" onerror="this.src='${PLACEHOLDER_CREST}'">
        <div class="name">${homeTeam.name}</div>
      </div>
      ${middle}
      <div class="team">
        <img src="${awayTeam.crest}" alt="${awayTeam.name} logo" onerror="this.src='${PLACEHOLDER_CREST}'">
        <div class="name">${awayTeam.name}</div>
      </div>
    </div>
    <div class="meta">
      <div>Date: ${dateStr}</div>
      
      <div>Stadium: ${venue || (homeTeam.id === TEAM_ID ? "Home" : "Away")}</div>
    </div>
  `;
}

function startCountdown(matchDate) {
  const daysEl = document.getElementById("daysTime");
  const hoursEl = document.getElementById("hoursTime");
  const minsEl = document.getElementById("minsTime");
  const secsEl = document.getElementById("secsTime");

  const timer = setInterval(() => {
    const now = new Date();
    const diff = matchDate - now;

    if (diff <= 0) {
      clearInterval(timer);
      daysEl.textContent = hoursEl.textContent = minsEl.textContent = secsEl.textContent = "0";
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minsEl.textContent = mins;
    secsEl.textContent = secs;
  }, 1000);
}


loadMatches();
