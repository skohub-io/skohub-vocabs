import { describe, expect, it } from "vitest"
import { validate } from "../src/validate"
import fs from "fs"
import jsonld from "jsonld"
import n3 from "n3"
const { DataFactory } = n3
const { namedNode } = DataFactory

describe("validate", () => {
  it("Returns true for a valid SkoHub Turtle File", async () => {
    const result = await validate(
      "./shapes/skohub.shacl.ttl",
      "./test/data/ttl/systematik.ttl"
    )
    expect(result).toBeTruthy()
  })
  it("Throws error for an invalid SkoHub Turtle File", async () => {
    const inverses = {
      "http://www.w3.org/2004/02/skos/core#narrower":
        "http://www.w3.org/2004/02/skos/core#broader",
      "http://www.w3.org/2004/02/skos/core#broader":
        "http://www.w3.org/2004/02/skos/core#narrower",
      "http://www.w3.org/2004/02/skos/core#related":
        "http://www.w3.org/2004/02/skos/core#related",
      "http://www.w3.org/2004/02/skos/core#hasTopConcept":
        "http://www.w3.org/2004/02/skos/core#topConceptOf",
      "http://www.w3.org/2004/02/skos/core#topConceptOf":
        "http://www.w3.org/2004/02/skos/core#hasTopConcept",
    }

    jsonld.registerRDFParser("text/turtle", (ttlString) => {
      const quads = new n3.Parser().parse(ttlString)
      const store = new n3.Store()
      store.addQuads(quads)
      quads.forEach((quad) => {
        quad.object.language &&
          inverses[quad.predicate.id] &&
          store.addQuad(
            quad.object,
            namedNode(inverses[quad.predicate.id]),
            quad.subject,
            quad.graph
          )
      })
      return store.getQuads()
    })
    const f = "./test/data/ttl/invalid_hashURIConceptScheme.ttl"

    const ttlString = fs.readFileSync(f).toString()
    const doc = await jsonld.fromRDF(ttlString, { format: "text/turtle" })

    await expect(() =>
      validate(
        "./shapes/skohub.shacl.ttl",
        "./test/data/ttl/invalid_hashURIConceptScheme.ttl",
        doc
      )
    ).rejects.toThrowError()
  })
})
