import { render, screen, within } from "@testing-library/react"
import React from "react"
import Concept from "../src/components/Concept"
import { ConceptPC } from "./data/pageContext"

describe("Concept", () => {
  it("renders concept component", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /Konstruktionstechnik/i })
    ).toBeInTheDocument()
  })

  it("shows no preflabel in h1 if no pref label is provided", () => {
    const pageContextNoPrefLabel = {
      ...ConceptPC,
      node: {
        ...ConceptPC.node,
        prefLabel: {
          de: null,
        },
      },
    }
    render(<Concept pageContext={pageContextNoPrefLabel} />)
    expect(
      screen.queryByRole("heading", { name: /Konstruktionstechnik/i })
    ).toBeNull()
  })

  it("renders definition", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: "Definition" })
    ).toBeInTheDocument()
  })

  it("renders no definition if not provided in language", () => {
    render(<Concept pageContext={{ ...ConceptPC, language: "en" }} />)
    expect(screen.queryByText("Meine Definition")).toBeNull()
    expect(
      screen.getByText('No definition in language "en" provided.')
    ).toBeInTheDocument()
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

  it("renders examples", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /^example$/i })
    ).toBeInTheDocument()
  })

  it("renders related Concepts", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /^related$/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /related concept/i })
    ).toBeInTheDocument()
  })

  it("renders narrow matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /narrow match/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /narrowMatchId/i })
    ).toBeInTheDocument()
  })

  it("renders broad matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /broad match/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /broadMatchId/i })
    ).toBeInTheDocument()
  })

  it("renders exact matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /exact match/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /exactMatchId/i })
    ).toBeInTheDocument()
  })

  it("renders close matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /close match/i })
    ).toBeInTheDocument(
      expect(
        screen.getByRole("link", { name: /closeMatchId/i })
      ).toBeInTheDocument()
    )
  })

  it("renders related matches", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /related match/i })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /relatedMatchId/i })
    ).toBeInTheDocument()
  })

  it("renders collection information", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(
      screen.getByRole("heading", { name: /in Collections/i })
    ).toBeInTheDocument()
  })

  it("json link is working", () => {
    render(<Concept pageContext={ConceptPC} />)
    expect(screen.getByRole("link", { name: "JSON" })).toHaveAttribute(
      "href",
      "/w3id.org/class/hochschulfaecher/S99.json"
    )
  })
})
