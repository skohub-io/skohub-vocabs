import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"
import { commitUrl, formatBuildTime, shortSha } from "../src/buildInfo"
import { resolveGitCommit } from "../src/resolveGitCommit"

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

describe("commitUrl", () => {
  it("joins repo URL and SHA with /commit/", () => {
    expect(
      commitUrl("https://github.com/skohub-io/skohub-vocabs", "a1b2c3d")
    ).toBe("https://github.com/skohub-io/skohub-vocabs/commit/a1b2c3d")
  })

  it("strips a single trailing slash from the repo URL", () => {
    expect(
      commitUrl("https://github.com/skohub-io/skohub-vocabs/", "a1b2c3d")
    ).toBe("https://github.com/skohub-io/skohub-vocabs/commit/a1b2c3d")
  })

  it("returns empty string when either input is missing", () => {
    expect(commitUrl("", "a1b2c3d")).toBe("")
    expect(commitUrl("https://example.com/r", "")).toBe("")
    expect(commitUrl(null, null)).toBe("")
  })
})

describe("resolveGitCommit", () => {
  const ORIGINAL_ENV = process.env
  let execSync

  beforeEach(() => {
    process.env = { ...ORIGINAL_ENV }
    delete process.env.GITHUB_SHA
    delete process.env.CI_COMMIT_SHA
    execSync = vi.fn()
  })

  afterEach(() => {
    process.env = ORIGINAL_ENV
  })

  it("returns GITHUB_SHA when set", () => {
    process.env.GITHUB_SHA = "github1111111111111111111111111111111111"
    expect(resolveGitCommit({ execSync })).toBe(
      "github1111111111111111111111111111111111"
    )
    expect(execSync).not.toHaveBeenCalled()
  })

  it("returns CI_COMMIT_SHA when GITHUB_SHA is absent", () => {
    process.env.CI_COMMIT_SHA = "gitlab2222222222222222222222222222222222"
    expect(resolveGitCommit({ execSync })).toBe(
      "gitlab2222222222222222222222222222222222"
    )
    expect(execSync).not.toHaveBeenCalled()
  })

  it("prefers GITHUB_SHA over CI_COMMIT_SHA", () => {
    process.env.GITHUB_SHA = "gh"
    process.env.CI_COMMIT_SHA = "gl"
    expect(resolveGitCommit({ execSync })).toBe("gh")
  })

  it("falls back to `git rev-parse HEAD` when no env var is set", () => {
    execSync.mockReturnValue("local333333333\n")
    expect(resolveGitCommit({ execSync })).toBe("local333333333")
    expect(execSync).toHaveBeenCalledWith("git rev-parse HEAD", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    })
  })

  it("returns null when env vars are missing and git fails", () => {
    execSync.mockImplementation(() => {
      throw new Error("not a git repository")
    })
    expect(resolveGitCommit({ execSync })).toBeNull()
  })
})
