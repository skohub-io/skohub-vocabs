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

  it("json link is working", () => {
    render(<Collection pageContext={CollectionPC} />)
    screen.debug()
    expect(screen.getByRole("link", { name: "JSON" })).toHaveAttribute(
      "href",
      "/w3id.org/class/hochschulfaecher/S99.json"
    )
  })
})
