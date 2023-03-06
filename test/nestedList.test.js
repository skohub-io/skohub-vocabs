import { render, screen } from "@testing-library/react"
import React from "react"
import NestedList from "../src/components/nestedList"
import { ConceptScheme } from "./data/pageContext"
import userEvent from "@testing-library/user-event"
import * as Gatsby from "gatsby"
import { mockConfig } from "./mocks/mockConfig"

const useStaticQuery = jest.spyOn(Gatsby, `useStaticQuery`)

describe("Nested List", () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => mockConfig)
  })
  it("renders nested list component with two concepts", () => {
    render(
      <NestedList
        items={ConceptScheme.hasTopConcept}
        current={"http://w3id.org/c1"}
        filter={null}
        highlight={null}
        language={"de"}
      />
    )
    expect(screen.getAllByRole("link").length).toBe(2)
  })

  it("renders nested list component with two concepts", () => {
    render(
      <NestedList
        items={ConceptScheme.hasTopConcept}
        current={"http://w3id.org/c2"}
        filter={["http://w3id.org/c2"]}
        highlight={"Konzept 2"}
        language={"de"}
      />
    )
    // parent concepts should be shown when narrower match
    expect(screen.getAllByRole("link").length).toBe(2)
    // current concept is marked as current
    expect(
      screen.getByRole("link", { name: "Konzept 2", current: true })
    ).toBeInTheDocument()
  })

  it("button click toggles aria label", async () => {
    const user = userEvent.setup()
    render(
      <NestedList
        items={ConceptScheme.hasTopConcept}
        current={"http://w3id.org/c1"}
        filter={null}
        highlight={null}
        language={"de"}
      />
    )
    expect(screen.getByRole("button", { expanded: true }))
    await user.click(screen.getByRole("button", { expanded: true }))
    expect(screen.getByRole("button", { expanded: false }))
  })
})
