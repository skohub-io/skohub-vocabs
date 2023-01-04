import { render, screen } from "@testing-library/react"
import React from "react"
import Collection from "../src/components/Collection"
import { Collection as pageContextCollection } from "./data/pageContext"

describe("Collection", () => {
  it("renders collection component", () => {
    render(<Collection pageContext={pageContextCollection} />)
    expect(
      screen.getByRole("link", { name: "Test-Member 1" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Test-Member 2" })
    ).toBeInTheDocument()
  })
})
