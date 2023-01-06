describe("Main page", () => {
  it("Visits index page", () => {
    cy.visit("http://localhost:8000/index.de.html")
    cy.contains("en").click()
    cy.findByRole("link", {
      name: "http://example.org/hashURIConceptScheme#scheme",
    }).should("exist")
    cy.findByRole("link", { name: "Hash URI Concept Scheme" }).should(
      "not.exist"
    )
  })
})
