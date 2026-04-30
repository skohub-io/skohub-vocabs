function formatBuildTime(iso) {
  if (!iso) return ""
  return new Date(iso).toISOString().slice(0, 16).replace("T", " ") + " UTC"
}

module.exports = { formatBuildTime }
