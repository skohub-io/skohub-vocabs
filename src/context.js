module.exports = {
  "@context": {
    "id": "@id",
    "type": "@type",
    "@vocab": "http://www.w3.org/2004/02/skos/core#",
    "title": {
      "@id": "http://purl.org/dc/terms/title",
      "@container": "@language"
    },
    "description": {
      "@id": "http://purl.org/dc/terms/description",
      "@container": "@language"
    },
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
    },
    "inbox": {
      "@id": "http://www.w3.org/ns/ldp#inbox"
    },
    "hub": {
      "@id": "http://www.w3.org/ns/ldp#hub"
    }
  }
}
