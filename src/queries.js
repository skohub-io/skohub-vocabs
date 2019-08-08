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
            en_us
          }
          definition {
            de
            en_us
          }
          scopeNote {
            de
            en_us
          }
          narrower {
            id
            prefLabel {
              de
              en_us
            }
          }
          broader {
            id
            prefLabel {
              de
              en_us
            }
          }
          inScheme {
            id
            title {
              de
              en_us
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
            en_us
          }
          description {
            de
            en_us
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
      en_us
    }
  }
`
