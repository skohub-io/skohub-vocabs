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
          scopeNote {
            ${[...languages].join(" ")}
          }
          note {
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
          url {
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
          description {
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
    deprecated
    url {
      id
    }
    exactMatch {
      id
    }
    relatedMatch {
      id
    }
    broadMatch {
      id
    }
  }
`
module.exports.tokenizer = `{
  site {
    siteMetadata {
      tokenizer
    }
  }
}`
