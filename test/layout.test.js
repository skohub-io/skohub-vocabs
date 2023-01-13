import React from "react"
import * as Gatsby from "gatsby"
import { render, screen } from "@testing-library/react"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import Layout from "../src/components/layout"

const useStaticQuery = jest.spyOn(Gatsby, `useStaticQuery`)
const title = `Gatsby Default Starter`
const mockUseStaticQuery = {
  site: {
    siteMetadata: {
      title: title,
    },
  },
}

const data = {}

describe("Layout", () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => mockUseStaticQuery)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it("renders layout component", () => {
    const reTitle = new RegExp(title, "i")
    render(
      <LocationProvider history={createHistory(createMemorySource("/"))}>
        <Layout data={data}>
          <div>Test Layout</div>
        </Layout>
      </LocationProvider>
    )
    // header is there
    expect(screen.getByRole("banner")).toBeInTheDocument()
    // link attribute is filled correctly
    expect(screen.getByRole("link", { name: reTitle })).toBeInTheDocument()
    // Test Layout <-- is the child that is passed
    expect(screen.getByText(/test layout/i)).toBeInTheDocument()
    // footer
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})
