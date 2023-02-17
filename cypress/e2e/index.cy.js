describe("Main Vocab Index page", () => {
  it("Visits index page and test language switch", () => {
    cy.visit("/index.de.html")

    // vocabs are found
    cy.get(".centerPage > ul li").should("have.length", 7)

    /**
     * What is tested by the existence of these links:
     * - interactivity Type should display concept scheme ID since no german label present
     * - Concept Schemes that are splitted in two files are present
     * - Multiple Concept Schemes in one file are also present
     *  */
    cy.findByRole("link", {
      name: "http://purl.org/dcx/lrmi-vocabs/interactivityType/",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular",
    }).should("exist")
    cy.findByRole("link", {
      name: "Hash URI Konzept Schema",
    }).should("exist")
    cy.findByRole("link", {
      name: "Destatis-Systematik der Fächergruppen, Studienbereiche und Studienfächer",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular 1",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular 2",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular in zwei Dateien",
    }).should("exist")

    // switch language
    cy.get(".language-menu").contains("en").click()
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
