import { afterEach, describe, expect, it, vi } from "vitest"
import React from "react"
import * as Gatsby from "gatsby"
import { render, screen, act } from "@testing-library/react"
import Header from "../src/components/header.jsx"
import mockFetch from "./mocks/mockFetch"
import { mockConfig } from "./mocks/mockConfig.js"

import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import { ContextProvider, useSkoHubContext } from "../src/context/Context.jsx"

const useStaticQuery = vi.spyOn(Gatsby, `useStaticQuery`)

function renderHeader(history, siteTitle) {
  return render(
    <ContextProvider>
      <LocationProvider history={history}>
        <Header siteTitle={siteTitle}></Header>
      </LocationProvider>
    </ContextProvider>
  )
}

describe("Header", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  vi.spyOn(window, "fetch").mockImplementation(mockFetch)
  useStaticQuery.mockImplementation(() => mockConfig)
  vi.mock("../src/context/Context.jsx", async () => {
    const actual = await vi.importActual("../src/context/Context.jsx")
    return {
      ...actual,
      useSkoHubContext: vi.fn(),
    }
  })

  const siteTitle = "Test Title"

  it("renders header component without language tags", async () => {
    const route = "/one-lang/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))
    useSkoHubContext.mockReturnValue({
      data: {
        languages: ["de"],
        currentScheme: {
          id: "http://one-lang/w3id.org/",
          title: {
            de: "Test Vokabular",
          },
        },
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    await act(() => {
      renderHeader(history, siteTitle)
    })
    expect(screen.getByRole("banner")).toBeInTheDocument()
    // skohub logo
    expect(screen.getByRole("img", { name: "SkoHub Logo" })).toBeInTheDocument()
    // skohub title
    expect(
      screen.getByRole("link", { name: "SkoHub Logo Test Title" })
    ).toBeInTheDocument()
    // skohub concept scheme link
    expect(
      screen.getByRole("link", {
        name: /test vokabular/i,
      })
    ).toBeInTheDocument()
    // check for language menu not to be present
    expect(screen.queryByRole("list")).toBeNull()
  })

  it(`renders header component with link to concept scheme (slash URIs)`, async () => {
    const route = "/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))
    useSkoHubContext.mockReturnValue({
      data: {
        languages: ["de"],
        currentScheme: {
          id: "http://w3id.org/",
          title: {
            de: "Test Vokabular",
          },
        },
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    await act(() => {
      renderHeader(history, siteTitle)
    })
    // skohub concept scheme link
    expect(
      screen.getByRole("link", {
        name: "Test Vokabular",
      })
    ).toBeInTheDocument()
  })

  it(`renders header component with multiple language tags (slash URIs)`, async () => {
    const route = "/w3id.org/index.de.html"
    const history = createHistory(createMemorySource(route))
    useSkoHubContext.mockReturnValue({
      data: {
        languages: ["de", "en"],
        currentScheme: {
          id: "http://w3id.org/",
          title: {
            de: "Test Vokabular",
          },
        },
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    await act(() => {
      renderHeader(history, siteTitle)
    })
    // check for language menu
    expect(screen.getByRole("list")).toBeInTheDocument()
    // check for language items
    expect(screen.getAllByRole("listitem").length).toBe(2)
  })

  it("renders header component with multiple language tags (hash URIs)", async () => {
    // setting three languages here, but we only have two in the cs
    // so test should return only two
    const route = "/example.org/hashURIConceptScheme.html"
    const history = createHistory(createMemorySource(route))
    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {
          id: "http://example.org/hashURIConceptScheme#scheme",
          title: {
            de: "Hash URI Konzept Schema",
          },
        },
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })

    await act(() => {
      renderHeader(history, siteTitle)
    })
    // skohub concept scheme link
    expect(
      screen.getByRole("link", {
        name: "Hash URI Konzept Schema",
      })
    ).toBeInTheDocument()
    // check for language menu
    expect(screen.getByRole("list")).toBeInTheDocument()
    // check for language items
    expect(screen.getAllByRole("listitem").length).toBe(2)
  })

  it("renders header, shows concept id if title in language is not present", async () => {
    const route = "/no-title-in-en/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))

    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {
          id: "http://w3id.org/",
        },
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    await act(() => {
      renderHeader(history, siteTitle)
    })
    // skohub concept scheme link
    expect(
      screen.getByRole("link", {
        name: "http://w3id.org/",
      })
    ).toBeInTheDocument()
  })

  it("render component with concept data", async () => {
    // we reduce language array here artifically, because two languages should be found
    const route = "/w3id.org/c1.html"
    const history = createHistory(createMemorySource(route))
    await act(() => {
      renderHeader(history, siteTitle)
    })
    // check for language menu
    expect(screen.getByRole("list")).toBeInTheDocument()
    // check for language items
    expect(screen.getAllByRole("listitem").length).toBe(2)
  })

  it("render component with collection data", async () => {
    // we reduce language array here artifically, because two languages should be found
    const languages = ["de"]
    const language = "de"
    const route = "/w3id.org/collection.html"
    const history = createHistory(createMemorySource(route))
    await act(() => {
      renderHeader(history, siteTitle)
    })
    // check for language menu
    expect(screen.getByRole("list")).toBeInTheDocument()
    // check for language items
    expect(screen.getAllByRole("listitem").length).toBe(2)
  })

  it("render languages if type is neither ConceptScheme, Concept or Collection", async () => {
    const languages = ["de", "en", "uk"]
    const language = "de"
    const route = "/no-in-scheme/w3id.org/collection.html"
    useSkoHubContext.mockReturnValue({
      data: {
        languages,
        currentScheme: {
          id: "http://no-in-scheme/w3id.org/",
          title: {
            de: "Test Vokabular",
          },
        },
        selectedLanguage: language,
      },
      updateState: vi.fn(),
    })
    const history = createHistory(createMemorySource(route))
    await act(() => {
      renderHeader(history, siteTitle)
    })
    // check for language menu
    expect(screen.getByRole("list")).toBeInTheDocument()
    // check for language items
    expect(screen.getAllByRole("listitem").length).toBe(3)
  })

  it("render default languages if langs can't be received (e.g. if rendered on overview index", async () => {
    const languages = ["de", "en", "uk"]
    useSkoHubContext.mockReturnValue({
      data: {
        languages,
      },
      updateState: vi.fn(),
    })
    const route = "/"
    const history = createHistory(createMemorySource(route))
    await act(() => {
      renderHeader(history, siteTitle)
    })
    // check for language menu
    expect(screen.getByRole("list")).toBeInTheDocument()
    // check for language items
    expect(screen.getAllByRole("listitem").length).toBe(3)
  })

  it(`shows only one Concept Scheme link in header, 
  if a concept is present in multiple concept schemes.
  Defaults to concept scheme id if no title in language provided.`, async () => {
    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {
          id: "http://w3id.org/",
          title: {
            de: "Test Vokabular",
          },
        },
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })

    const route = "/w3id.org/c1.html"
    const history = createHistory(createMemorySource(route))
    await act(() => {
      renderHeader(history, siteTitle)
    })
    // skohub concept scheme link
    expect(
      screen.getByRole("link", {
        name: "Test Vokabular",
      })
    ).toBeInTheDocument()
  })
})
