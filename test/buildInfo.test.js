import { describe, it, expect } from "vitest"
import { formatBuildTime, shortSha } from "../src/buildInfo"

describe("formatBuildTime", () => {
  it("formats an ISO timestamp as 'YYYY-MM-DD HH:mm UTC'", () => {
    expect(formatBuildTime("2026-04-30T14:30:42.123Z")).toBe(
      "2026-04-30 14:30 UTC"
    )
  })

  it("drops seconds and fractional seconds", () => {
    expect(formatBuildTime("2026-01-01T00:00:59.999Z")).toBe(
      "2026-01-01 00:00 UTC"
    )
  })

  it("returns empty string for falsy input", () => {
    expect(formatBuildTime("")).toBe("")
    expect(formatBuildTime(null)).toBe("")
    expect(formatBuildTime(undefined)).toBe("")
  })
})

describe("shortSha", () => {
  it("truncates a full git SHA to 7 chars", () => {
    expect(shortSha("a1b2c3d4e5f67890abcdef1234567890abcdef12")).toBe("a1b2c3d")
  })

  it("returns the input unchanged when shorter than 7 chars", () => {
    expect(shortSha("abc")).toBe("abc")
  })

  it("returns empty string for falsy input", () => {
    expect(shortSha("")).toBe("")
    expect(shortSha(null)).toBe("")
    expect(shortSha(undefined)).toBe("")
  })
})
