import React from "react"
import * as Gatsby from "gatsby"
import { render, screen } from "@testing-library/react"
import App from "../src/templates/App"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import {
  ConceptSchemeNoNarrower,
  ConceptSchemeWithNarrower,
  ConceptSchemeNoPrefLabel,
  ConceptNoPrefLabel,
} from "./data/pageContext"

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
    useStaticQuery.mockImplementation(() => mockUseStaticQuery)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("renders App component with expand and collapse button", () => {
    render(
      <LocationProvider history={createHistory(createMemorySource("/"))}>
        <App pageContext={ConceptSchemeWithNarrower} children={null} />
      </LocationProvider>
    )
    expect(screen.getByRole("button", { name: "Collapse" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Expand" })).toBeInTheDocument()
  })

  it("renders App component without collapse and expand button", () => {
    render(
      <LocationProvider history={createHistory(createMemorySource("/"))}>
        <App pageContext={ConceptSchemeNoNarrower} children={null} />
      </LocationProvider>
    )
    expect(screen.queryByRole("button", { name: "Collapse" })).toBeNull()
    expect(screen.queryByRole("button", { name: "Expand" })).toBeNull()
  })

  it("renders App component with no prefLabelMessage", () => {
    render(
      <LocationProvider history={createHistory(createMemorySource("/"))}>
        <App pageContext={ConceptSchemeNoPrefLabel} children={null} />
      </LocationProvider>
    )
    expect(
      screen.getByRole("link", { name: 'No label for language "en" provided' })
    ).toBeInTheDocument()
  })
})
