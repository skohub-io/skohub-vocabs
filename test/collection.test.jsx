import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import Collection from "../src/components/Collection"
import { CollectionPC } from "./data/pageContext"

describe("Collection", () => {
  it("renders collection component", () => {
    render(<Collection pageContext={CollectionPC}></Collection>)
    expect(screen.getByRole("link", { name: "Konzept 1" })).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Test Mitglied 2" })
    ).toBeInTheDocument()
  })

  it("shows no prefLabel-Message if none is provided", () => {
    render(
      <Collection
        pageContext={{ ...CollectionPC, language: "en" }}
      ></Collection>
    )
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
