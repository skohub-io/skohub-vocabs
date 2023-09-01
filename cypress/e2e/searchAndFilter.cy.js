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

    cy.contains("en").click().wait(0) // eslint-disable-line

    cy.get(".currentLanguage").contains("en").should("exist")
    // cy.get("span").contains("Konzept 1").should("not.exist")
    cy.get("span").contains("Concept 1").should("exist")
    cy.findByRole("textbox").type("Concept 2")
    cy.get("span").contains("Concept 1").should("exist")
    cy.get("span").contains("Concept 2").should("exist")
    cy.get("span").contains("Concept 3").should("not.exist")
  })

  it("search works after switching concept schemes", () => {
    cy.visit("/w3id.org/kim/hochschulfaechersystematik/scheme.en.html")
    cy.findByRole("textbox").type("Mathema")

    cy.get("span").contains("Mathematic").should("exist")

    cy.visit("/w3id.org/cs-splitted-two-files/index.en.html")

    cy.get("span").contains("Concept 1").should("exist")
  })

  it("turning on altLabel checkbox returns altLabel matches", () => {
    cy.visit("/w3id.org/index.de.html")
    cy.findByRole("textbox").type("Alternat")

    cy.get("p").contains("Nothing found").should("exist")

    cy.get("#altLabelCheckBox").click()
    cy.get("span").contains("Konzept 1").should("exist")
  })

  it("turning on hiddenLabel checkbox returns hiddenLabel matches", () => {
    cy.visit("/w3id.org/index.de.html")
    cy.findByRole("textbox").type("Verstecktes")

    cy.get("p").contains("Nothing found").should("exist")

    cy.get("#hiddenLabelCheckBox").click()
    cy.get("span").contains("Konzept 1").should("exist")
  })

  it("turning on notation checkbox returns notation matches", () => {
    cy.visit("/w3id.org/index.de.html")
    cy.findByRole("textbox").type("Notat")

    cy.get("p").contains("Nothing found").should("exist")

    cy.get("#notationCheckBox").click()
    cy.get("span").contains("Konzept 1").should("exist")
  })

  it("turning on definition checkbox returns definition matches", () => {
    cy.visit("/w3id.org/index.de.html")
    cy.findByRole("textbox").type("Meine Defi")

    cy.get("p").contains("Nothing found").should("exist")

    cy.get("#definitionCheckBox").click()
    cy.get("span").contains("Konzept 1").should("exist")
  })

  it("turning on example checkbox returns example matches", () => {
    cy.visit("/w3id.org/index.de.html")
    cy.findByRole("textbox").type("Beis")

    cy.get("p").contains("Nothing found").should("exist")

    cy.get("#exampleCheckBox").click()
    cy.get("span").contains("Konzept 1").should("exist")
  })
})
