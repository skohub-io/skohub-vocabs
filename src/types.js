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
    altLabel: LanguageMapArray,
    definition: LanguageMap,
    scopeNote: LanguageMap,
    note: LanguageMap,
    notation: [String],
    example: LanguageMap,
    topConceptOf: ConceptScheme @link(from: "topConceptOf___NODE"),
    narrower: [Concept] @link(from: "narrower___NODE"),
    narrowerTransitive: [Concept] @link(from: "narrowerTransitive___NODE"),
    narrowMatch: [Concept],
    broader: Concept @link(from: "broader___NODE"),
    broaderTransitive: [Concept] @link(from: "broaderTransitive___NODE"),
    broadMatch: [Concept],
    related: [Concept] @link(from: "related___NODE"),
    relatedMatch: [Concept],
    closeMatch: [Concept],
    exactMatch: [Concept],
    inScheme: ConceptScheme! @link(from: "inScheme___NODE"),
    hub: String,
    inbox: String
  }

  type LanguageMap {
    ${[...languages].map(l => `${l}: String`).join(', ')}
  }
  type LanguageMapArray {
    ${[...languages].map(l => `${l}: [String]`).join(', ')}
  }
`
