const API_KEY = "56ecb382ac6840e88df89ba626eb7004"; 
const TEAM_ID = 81; // Barcelona

async function loadMatches() {
  const res = await fetch(
    `https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED,FINISHED`, 
    { headers: { "X-Auth-Token": API_KEY } }
  );
  const data = await res.json();
  const matches = data.matches;

  const pastMatches = matches.filter(m => m.status === "FINISHED").slice(-2);
  const futureMatches = matches.filter(m => m.status === "SCHEDULED");
  const nextMatch = futureMatches[0];
  const upcoming = futureMatches.slice(1, 3);

  renderMatch("past1", pastMatches[0]);
  renderMatch("past2", pastMatches[1]);

  renderMatch("next", nextMatch);
  startCountdown(new Date(nextMatch.utcDate));

  renderMatch("future1", upcoming[0]);
  renderMatch("future2", upcoming[1]);
}

function renderMatch(elementId, match) {
  const el = document.getElementById(elementId);

  if (!match) {
    el.innerHTML = "No match data";
    return;
  }

  // 判斷主客場
  const isHome = match.homeTeam.id === TEAM_ID;
  const barca = isHome ? match.homeTeam : match.awayTeam;
  const opponent = isHome ? match.awayTeam : match.homeTeam;

  el.innerHTML = `
    <div>
      ${isHome 
        ? `<img src="${barca.crest}" alt="Barcelona logo"> vs <img src="${opponent.crest}" alt="${opponent.name} logo">`
        : `<img src="${opponent.crest}" alt="${opponent.name} logo"> vs <img src="${barca.crest}" alt="Barcelona logo">`
      }
    </div>
    <p>${barca.name} vs ${opponent.name}</p>
    <p>Date: ${new Date(match.utcDate).toLocaleString()}</p>
    <p>League: ${match.competition.name}</p>
    <p>Stadium: ${match.venue || "Unknown"}</p>
  `;
}

function startCountdown(matchDate) {
  setInterval(() => {
    const now = new Date();
    const diff = matchDate - now;
    if (diff <= 0) {
      document.getElementById("countdown").innerText = "Match started!";
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff / (1000*60*60)) % 24);
    const mins = Math.floor((diff / (1000*60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);
    document.getElementById("countdown").innerText =
      `${days}d ${hours}h ${mins}m ${secs}s`;
  }, 1000);
}

loadMatches();
