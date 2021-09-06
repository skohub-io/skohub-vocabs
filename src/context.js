const jsonld = {
  "@context": {
    "@version": 1.1,
    "id": "@id",
    "type": "@type",
    "@vocab": "http://www.w3.org/2004/02/skos/core#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "dct": "http://purl.org/dc/terms/",
    "schema": "http://schema.org/",
    "vann": "http://purl.org/vocab/vann/",
    "as": "https://www.w3.org/ns/activitystreams#",
    "ldp": "http://www.w3.org/ns/ldp#",
    "title": {
      "@id": "dct:title",
      "@container": "@language"
    },
    "description": {
      "@id": "dct:description",
      "@container": "@language"
    },
    "issued": {
      "@id": "dct:issued",
      "@type": "xsd:date"
    },
    "created": {
      "@id": "dct:created",
      "@type": "xsd:date"
    },
    "modified": {
      "@id": "dct:modified",
      "@type": "xsd:date"
    },
    "creator": "dct:creator",
    "publisher": "dct:publisher",
    "preferredNamespacePrefix": "vann:preferredNamespacePrefix",
    "preferredNamespaceUri": "vann:preferredNamespaceUri",
    "isBasedOn": "schema:isBasedOn",
    "source": "dct:source",
    "prefLabel": {
      "@container": "@language"
    },
    "altLabel": {
      "@container": ["@language", "@set"],
    },
    "definition": {
      "@container": "@language"
    },
    "scopeNote": {
      "@container": "@language"
    },
    "note": {
      "@container": "@language"
    },
    "notation": {
      "@container": "@set"
    },
    "example": {
      "@container": "@language"
    },
    "narrower": {
      "@container": "@set"
    },
    "related": {
      "@container": "@set"
    },
    "relatedMatch": {
      "@container": "@set"
    },
    "narrowerTransitive": {
      "@container": "@set"
    },
    "broaderTransitive": {
      "@container": "@set"
    },
    "broadMatch": {
      "@container": "@set"
    },
    "narrowMatch": {
      "@container": "@set"
    },
    "closeMatch": {
      "@container": "@set"
    },
    "exactMatch": {
      "@container": "@set"
    },
    "followers": "as:followers",
    "inbox": "ldp:inbox",
    "hasTopConcept": {
      "@container": "@set"
    }
  }
}

const as = {
  "@context": [
    "https://www.w3.org/ns/activitystreams",
    "https://w3id.org/security/v1"
  ]
}

module.exports = { jsonld, as }
