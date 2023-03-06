import React from "react"
import * as Gatsby from "gatsby"
import { render, screen, act } from "@testing-library/react"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
import Layout from "../src/components/layout"
import { mockConfig } from "./mocks/mockConfig"
import { ContextProvider } from "../src/context/Context"

const useStaticQuery = jest.spyOn(Gatsby, `useStaticQuery`)
const data = {}

describe("Layout", () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => mockConfig)
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it("renders layout component", async () => {
    await act(() => {
      render(
        <ContextProvider>
          <LocationProvider history={createHistory(createMemorySource("/"))}>
            <Layout data={data}>
              <div>Test Layout</div>
            </Layout>
          </LocationProvider>
        </ContextProvider>
      )
    })
    // header is there
    expect(screen.getByRole("banner")).toBeInTheDocument()
    // link attribute is filled correctly
    expect(
      screen.getByRole("link", { name: /SkoHub Vocabs/ })
    ).toBeInTheDocument()
    // Test Layout <-- is the child that is passed
    expect(screen.getByText(/test layout/i)).toBeInTheDocument()
    // footer
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
  })
})
