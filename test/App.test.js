import React from "react"
import * as Gatsby from "gatsby"
import { render, screen, act } from "@testing-library/react"
import App from "../src/templates/App"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import {
  ConceptSchemeWithNarrowerPC,
  ConceptSchemeNoNarrowerPC,
  ConceptSchemeNoPrefLabelPC,
} from "./data/pageContext"
import userEvent from "@testing-library/user-event"
import mockFetch from "./mocks/mockFetch"

const useStaticQuery = jest.spyOn(Gatsby, `useStaticQuery`)
const mockUseStaticQuery = {
  site: {
    siteMetadata: {
      title: "Default Title",
    },
  },
}
describe("App", () => {
  beforeEach(() => {
    jest.spyOn(window, "fetch").mockImplementation(mockFetch)
    useStaticQuery.mockImplementation(() => mockUseStaticQuery)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders App component with expand and collapse button", async () => {
    const route = "/w3id.org/class/hochschulfaecher/scheme.de.html"
    await act(() => {
      render(
        <LocationProvider history={createHistory(createMemorySource(route))}>
          <App pageContext={ConceptSchemeWithNarrowerPC} children={null} />
        </LocationProvider>
      )
    })
    expect(screen.getByRole("button", { name: "Collapse" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Expand" })).toBeInTheDocument()
  })

  it("renders App component without collapse and expand button", async () => {
    const route = "/no-narrower/w3id.org/class/hochschulfaecher/scheme.de.html"
    await act(() => {
      render(
        <LocationProvider history={createHistory(createMemorySource(route))}>
          <App pageContext={ConceptSchemeNoNarrowerPC} children={null} />
        </LocationProvider>
      )
    })
    expect(screen.queryByRole("button", { name: "Collapse" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Expand" })).toBeNull()
  })

  it("renders App component with no prefLabelMessage", async () => {
    const route = "/no-prefLabel/w3id.org/class/hochschulfaecher/scheme.de.html"
    await act(() => {
      render(
        <LocationProvider history={createHistory(createMemorySource(route))}>
          <App pageContext={ConceptSchemeNoPrefLabelPC} children={null} />
        </LocationProvider>
      )
    })
    expect(
      screen.getByRole("link", { name: 'No label for language "en" provided' })
    ).toBeInTheDocument()
  })

  it("searches and filters concepts", async () => {
    const user = userEvent.setup()
    await act(() => {
      render(
        <LocationProvider
          history={createHistory(
            createMemorySource(
              "/w3id.org/class/hochschulfaecher/scheme.de.html"
            )
          )}
        >
          <App pageContext={ConceptSchemeWithNarrowerPC} children={null} />
        </LocationProvider>
      )
    })
    await user.click(screen.getByRole("textbox"))
    await user.keyboard("Forst")
    expect(
      screen.getByRole("link", {
        name: "Agrar-, Forst - und Ernährungswissenschaften, Veterinärmedizin",
      })
    ).toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: "Agrarwissenschaft/Landwirtschaft" })
    ).toBeNull()
  })
})
