import { render, screen } from "@testing-library/react"
import React from "react"
import Concept from "../src/components/Concept"
import { Concept as pageContext, ConceptNoPrefLabel } from "./data/pageContext"

describe("Concept", () => {
  it("renders concept component", () => {
    render(<Concept pageContext={pageContext} />)
    expect(
      screen.getByRole("heading", { name: "Konstruktionstechnik" })
    ).toBeInTheDocument()
  })

  it("shows no preflabel in h1 if no pref label is provided", () => {
    render(<Concept pageContext={ConceptNoPrefLabel} />)
    expect(
      screen.queryByRole("heading", { name: "Konstruktionstechnik" })
    ).toBeNull()
  })
})
