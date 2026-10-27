const { execSync: defaultExecSync } = require("child_process")

function resolveGitCommit({ execSync = defaultExecSync } = {}) {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA
  if (process.env.CI_COMMIT_SHA) return process.env.CI_COMMIT_SHA
  try {
    return execSync("git rev-parse HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim()
  } catch {
    return null
  }
}

module.exports = { resolveGitCommit }
