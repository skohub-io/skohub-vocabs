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

  it("Visting a slash URI Concept Scheme works", () => {
    cy.visit("/w3id.org/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get(".conceptScheme > a").should("have.text", "Test Vokabular")
    cy.get("h1").should("have.text", "Test Vokabular")
    cy.get(".markdown > span").should("have.text", "Test Beschreibung")
  })

  it("Visting a slash URI Concept works", () => {
    cy.visit("/w3id.org/c1.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get(".conceptScheme > a").should("have.text", "Test Vokabular")
    cy.get("h1").should("include.text", "Konzept 1")
  })

  it("Visting a hash URI Concept Scheme works", () => {
    cy.visit("/example.org/hashURIConceptScheme.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get(".conceptScheme > a").should("have.text", "Hash URI Konzept Schema")
    cy.get("h1").should("have.text", "Hash URI Konzept Schema")
  })

  it("Visting a hash URI Concept Scheme with hash uri in URL works", () => {
    cy.visit("/example.org/hashURIConceptScheme.html#scheme", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get(".conceptScheme > a").should("have.text", "Hash URI Konzept Schema")
    cy.get("h1").should("have.text", "Hash URI Konzept Schema")
  })

  it("Visting a hash URI Concept works", () => {
    cy.visit("/example.org/hashURIConceptScheme.html#concept1", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get(".conceptScheme > a").should("have.text", "Hash URI Konzept Schema")
    cy.get("h1").should("have.text", "Konzept 1")
  })
})

describe("Parsing language from URL on Concept Schemes and Concepts", () => {
  it("Visting a Concept Scheme directly with a language url param shows correct language", () => {
    cy.visit("/w3id.org/kim/hochschulfaechersystematik/scheme.html?lang=de", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "en-EN" })
      },
    })
    cy.get(".conceptScheme > a").should(
      "have.text",
      "Destatis-Systematik der Fächergruppen, Studienbereiche und Studienfächer"
    )
  })
  it("Visting a Concept directly with a language url param shows correct language", () => {
    cy.visit("/w3id.org/kim/hochschulfaechersystematik/n1.html?lang=de", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "en-EN" })
      },
    })
    cy.get(".conceptScheme > a").should(
      "have.text",
      "Destatis-Systematik der Fächergruppen, Studienbereiche und Studienfächer"
    )
  })
})

describe("DC properties for describing concept scheme are working", () => {
  it("Title is present", () => {
    cy.visit("/w3id.org/dc/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    //header
    cy.get(".conceptScheme > a").should("have.text", "Test Vokabular DC")
    // concept content block
    cy.get("h1").should("include.text", "Test Vokabular DC")
  })
  it("Description is present", () => {
    cy.visit("/w3id.org/dc/index.html", {
      onBeforeLoad(win) {
        Object.defineProperty(win.navigator, "language", { value: "de-DE" })
      },
    })
    cy.get(".markdown").should("have.text", "Test Beschreibung DC")
  })
})
