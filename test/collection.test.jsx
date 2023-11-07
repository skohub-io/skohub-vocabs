import { afterEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import Collection from "../src/components/Collection"
import { CollectionPC } from "./data/pageContext"
import { useSkoHubContext } from "../src/context/Context.jsx"

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
  it("renders collection component", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        conceptSchemeLanguages: ["de"],
        currentScheme: {
          id: "http://one-lang/w3id.org/",
          title: {
            de: "Test Vokabular",
          },
        },
        selectedLanguage: "de",
      },
      updateState: vi.fn(),
    })
    render(<Collection pageContext={CollectionPC}></Collection>)
    expect(screen.getByRole("link", { name: "Konzept 1" })).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Test Mitglied 2" })
    ).toBeInTheDocument()
  })

  it("shows no prefLabel-Message if none is provided", () => {
    useSkoHubContext.mockReturnValue({
      data: {
        conceptSchemeLanguages: ["en"],
        currentScheme: {
          id: "http://one-lang/w3id.org/",
          title: {
            de: "Test Vokabular",
          },
        },
        selectedLanguage: "en",
      },
      updateState: vi.fn(),
    })
    render(<Collection pageContext={CollectionPC}></Collection>)
    expect(screen.getByRole("link", { name: /no label in language/i }))
  })

  it("json link is working", () => {
    render(<Collection pageContext={CollectionPC}></Collection>)
    expect(screen.getByRole("link", { name: "JSON" })).toHaveAttribute(
      "href",
      "/w3id.org/collection.json"
    )
  })
})
