import { describe, it, expect } from "vitest"
import { sortConcepts } from "../src/sortConcepts"

const mk = (id, prefLabel, notation) => ({
  id,
  prefLabel,
  ...(notation !== undefined ? { notation } : {}),
})

describe("sortConcepts", () => {
  it("returns input unchanged when sortBy is 'none'", () => {
    const items = [mk("c", { en: "Charlie" }), mk("a", { en: "Alpha" })]
    expect(sortConcepts(items, "none", "en")).toBe(items)
  })

  it("returns input unchanged when sortBy is falsy", () => {
    const items = [mk("c", { en: "Charlie" }), mk("a", { en: "Alpha" })]
    expect(sortConcepts(items, null, "en")).toBe(items)
    expect(sortConcepts(items, undefined, "en")).toBe(items)
  })

  it("does not mutate the input array", () => {
    const items = [mk("c", { en: "Charlie" }), mk("a", { en: "Alpha" })]
    const before = [...items]
    sortConcepts(items, "prefLabel", "en")
    expect(items).toEqual(before)
  })

  it("sorts alphabetically by prefLabel in the given language", () => {
    const items = [
      mk("c", { en: "Charlie" }),
      mk("a", { en: "Alpha" }),
      mk("b", { en: "Bravo" }),
    ]
    const sorted = sortConcepts(items, "prefLabel", "en")
    expect(sorted.map((i) => i.id)).toEqual(["a", "b", "c"])
  })

  it("uses the selected language to choose the prefLabel string", () => {
    const items = [
      mk("x", { en: "Apple", de: "Zebra" }),
      mk("y", { en: "Zebra", de: "Apfel" }),
    ]
    expect(sortConcepts(items, "prefLabel", "en").map((i) => i.id)).toEqual([
      "x",
      "y",
    ])
    expect(sortConcepts(items, "prefLabel", "de").map((i) => i.id)).toEqual([
      "y",
      "x",
    ])
  })

  it("sorts notations numerically (1, 2, 10 — not 1, 10, 2)", () => {
    const items = [
      mk("a", { en: "A" }, ["10"]),
      mk("b", { en: "B" }, ["2"]),
      mk("c", { en: "C" }, ["1"]),
    ]
    const sorted = sortConcepts(items, "notation", "en")
    expect(sorted.map((i) => i.id)).toEqual(["c", "b", "a"])
  })

  it("sorts notations lexically when they share a prefix (e.g. '1.10' after '1.2')", () => {
    const items = [
      mk("a", { en: "A" }, ["1.10"]),
      mk("b", { en: "B" }, ["1.2"]),
      mk("c", { en: "C" }, ["1.1"]),
    ]
    // numeric collation: 1.1 < 1.2 < 1.10
    const sorted = sortConcepts(items, "notation", "en")
    expect(sorted.map((i) => i.id)).toEqual(["c", "b", "a"])
  })

  it("places items without notation after notation-bearing items, tie-broken by prefLabel", () => {
    const items = [
      mk("z", { en: "Zeta" }), // no notation
      mk("a", { en: "Alpha" }, ["5"]),
      mk("m", { en: "Mu" }), // no notation
    ]
    const sorted = sortConcepts(items, "notation", "en")
    expect(sorted.map((i) => i.id)).toEqual(["a", "m", "z"])
  })

  it("falls back to id when prefLabel is missing for the requested language", () => {
    const items = [mk("zzz", { de: "ignored" }), mk("aaa", { de: "ignored" })]
    const sorted = sortConcepts(items, "prefLabel", "en")
    expect(sorted.map((i) => i.id)).toEqual(["aaa", "zzz"])
  })

  it("returns input unchanged when fewer than two items", () => {
    expect(sortConcepts([], "prefLabel", "en")).toEqual([])
    const single = [mk("a", { en: "A" })]
    expect(sortConcepts(single, "prefLabel", "en")).toBe(single)
  })

  it("handles non-array input gracefully", () => {
    expect(sortConcepts(null, "prefLabel", "en")).toBe(null)
    expect(sortConcepts(undefined, "prefLabel", "en")).toBe(undefined)
  })
})
