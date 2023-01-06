import React from "react"
import * as Gatsby from "gatsby"
import { render, screen, act } from "@testing-library/react"
import App from "../src/templates/App"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import { ConceptSchemePC } from "./data/pageContext"
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

  // den Test behalten behalten
  it("renders App component with expand and collapse button", async () => {
    const route = "/w3id.org/index.de.html"
    await act(() => {
      render(
        <LocationProvider history={createHistory(createMemorySource(route))}>
          <App pageContext={ConceptSchemePC} children={null} />
        </LocationProvider>
      )
    })
    expect(screen.getByRole("button", { name: "Collapse" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Expand" })).toBeInTheDocument()
  })

  // den Test auch behalten
  it("renders App component **without** collapse and expand button", async () => {
    const route = "/w3id.org/index.de.html"
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
      render(
        <LocationProvider history={createHistory(createMemorySource(route))}>
          <App pageContext={pageContext} children={null} />
        </LocationProvider>
      )
    })
    expect(screen.queryByRole("button", { name: "Collapse" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Expand" })).toBeNull()
  })
})
