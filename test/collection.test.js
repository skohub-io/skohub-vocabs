import { render, screen } from "@testing-library/react"
import React from "react"
import Collection from "../src/components/Collection"
import { CollectionPC } from "./data/pageContext"

describe("Collection", () => {
  it("renders collection component", () => {
    render(<Collection pageContext={CollectionPC} />)
    expect(
      screen.getByRole("link", { name: "Test-Member 1" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Test-Member 2" })
    ).toBeInTheDocument()
  })

  it("shows no prefLabel-Message if none is provided", () => {
    render(<Collection pageContext={{ ...CollectionPC, language: "en" }} />)
    expect(screen.queryByRole("link", { name: /test-member 1/i })).toBeNull()
  })

  it("json link is working", () => {
    render(<Collection pageContext={CollectionPC} />)
    expect(screen.getByRole("link", { name: "JSON" })).toHaveAttribute(
      "href",
      "/w3id.org/class/hochschulfaecher/S99.json"
    )
  })
})
