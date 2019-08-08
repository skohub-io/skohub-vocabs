module.exports.allConcept = inScheme => `
  {
    allConcept(
      filter: {
        inScheme: {
          id: {
            eq: "${inScheme}"
          }
        }
      }
    ) {
      edges {
        node {
          id
          type
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
            prefLabel {
              de
            }
          }
          broader {
            id
            prefLabel {
              de
            }
          }
          inScheme {
            id
            title {
              de
            }
          }
          topConceptOf {
            id
          }
        }
      }
    }
  }
`

module.exports.allConceptScheme = `
  {
    allConceptScheme {
      edges {
        node {
          id
          type
          title {
            de
          }
          description {
            de
          }
          hasTopConcept {
            ...ConceptFields
            narrower {
              ...ConceptFields
              narrower {
                ...ConceptFields
                narrower {
                  ...ConceptFields
                  narrower {
                    ...ConceptFields
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  fragment ConceptFields on Concept {
    id
    prefLabel {
      de
    }
  }
`
