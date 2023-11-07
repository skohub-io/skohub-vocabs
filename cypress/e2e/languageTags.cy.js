describe("Language Tags", () => {
  it("language tags get updated depending on the concept scheme coming from index page", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.contains("Hash URI Konzept Schema").click()
    cy.findByRole("button", { name: "en" }).should("not.exist")
    cy.findByRole("button", { name: "de" }).should("not.exist")
  })

  it("language tags shown on the concept scheme coming from index page", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.contains("Test Vokabular").click()

    cy.get(".language-menu li").should("have.length", 2)

    cy.findByRole("button", { name: "en" }).should("exist")
  })
  it("language tags and concepts are present when visitng a concept directly", () => {
    cy.visit("/w3id.org/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get(".language-menu li").should("have.length", 2)
    cy.findByRole("button", { name: "en" }).should("exist")

    cy.get(".concepts").children().should("have.length", 1)
  })

  it("language tags and concepts are present when visitng a collection directly", () => {
    cy.visit("/w3id.org/collection.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get(".language-menu li").should("have.length", 2)
    cy.findByRole("button", { name: "en" }).should("exist")

    cy.get(".concepts").children().should("have.length", 1)
  })

  it("switching languages keeps the concept tree and language tags ", () => {
    cy.visit("/w3id.org/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.contains("en").click()

    cy.findByRole("button", { name: "de" }).should("exist")
    cy.get(".concepts").children().should("have.length", 1)
  })
})
