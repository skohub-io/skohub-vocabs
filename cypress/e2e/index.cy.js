describe("Main Vocab Index page", () => {
  it("Visits index page and test language switch", () => {
    cy.visit("http://localhost:8000/index.de.html")

    // three vocabs found
    cy.get(".centerPage > ul li").should("have.length", 3)

    // interactivity Type should display concept scheme ID since no german label present
    cy.findByRole("link", {
      name: "http://purl.org/dcx/lrmi-vocabs/interactivityType/",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular",
    }).should("exist")
    cy.findByRole("link", {
      name: "Hash URI Konzept Schema",
    }).should("exist")

    // switch language
    cy.contains("en").click()
    cy.findByRole("link", {
      name: "Test Vocabulary",
    }).should("exist")
    cy.findByRole("link", {
      name: "LRMI Interact Type Vocabulary",
    }).should("exist")
    cy.findByRole("link", {
      name: "http://example.org/hashURIConceptScheme#scheme",
    }).should("exist")

    // switching back also works
    cy.contains("de").click()
    cy.findByRole("link", {
      name: "Test Vokabular",
    }).should("exist")
  })
})
