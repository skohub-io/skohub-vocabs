module.exports.allCollection = (languages) => `
{
  allCollection {
    edges {
      node {
        id
        type
        prefLabel {
            ${[...languages].join(" ")}
        }
        member {
          id
          prefLabel {
            ${[...languages].join(" ")}
          }
        }
      }
    }
  }
}
`

module.exports.allConcept = (inScheme, languages) => `
  {
    allConcept(
      filter: {
        inScheme: {
          elemMatch: {
            id: {
              eq: "${inScheme}"
            }
          }
        }
      }
    ) {
      edges {
        node {
          id
          type
          prefLabel {
            ${[...languages].join(" ")}
          }
          altLabel {
            ${[...languages].join(" ")}
          }
          hiddenLabel {
            ${[...languages].join(" ")}
          }
          definition {
            ${[...languages].join(" ")}
          }
          note {
            ${[...languages].join(" ")}
          }
          changeNote {
            ${[...languages].join(" ")}
          }
          editorialNote {
            ${[...languages].join(" ")}
          }
          historyNote {
            ${[...languages].join(" ")}
          }
          scopeNote {
            ${[...languages].join(" ")}
          }
          notation
          example {
            ${[...languages].join(" ")}
          }
          narrower {
            id
            prefLabel {
              ${[...languages].join(" ")}
            }
          }
          narrowerTransitive {
            id
            prefLabel {
              ${[...languages].join(" ")}
            }
          }
          broader {
            id
            prefLabel {
              ${[...languages].join(" ")}
            }
          }
          broaderTransitive {
            id
            prefLabel {
              ${[...languages].join(" ")}
            }
          }
          related {
            id
            prefLabel {
              ${[...languages].join(" ")}
            }
          }
          relatedMatch {
            id
          }
          broadMatch {
            id
          }
          narrowMatch {
            id
          }
          closeMatch {
            id
          }
          exactMatch {
            id
          }
          inScheme {
            id
            title {
              ${[...languages].join(" ")}
            }
          }
          inSchemeAll {
            id
          }
          topConceptOf {
            id
            title {
              ${[...languages].join(" ")}
            }
          }
          deprecated
          isReplacedBy {
            id
          }
        }
      }
    }
  }
`

module.exports.allConceptScheme = (languages) => `
  {
    allConceptScheme {
      edges {
        node {
          id
          type
          title {
            ${[...languages].join(" ")}
          }
          prefLabel {
            ${[...languages].join(" ")}
          }
          dc_title {
            ${[...languages].join(" ")}
          }
          description {
            ${[...languages].join(" ")}
          }
          dc_description {
            ${[...languages].join(" ")}
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
  }
  fragment ConceptFields on Concept {
    id
    notation
    prefLabel {
      ${[...languages].join(" ")}
    }
    altLabel {
      ${[...languages].join(" ")}
    }
    hiddenLabel {
      ${[...languages].join(" ")}
    }
    definition {
      ${[...languages].join(" ")}
    }
    example {
      ${[...languages].join(" ")}
    }
    scopeNote {
      ${[...languages].join(" ")}
    }
    deprecated
  }
`
module.exports.tokenizer = `{
  site {
    siteMetadata {
      tokenizer
    }
  }
}`
