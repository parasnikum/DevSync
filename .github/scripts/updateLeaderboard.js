const { getOctokit } = require("@actions/github");
const { google } = require("googleapis");

const repo = process.env.GITHUB_REPO;
const [owner, repoName] = repo.split("/");
const octokit = getOctokit(process.env.GITHUB_TOKEN);

// Points mapping
const LEVEL_POINTS = {
  level1: 3,
  level2: 7,
  level3: 10,
};

async function fetchAllPRs() {
  let contributors = {};

  // Fetch all closed PRs
  const prs = await octokit.paginate(octokit.rest.pulls.list, {
    owner,
    repo: repoName,
    state: "closed",
    per_page: 100,
  });

  prs.forEach(pr => {
    if (!pr.merged_at) return; // only merged PRs

    // Normalize label names to lowercase
    const labels = pr.labels.map(l => l.name.toLowerCase());

    // Find label like "level1" or "level-1"
    let level = labels.find(l => l.startsWith("level"));
    if (!level) return;

    // Normalize "level-1" → "level1"
    level = level.replace("-", "");

    const points = LEVEL_POINTS[level] || 0;
    const user = pr.user.login;

    if (!contributors[user]) contributors[user] = { total: 0, items: [] };

    contributors[user].items.push({
      number: pr.number,
      url: pr.html_url,
      level,
      points,
    });
    contributors[user].total += points;
  });

  return contributors;
}

async function updateGoogleSheet(contributors) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS || "./credentials.json",
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Prepare rows for sheet
  let rows = [["Username", "PR Number", "Link", "Level", "Points", "Total Points"]];
  for (let [user, data] of Object.entries(contributors)) {
    data.items.forEach(item => {
      rows.push([
        user,
        item.number,
        item.url,
        item.level,
        item.points,
        data.total,
      ]);
    });
  }

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: { values: rows },
  });

  console.log("✅ PR Leaderboard updated!");
}

(async () => {
  const contributors = await fetchAllPRs();
  await updateGoogleSheet(contributors);
})();
