describe("modal", () => {
  // closing modal works
  it("click on close closes the modal", () => {
    cy.visit("/w3id.org/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get("#settingsModal").should("not.be.visible")
    cy.get("#settings").click()
    cy.get("#settingsModal").should("be.visible")
    cy.get("#closeModal").click()
    cy.get("#settingsModal").should("not.be.visible")
  })

  it("click outside closes the modal", () => {
    cy.visit("/w3id.org/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get("#settingsModal").should("not.be.visible")
    cy.get("#settings").click()
    cy.get("#settingsModal").should("be.visible")
    cy.get("#settingsModal").click(-5, -5)
    cy.get("#settingsModal").should("not.be.visible")
  })
})
