function formatBuildTime(iso) {
  if (!iso) return ""
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ") + " UTC"
}

function shortSha(sha) {
  if (!sha) return ""
  return sha.slice(0, 7)
}

module.exports = { formatBuildTime, shortSha }
