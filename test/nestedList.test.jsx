import { beforeEach, describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import React from "react"
import NestedList from "../src/components/nestedList"
import { ConceptScheme, ConceptSchemeDeprecated } from "./data/pageContext"
import userEvent from "@testing-library/user-event"
import * as Gatsby from "gatsby"
import { mockConfig } from "./mocks/mockConfig"
import { ContextProvider, useSkoHubContext } from "../src/context/Context"
import { useEffect } from "react"

const useStaticQuery = vi.spyOn(Gatsby, `useStaticQuery`)

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
      ></NestedList>
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

  describe("sorting", () => {
    const unsorted = [
      { id: "http://x/c", prefLabel: { en: "Charlie" }, notation: ["3"] },
      { id: "http://x/a", prefLabel: { en: "Alpha" }, notation: ["1"] },
      { id: "http://x/b", prefLabel: { en: "Bravo" }, notation: ["2"] },
    ]

    // Helper component that seeds context state for a test
    const SetSort = ({ sortBy }) => {
      const { data, updateState } = useSkoHubContext()
      useEffect(() => {
        updateState({ ...data, sortBy })
      }, [sortBy])
      return null
    }

    const renderWithSort = (sortBy) =>
      render(
        <ContextProvider>
          <SetSort sortBy={sortBy} />
          <NestedList
            items={unsorted}
            current={null}
            queryFilter={null}
            highlight={null}
            language={"en"}
          />
        </ContextProvider>
      )

    it("sortBy='prefLabel' reorders entries alphabetically", () => {
      renderWithSort("prefLabel")
      const links = screen.getAllByRole("link")
      const labels = links.map((l) => l.textContent.trim())
      expect(labels).toEqual([
        expect.stringMatching(/Alpha/),
        expect.stringMatching(/Bravo/),
        expect.stringMatching(/Charlie/),
      ])
    })

    it("sortBy='notation' reorders by notation", () => {
      renderWithSort("notation")
      const links = screen.getAllByRole("link")
      const labels = links.map((l) => l.textContent.trim())
      // notations are 1 (Alpha), 2 (Bravo), 3 (Charlie)
      expect(labels).toEqual([
        expect.stringMatching(/Alpha/),
        expect.stringMatching(/Bravo/),
        expect.stringMatching(/Charlie/),
      ])
    })

    it("sortBy='none' preserves source order", () => {
      renderWithSort("none")
      const links = screen.getAllByRole("link")
      const labels = links.map((l) => l.textContent.trim())
      expect(labels).toEqual([
        expect.stringMatching(/Charlie/),
        expect.stringMatching(/Alpha/),
        expect.stringMatching(/Bravo/),
      ])
    })
  })

  it("shows deprecation notice for deprecated concepts", () => {
    render(
      <NestedList
        items={ConceptSchemeDeprecated.hasTopConcept}
        current={"http://w3id.org/c1"}
        filter={null}
        highlight={null}
        language={"de"}
      />
    )
    expect(
      screen.getByRole("link", { name: "(DEPRECATED) Konzept 1" })
    ).toBeInTheDocument()
  })
})
