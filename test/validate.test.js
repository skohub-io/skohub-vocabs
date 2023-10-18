import { describe, expect, it } from "vitest"
import { validate } from "../src/validate"

describe("validate", () => {
  it("Returns true for a valid SkoHub Turtle File", async () => {
    const result = await validate(
      "./shapes/skohub.shacl.ttl",
      "./test/data/ttl/systematik.ttl"
    )
    expect(result).toBeTruthy()
  })
  it("Returns false for an invalid SkoHub Turtle File", async () => {
    const result = await validate(
      "./shapes/skohub.shacl.ttl",
      "./test/data/ttl/hashURIConceptScheme.ttl"
    )
    expect(result).toBeFalsy()
  })
})
