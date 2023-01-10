import { parseLanguages } from "../src/common"
import { compactedHashURI, compactedSlashURI } from "./data/gatsby-node-data"

describe("gatsby node", () => {
  it("detects three languages for concept scheme with slash uri", () => {
    const conceptSchemeId = "http://w3id.org/class/hochschulfaecher/scheme#"
    const languages = parseLanguages(
      conceptSchemeId,
      compactedSlashURI["@graph"]
    )
    expect(languages.size).toBe(3)
  })
  it("detects three languages for concept scheme with slash uri", () => {
    const conceptSchemeId = "http://example.org/hashURIConceptScheme#scheme"
    const languages = parseLanguages(
      conceptSchemeId,
      compactedHashURI["@graph"]
    )
    expect(languages.size).toBe(2)
  })
})
