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
  it("Throws error for an invalid SkoHub Turtle File", async () => {
    await expect(() =>
      validate(
        "./shapes/skohub.shacl.ttl",
        "./test/data/ttl/invalid_hashURIConceptScheme.ttl"
      )
    ).rejects.toThrowError()
  })
})
