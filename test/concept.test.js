import { render, screen, within } from "@testing-library/react"
import React from "react"
import Concept from "../src/components/Concept"
import { ConceptPC, ConceptNoPrefLabelPC } from "./data/pageContext"

describe("Concept", () => {
  it("renders concept component", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: "Konstruktionstechnik" })
    ).toBeInTheDocument()
  })

  it("shows no preflabel in h1 if no pref label is provided", () => {
    render(<Concept pageContext={ConceptNoPrefLabelPC} />)
    expect(
      screen.queryByRole("heading", { name: "Konstruktionstechnik" })
    ).toBeNull()
  })

  it("renders altLabels", () => {
    render(<Concept pageContext={ConceptPC} />)
    const list = screen.getByRole("list", {
      name: /alt label/i,
    })
    const { getAllByRole } = within(list)
    const items = getAllByRole("listitem")
    expect(items.length).toBe(2)
  })

  it("renders hidden labels", () => {
    render(<Concept pageContext={ConceptPC} />)
    const list = screen.getByRole("list", {
      name: /hidden label/i,
    })
    const { getAllByRole } = within(list)
    const items = getAllByRole("listitem")
    expect(items.length).toBe(2)
  })

  it("json link is working", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(screen.getByRole("link", { name: "JSON" })).toHaveAttribute(
      "href",
      "/w3id.org/class/hochschulfaecher/S99.json"
    )
  })
})
