describe("Concept Scheme and Concept", () => {
  it("Scrolling in Nested List and Concept on wide screen", () => {
    // we need a wider view to test scrolling in navbar and concept page
    cy.viewport(1280, 768)
    cy.visit("/w3id.org/kim/hochschulfaechersystematik/n1.html")
    cy.findByRole("button", { name: "Expand" }).click()
    cy.get(".concepts").scrollTo("bottom")
  })

  it("Scrolling in Nested List and Concept on smaller screen", () => {
    // we need a wider view to test scrolling in navbar and concept page
    cy.viewport(1024, 768)
    cy.visit("/w3id.org/kim/hochschulfaechersystematik/n1.html")
    cy.findByRole("button", { name: "Expand" }).click()
    cy.scrollTo("bottom")
  })

  it("Scrolling in Nested List and Concept on small screen", () => {
    // we need a wider view to test scrolling in navbar and concept page
    cy.viewport(800, 768)
    cy.visit("/w3id.org/kim/hochschulfaechersystematik/n1.html")
    cy.findByRole("button", { name: "Expand" }).click()
    cy.get(".nav-block").scrollTo("bottom")
    cy.scrollTo("bottom")
  })

  it("Copying URI works", () => {
    cy.visit("/w3id.org/kim/hochschulfaechersystematik/n1.html")
    cy.get(".tooltip > button").click()
    cy.window()
      .its("navigator.clipboard")
      .then((clip) => clip.readText())
      .should("equal", "https://w3id.org/kim/hochschulfaechersystematik/n1")
  })
})
