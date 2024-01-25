import { describe, expect, it, vi } from "vitest"
import React from "react"
import * as Gatsby from "gatsby"
import { render, screen, act } from "@testing-library/react"
import App from "../src/templates/App.jsx"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import { ConceptPC, ConceptSchemePC, CollectionPC } from "./data/pageContext"
import mockFetch from "./mocks/mockFetch"
import { mockConfig } from "./mocks/mockConfig"
import userEvent from "@testing-library/user-event"
import { ContextProvider, useSkoHubContext } from "../src/context/Context"

vi.mock("../src/context/Context.jsx", async () => {
  const actual = await vi.importActual("../src/context/Context.jsx")
  return {
    ...actual,
    useSkoHubContext: vi.fn(),
  }
})

vi.mock("flexsearch/dist/module/document.js", async () => {
  const { Document } = await vi.importActual("flexsearch")
  return {
    default: Document,
  }
})
const useStaticQuery = vi.spyOn(Gatsby, `useStaticQuery`)

function renderApp(history, pageContext, location, children = null) {
  return render(
    <ContextProvider>
      <LocationProvider history={history}>
        <App
          pageContext={pageContext}
          children={children}
          location={location}
        />
      </LocationProvider>
    </ContextProvider>
  )
}

describe("App", () => {
  vi.spyOn(window, "fetch").mockImplementation(mockFetch)
  vi.mock("../src/components/Modal.jsx", async () => {
    return {
      default: () => <div></div>,
    }
  })
  useStaticQuery.mockImplementation(() => mockConfig)

  useSkoHubContext.mockReturnValue({
    data: {
      conceptSchemeLanguages: ["de", "en"],
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
  it("renders App component with expand and collapse button", async () => {
    const route = "/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))
    const location = { search: "?lang=de" }
    await act(() => {
      renderApp(history, ConceptSchemePC, location)
    })
    expect(screen.getByRole("button", { name: "Collapse" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Expand" })).toBeInTheDocument()
  })

  it("renders App component **without** collapse and expand button", async () => {
    const route = "/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))
    const location = { search: "?lang=de" }

    // remove narrower from concept
    const topConcept = ConceptSchemePC.node.hasTopConcept[0]
    const pageContext = {
      ...ConceptSchemePC,
      node: {
        ...ConceptSchemePC.node,
        hasTopConcept: [{ ...topConcept, narrower: null }],
      },
    }

    await act(() => {
      renderApp(history, pageContext, location)
    })
    expect(screen.queryByRole("button", { name: "Collapse" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Expand" })).toBeNull()
  })

  it("correctly fetches tree when page context is a concept", async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {}
    const route = "/w3id.org/c1.html"
    const history = createHistory(createMemorySource(route))
    const location = { search: "?lang=de" }

    await act(() => {
      renderApp(history, ConceptPC, location)
    })
    // we render the concept with notation therefore the "1"
    expect(
      screen.getByRole("link", { name: "1 Konzept 1" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Konzept 2" })).toBeInTheDocument()
  })

  it("correctly fetches tree when page context is a collection", async () => {
    window.HTMLElement.prototype.scrollIntoView = function () {}
    const route = "/w3id.org/collection.html"
    const history = createHistory(createMemorySource(route))
    const location = { search: "", pathname: route }

    await act(() => {
      renderApp(history, CollectionPC, location)
    })
    // we render the concept with notation therefore the "1"
    expect(
      screen.getByRole("link", { name: "1 Konzept 1" })
    ).toBeInTheDocument()
    // somehow the link role for Konzept 2 is not found, but it is there, so we use getByText
    expect(screen.getByText("Konzept 2")).toBeInTheDocument()
  })

  it("search is working", async () => {
    const user = userEvent.setup()
    const route = "/w3id.org/index.html"
    const history = createHistory(createMemorySource(route))
    const location = { search: "?lang=de" }

    await act(() => {
      renderApp(history, ConceptSchemePC, location)
    })
    expect(screen.queryByText("Konzept 1")).toBeInTheDocument()
    expect(screen.queryByText("Konzept 2")).toBeInTheDocument()
    await user.click(screen.getByRole("textbox"))
    await act(async () => {
      await user.keyboard("Konzept 1")

      expect(screen.queryByText("Konzept 1")).toBeInTheDocument()
      expect(screen.queryByText("Konzept 2")).toBeNull()
    })
  })
})
