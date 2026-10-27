import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import * as Gatsby from "gatsby"
import TreeControls from "../src/components/TreeControls"
import userEvent from "@testing-library/user-event"
import { ContextProvider } from "../src/context/Context"
import { mockConfig } from "./mocks/mockConfig"

const useStaticQuery = vi.spyOn(Gatsby, `useStaticQuery`)

const doc = (
  <ContextProvider>
    <TreeControls />
    <ul>
      <li>
        <button
          aria-expanded="false"
          className="treeItemIcon inputStyle collapsed"
        ></button>
        <div>
          <a href="/w3id.org/class/hochschulfaecher/F1.de.html">
            <span>
              Agrar-, Forst- und Ernährungswissenschaften, Veterinärmedizin
            </span>
          </a>
          <ul>
            <li>
              <div>
                <a href="/w3id.org/class/hochschulfaecher/B1.de.html">
                  <span>Agrarwissenschaft/Landwirtschaft</span>
                </a>
              </div>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </ContextProvider>
)

describe("TreeControls", () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => mockConfig)
  })

  it("tree controls expands and collapse buttons are setting attributes", async () => {
    const user = userEvent.setup()
    render(doc)
    expect(screen.getByRole("button", { expanded: false }))
    await user.click(screen.getByRole("button", { name: /expand/i }))
    expect(screen.getByRole("button", { expanded: true }))

    await user.click(screen.getByRole("button", { name: /collapse/i }))
    expect(screen.getByRole("button", { expanded: false }))
  })

  it("renders sort selector with config default selected", () => {
    render(doc)
    const select = screen.getByRole("combobox", { name: /sort entries by/i })
    expect(select).toHaveValue("prefLabel")
    expect(screen.getByRole("option", { name: "Label" })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Notation" })).toBeInTheDocument()
    expect(
      screen.getByRole("option", { name: "Source order" })
    ).toBeInTheDocument()
  })

  it("changing sort selector updates the value", async () => {
    const user = userEvent.setup()
    render(doc)
    const select = screen.getByRole("combobox", { name: /sort entries by/i })
    await user.selectOptions(select, "notation")
    expect(select).toHaveValue("notation")
  })

  it("hides Collapse/Expand buttons when hasNesting is false", () => {
    render(
      <ContextProvider>
        <TreeControls hasNesting={false} />
      </ContextProvider>
    )
    expect(
      screen.queryByRole("button", { name: /expand/i })
    ).not.toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: /collapse/i })
    ).not.toBeInTheDocument()
    // Sort selector still visible
    expect(
      screen.getByRole("combobox", { name: /sort entries by/i })
    ).toBeInTheDocument()
  })
})
