describe("Test header specific rendering", () => {
  it("shows multiple concept schemes in header when a concept has multiple", () => {
    cy.visit("/w3id.org/two-concepts-one-file/c1.de.html")
    cy.findByRole("link", { name: "Test Vokabular 1" })
      .should("exist")
      .should("have.class", "active")
    cy.findByRole("link", { name: "Test Vokabular 2" })
      .should("exist")
      .should("not.have.class", "active")
  })

  it("switching concept schemes makes other concept scheme active", () => {
    cy.visit("/w3id.org/two-concepts-one-file/c1.de.html")
    cy.contains("Test Vokabular 2").click()
    cy.findByRole("link", { name: "Test Vokabular 2" })
      .should("exist")
      .should("have.class", "active")
  })

  it("when switching concepts there is only one concept scheme in header", () => {
    cy.visit("/w3id.org/two-concepts-one-file/c2.de.html")
    cy.findByRole("link", { name: "Test Vokabular 1" })
      .should("exist")
      .should("have.class", "active")
    cy.findByRole("link", { name: "Test Vokabular 2" }).should("not.exist")
  })
})
