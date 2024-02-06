import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import * as Gatsby from "gatsby"

import React from "react"
import Concept from "../src/components/Concept.jsx"
import { ConceptPC, ConceptPCDeprecated } from "./data/pageContext"
import mockFetch from "./mocks/mockFetch"
import { mockConfig } from "./mocks/mockConfig"
import { useSkoHubContext } from "../src/context/Context.jsx"

const useStaticQuery = vi.spyOn(Gatsby, `useStaticQuery`)

describe.concurrent("Concept", () => {
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

  it("renders concept component", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {},
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /Konzept 1/i })
    ).toBeInTheDocument()
  })

  it("shows no preflabel in h1 if no pref label is provided in language", () => {
    vi.spyOn(window, "fetch").mockImplementation(mockFetch)
    useStaticQuery.mockImplementation(() => mockConfig)
    const pageContextNoPrefLabel = {
      ...ConceptPC,
      node: {
        ...ConceptPC.node,
        prefLabel: {
          de: null,
        },
      },
    }
    render(<Concept pageContext={pageContextNoPrefLabel} />)
    expect(screen.queryByRole("heading", { name: /concept2/i })).toBeNull()
  })

  it("renders definition", () => {
    vi.spyOn(window, "fetch").mockImplementation(mockFetch)
    useStaticQuery.mockImplementation(() => mockConfig)

    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: "Definition" })
    ).toBeInTheDocument()
    expect(screen.getByText("Meine Definition")).toBeInTheDocument()
  })

  it("renders no definition if not provided in language", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {},
        selectedLanguage: "en",
      },
      updateState: vi.fn(),
    })
    render(
      <Concept
        pageContext={{
          ...ConceptPC,
          language: "en",
        }}
      />
    )
    expect(screen.queryByText("Meine Definition")).toBeNull()
    expect(
      screen.getByText('No definition in language "en" provided.')
    ).toBeInTheDocument()
  })

  it("renders altLabels", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {},
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    render(<Concept pageContext={ConceptPC} />)
    const list = screen.getByRole("list", {
      name: /alt label/i,
    })
    const { getAllByRole } = within(list)
    const items = getAllByRole("listitem")
    expect(items.length).toBe(2)
  })

  it("renders hidden labels", () => {
    render(<Concept pageContext={ConceptPC} />)

    expect(screen.getByText(/Verstecktes Label 1/i)).toBeInTheDocument()

    const list = screen.getByRole("list", {
      name: /hidden label/i,
    })
    const { getAllByRole } = within(list)
    const items = getAllByRole("listitem")
    expect(items.length).toBe(2)
  })

  it("renders examples", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /^example$/i })
    ).toBeInTheDocument()
  })

  it("renders related Concepts", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /^related$/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /konzept 4/i })).toBeInTheDocument()
  })

  it("renders narrow matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /narrow match/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /narrowMatchId/i })
    ).toBeInTheDocument()
  })

  it("renders broad matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /broad match/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /broadMatchId/i })
    ).toBeInTheDocument()
  })

  it("renders exact matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /exact match/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /exactMatchId/i })
    ).toBeInTheDocument()
  })

  it("renders close matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /close match/i })
    ).toBeInTheDocument(
      expect(
        screen.getByRole("link", { name: /closeMatchId/i })
      ).toBeInTheDocument()
    )
  })

  it("renders related matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /related match/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /relatedMatchId/i })
    ).toBeInTheDocument()
  })

  it("renders collection information", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /in Collections/i })
    ).toBeInTheDocument()
  })

  it("json link is working", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(screen.getByRole("link", { name: "JSON" })).toHaveAttribute(
      "href",
      "/w3id.org/c1.json"
    )
  })

  it("renders multiple in Scheme information", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /in Scheme/i })
    ).toBeInTheDocument()

    const list = screen.getByRole("list", {
      name: /in scheme/i,
    })
    const { getAllByRole } = within(list)
    const items = getAllByRole("listitem")
    expect(items.length).toBe(3)

    /**
     * concept scheme 2 links to an "en" scheme beside we
     * are currently in "de", because there is no "de" in cs2
     *
     * check that the link is pointing to en
     */
    expect(
      screen.getByRole("link", { name: "http://w3id.org/cs2/" })
    ).toHaveAttribute("href", "/w3id.org/cs2/index.html")

    expect(
      screen.getByRole("link", { name: /just-another-scheme/i })
    ).toHaveAttribute("href", "http://just-another-scheme.org/")
  })

  it("renders deprecated notice, if concept is deprecaed", () => {
    render(<Concept pageContext={ConceptPCDeprecated} />)
    expect(
      screen.getByRole("heading", { name: /Deprecated/i })
    ).toBeInTheDocument()
  })
})
