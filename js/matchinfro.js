// script.js
const TEAM_ID = 81; // Barcelona
const API_BASE = 'http://localhost:3000/api'; // 代理位址

async function loadMatches() {
  const res = await fetch(`${API_BASE}/matches?teamId=${TEAM_ID}&status=SCHEDULED,FINISHED`);
  if (!res.ok) {
    console.error('Proxy/API error:', res.status, await res.text());
    return;
  }
  const data = await res.json();
  const matches = data.matches || [];

  const pastMatches = matches.filter(m => m.status === 'FINISHED').slice(-2);
  const futureMatches = matches.filter(m => m.status === 'SCHEDULED');
  const nextMatch = futureMatches[0] || null;
  const upcoming = futureMatches.slice(1, 3);

  renderMatch('past1', pastMatches[0]);
  renderMatch('past2', pastMatches[1]);

  if (nextMatch) {
    renderMatch('next', nextMatch);
    startCountdown(new Date(nextMatch.utcDate));
  } else {
    document.getElementById('next').innerHTML = '<p>No upcoming match</p>';
  }

  renderMatch('future1', upcoming[0]);
  renderMatch('future2', upcoming[1]);
}

function renderMatch(elementId, match) {
  const el = document.getElementById(elementId);
  if (!el || !match) {
    if (el) el.innerHTML = '<p>No match data</p>';
    return;
  }

  const isHome = match.homeTeam.id === TEAM_ID;
  const leftTeam = isHome ? match.homeTeam : match.awayTeam;   // 左邊：主場/客場決定
  const rightTeam = isHome ? match.awayTeam : match.homeTeam;  // 右邊：另一隊

  const dateStr = new Date(match.utcDate).toLocaleString();
  const league = match.competition?.name || '—';
  const venue = match.venue || (isHome ? 'Home' : 'Away');

  el.innerHTML = `
    <div class="teams">
      <div class="team">
        <img src="${leftTeam.crest || ''}" alt="${leftTeam.name} logo">
        <div class="name">${leftTeam.name}</div>
      </div>
      <div class="vs">vs</div>
      <div class="team">
        <img src="${rightTeam.crest || ''}" alt="${rightTeam.name} logo">
        <div class="name">${rightTeam.name}</div>
      </div>
    </div>
    <div class="meta">
      <div>Date: ${dateStr}</div>
      <div>League: ${league}</div>
      <div>Stadium: ${venue}</div>
    </div>
  `;
}

function startCountdown(matchDate) {
  const target = document.getElementById('countdown');
  if (!target) return;

  const timer = setInterval(() => {
    const now = new Date();
    const diff = matchDate - now;
    if (diff <= 0) {
      clearInterval(timer);
      target.textContent = 'Match started!';
      return;
    }
    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);
    target.textContent = `${days}d ${hours}h ${mins}m ${secs}s`;
  }, 1000);
}

loadMatches();
