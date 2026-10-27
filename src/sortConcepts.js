const { i18n } = require("./common")

/**
 * Stable, locale-aware sort for SKOS-shaped items (concepts, collection
 * members, top concepts).
 *
 * @param {Array} items
 * @param {"prefLabel" | "notation" | "none" | null | undefined} sortBy
 * @param {string} language - BCP-47 language tag used both to pick the
 *   prefLabel string and as the locale for Intl.Collator
 * @returns {Array} a new array (input is not mutated). When sortBy is "none"
 *   or falsy, the original array is returned unchanged.
 */
const sortConcepts = (items, sortBy, language) => {
  if (!Array.isArray(items) || items.length < 2) return items
  if (!sortBy || sortBy === "none") return items

  const t = i18n(language)
  const collator = new Intl.Collator(language || undefined, {
    numeric: true,
    sensitivity: "base",
  })

  const labelOf = (item) => t(item.prefLabel) || item.id || ""
  const notationOf = (item) =>
    Array.isArray(item.notation) && item.notation.length > 0
      ? String(item.notation[0])
      : ""

  const compareByLabel = (a, b) => collator.compare(labelOf(a), labelOf(b))

  const compareByNotation = (a, b) => {
    const na = notationOf(a)
    const nb = notationOf(b)
    if (na && nb) return collator.compare(na, nb)
    // Items without a notation sink below items that have one; among the
    // notation-less, fall back to prefLabel so the order is still meaningful.
    if (na && !nb) return -1
    if (!na && nb) return 1
    return compareByLabel(a, b)
  }

  const compare = sortBy === "notation" ? compareByNotation : compareByLabel
  return [...items].sort(compare)
}

module.exports = { sortConcepts }
