// PC Indicates PageContext

const concept2 = {
  id: "http://w3id.org/c2",
  prefLabel: {
    de: "Konzept 2",
    en: "Concept 2",
  },
  broader: [
    {
      id: "http://w3id.org/c1",
    },
  ],
  inScheme: [{ id: "http://w3id.org/" }],
}

const topConceptDeprecated = {
  id: "http://w3id.org/c1",
  type: "Concept",
  deprecated: true,
  isReplacedBy: [{ id: "http://w3id.org/replacement" }],
  hub: "https://test.skohub.io/hub",
  prefLabel: {
    de: "Konzept 1",
    en: "Concept 1",
  },
  narrower: [concept2],
  topConceptOf: null,
}

export const topConcept = {
  id: "http://w3id.org/c1",
  type: "Concept",
  hub: "https://test.skohub.io/hub",
  prefLabel: {
    de: "Konzept 1",
    en: "Concept 1",
  },
  altLabel: {
    de: ["Alternativbezeichnung 1", "Alternativbezeichnung 2"],
    en: ["Alt label 1"],
  },
  hiddenLabel: {
    de: ["Verstecktes Label 1", "Verstecktes Label 2"],
  },
  definition: {
    de: "Meine Definition",
  },
  example: {
    de: "Ein Beispiel",
  },
  note: {
    de: ["Meine Anmerkung", "Noch eine Anmerkung"],
  },
  changeNote: {
    de: ["Meine Change Note", "Noch eine Change Note"],
  },
  editorialNote: {
    de: ["Meine Editorial Note", "Noch eine Editorial Note"],
  },
  historyNote: {
    de: ["Meine History Note", "Noch eine History Note"],
  },
  scopeNote: {
    de: ["Meine Scope Note", "Noch eine Scope Note"],
  },
  notation: ["1"],
  narrower: [concept2],
  related: [
    {
      id: "http://w3id.org/c4",
      prefLabel: {
        de: "Konzept 4",
      },
    },
  ],
  narrowMatch: [{ id: "narrowMatchId" }],
  broadMatch: [{ id: "broadMatchId" }],
  exactMatch: [{ id: "exactMatchId" }],
  closeMatch: [{ id: "closeMatchId" }],
  relatedMatch: [{ id: "relatedMatchId" }],
  inScheme: [
    {
      id: "http://w3id.org/",
      type: "ConceptScheme",
      title: {
        de: "Test Vokabular",
      },
    },
    {
      id: "http://w3id.org/cs2/",
      type: "ConceptScheme",
      title: {
        en: "Concept Scheme 2",
      },
    },
  ],
  inSchemeAll: [
    {
      id: "http://w3id.org/",
    },
    {
      id: "http://w3id.org/cs2/",
    },
    {
      id: "http://just-another-scheme.org/",
    },
  ],
  topConceptOf: null,
}

export const ConceptPC = {
  node: topConcept,
  language: "de",
  collections: [
    {
      id: "http://w3id.org/collection",
      prefLabel: { de: "Meine Collection", en: "My Collection" },
      member: [topConcept, concept2],
    },
  ],
}

export const ConceptPCDeprecated = {
  node: topConceptDeprecated,
  language: "de",
  collections: [
    {
      id: "http://w3id.org/collection",
      prefLabel: { de: "Meine Collection", en: "My Collection" },
      member: [topConcept, concept2],
    },
  ],
}

export const ConceptSchemeDeprecated = {
  id: "http://w3id.org/",
  type: "ConceptScheme",
  title: {
    de: "Test Vokabular",
    en: "Test Vocabulary",
  },
  hasTopConcept: [topConceptDeprecated],
}

export const ConceptScheme = {
  id: "http://w3id.org/",
  type: "ConceptScheme",
  title: {
    de: "Test Vokabular",
    en: "Test Vocabulary",
  },
  hasTopConcept: [topConcept],
}

export const ConceptSchemePC = {
  node: ConceptScheme,
  language: "de",
}

export const ConceptScheme2 = {
  id: "http://w3id.org/cs2/",
  type: "ConceptScheme",
  title: {
    en: "Concept Scheme 2",
  },
  hasTopConcept: [topConcept],
}

export const ConceptScheme2PC = {
  node: ConceptScheme2,
  language: "en",
}

export const collection = {
  id: "http://w3id.org/collection",
  type: "Collection",
  prefLabel: {
    de: "Test-Collection",
  },
  definition: null,
  member: [
    topConcept,
    {
      id: "http://w3id.org/member2",
      prefLabel: {
        de: "Test Mitglied 2",
      },
    },
  ],
}

export const CollectionPC = {
  node: collection,
  language: "de",
  customDomain: "",
}

export const hashURIConceptScheme = {
  id: "http://example.org/hashURIConceptScheme#scheme",
  type: "ConceptScheme",
  title: {
    de: "Hash URI Konzept Schema",
  },
  hasTopConcept: [
    {
      id: "http://example.org/hashURIConceptScheme#concept1",
      prefLabel: {
        de: "Konzept 1",
      },
      narrower: [
        {
          id: "http://example.org/hashURIConceptScheme#concept4",
          prefLabel: {
            de: "Konzept 4",
            en: "Concept4",
          },
        },
      ],
    },
    {
      id: "http://example.org/hashURIConceptScheme#concept2",
      prefLabel: {
        de: "Konzept 2",
      },
    },
    {
      id: "http://example.org/hashURIConceptScheme#concept3",
      prefLabel: {
        de: "Konzept 3",
      },
    },
  ],
}
