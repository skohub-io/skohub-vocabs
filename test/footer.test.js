import { render, screen } from "@testing-library/react"
import React from "react"
import Footer from "../src/components/footer"

describe("Footer", () => {
  it("renders footer", () => {
    process.env.GATSBY_RESPOSITORY_URL = "http://test.com"
    render(<Footer />)
    expect(screen.getByRole("link", { name: "Source" }))
  })
})
