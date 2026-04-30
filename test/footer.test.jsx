import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import Footer from "../src/components/footer"
import * as Gatsby from "gatsby"
import { mockConfig } from "./mocks/mockConfig"

const useStaticQuery = vi.spyOn(Gatsby, `useStaticQuery`)

const withMock = (overrides = {}) => ({
  ...mockConfig,
  site: {
    ...mockConfig.site,
    ...(overrides.site || {}),
    siteMetadata: {
      ...mockConfig.site.siteMetadata,
      ...((overrides.site && overrides.site.siteMetadata) || {}),
    },
  },
})

describe("Footer", () => {
  beforeEach(() => {
    delete process.env.GATSBY_RESPOSITORY_URL
  })

  afterEach(() => {
    delete process.env.GATSBY_RESPOSITORY_URL
  })

  it("renders Source link when repositoryUrl is set", () => {
    useStaticQuery.mockImplementation(() =>
      withMock({
        site: {
          siteMetadata: {
            repositoryUrl: "https://github.com/skohub-io/skohub-vocabs",
          },
        },
      })
    )
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Source" })).toBeInTheDocument()
  })

  it("renders timestamp only when no commit info is available", () => {
    useStaticQuery.mockImplementation(() =>
      withMock({
        site: {
          buildTime: "2026-04-30T14:30:42.000Z",
          siteMetadata: { gitCommit: "", repositoryUrl: "" },
        },
      })
    )
    render(<Footer />)
    expect(
      screen.getByText("Last built: 2026-04-30 14:30 UTC")
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: /a1b2c3d/ })
    ).not.toBeInTheDocument()
  })

  it("renders timestamp + plain short SHA when no repositoryUrl", () => {
    useStaticQuery.mockImplementation(() =>
      withMock({
        site: {
          buildTime: "2026-04-30T14:30:42.000Z",
          siteMetadata: {
            gitCommit: "a1b2c3d4e5f67890abcdef1234567890abcdef12",
            repositoryUrl: "",
          },
        },
      })
    )
    render(<Footer />)
    expect(
      screen.getByText("Last built: 2026-04-30 14:30 UTC (a1b2c3d)")
    ).toBeInTheDocument()
  })

  it("renders timestamp + linked short SHA when both are set", () => {
    useStaticQuery.mockImplementation(() =>
      withMock({
        site: {
          buildTime: "2026-04-30T14:30:42.000Z",
          siteMetadata: {
            gitCommit: "a1b2c3d4e5f67890abcdef1234567890abcdef12",
            repositoryUrl: "https://github.com/skohub-io/skohub-vocabs",
          },
        },
      })
    )
    render(<Footer />)
    const link = screen.getByRole("link", { name: "a1b2c3d" })
    expect(link).toHaveAttribute(
      "href",
      "https://github.com/skohub-io/skohub-vocabs/commit/a1b2c3d4e5f67890abcdef1234567890abcdef12"
    )
  })

  it("does not render the Last built line when buildTime is missing", () => {
    useStaticQuery.mockImplementation(() =>
      withMock({ site: { buildTime: null } })
    )
    render(<Footer />)
    expect(screen.queryByText(/Last built:/)).not.toBeInTheDocument()
  })
})
