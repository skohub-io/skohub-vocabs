import { describe, it, expect } from "vitest"
import { formatBuildTime } from "../src/buildInfo"

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
