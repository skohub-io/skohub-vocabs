module.exports = `
  {
    allConcept {
      edges {
        node {
          id
          prefLabel {
            de
          }
          definition {
            de
          }
          scopeNote {
            de
          }
          narrower {
            id
          }
          inScheme {
            id
          }
          topConceptOf {
            id
          }
          tree
          json
        }
      }
    }
    allConceptScheme {
      edges {
        node {
          title {
            de
          }
          description {
            de
          }
          id
          hasTopConcept {
            id
          }
          tree
          json
        }
      }
    }
  }
`
