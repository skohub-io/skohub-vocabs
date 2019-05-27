import React from 'react'
import { graphql } from 'gatsby'

const Concept = ({pageContext, data}) => (
  <div className="Concept">
    <h1>Concept</h1>
    <pre>
      {JSON.stringify(pageContext, null, 2)}
      {JSON.stringify(data, null, 2)}
    </pre>
  </div>
)

export default Concept

export const query = graphql`
  query($narrower: [String]!) {
    narrower: allConcept(filter: {id: {in: $narrower}}) {
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
