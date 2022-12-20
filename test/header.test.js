import React from "react"
import { render, screen, act } from "@testing-library/react"
import pageContext from "../test/data/pageContext"
import Header from "../src/components/header"
import mockFetch from "./mocks/mockFetch"
import {
  Router,
  Link,
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"
// import { act } from "react-dom/test-utils"

beforeEach(() => {
  jest.spyOn(window, "fetch").mockImplementation(mockFetch)
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe("Header", () => {
  it("renders header component", async () => {
    const languages = ["de", "en"]
    const route = "test/index.de.html"
    const history = createHistory(createMemorySource(route))
    await act(() => {
      render(
        <LocationProvider history={history}>
          <Header siteTitle="Test Title" languages={languages} language="de" />
        </LocationProvider>
      )
    })
    screen.debug()
    // TODO check for language menu
  })
})
