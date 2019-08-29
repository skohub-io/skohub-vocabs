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
          hub
          inbox
          prefLabel {
            de
            en_us
            en
          }
          definition {
            de
            en_us
            en
          }
          scopeNote {
            de
            en_us
            en
          }
          narrower {
            id
            prefLabel {
              de
              en_us
              en
            }
          }
          broader {
            id
            prefLabel {
              de
              en_us
              en
            }
          }
          inScheme {
            id
            title {
              de
              en_us
              en
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
            en
          }
          description {
            de
            en_us
            en
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
      en
    }
  }
`
