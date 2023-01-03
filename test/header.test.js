import React from "react"
import { render, screen, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Header from "../src/components/header"
import mockFetch from "./mocks/mockFetch"
import {
  createHistory,
  createMemorySource,
  LocationProvider,
} from "@gatsbyjs/reach-router"

beforeEach(() => {
  jest.spyOn(window, "fetch").mockImplementation(mockFetch)
})

afterEach(() => {
  jest.restoreAllMocks()
})

describe("Header", () => {
  it("renders header component without language tags", async () => {
    const languages = ["de"]
    const language = "de"
    const route = "test-one-language/index.de.html"
    const history = createHistory(createMemorySource(route))
    await act(() => {
      render(
        <LocationProvider history={history}>
          <Header
            siteTitle="Test Title"
            languages={languages}
            language={language}
          />
        </LocationProvider>
      )
    })
    expect(screen.getByRole("banner")).toBeInTheDocument()
    // skohub logo
    expect(screen.getByRole("img", { name: "SkoHub Logo" })).toBeInTheDocument()
    // skohub title
    expect(
      screen.getByRole("link", { name: "SkoHub Logo Test Title" })
    ).toBeInTheDocument()
    // skohub concept scheme link
    expect(
      screen.getByRole("link", { name: "Hochschulcampus Ressourcentypen" })
    ).toBeInTheDocument()
    // check for language menu not to be present
    expect(screen.queryByRole("list")).toBeNull()
  })
})

describe("Header", () => {
  it("renders header component with multiple language tags", async () => {
    const languages = ["de", "en", "uk"]
    const language = "de"
    const route = "test-three-languages/index.de.html"
    const history = createHistory(createMemorySource(route))
    await act(() => {
      render(
        <LocationProvider history={history}>
          <Header
            siteTitle="Test Title"
            languages={languages}
            language={language}
          />
        </LocationProvider>
      )
    })
    // skohub concept scheme link
    expect(
      screen.getByRole("link", { name: "Hochschulcampus Ressourcentypen" })
    ).toBeInTheDocument()
    // check for language menu
    expect(screen.getByRole("list")).toBeInTheDocument()
    // check for language items
    expect(screen.getAllByRole("listitem").length === 3)
  })
})

describe("Header", () => {
  it("renders header, shows concept id if title in language is not present", async () => {
    const languages = ["de"]
    const language = "en"
    const route = "test-one-language/index.de.html"
    const history = createHistory(createMemorySource(route))
    await act(() => {
      render(
        <LocationProvider history={history}>
          <Header
            siteTitle="Test Title"
            languages={languages}
            language={language}
          />
        </LocationProvider>
      )
    })
    // skohub concept scheme link
    expect(
      screen.getByRole("link", { name: "https://w3id.org/kim/hcrt/scheme" })
    ).toBeInTheDocument()
  })
})
