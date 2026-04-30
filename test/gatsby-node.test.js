import { parseLanguages } from "../src/common"
import { compactedHashURI, compactedSlashURI } from "./data/gatsby-node-data"

describe("gatsby node", () => {
  it("detects three languages for concept scheme with slash uri", () => {
    const languages = parseLanguages(compactedSlashURI["@graph"])
    expect(languages.size).toBe(3)
  })
  it("detects three languages for concept scheme with hash uri", () => {
    const languages = parseLanguages(compactedHashURI["@graph"])
    expect(languages.size).toBe(2)
  })
  it("ignores the JSON-LD '@none' key when collecting languages (#335)", () => {
    const graph = [
      {
        type: "ConceptScheme",
        title: { en: "Vocab", "@none": "Untagged title" },
        hasTopConcept: [
          {
            type: "Concept",
            prefLabel: { de: "Begriff", "@none": "Untagged label" },
            altLabel: { "@none": "Other untagged" },
            hiddenLabel: { "@none": "Hidden untagged" },
          },
        ],
      },
    ]
    const languages = parseLanguages(graph)
    expect(languages.has("@none")).toBe(false)
    expect(languages.has("en")).toBe(true)
    expect(languages.has("de")).toBe(true)
    expect(languages.size).toBe(2)
  })
})
