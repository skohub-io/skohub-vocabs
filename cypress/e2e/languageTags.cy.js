describe("Language Tags", () => {
  it("language tags get updated depending on the concept scheme coming from index page", () => {
    cy.visit("http://localhost:8000/index.de.html")
    cy.contains("Hash URI Konzept Schema").click()
    cy.findByRole("link", { name: "en" }).should("not.exist")
    cy.findByRole("link", { name: "de" }).should("not.exist")
  })

  it("language tags shown on the concept scheme coming from index page", () => {
    cy.visit("http://localhost:8000/index.de.html")
    cy.contains("Test Vokabular").click()

    cy.get(".language-menu li").should("have.length", 2)

    cy.findByRole("link", { name: "en" }).should("exist")
  })
  it("language tags and concepts are present when visitng a concept directly", () => {
    cy.visit("http://localhost:8000/w3id.org/index.de.html")
    cy.get(".language-menu li").should("have.length", 2)
    cy.findByRole("link", { name: "en" }).should("exist")

    cy.get(".concepts").children().should("have.length", 1)
  })

  it("language tags and concepts are present when visitng a collection directly", () => {
    cy.visit("http://localhost:8000/w3id.org/collection.de.html")
    cy.get(".language-menu li").should("have.length", 2)
    cy.findByRole("link", { name: "en" }).should("exist")

    cy.get(".concepts").children().should("have.length", 1)
  })

  it("switching languages keeps the concept tree and language tags ", () => {
    cy.visit("http://localhost:8000/w3id.org/index.de.html")
    cy.contains("en").click()

    cy.findByRole("link", { name: "de" }).should("exist")
    cy.get(".concepts").children().should("have.length", 1)
  })
})
