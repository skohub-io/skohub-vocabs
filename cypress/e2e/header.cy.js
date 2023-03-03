describe("Test header specific rendering", () => {
  it("shows only one concept scheme in header even when a concept has multiple", () => {
    cy.visit("/w3id.org/two-concepts-one-file/c1.de.html")
    cy.findByRole("link", { name: "Test Vokabular 1" }).should("exist")
    cy.findByRole("link", { name: "Test Vokabular 2" }).should("not.exist")
  })

  it("when switching concepts there is only one concept scheme in header", () => {
    cy.visit("/w3id.org/two-concepts-one-file/c2.de.html")
    cy.findByRole("link", { name: "Test Vokabular 1" }).should("exist")
    cy.findByRole("link", { name: "Test Vokabular 2" }).should("not.exist")
  })
})
