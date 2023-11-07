describe("tree Controls", () => {
  it("tree controls not present in concept scheme with hierarchy", () => {
    cy.visit("/purl.org/dcx/lrmi-vocabs/interactivityType/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "en-EN" })
      },
    })

    cy.contains("Collapse").should("not.exist")
    cy.contains("Expand").should("not.exist")
  })
  it("tree controls present and working in concept scheme with hierarchy", () => {
    cy.visit("/w3id.org/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "en-EN" })
      },
    })

    cy.findByRole("button", { name: "Collapse" }).should("exist")
    cy.findByRole("button", { name: "Expand" }).should("exist")
    cy.get("span").contains("Concept 2").should("not.be.visible")

    cy.findByRole("button", { name: "Expand" }).click()
    cy.get("span").contains("Concept 2").should("be.visible")
  })
})
