import React from 'react'
import { graphql } from 'gatsby'

const ConceptScheme = ({pageContext, data}) => (
  <div className="ConceptScheme">
    <h1>ConceptScheme</h1>
    <pre>
      {JSON.stringify(pageContext, null, 2)}
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
)

export default ConceptScheme

export const query = graphql`
  query($hasTopConcept: [String]!) {
    topConcepts: allConcept(filter: {id: {in: $hasTopConcept}}) {
      edges {
        node {
          id,
          prefLabel {
            value
            language
          }
        }
      }
    }
  }
`
