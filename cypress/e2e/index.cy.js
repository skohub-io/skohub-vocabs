describe("Main Vocab Index page", () => {
  it("Visits index page and test language switch", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    // vocabs are found
    cy.get(".centerPage > ul li").should("have.length", 8)

    /**
     * What is tested by the existence of these links:
     * - interactivity Type should display concept scheme ID since no german label present
     * - Concept Schemes that are splitted in two files are present
     * - Multiple Concept Schemes in one file are also present
     *  */
    cy.findByRole("link", {
      name: "http://purl.org/dcx/lrmi-vocabs/interactivityType/",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular",
    }).should("exist")
    cy.findByRole("link", {
      name: "Hash URI Konzept Schema",
    }).should("exist")
    cy.findByRole("link", {
      name: "Destatis-Systematik der Fächergruppen, Studienbereiche und Studienfächer",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular 1",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular 2",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular in zwei Dateien",
    }).should("exist")
    cy.findByRole("link", {
      name: "Test Vokabular DC",
    }).should("exist")

    // switch language
    cy.get(".language-menu").contains("en").click()
    cy.findByRole("link", {
      name: "Test Vocabulary",
    }).should("exist")
    cy.findByRole("link", {
      name: "LRMI Interact Type Vocabulary",
    }).should("exist")
    cy.findByRole("link", {
      name: "http://example.org/hashURIConceptScheme#scheme",
    }).should("exist")

    // switching back also works
    cy.contains("de").click()
    cy.findByRole("link", {
      name: "Test Vokabular",
    }).should("exist")
  })

  it("shows no concept scheme in header if going back to index page from concept", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.contains("Destatis-Systematik").click()
    cy.findByRole("link", {
      name: "Destatis-Systematik der Fächergruppen, Studienbereiche und Studienfächer",
    }).should("exist")
    cy.go("back")
    cy.get(".conceptScheme > a").should("not.exist")
  })

  it("German language is selected, when lang=de param is given in url", () => {
    cy.visit("/?lang=de", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "en-EN" })
      },
    })
    cy.findByRole("link", {
      name: "Test Vokabular",
    }).should("exist")
  })

  it("The navigator language is used as fallback language, when the language from url param 'lang' is not found", () => {
    cy.visit("/?lang=bla", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "en-EN" })
      },
    })
    cy.findByRole("link", {
      name: "Test Vocabulary",
    }).should("exist")
  })

  it("A fallback language is used, when neither navigator language nor language from url param 'lang' is found", () => {
    cy.visit("/?lang=bla", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "fr-FR" })
      },
    })
    cy.findByRole("link", {
      name: "Test Vokabular",
    }).should("exist")
  })
})
