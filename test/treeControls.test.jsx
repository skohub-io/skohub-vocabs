import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import TreeControls from "../src/components/TreeControls"
import userEvent from "@testing-library/user-event"

const doc = (
  <div>
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
  </div>
)

describe("TreeControls", () => {
  it("tree controls expands and collapse buttons are setting attributes", async () => {
    const user = userEvent.setup()
    render(doc)
    expect(screen.getByRole("button", { expanded: false }))
    await user.click(screen.getByRole("button", { name: /expand/i }))
    expect(screen.getByRole("button", { expanded: true }))

    await user.click(screen.getByRole("button", { name: /collapse/i }))
    expect(screen.getByRole("button", { expanded: false }))
  })
})
