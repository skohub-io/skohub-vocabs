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
})
