import { render, screen } from "@testing-library/react"
import React from "react"
import Footer from "../src/components/footer"
import * as Gatsby from "gatsby"
import { mockConfig } from "./mocks/mockConfig"

const useStaticQuery = jest.spyOn(Gatsby, `useStaticQuery`)

describe("Footer", () => {
  beforeEach(() => {
    useStaticQuery.mockImplementation(() => mockConfig)
  })

  it("renders footer", () => {
    process.env.GATSBY_RESPOSITORY_URL = "http://test.com"
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Source" })).toBeInTheDocument()
  })
})
