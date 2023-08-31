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
    cy.intercept("/w3id.org/search/en/prefLabel.cfg.json").as("cfg")
    cy.intercept("/w3id.org/search/en/prefLabel.ctx.json").as("ctx")
    cy.intercept("/w3id.org/search/en/prefLabel.map.json").as("map")
    cy.intercept("/w3id.org/search/en/reg.json").as("reg")
    cy.intercept("/w3id.org/search/en/prefLabel.tag.json").as("tag")
    cy.intercept("/w3id.org/search/en/prefLabel.store.json").as("store")
    // cy.intercept("/w3id.org/index.en.html/page-data.json").as("pageData")
    cy.visit("/w3id.org/index.de.html")

    cy.contains("en").click()

    cy.wait(["@ctx", "@cfg", "@map", "@reg", "@tag", "@store"])
    cy.get(".currentLanguage").contains("en").should("exist")
    // cy.get("span").contains("Konzept 1").should("not.exist")
    cy.get("span", { timeout: 10000 }).contains("Concept 1").should("exist")
    cy.findByRole("textbox").type("Concept 2")
    cy.get("span").contains("Concept 1").should("exist")
    cy.get("span").contains("Concept 2").should("exist")
    cy.get("span").contains("Concept 3").should("not.exist")
  })
})
