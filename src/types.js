module.exports = languages => `
  type ConceptScheme implements Node {
    type: String,
    title: LanguageMap,
    description: LanguageMap,
    hasTopConcept: [Concept] @link(from: "hasTopConcept___NODE")
  }

  type Concept implements Node {
    type: String,
    prefLabel: LanguageMap,
    definition: LanguageMap,
    scopeNote: LanguageMap,
    note: LanguageMap,
    notation: [String],
    topConceptOf: ConceptScheme @link(from: "topConceptOf___NODE"),
    narrower: [Concept] @link(from: "narrower___NODE"),
    narrowerTransitive: [Concept] @link(from: "narrowerTransitive___NODE"),
    broader: Concept @link(from: "broader___NODE"),
    broaderTransitive: [Concept] @link(from: "broaderTransitive___NODE"),
    inScheme: ConceptScheme! @link(from: "inScheme___NODE"),
    hub: String,
    inbox: String
  }

  type LanguageMap {
    ${[...languages].map(l => `${l}: String`).join(', ')}
  }
`
