describe("search and filter", () => {
  // search and filter works
  it("search for top concept works", () => {
    cy.visit("/w3id.org/index.de.html")

    cy.get("span").contains("Konzept 2").should("exist")
    cy.findByRole("textbox").type("Konzept 1")
    cy.get("span").contains("Konzept 1").should("exist")
    cy.get("span").contains("Konzept 2").should("not.exist")
  })

  it("search for nested concept works", () => {
    cy.visit("/w3id.org/index.de.html")

    cy.get("span").contains("Konzept 2").should("exist")
    cy.findByRole("textbox").type("Konzept 2")
    cy.get("span").contains("Konzept 1").should("exist")
    cy.get("span").contains("Konzept 2").should("exist")
    cy.get("span").contains("Konzept 3").should("not.exist")
  })

  it("search works after switching language", () => {
    cy.visit("/w3id.org/index.de.html")

    cy.contains("en").click()
    cy.get("span").contains("Konzept 2").should("not.exist")
    cy.get("span").contains("Concept 1").should("exist")
    cy.findByRole("textbox").type("Concept 2")
    cy.get("span").contains("Concept 1").should("exist")
    cy.get("span").contains("Concept 2").should("exist")
    cy.get("span").contains("Concept 3").should("not.exist")
  })
})
