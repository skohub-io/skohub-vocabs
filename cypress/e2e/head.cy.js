describe("Concept Scheme has correct head tags", () => {
  it("has correct title", () => {
    cy.visit("/w3id.org/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.title().should("eq", "Test Vokabular | SkoHub Vocabs")
    cy.get(`head > meta[name="keywords"]`).should(
      "have.attr",
      "content",
      "Concept, Test Vokabular"
    )
  })
})
