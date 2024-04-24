import { describe, expect, it, vi } from "vitest"
import { render, screen, within } from "@testing-library/react"
import * as Gatsby from "gatsby"

import React from "react"
import ConceptScheme from "../src/components/ConceptScheme.jsx"
import { ConceptSchemePC } from "./data/pageContext"
import mockFetch from "./mocks/mockFetch"
import { mockConfig } from "./mocks/mockConfig"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import { ContextProvider, useSkoHubContext } from "../src/context/Context"

const useStaticQuery = vi.spyOn(Gatsby, `useStaticQuery`)

function renderConceptScheme(history, pageContext, location, children = null) {
  return render(
    <ContextProvider>
      <LocationProvider history={history}>
        <ConceptScheme
          pageContext={pageContext}
          children={children}
          location={location}
        />
      </LocationProvider>
    </ContextProvider>
  )
}
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

  it("renders conceptScheme component", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {},
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })

    const route = "/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))
    const location = { search: "?lang=de" }
    renderConceptScheme(history, ConceptSchemePC, location)
    expect(
      screen.getByRole("heading", { name: /Test Vokabular/i })
    ).toBeInTheDocument()
  })

  it("renders conceptScheme component with skos:prefLabel", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {},
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    const ConceptSchemePCprefLabel = {
      ...ConceptSchemePC,
      node: {
        ...ConceptSchemePC.node,
        prefLabel: {
          de: "PrefLabel DE",
        },
      },
    }
    delete ConceptSchemePCprefLabel["node"]["title"]
    const route = "/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))
    const location = { search: "?lang=de" }
    renderConceptScheme(history, ConceptSchemePCprefLabel, location)
    expect(
      screen.getByRole("heading", { name: /PrefLabel DE/i })
    ).toBeInTheDocument()
  })

  it("renders conceptScheme component with dctitle", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        currentScheme: {},
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    const ConceptSchemePCprefLabel = {
      ...ConceptSchemePC,
      node: {
        ...ConceptSchemePC.node,
        dc_title: {
          de: "dctitle DE",
        },
      },
    }
    delete ConceptSchemePCprefLabel["node"]["title"]
    const route = "/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))
    const location = { search: "?lang=de" }
    renderConceptScheme(history, ConceptSchemePCprefLabel, location)
    expect(
      screen.getByRole("heading", { name: /dctitle DE/i })
    ).toBeInTheDocument()
  })
})
