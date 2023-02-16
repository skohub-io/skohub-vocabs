describe("Main Vocab Index page", () => {
  it("Visits index page and test language switch", () => {
    cy.visit("/index.de.html")

    // vocabs are found
    cy.get(".centerPage > ul li").should("have.length", 7)

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

  it("checks if concept data is present for concepts", () => {
    cy.visit("/example.org/hashURIConceptScheme.de.html")
    cy.contains("Konzept 1").click()
    cy.findByRole("heading", { name: "Konzept 1" }).should("exist")

    cy.visit("/purl.org/dcx/lrmi-vocabs/interactivityType/index.en.html")
    // cy.findByRole("heading", {name: "active"}).should("exist")
  })
})
