describe("Sort entries", () => {
  // Top concepts from systematik.ttl, in source (TTL) order:
  //   n1 Geisteswissenschaften, n2 Sport, n3 Rechts-..., n4 Mathematik,
  //   n5 Humanmedizin, n7 Agrar-..., n8 Ingenieurwissenschaften, n9 Kunst
  // Notations: 1, 2, 3, 4, 5, 7, 8, 9
  // Alphabetical (de): Agrar-, Geisteswissenschaften, Humanmedizin,
  //   Ingenieurwissenschaften, Kunst, Mathematik, Rechts-, Sport
  const url = "/w3id.org/kim/hochschulfaechersystematik/scheme.html?lang=de"

  it("renders the sort selector with prefLabel as default", () => {
    cy.visit(url)
    cy.findByRole("combobox", { name: /sort entries by/i })
      .should("exist")
      .and("have.value", "prefLabel")
  })

  it("default order is alphabetical by prefLabel", () => {
    cy.visit(url)
    // First top-level link in the tree should start with "Agrar"
    cy.get(".concepts > nav, .concepts").should("exist")
    cy.get(".concepts ul li > div > a")
      .first()
      .invoke("text")
      .should("match", /Agrar/)
  })

  it("switching to Notation reorders the tree by notation", () => {
    cy.visit(url)
    cy.findByRole("combobox", { name: /sort entries by/i }).select("notation")
    // Notation 1 → Geisteswissenschaften
    cy.get(".concepts ul li > div > a")
      .first()
      .invoke("text")
      .should("match", /Geisteswissenschaften/)
  })

  it("switching to Source order preserves TTL order", () => {
    cy.visit(url)
    cy.findByRole("combobox", { name: /sort entries by/i }).select("none")
    cy.get(".concepts ul li > div > a")
      .first()
      .invoke("text")
      .should("match", /Geisteswissenschaften/)
  })

  it("sort selector is visible even on flat schemes (no hierarchy)", () => {
    cy.visit("/purl.org/dcx/lrmi-vocabs/interactivityType/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "en-EN" })
      },
    })
    cy.findByRole("combobox", { name: /sort entries by/i }).should("exist")
    // Collapse/Expand should still be hidden on flat schemes
    cy.contains("Collapse").should("not.exist")
    cy.contains("Expand").should("not.exist")
  })
})
