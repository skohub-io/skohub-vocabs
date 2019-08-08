module.exports = `
  type ConceptScheme implements Node {
    title: LanguageMap,
    description: LanguageMap,
    hasTopConcept: [Concept]!
  }

  type Concept implements Node {
    prefLabel: LanguageMap,
    definition: LanguageMap,
    scopeNote: LanguageMap,
    topConceptOf: ConceptScheme,
    narrower: [Concept],
    broader: Concept,
    inScheme: ConceptScheme!
  }

  type LanguageMap {
    de: String,
    en_us: String
  }
`
