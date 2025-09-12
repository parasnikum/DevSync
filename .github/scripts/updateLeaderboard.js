const { Octokit } = require("@octokit/rest");
const { google } = require("googleapis");

const repo = process.env.GITHUB_REPO;
const [owner, repoName] = repo.split("/");
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

// Points mapping
const LEVEL_POINTS = {
  level1: 3,
  level2: 7,
  level3: 10,
};

async function fetchAllPRsAndIssues() {
  let contributors = {};

  // Fetch PRs
  const prs = await octokit.paginate(octokit.pulls.list, {
    owner,
    repo: repoName,
    state: "closed",
    per_page: 100,
  });

  prs.forEach(pr => {
    if (!pr.merged_at) return; // only merged PRs
    const labels = pr.labels.map(l => l.name.toLowerCase());
    const level = labels.find(l => l.startsWith("level"));
    if (!level) return;

    const points = LEVEL_POINTS[level] || 0;
    const user = pr.user.login;

    if (!contributors[user]) contributors[user] = { total: 0, items: [] };

    contributors[user].items.push({
      type: "PR",
      number: pr.number,
      url: pr.html_url,
      level,
      points,
    });
    contributors[user].total += points;
  });

  // Fetch Issues
  const issues = await octokit.paginate(octokit.issues.listForRepo, {
    owner,
    repo: repoName,
    state: "closed",
    per_page: 100,
  });

  issues.forEach(issue => {
    if (issue.pull_request) return; // skip PRs
    const labels = issue.labels.map(l => l.name.toLowerCase());
    const level = labels.find(l => l.startsWith("level"));
    if (!level) return;

    const points = LEVEL_POINTS[level] || 0;
    const user = issue.user.login;

    if (!contributors[user]) contributors[user] = { total: 0, items: [] };

    contributors[user].items.push({
      type: "Issue",
      number: issue.number,
      url: issue.html_url,
      level,
      points,
    });
    contributors[user].total += points;
  });

  return contributors;
}

async function updateGoogleSheet(contributors) {
  const auth = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    null,
    process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    ["https://www.googleapis.com/auth/spreadsheets"]
  );

  const sheets = google.sheets({ version: "v4", auth });

  // Prepare data for sheet
  let rows = [["Username", "Type", "Number", "Link", "Level", "Points", "Total Points"]];
  for (let [user, data] of Object.entries(contributors)) {
    data.items.forEach(item => {
      rows.push([
        user,
        item.type,
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

  console.log("✅ Leaderboard updated!");
}

(async () => {
  const contributors = await fetchAllPRsAndIssues();
  await updateGoogleSheet(contributors);
})();
