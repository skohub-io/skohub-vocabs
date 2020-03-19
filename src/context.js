const jsonld = {
  "@context": {
    "id": "@id",
    "type": "@type",
    "@vocab": "http://www.w3.org/2004/02/skos/core#",
    "xsd": "http://www.w3.org/2001/XMLSchema#",
    "dct": "http://purl.org/dc/terms/",
    "schema": "http://schema.org/",
    "vann": "http://purl.org/vocab/vann/",
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
    "creator": "dct:creator",
    "publisher": "dct:publisher",
    "preferredNamespacePrefix": "vann:preferredNamespacePrefix",
    "preferredNamespaceUri": "vann:preferredNamespaceUri",
    "isBasedOn": "schema:isBasedOn",
    "source": "dct:source",
    "prefLabel": {
      "@container": "@language"
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
    "narrower": {
      "@container": "@set"
    },
    "narrowerTransitive": {
      "@container": "@set"
    },
    "broaderTransitive": {
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
