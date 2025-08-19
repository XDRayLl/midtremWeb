const API_KEY = "56ecb382ac6840e88df89ba626eb7004";
const TEAM_ID = 81; // Barcelona

async function testAPI() {
  const res = await fetch(`https://api.football-data.org/v4/teams/${TEAM_ID}/matches?status=SCHEDULED`, {
    headers: { "X-Auth-Token": API_KEY }
  });
  const data = await res.json();
  console.log(data); // 看瀏覽器 console，有沒有比賽資料
}

testAPI();