// .github/scripts/updateLeaderboard.js
const { Octokit } = require("@octokit/rest");
const { google } = require("googleapis");

const repoFull = process.env.GITHUB_REPOSITORY || "your-org/your-repo"; // override if needed
const [repoOwner, repoName] = repoFull.split("/");

// Points by level
const LEVEL_POINTS = {
  "level-1": 3,
  "level-2": 7,
  "level-3": 10,
};

function extractLevelFromLabel(labelName) {
  // Normalize and try to extract "level-N" where N is 1/2/3 etc.
  if (!labelName) return null;
  const m = labelName.match(/level[\s\-_.]?(\d+)/i);
  if (m && m[1]) {
    return `level-${m[1]}`;
  }
  return null;
}

async function fetchAllPRs(octokit) {
  return await octokit.paginate(octokit.rest.pulls.list, {
    owner: repoOwner,
    repo: repoName,
    state: "closed",
    per_page: 100,
  });
}

async function fetchAllIssues(octokit) {
  return await octokit.paginate(octokit.rest.issues.listForRepo, {
    owner: repoOwner,
    repo: repoName,
    state: "closed",
    per_page: 100,
  });
}

async function buildLeaderboard() {
  const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

  const contributors = {}; // username -> { prs:[], issues:[], prPoints, issuePoints, levels:Set }

  const prs = await fetchAllPRs(octokit);
  for (const pr of prs) {
    // check that it has gssoc label (case-insensitive)
    const labels = pr.labels || [];
    const hasGssoc = labels.some((l) =>
      String(l.name).toLowerCase().includes("gssoc")
    );
    if (!hasGssoc) continue;

    const username = pr.user?.login || "unknown";
    if (!contributors[username]) {
      contributors[username] = {
        prs: [],
        issues: [],
        prPoints: 0,
        issuePoints: 0,
        levels: new Set(),
      };
    }

    // Find best level label for this PR (pick highest if multiple)
    let prLevel = null;
    let prPoints = 0;
    for (const l of labels) {
      const lvl = extractLevelFromLabel(l.name);
      if (lvl && LEVEL_POINTS[lvl]) {
        // choose higher points if multiple levels present
        if (!prLevel || LEVEL_POINTS[lvl] > prPoints) {
          prLevel = lvl;
          prPoints = LEVEL_POINTS[lvl];
        }
      }
    }

    // Build HYPERLINK formula + label text
    const prHyperlinkFormula = prLevel
      ? `=HYPERLINK("https://github.com/${repoOwner}/${repoName}/pull/${pr.number}","#${pr.number}") & " (${prLevel} - ${prPoints}pts)"`
      : `=HYPERLINK("https://github.com/${repoOwner}/${repoName}/pull/${pr.number}","#${pr.number}")`;

    contributors[username].prs.push(prHyperlinkFormula);

    if (prPoints > 0) {
      contributors[username].prPoints += prPoints;
      contributors[username].levels.add(prLevel);
    }
  }

  const issues = await fetchAllIssues(octokit);
  for (const issue of issues) {
    if (issue.pull_request) continue; // skip PRs in issues listing

    const labels = issue.labels || [];
    const hasGssoc = labels.some((l) =>
      String(l.name).toLowerCase().includes("gssoc")
    );
    if (!hasGssoc) continue;

    const username = issue.user?.login || "unknown";
    if (!contributors[username]) {
      contributors[username] = {
        prs: [],
        issues: [],
        prPoints: 0,
        issuePoints: 0,
        levels: new Set(),
      };
    }

    // Find best level label for this Issue
    let issueLevel = null;
    let issuePoints = 0;
    for (const l of labels) {
      const lvl = extractLevelFromLabel(l.name);
      if (lvl && LEVEL_POINTS[lvl]) {
        if (!issueLevel || LEVEL_POINTS[lvl] > issuePoints) {
          issueLevel = lvl;
          issuePoints = LEVEL_POINTS[lvl];
        }
      }
    }

    const issueHyperlinkFormula = issueLevel
      ? `=HYPERLINK("https://github.com/${repoOwner}/${repoName}/issues/${issue.number}","#${issue.number}") & " (${issueLevel} - ${issuePoints}pts)"`
      : `=HYPERLINK("https://github.com/${repoOwner}/${repoName}/issues/${issue.number}","#${issue.number}")`;

    contributors[username].issues.push(issueHyperlinkFormula);

    if (issuePoints > 0) {
      contributors[username].issuePoints += issuePoints;
      contributors[username].levels.add(issueLevel);
    }
  }

  // Convert sets to arrays and compute totals
  for (const [user, obj] of Object.entries(contributors)) {
    obj.levels = Array.from(obj.levels).filter(Boolean); // e.g. ["level-2", "level-1"]
    obj.totalPoints = (obj.prPoints || 0) + (obj.issuePoints || 0);
  }

  return contributors;
}

async function updateSheet(contributors) {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Header
  const header = [
    "Rank",
    "GitHub Username",
    "Pull Requests (link & level)",
    "Issue No. (link & level)",
    "PR Points",
    "Issue Points",
    "Total Points",
    "Levels",
  ];

  // Sort contributors by totalPoints desc
  const sorted = Object.entries(contributors)
    .sort((a, b) => (b[1].totalPoints || 0) - (a[1].totalPoints || 0))
    .map(([username, data], idx) => [
      idx + 1,
      username,
      data.prs.length ? data.prs.join(", ") : "",
      data.issues.length ? data.issues.join(", ") : "",
      data.prPoints || 0,
      data.issuePoints || 0,
      data.totalPoints || 0,
      data.levels.join(", "),
    ]);

  const rows = [header, ...sorted];

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: "Sheet1!A1",
    valueInputOption: "USER_ENTERED", // important so HYPERLINK formulas evaluate
    requestBody: { values: rows },
  });

  console.log("✅ Google Sheet updated: rows =", rows.length - 1);
}

(async () => {
  try {
    const contributors = await buildLeaderboard();
    await updateSheet(contributors);
  } catch (err) {
    console.error("ERROR:", err);
    process.exit(1);
  }
})();
