import React from "react"
import { render, screen } from "@testing-library/react"
import {
  Concept as pageContext,
  ConceptNoPrefLabel,
} from "../test/data/pageContext"
import Concept from "../src/components/Concept"

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
