import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Collection from "../src/components/Collection"
import { CollectionPC } from "./data/pageContext"
import { useSkoHubContext, ContextProvider } from "../src/context/Context.jsx"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import * as Gatsby from "gatsby"
import { mockConfig } from "./mocks/mockConfig.js"
import mockFetch from "./mocks/mockFetch"

const useStaticQuery = vi.spyOn(Gatsby, `useStaticQuery`)

function renderCollection(history, pageContext) {
  return render(
    <ContextProvider>
      <LocationProvider history={history}>
        <Collection pageContext={pageContext}></Collection>
      </LocationProvider>
    </ContextProvider>
  )
}

describe("Collection", () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  vi.mock("../src/context/Context.jsx", async () => {
    const actual = await vi.importActual("../src/context/Context.jsx")
    return {
      ...actual,
      useSkoHubContext: vi.fn(),
    }
  })
  useStaticQuery.mockImplementation(() => mockConfig)
  const route = "/w3id.org/index.html"
  const history = createHistory(createMemorySource(route))
  vi.spyOn(window, "fetch").mockImplementation(mockFetch)

  it("renders collection component", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    renderCollection(history, CollectionPC)
    expect(screen.getByRole("link", { name: "Konzept 1" })).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Test Mitglied 2" })
    ).toBeInTheDocument()
  })

  it("shows no prefLabel-Message if none is provided", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        selectedLanguage: "en",
      },
      updateState: vi.fn(),
    })
    renderCollection(history, CollectionPC)
    expect(screen.getByRole("link", { name: /no label in language/i }))
  })

  it("json link is working", () => {
    renderCollection(history, CollectionPC)
    expect(screen.getByRole("link", { name: "JSON" })).toHaveAttribute(
      "href",
      "/w3id.org/collection.json"
    )
  })
})
