const jsonld = {
  "@context": {
    "@version": 1.1,
    id: "@id",
    type: "@type",
    "@vocab": "http://www.w3.org/2004/02/skos/core#",
    xsd: "http://www.w3.org/2001/XMLSchema#",
    dct: "http://purl.org/dc/terms/",
    dc: "http://purl.org/dc/elements/1.1/",
    schema: "https://schema.org/",
    vann: "http://purl.org/vocab/vann/",
    ldp: "http://www.w3.org/ns/ldp#",
    owl: "http://www.w3.org/2002/07/owl#",
    title: {
      "@id": "dct:title",
      "@container": "@language",
    },
    "dc:title": {
      "@id": "dc:title",
      "@container": "@language",
    },
    "dc:description": {
      "@id": "dc:description",
      "@container": "@language",
    },
    description: {
      "@id": "dct:description",
      "@container": "@language",
    },
    issued: {
      "@id": "dct:issued",
      "@type": "xsd:date",
    },
    created: {
      "@id": "dct:created",
      "@type": "xsd:date",
    },
    modified: {
      "@id": "dct:modified",
      "@type": "xsd:date",
    },
    creator: "dct:creator",
    publisher: "dct:publisher",
    preferredNamespacePrefix: "vann:preferredNamespacePrefix",
    preferredNamespaceUri: "vann:preferredNamespaceUri",
    isBasedOn: "schema:isBasedOn",
    source: "dct:source",
    prefLabel: {
      "@container": "@language",
    },
    altLabel: {
      "@container": ["@language", "@set"],
    },
    hiddenLabel: {
      "@container": ["@language", "@set"],
    },
    definition: {
      "@container": "@language",
    },
    note: {
      "@container": ["@language", "@set"],
    },
    changeNote: {
      "@container": ["@language", "@set"],
    },
    editorialNote: {
      "@container": ["@language", "@set"],
    },
    historyNote: {
      "@container": ["@language", "@set"],
    },
    scopeNote: {
      "@container": ["@language", "@set"],
    },
    notation: {
      "@container": "@set",
    },
    example: {
      "@container": "@language",
    },
    narrower: {
      "@container": "@set",
    },
    related: {
      "@container": "@set",
    },
    relatedMatch: {
      "@container": "@set",
    },
    narrowerTransitive: {
      "@container": "@set",
    },
    broaderTransitive: {
      "@container": "@set",
    },
    broadMatch: {
      "@container": "@set",
    },
    narrowMatch: {
      "@container": "@set",
    },
    closeMatch: {
      "@container": "@set",
    },
    exactMatch: {
      "@container": "@set",
    },
    hasTopConcept: {
      "@container": "@set",
    },
    inScheme: {
      "@container": "@set",
    },
    topConceptOf: {
      "@container": "@set",
    },
    deprecated: {
      "@id": "owl:deprecated",
      "@type": "xsd:boolean",
    },
    isReplacedBy: {
      "@id": "dct:isReplacedBy",
      "@container": "@set",
    },
  },
}

module.exports = { jsonld }
