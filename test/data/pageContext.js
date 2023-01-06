// PC Indicates PageContext

const topConcept = {
  id: "http://w3id.org/c2",
  type: "Concept",
  hub: "https://test.skohub.io/hub",
  prefLabel: {
    de: "Konzept 2",
    en: "Concept 2",
  },
  altLabel: {
    de: ["Alt-Label-1", "Alt-Label-2"],
  },
  hiddenLabel: {
    de: ["Hidden-Label-1", "Hidden-Label-2"],
  },
  definition: {
    de: "Meine Definition",
  },
  example: {
    de: "Ein Beispiel",
  },
  scopeNote: {
    de: "Meine Scope Note",
  },
  note: {
    de: "Meine Note",
  },
  notation: ["1"],
  narrower: [
    {
      id: "http://w3id.org/c3",
      prefLabel: {
        de: "Konzept 3",
        en: "Concept 3",
      },
    },
  ],
  broader: {
    id: "http://w3id.org/c1",
    prefLabel: {
      de: "Konzept 1",
      en: "Concept 1",
    },
  },
  related: [
    {
      id: "relatedId",
      prefLabel: {
        de: "Related Concept",
      },
    },
  ],
  narrowMatch: [{ id: "narrowMatchId" }],
  broadMatch: [{ id: "broadMatchId" }],
  exactMatch: [{ id: "exactMatchId" }],
  closeMatch: [{ id: "closeMatchId" }],
  relatedMatch: [{ id: "relatedMatchId" }],
  inScheme: {
    id: "http://w3id.org/",
    type: "ConceptScheme",
    title: {
      de: "Test Vokabular",
    },
  },
  topConceptOf: null,
}

export const ConceptPC = {
  node: topConcept,
  language: "de",
  collections: [
    {
      id: "my-id",
      prefLabel: { de: "Collection PrefLabel" },
    },
  ],
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

export const CollectionPC = {
  node: {
    id: "http://w3id.org/class/hochschulfaecher/S99#",
    type: "Collection",
    prefLabel: {
      de: "Test-Collection",
    },
    definition: null,
    member: [
      {
        id: "http://w3id.org/class/hochschulfaecher/B96#",
        prefLabel: {
          de: "Test-Member 1",
        },
      },
      {
        id: "http://w3id.org/class/hochschulfaecher/B97#",
        prefLabel: {
          de: "Test-Member 2",
        },
      },
    ],
  },
  language: "de",
}
