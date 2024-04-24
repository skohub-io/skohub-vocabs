module.exports = (languages) => `

  type Collection implements Node {
    type: String,
    prefLabel: LanguageMap,
    member: [Concept] @link(from: "member___NODE")
  }

  type ConceptScheme implements Node {
    type: String,
    title: LanguageMap,
    dc_title: LanguageMap,
    prefLabel: LanguageMap,
    description: LanguageMap,
    dc_description: LanguageMap,
    hasTopConcept: [Concept] @link(from: "hasTopConcept___NODE"),
    languages: [String]
  }

  type Concept implements Node {
    type: String,
    prefLabel: LanguageMap,
    altLabel: LanguageMapArray,
    hiddenLabel: LanguageMapArray,
    definition: LanguageMap,
    note: LanguageMapArray,
    changeNote: LanguageMapArray,
    editorialNote: LanguageMapArray,
    historyNote: LanguageMapArray,
    scopeNote: LanguageMapArray,
    notation: [String],
    example: LanguageMap,
    topConceptOf: [ConceptScheme] @link(from: "topConceptOf___NODE"),
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
    inScheme: [ConceptScheme] @link(from: "inScheme___NODE"),
    inSchemeAll: [ConceptScheme],
    hub: String,
    deprecated: Boolean,
    isReplacedBy: [Concept]
  }

  type LanguageMap {
    ${[...languages].map((l) => `${l}: String`).join(", ")}
  }
  
  type LanguageMapArray {
    ${[...languages].map((l) => `${l}: [String]`).join(", ")}
  }
`
